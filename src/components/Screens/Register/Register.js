import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';
import './Register.css'
const Register = () => {
  const[username,setUsername]=useState('');
  const[password,setPassword]=useState('');
  const [redirect,setRedirect]=useState(false)
  function register(e){
    e.preventDefault();
     fetch('http://localhost:5000/Register',{
      method:'POST',
      body:JSON.stringify({username,password}),
      headers:{'Content-Type':'application/json'},

    })
    .then(response => response.json())
    .then(data => { 
      
      if (data.success === true) {    
        setRedirect(true);
        console.log('Registration successful');
       // alert(data.message);
        
      } else {
      
        console.log('Registration failed');
        alert(data.message);
     
      }
    })
    .catch(error => {
      console.error('Error:', error);
    
    });
}



if(redirect)
{
  return <Navigate to={'/Login'} />
}


  return (
    <div className='register'>
        <header>
        <a href="" className="logo">Travelex Insights</a>       
      </header>

      <form className='form' onSubmit={register}>
        <h1>Register</h1>

       
        <input type='text'
         placeholder='username'
         value={username}
         onChange={(e)=>setUsername(e.target.value)}
          />
        <input type='password' 
        placeholder='password'
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        <button>Register</button>
       </form>
       
       


    </div>
  )
}

export default Register