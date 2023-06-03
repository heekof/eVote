import React, {useState,useCallback, useEffect} from 'react';

import Register from './Register';
import Reset  from './Reset';
import Init from './Init';

function App() {


  const [isRegistered, setIsRegistered] = useState(false);
 


  return (
    <div className="App">
      <Init />
      <Register onRegister={() => setIsRegistered(true)}  />
           
    </div>
  );
}

export default App;
