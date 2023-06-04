import React, { useEffect, useState } from "react";

import axios from "axios";

function PossibleVotes({ getNumberVotes }) {
  return (
    <div>
      {" "}
      <h6>PossibleVotes = {getNumberVotes()} </h6>
    </div>
  );
}

export default PossibleVotes;
