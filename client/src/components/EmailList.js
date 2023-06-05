/*

EmailList component is for managing the list of 
  the candidate, their assosciated vote/unvote button
  printing the vote number and showing marking users 
  you voted for using STAR mark


Not optimised as I was learning while coding :(



*/
import React, { useEffect, useState } from "react";
import axios from "axios";
import PossibleVotes from "./PossibleVotes";
import Reset from "./Reset";

// Props are immutable

function EmailList({
  getUsers,
  getCurrentUser,
  onVoteChange,
  getAllUsers,
  resetPage,
  youVotedForThisUser,
  port,
}) {
  // users
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  //
  const [numberPossibleVotes, setNumberPossibleVotes] = useState(0);

  useEffect(() => {
    setCurrentUser(getCurrentUser);
  }, [getCurrentUser]);

  useEffect(() => {
    setUsers(getUsers);
  }, [getUsers]);

  useEffect(() => {
    setAllUsers(getAllUsers);
  }, [getAllUsers]);

  // handle when you click on unvote button

  const vote = async (email) => {
    try {
      await axios.post(`http://localhost:${port}/vote/${email}/${currentUser}`);
      //checkItems();
      onVoteChange();
    } catch (error) {
      alert(error.response.data);
    }
  };

  // handle when you click on unvote button
  const unvote = async (email) => {
    try {
      await axios.post(
        `http://localhost:${port}/unvote/${email}/${currentUser}`
      );
      //checkItems();
      onVoteChange();
    } catch (error) {
      alert(error.response.data);
    }
  };

  const computeRemainingVotes = () => {
    if (allUsers) {
      let numberVotes = allUsers
        .map((user) => 2 - user.voted_for.length)
        .reduce((a, b) => a + b, 0);

      setNumberPossibleVotes(numberVotes);
    }
  };

  const getNumberVotes = () => {
    return numberPossibleVotes;
  };

  useEffect(() => {
    computeRemainingVotes();
  }, [users]);

  // JSX markup
  // <> </> Fragment
  // in JS to loop over an array => items.map(item => console.log(item) )
  // we need to give each <li> a unique key !  items.map( (item,index) => ( <> <>) )

  // [...users] => is to copy users

  // sorting collection by an attribute
  // https://stackoverflow.com/questions/1069666/sorting-object-property-by-values
  // https://www.programiz.com/javascript/examples/sort-array-objects

  return (
    <>
      <h4>Candidates to vote for :</h4>

      {[...users]
        .sort((a, b) => b.votes - a.votes)
        .map((user, index) => (
          <ul className="list-group list-group-horizontal" key={index * -1}>
            <li className="list-group-item " key={index}>
              {user.email}
            </li>
            <li className="list-group-item ">
              <button
                className="btn btn-outline-success"
                onClick={() => vote(user.email)}
              >
                Vote
              </button>
            </li>
            <li className="list-group-item ">
              <button
                className="btn btn-outline-secondary"
                onClick={() => unvote(user.email)}
              >
                Unvote
              </button>
            </li>
            <li className="list-group-item ">Votes: {user.votes}</li>
            {youVotedForThisUser(user) && (
              <li className="list-group-item ">STAR</li>
            )}
          </ul>
        ))}
      <div></div>
      <PossibleVotes getNumberVotes={getNumberVotes} />
      <Reset resetPage={resetPage} port={port} />
    </>
  );
}

export default EmailList;
