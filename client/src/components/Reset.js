import React, { useState } from "react";
import axios from "axios";

import { useEffect } from "react";

function Reset({ resetPage }) {
  const [reseted, setReseted] = useState(false);
  useEffect(() => {}, [reseted]);

  const reset = async () => {
    try {
      await axios.delete("http://localhost:5001/reset");
      // Add additional logic here if you want to update UI after reset
      alert("candidates list reseted !");
      setReseted(true);

      resetPage();
    } catch (error) {
      console.error("Error deleting emails", error);
    }
  };

  return (
    <div>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Reset;
