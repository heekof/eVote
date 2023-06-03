import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmailList({getUsers, getCurrentUser}) {

const [items, setItems] = useState([])

const [currentUser, setCurrentUser] = useState("")


useEffect ( () => {

    setCurrentUser(getCurrentUser)

}, [getCurrentUser]
)

//console.log(`The current user in EmailList is ${currentUser}`)

useEffect( () => {

    setItems(getUsers)

}, [getUsers])

  const vote = async (email) => {
    try {


      await axios.post(`http://localhost:5001/vote/${email}/${currentUser}`);
      checkItems();
    } catch (error) {
    alert(error.response.data)
 
    }
  };

    const unvote = async (email) => {
    try {


      await axios.post(`http://localhost:5001/unvote/${email}/${currentUser}`);
      checkItems();
    } catch (error) {
    alert(error.response.data)
    }
  };


  //useEffect( ()=>{}, [items])
const checkItems = async ()=> {

  try {
    const updatedUsers = await axios.get(`http://localhost:5001/getemailsregistered`);
    // console.log(updatedUsers)
    setItems(updatedUsers.data);
  } catch (error) {
    alert(error.response.data)

  }
}

  return (
    <div>
      <h2>Registered Emails</h2>
      <ul>
        {[...items].sort((a, b) => b.votes - a.votes).map((user, index) => (
          <li key={index}>
            {user.email}
            <button onClick={() => vote(user.email)}>Vote</button>
            <button onClick={() => unvote(user.email)}>Unvote</button>
            Votes: {user.votes}
          </li>
        ))}
      </ul>
      <h4>Possible votes : 2</h4>
    </div>
  );
}

export default EmailList;
