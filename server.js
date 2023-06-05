const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Joi = require("joi");

const app = express();

const data = require("./data/data");

// prod requirements
//require("./client/src/startup/prod")(app);

const port = process.env.PORT || 5001;
//console.log(data);

app.use(cors());
app.use(express.json());

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/userDB";

/*
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
  */
mongoose.connect(`${MONGODB_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

    let { voted_for } = await User.findOne({ email: voter }); //.voted_for; // Only find users where candidate is true

    voted_for.push(candidate);
    let uniqueVotes = new Set(voted_for).size;
    let candidates_voted_for = voted_for.length;

    // if email voted for === users.email ==> Error

    if (candidates_voted_for > 2)
      return res.status(500).send(`Limit of vote reached !`);

    let cond_one_vote_per_candidate =
      uniqueVotes < candidates_voted_for && uniqueVotes == 1;

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

app.post(`/updateusersvotedfor`, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  console.log(`user = ${user}  `);
  console.log(
    `UsersYouVotedForThatAreStillCandidates = ${req.body.UsersYouVotedForThatAreStillCandidates}  `
  );

  try {
    await User.findOneAndUpdate(
      { email: req.body.email },
      { voted_for: req.body.UsersYouVotedForThatAreStillCandidates }
    );
    res.send("Candidate status updated");
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
    if (error) return res.status(500).send(error.message);

    const user = await User.findOne({ email: req.params.email });

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
    await User.insertMany(data);

    res.send("Candidate initialized");
  } catch (error) {
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

    // remove this user from all voted_for array in users that have voted for him

    await User.updateMany(
      { voted_for: req.params.email },
      { $pull: { voted_for: req.params.email } }
    );

    res.send("Candidate status updated");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/getemailsregistered", async (req, res) => {
  try {
    const users = await User.find({ candidate: true }); // Only find users where candidate is true
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
    await User.insertMany(data);

    res.send("All emails deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
