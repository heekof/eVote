import React, { useEffect, useState } from "react";

import axios from "axios";

function PossibleVotes({ usersProp, usersPropTest }) {
  const [numberPossibleVotes, setNumberPossibleVotes] = useState(0);
  const [users, setUsers] = useState();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    ComputePoints();
  }, [users]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/getemailsdebug");
      setUsers(res.data);
    } catch (error) {
      alert(error.response.data);
    }
  };

  const ComputePoints = () => {
    /*
    users = 
    */

    console.log("ComputePoints");

    console.log(users);
    if (users) {
      let numberVotes = users
        .map((user) => 2 - user.voted_for.length)
        .reduce((a, b) => a + b, 0);
      console.log("emails = ");
      console.log(numberVotes);

      setNumberPossibleVotes(numberVotes);
    }
  };

  return (
    <div>
      {" "}
      <h6>PossibleVotes = {numberPossibleVotes} </h6>
    </div>
  );
}

export default PossibleVotes;
