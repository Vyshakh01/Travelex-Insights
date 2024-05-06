import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../usercontext/userContext'
const Header = () => {
   const {setUserInfo,userInfo}=useContext(UserContext);

    useEffect(()=>{
        fetch('http://localhost:5000/profile',{
          credentials:'include',          
        }).then(response => response.json())
        .then(data => {
            setUserInfo(data);
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
    },[])


    function logout(){
      const confirmLogout=window.confirm("Are you sure you want to logout?");
      if(confirmLogout){
        fetch('http://localhost:5000/logout',{
          credentials:'include',
          method:'POST',
         
        });
        setUserInfo(null)
      }
      

    }
const username=userInfo?.username

  return (
    <header>
        <Link to='/MainScreen'  className="logo">Travelex Insights</Link>
        <nav>

        {!username &&( <>
          <Link to="/Login"> Login</Link>
          <Link to="/Register"> Register</Link>
          </>
        )
         
          }

          {username &&( <>
          <Link to="/Create "> Create new blog</Link>
          <a className= 'logout' onClick={logout} >Logout</a>
          </>
        )
         
          }
         
          
        </nav>
      </header>
  )
}
export default Header