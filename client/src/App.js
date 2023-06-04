import React, { useState, useCallback, useEffect } from "react";

import Register from "./components/Register";
import Reset from "./components/Reset";
import Init from "./components/Init";
import TestProps from "./components/TestProps";
import Alert from "./components/Alert";

function App() {
  const [isRegistered, setIsRegistered] = useState(false);

  let item = "new_item";

  const handleSelectItem = () => {
    console.log(`Selected item is ${item}`);
  };

  const [alertVisible, setAlertVisibility] = useState(true);

  return (
    <div className="App">
      <Init />
      <Register onRegister={() => setIsRegistered(true)} />
      {false && (
        <TestProps
          item={item}
          heading="head"
          onSelectedItem={handleSelectItem}
        />
      )}
      {false && <Alert> This is an alert </Alert>}
    </div>
  );
}

export default App;
