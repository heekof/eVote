import React, { useEffect, useState } from "react";
import axios from "axios";
import PossibleVotes from "./PossibleVotes";
import Reset from "./Reset";

// Props are immutable
interface Props {
  users: string[];
  heading: String;
  onVoteChange: (item: string) => void;
}

function EmailList({
  getUsers,
  getCurrentUser,
  onVoteChange,
  getAllUsers,
  resetPage,
  youVotedForThisUser,
}) {
  const [items, setItems] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [currentUser, setCurrentUser] = useState("");
  const [numberPossibleVotes, setNumberPossibleVotes] = useState(0);

  useEffect(() => {
    setCurrentUser(getCurrentUser);
  }, [getCurrentUser]);

  //console.log(`The current user in EmailList is ${currentUser}`)

  useEffect(() => {
    setItems(getUsers);
  }, [getUsers]);

  useEffect(() => {
    setAllUsers(getAllUsers);
  }, [getAllUsers]);

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

  const computeRemainingVotes = () => {
    if (allUsers) {
      let numberVotes = allUsers
        .map((user) => 2 - user.voted_for.length)
        .reduce((a, b) => a + b, 0);

      console.log("remaining votes = ");
      console.log(allUsers.map((user) => 2 - user.voted_for.length));

      setNumberPossibleVotes(numberVotes);
    }
  };

  const getNumberVotes = () => {
    return numberPossibleVotes;
  };

  useEffect(() => {
    //console.log("users changed !");
    computeRemainingVotes();
    //
  }, [items]);

  // JSX markup
  // <> </> Fragment
  // in JS to loop over an array => items.map(item => console.log(item) )
  // we need to give each <li> a unique key !  items.map( (item,index) => ( <> <>) )

  return (
    <>
      <h4>Candidates to vote for :</h4>

      {[...items]
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
      <Reset resetPage={resetPage} />
    </>
  );
}

export default EmailList;
