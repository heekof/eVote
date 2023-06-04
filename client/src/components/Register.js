import React, { useEffect, useState } from "react";
import axios from "axios";
import EmailList from "./EmailList";
import Reset from "./Reset";

function Register({ onRegister }) {
  // const [registered, setRegistered] = useState(false);
  const [candidate, setCandidate] = useState(false);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // get all users to count remaining votes
  const [connected, setConnected] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [email, setEmail] = useState("");

  const [testProp, setTestProp] = useState("testProp");

  // // Read localStorage
  useEffect(() => {
    if (localStorage.getItem("currentEmail") != null) {
      //console.log(`local storage exists with currentEmail !`);

      const currentEmailStorage = localStorage.getItem("currentEmail");
      const connectedStorage = localStorage.getItem("connected");

      // console.log(
      //   `Reading from local storage, current Email = ${currentEmailStorage} and connected = ${connectedStorage}`
      // );

      setCurrentEmail(currentEmailStorage);
      setConnected(connectedStorage);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [candidate]);

  const fetch = async () => {
    fetchAllUsers();
    fetchUsers();
    youVotedForThisUser();
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/getemailsregistered");
      setUsers(res.data);
    } catch (error) {
      alert(error.response.data);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/getemailsdebug");
      setAllUsers(res.data);
    } catch (error) {
      alert(error.response.data);
    }
  };

  const register = async () => {
    let email = currentText;
    try {
      // to test
      // console.log(`The email send is ${email}`);
      await axios.post("http://localhost:5001/register", { email });
      alert("User successfully registered");
    } catch (error) {
      alert(error.response.data);
    }
  };

  const withdraw = async () => {
    try {
      await axios.post(`http://localhost:5001/withdraw/${currentEmail}`);
      setCandidate(false);

      alert("Candidate Withrawed !");
    } catch (error) {
      alert(error.response.data);
    }
  };

  const beCandidate = async () => {
    try {
      await axios.post(`http://localhost:5001/becandidate/${currentEmail}`);
      setCandidate(true);

      alert("Congratulations you are a new candidate");
    } catch (error) {
      alert(error.response.data);
    }
  };

  const getUsers = () => {
    return users;
  };

  // useEffect(() => {}, [currentText]);
  // useEffect(() => {}, [currentEmail]);

  const currentTyping = (e) => {
    const currentT = e.target.value;

    setCurrentText(currentT);
    setEmail(currentT);
  };

  const registerEmail = async () => {
    // if (registered) {
    //   alert("Cannot register another person ! To exit refresh the page");
    //   return;
    // }

    //console.log("currentText = "+currentText)
    await setCurrentEmail(currentText);

    register();
    setEmail("");
  };

  const getCurrentUser = () => {
    return currentEmail;
  };

  const isRegistered = (email) => {};

  const connect = async () => {
    // connect the user if he is registered

    try {
      // const {error} = Joi.validate({"email" : currentText}, schema);
      // if(error) return alert("Email not formatted !")

      if (currentText === "") return;

      //console.log(`The email send is ${email}`);

      const user_exists = await axios.get(
        `http://localhost:5001/connect/${email}`
      );

      if (user_exists) {
        setConnected(true);
        //setRegistered(true);
        setCurrentEmail(currentText);
        setEmail("");
        alert("Congratulations you are connected");
      } else {
        alert("User not found !");
      }
    } catch (error) {
      alert(error.response.data);
    }
  };

  const disconnect = () => {
    setConnected(false);
    setCurrentEmail("");
    setCurrentText("");
    setEmail("");

    // clearing the local storage so that if I refresh the page I will not keep previous values !
    localStorage.clear();

    alert("Disconnected !");
  };

  // const voteChanged = () => {
  //   console.log(`Vote has successfully changed`);
  // };

  useEffect(() => {
    fetch();

    if (connected == true) {
      // console.log(`Writing to local storage, currentEmail = ${currentText}`);
      // console.log(`Writing to local storage, connected = ${connected}`);

      localStorage.setItem("currentEmail", currentText);
      localStorage.setItem("connected", connected);
    }
  }, [connected]);

  // console.log(` connected = ${connected} `);
  // console.log(` currentEmail = ${currentEmail} `);
  // console.log(` currentText = ${currentText} `);
  // console.log(` users = ${users} `);

  const resetPage = () => {
    console.log("You should reset the page !!");
    disconnect();
  };

  function youVotedForThisUser(u) {
    /*

    Debug !!!!!

    */
    if (u && users) {
      console.log(`youVotedForThisUser u = ${u.email}`);
      console.log("youVoted currentEmail " + currentEmail);
      console.log(users);
      const res = allUsers.filter((user) => user.email === currentEmail)[0];
      console.log("result");
      console.log(res);

      // you voted for no one
      if (!res) return false;

      console.log("result");
      console.log(res);
      return res.voted_for.includes(u.email);
    }
  }

  // <> is a Fragment to tell react to wrapp all his children html

  return (
    <>
      <div> typing ... {currentText} </div>
      {!connected && (
        <input
          type="email"
          value={email}
          onChange={currentTyping}
          placeholder="Enter your email"
        />
      )}

      {!connected && (
        <button className="btn btn-outline-primary" onClick={connect}>
          Connect
        </button>
      )}
      {!connected && (
        <button className="btn btn-outline-info" onClick={registerEmail}>
          Register
        </button>
      )}
      {connected && (
        <button className="btn btn-outline-info" onClick={beCandidate}>
          Be Candidate
        </button>
      )}
      {connected && (
        <button className="btn btn-outline-info" onClick={withdraw}>
          Withdraw
        </button>
      )}
      {connected && (
        <button className="btn btn-outline-secondary" onClick={disconnect}>
          Disconnect
        </button>
      )}

      {connected ? (
        <h5> Hello you are signed in as {currentEmail} </h5>
      ) : (
        <h5> Hello you are not signed-in </h5>
      )}

      {connected && (
        <EmailList
          getUsers={users}
          getCurrentUser={getCurrentUser}
          onVoteChange={fetch}
          getAllUsers={allUsers}
          resetPage={resetPage}
          youVotedForThisUser={youVotedForThisUser}
        />
      )}
    </>
  );
}

export default Register;
