import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Init() {
  useEffect(() => {
    console.log("Init Called");
  }, []);

  const addDefautUsers = async ({ port }) => {
    try {
      await axios.get(`http://localhost:${port}/setdefaultusers`);
    } catch (error) {
      //console.error('Error updating items', error);
      alert(error.response.data);
    }
  };

  // Jsx
  return <>Welcome to eVote web app</>;
}
