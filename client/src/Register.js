import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmailList from './EmailList';
import Reset from './Reset';

function Register({ onRegister }) {
  const [registered,setRegistered] = useState(false);
  const [candidate, setCandidate] = useState(false);
  const [users, setUsers] = useState([]);


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

  return (
    <div>
       <div> writing : {currentText} </div>
      <input type="email" value={email} onChange={currentTyping} placeholder="Enter your email" />
      
      <button onClick={registerEmail}>Register</button>
      <button onClick={beCandidate}>Be Candidate</button>
      <button onClick={withdraw}>Withdraw</button>
 
        {registered ?  <h1> Hello you are registered as {currentEmail} {registered} </h1> : <h1> Hello you are not registered  </h1> }


<EmailList getUsers={getUsers} getCurrentUser={getCurrentUser} />
            <Reset  />


    </div>
  );
}

export default Register;
