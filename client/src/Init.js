import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Init() {


    useEffect( ()=>{
        console.log("Init Called")
        addDefautUsers()
    }, [])


    const addDefautUsers = async () => {

  // try {
  //   await axios.get(`http://localhost:5001/setdefaultusers`);
  // } catch (error) {
  //   //console.error('Error updating items', error);
  //   alert(error.response.data)
  // }
}

// Jsx
return (
<>
Hello Init
</>
) ;

}; 