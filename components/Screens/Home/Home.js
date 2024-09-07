import React from 'react'
import './Home.css'
import {Link} from 'react-router-dom';
import Navbar from './navbar/Navbar';


const Home = () => {
  return (
    <div> 
    
      <Navbar></Navbar>
      <div className="main-content">
    <h2 className="catchphrase">Explore the World Through Stories</h2>
    <Link to='/MainScreen'><button className="discover-button">Discover More</button></Link>
    
  </div>
    </div>
    
  )
}

export default Home;