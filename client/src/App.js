/*

App is the main container, containing Init and Register Components.

*/
import React, { useState } from "react";
import Register from "./components/Register";
import Init from "./components/Init";

function App() {
  return (
    <div className="App">
      <Init />
      <Register />
    </div>
  );
}

export default App;
