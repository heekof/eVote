const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Joi = require("joi");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//const User = mongoose.model('User', new mongoose.Schema({ email: String }));

const schema = { email: Joi.string().email().required() };

app.post("/register", async (req, res) => {
  try {
    const { error } = Joi.validate(req.body, schema);
    if (error) return res.status(500).send(error.message);

    let check_user_exists = await User.findOne({ email: req.body.email }); //.voted_for; // Only find users where candidate is true

    if (check_user_exists) res.status(500).send("User already exists");

    const user = new User({
      email: req.body.email,
      votes: 0,
      candidate: false,
    }); // initialize votes to 0

    await user.save();
    return res.send("User registered");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/vote/:email/:user", async (req, res) => {
  // new endpoint to increase vote
  try {
    voter = req.params.user;

    candidate = req.params.email;

    if (voter === candidate)
      return res.status(500).send(`You cannot vote for yourself !`);

    // process the logic of the vote
    console.log(`We have received a vote for ${candidate} by  user=${voter}`);

    let { voted_for } = await User.findOne({ email: voter }); //.voted_for; // Only find users where candidate is true

    voted_for.push(candidate);
    let uniqueVotes = new Set(voted_for).size;
    let candidates_voted_for = voted_for.length;

    console.log(
      `The previously voted for candidates ${voted_for} for candidate ${candidate}`
    );

    console.log("foo");
    // if email voted for === users.email ==> Error

    if (candidates_voted_for > 2)
      return res.status(500).send(`Limit of vote reached !`);

    let cond_one_vote_per_candidate =
      uniqueVotes < candidates_voted_for && uniqueVotes == 1;

    console.log(
      `uniqueVotes = ${uniqueVotes} & voted_for.length = ${candidates_voted_for} cond = ${cond_one_vote_per_candidate}`
    );

    if (cond_one_vote_per_candidate)
      return res.status(500).send(`Cannot vote twice for the same candidate !`);

    // find user by email and then increment the votes attribute by 1
    await User.findOneAndUpdate({ email: candidate }, { $inc: { votes: 1 } });

    await User.findOneAndUpdate(
      { email: voter },
      { $push: { voted_for: candidate } }
    );

    res.send("Vote counted");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/unvote/:email/:user", async (req, res) => {
  // new endpoint to increase vote
  try {
    voter = req.params.user;
    candidate = req.params.email;

    console.log("Unvoting ...");

    let { voted_for } = await User.findOne({ email: voter }); //.voted_for; // Only find users where candidate is true

    const voter_voted_for_candidate = voted_for.includes(candidate);

    if (voter_voted_for_candidate) {
      // remove from the voter
      await User.findOneAndUpdate(
        { email: voter },
        { $pull: { voted_for: candidate } }
      );

      // remove from the candidate
      await User.findOneAndUpdate(
        { email: candidate },
        { $inc: { votes: -1 } }
      );

      return res.send("Candidate status updated");
    }

    return res.status(500).send("Can't unvote candidate !");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/becandidate/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (user.candidate)
    return res.status(400).send("You are already a candidate");

  try {
    await User.findOneAndUpdate(
      { email: req.params.email },
      { candidate: true }
    );
    res.send("Candidate status updated");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/connect/:email", async (req, res) => {
  try {
    const { error } = Joi.validate(req.params, schema);
    console.log(error);
    if (error) return res.status(500).send(error.message);

    const user = await User.findOne({ email: req.params.email });

    console.log(`user = ${user} and condition = ${!user} `);
    if (!user) return res.status(404).send("User not found");
    return res.send(true);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get(`/setdefaultusers`, async (req, res) => {
  try {
    // delete
    await User.deleteMany({});
    // set it in a data folder ==> data.json
    await User.insertMany([
      { votes: 2, candidate: true, voted_for: [], email: "jaafar@ovivo.com" },
      { votes: 2, candidate: true, voted_for: [], email: "dayyani@ovivo.com" },
      { votes: 2, candidate: true, voted_for: [], email: "matthew@ovivo.com" },
      { votes: 0, candidate: false, voted_for: [], email: "turing@ovivo.com" },
      { votes: 0, candidate: false, voted_for: [], email: "ahmed@ovivo.com" },
      { votes: 0, candidate: false, voted_for: [], email: "issac@ovivo.com" },
    ]);

    res.send("Candidate initialized");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/withdraw/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user.candidate)
    return res.status(400).send("You are already withdrawed");

  try {
    await User.findOneAndUpdate(
      { email: req.params.email },
      { candidate: false }
    );
    res.send("Candidate status updated");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/getemailsregistered", async (req, res) => {
  try {
    const users = await User.find({ candidate: true }); // Only find users where candidate is true
    //console.log("Registered users found = " + users)
    return res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/getemailsdebug", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/reset", async (req, res) => {
  try {
    await User.deleteMany({});
    res.send("All emails deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
