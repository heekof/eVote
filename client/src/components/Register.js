/*

Register component responsible for registering users. 

default users : 

sean.carroll@ovivo.com ==> candidate  + default 2 votes
dayyani.basel@ovivo.com ==> candidate  + default 2 votes
alan.turing@ovivo.com ==> candidate  + default 2 votes

ray.dalio@ovivo.com
martin.scorsese@ovivo.com
hans.zimmer@ovivo.com

*/
import React, { useEffect, useMemo, useState } from "react";

// axios for API calls to mongoDB (mongoose)
import axios from "axios";
// importing EmailList for listing emails
import EmailList from "./EmailList";

function Register({ port }) {
  // state for checking if user became candidate
  const [candidate, setCandidate] = useState(); // Huge mistake !!! this value was set to false !!!!
  // get all the users that are candidate
  const [users, setUsers] = useState([]);
  // get all the users, used to count the remaining votes
  const [allUsers, setAllUsers] = useState([]); // get all users to count remaining votes
  // state of user connected or disconnected from the app
  const [connected, setConnected] = useState(false);
  // Not optimised, I need to use useRef here.
  // checks for current user after reloading the page
  const [currentEmail, setCurrentEmail] = useState("");
  // tracks current typed text, not optimized.
  const [currentText, setCurrentText] = useState("");
  // tracks the email sent
  const [email, setEmail] = useState("");

  // Read localStorage inorder to keep the same data after reloading
  useEffect(() => {
    if (localStorage.getItem("currentEmail") != null) {
      const currentEmailStorage = localStorage.getItem("currentEmail");
      const connectedStorage = localStorage.getItem("connected");

      setCurrentEmail(currentEmailStorage);
      setConnected(connectedStorage);
    }
  }, []);

  // if candidate change fetch data
  useEffect(() => {
    fetch();
    getUsers();
    console.log(`2 candidate status = ${candidate}`);
  }, [candidate]);

  // :( not optimized as I needed to change afterwards
  // fetches for all users and updates the user voted for view : "STAR"
  const fetch = async () => {
    fetchAllUsers();
    fetchUsers();
    youVotedForThisUser();
  };

  // get emails that are candidate (bad name as I have misunderstood in the beginning)
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:${port}/getemailsregistered`
      );
      setUsers(res.data);
    } catch (error) {
      alert(error.response.data);
    }
  };

  // get all users and set them
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:${port}/getemailsdebug`);
      setAllUsers(res.data);
    } catch (error) {
      alert(error.response.data);
    }
  };

  // handle when a new email wants to regidter
  const register = async () => {
    let email = currentText;
    try {
      await axios.post(`http://localhost:${port}/register`, { email });
      alert("User successfully registered");
    } catch (error) {
      alert(error.response.data);
    }
  };

  // withdraw candidate from election.
  const withdraw = async () => {
    try {
      console.log("You clicked on withdraw !!");
      await axios.post(`http://localhost:${port}/withdraw/${currentEmail}`);

      // IMPORTANT : happens asynchronously and so doesn't appear until next render
      setCandidate(false);

      console.log(`1 candidate status = ${candidate}`);

      alert("Candidate Withrawed !");
    } catch (error) {
      alert(error.response.data);
    }
  };

  // API to become candidate
  const beCandidate = async () => {
    try {
      await axios.post(`http://localhost:${port}/becandidate/${currentEmail}`);
      setCandidate(true);

      alert("Congratulations you are a new candidate");
    } catch (error) {
      alert(error.response.data);
    }
  };

  // tracks current typing
  // bad idea but I did it to learn how useState works
  const currentTyping = (e) => {
    const currentT = e.target.value;

    setCurrentText(currentT);
    setEmail(currentT);
  };

  // handle register emails
  const registerEmail = async () => {
    await setCurrentEmail(currentText);

    register();
    setEmail("");
  };

  const getCurrentUser = () => {
    return currentEmail;
  };

  // connect API => check if user exists in DB
  // if yes connect it
  // else Error
  const connect = async () => {
    // connect the user if he is registered

    try {
      // Here I could have let the server return an error if text is empty
      if (currentText === "") return;

      // connect API
      const user_exists = await axios.get(
        `http://localhost:${port}/connect/${email}`
      );

      // setup after connection is validated
      if (user_exists) {
        setConnected(true);
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

  // handle disconnect button
  const disconnect = () => {
    setConnected(false);
    setCurrentEmail("");
    setCurrentText("");
    setEmail("");

    // clearing the local storage so that if I refresh the page I will not keep previous values !
    localStorage.clear();

    alert("Disconnected !");
  };

  // if connected ==> store data in localStorage
  useEffect(() => {
    fetch();

    if (connected == true) {
      localStorage.setItem("currentEmail", currentText);
      localStorage.setItem("connected", connected);
    }
  }, [connected]);

  // when clicking on Reset button
  const resetPage = () => {
    disconnect();
  };

  // this function is important to update the user if withrawed
  const getUsers = () => {
    return users;
  };

  // Not optimised !!!
  // I don't understand ... still learning ...
  // Show which candidate you voted for by printing : STAR
  function youVotedForThisUser(u) {
    if (u && users) {
      const res = allUsers.filter((user) => user.email === currentEmail)[0];

      if (!res) return false;

      // console.log("result");
      // console.log(u.email);

      return res.voted_for.includes(u.email);
    }
  }

  // <> is a Fragment to tell react to wrapp all his children html
  // JSX
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
          getUsers={getUsers}
          getCurrentUser={getCurrentUser}
          onVoteChange={fetch}
          getAllUsers={allUsers}
          resetPage={resetPage}
          youVotedForThisUser={youVotedForThisUser}
          port={port}
          candidate={candidate}
        />
      )}
    </>
  );
}

export default Register;
