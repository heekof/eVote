import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmailList from './EmailList';
import Reset from './Reset';

// need to put in a separate module ...
// const Joi = require('joi');
// const schema = { currentText : Joi.string().email().required()}


function Register({ onRegister }) {
  const [registered,setRegistered] = useState(false);
  const [candidate, setCandidate] = useState(false);
  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(false)

  const[currentEmail, setCurrentEmail] = useState("");
  const[currentText, setCurrentText] = useState("");
  const [email, setEmail] = useState("");


    useEffect( () => {

    if (currentEmail){
      //console.log(`RegisteringE == ${currentEmail}`);
      //console.log(`RegisteringT == ${currentText}`);

                fetchUsers();
    }

                //fetchUsers();


    // console.log(`WE FOUND USERS = ${users}`)

    },[registered,candidate] )

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/getemailsregistered');
      setUsers(res.data);
    } catch (error) {
    alert(error.response.data)
    }
  };



  const register = async () => {
    try {



      await axios.post('http://localhost:5001/register', { currentText });
      setRegistered(true)
      alert('User successfully registered');
    } catch (error) {
      alert(error.response.data);
    }
  };



const withdraw = async () => {
    try{
        await axios.post(`http://localhost:5001/withdraw/${currentEmail}`);
    setCandidate(false)

    alert("Candidate Withrawed !")

    }
    catch (error){
        alert(error.response.data)
    }
}

const beCandidate = async () => {

    try{


    await axios.post(`http://localhost:5001/becandidate/${currentEmail}`);
    setCandidate(true)

    alert("Congratulations you are a new candidate")

    }
    catch (error){
        alert(error.response.data)
    }


}

const getUsers = () => {
    return users;
} 

useEffect( ()=> {

}, [currentText] )

useEffect(() => {
}, [currentEmail]);

const currentTyping =(e) => {
    const currentT = e.target.value

    setCurrentText(currentT)
    setEmail(currentT);

}

  const registerEmail = async () => {
    if(registered)  {alert("Cannot register another person ! To exit refresh the page"); return;}

    //console.log("currentText = "+currentText)
    await setCurrentEmail(currentText);
 
    register();
    setEmail("");
  }

  const getCurrentUser = () => {

    return currentEmail;
  }

  const isRegistered = (email) => {



  }

  const connect = async () => {
    // connect the user if he is registered

        try{

    
    // const {error} = Joi.validate({"email" : currentText}, schema);
    // if(error) return alert("Email not formatted !")

    console.log(`current Email = ${currentText}`)
    const user_exists = await axios.get(`http://localhost:5001/connect/${currentText}`);
    
    if (user_exists){

    setConnected(true);
    setRegistered(true)
    setCurrentEmail(currentText)
    setEmail("");
    alert("Congratulations you are connected")
    }
    else {

        alert("User not found !")
    }


    }
    catch (error){

        alert(error.response.data)
    }

  }

  const disconnect = () => {

    setConnected(false);
    setRegistered(false)
    setCurrentEmail("")
    setEmail("");
    alert("Congratulations you are connected")

  }

  return (
    <div>
       <div> writing : {currentText} </div>
      <input type="email" value={email} onChange={currentTyping} placeholder="Enter your email" />


      { !connected &&  <button onClick={connect}>Connect</button>} 

      
      {  !registered  &&  <button onClick={registerEmail}>Register</button>} 

    { connected &&   <button onClick={beCandidate}>Be Candidate</button> }

      { connected &&  <button onClick={withdraw}>Withdraw</button>  }

      { connected &&  <button onClick={disconnect}>Disconnect</button>  }

    
 
        {connected ?  <h4> Hello you are signed in as {currentEmail} {registered} </h4> : <h4> Hello you are not signed-in  </h4> }



 {connected && <EmailList getUsers={getUsers} getCurrentUser={getCurrentUser} /> }
            <Reset  />


    </div>
  );
}

export default Register;
