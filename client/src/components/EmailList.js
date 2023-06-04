import React, { useEffect, useState } from "react";
import axios from "axios";
import PossibleVotes from "./PossibleVotes";

// Props are immutable
interface Props {
  users: string[];
  heading: String;
  onVoteChange: (item: string) => void;
}

function EmailList({ getUsers, getCurrentUser, onVoteChange, testProp }) {
  const [items, setItems] = useState([]);

  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    setCurrentUser(getCurrentUser);
  }, [getCurrentUser]);

  //console.log(`The current user in EmailList is ${currentUser}`)

  useEffect(() => {
    setItems(getUsers);
  }, [getUsers]);

  const vote = async (email) => {
    try {
      await axios.post(`http://localhost:5001/vote/${email}/${currentUser}`);
      //checkItems();
      onVoteChange();
    } catch (error) {
      alert(error.response.data);
    }
  };

  const unvote = async (email) => {
    try {
      await axios.post(`http://localhost:5001/unvote/${email}/${currentUser}`);
      //checkItems();
      onVoteChange();
    } catch (error) {
      alert(error.response.data);
    }
  };

  //useEffect( ()=>{}, [items])
  const checkItems = async () => {
    try {
      const updatedUsers = await axios.get(
        `http://localhost:5001/getemailsregistered`
      );
      // console.log(updatedUsers)
      setItems(updatedUsers.data);
    } catch (error) {
      alert(error.response.data);
    }
  };
  // JSX markup
  // <> </> Fragment
  // in JS to loop over an array => items.map(item => console.log(item) )
  // we need to give each <li> a unique key !  items.map( (item,index) => ( <> <>) )
  return (
    <>
      <h4>Candidates to vote for :</h4>
      <ul className="list-group">
        {[...items]
          .sort((a, b) => b.votes - a.votes)
          .map((user, index) => (
            <li className="list-group-item" key={index}>
              {user.email}
              <button
                className="btn btn-outline-success"
                onClick={() => vote(user.email)}
              >
                Vote
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => unvote(user.email)}
              >
                Unvote
              </button>
              Votes: {user.votes}
            </li>
          ))}
      </ul>

      <PossibleVotes getUsers={getUsers} testProp={testProp} />
    </>
  );
}

export default EmailList;
