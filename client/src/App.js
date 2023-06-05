/*

App is the main container, containing Init and Register Components.

*/
import React, { useState } from "react";
import Register from "./components/Register";
import Init from "./components/Init";

function App({ port }) {
  return (
    <div className="App">
      <Init port={port} />
      <Register port={port} />
    </div>
  );
}

export default App;
