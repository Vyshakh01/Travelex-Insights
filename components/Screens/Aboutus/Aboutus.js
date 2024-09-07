import React from 'react';
import './Aboutus.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      <h1>About Us</h1>
      <p className="intro">
        Welcome to our application! We are dedicated to providing the best service possible.
        Our team of experts works hard to create innovative solutions and provide excellent customer support.
      </p>
      
      <div className="team-section">
        <h2></h2>
        <div className="team-grid">
          <div className="team-member">
            <img src="/path-to-image.jpg" alt="Team member name" />
            <h3>Travelex Insights</h3>
            <p>Role and brief bio</p>
          </div>
          <ul>
          <li>Faiz Zubair Vadakkayil</li>
          <li>Vyshakh Rajeevan</li>
          <li>Vijay Kiran</li>
          <li>Wisam SHamsudheen</li>
         
          {/* Add more values as needed */}
        </ul>
        </div>
      </div>

      <div className="values-section">
        <h2>Our Values</h2>
        <ul>
          <li>Innovation</li>
          <li>Integrity</li>
          <li>Customer Satisfaction</li>
          {/* Add more values as needed */}
        </ul>
      </div>

      {/* Add more sections as needed */}
    </div>
  );
};

export default AboutUs;
