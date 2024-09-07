// App.js
import React from "react";
//import Navbar from './components/navbar/Navbar'; // Import the Navbar component
//import './App.css'; // Import your CSS file for styling
import Home from "./components/Screens/Home/Home";
import { Route, Routes } from "react-router-dom";
import Aboutus from "./components/Screens/Aboutus/Aboutus";
import MainScreen from "./components/Screens/Mainscreen/MainScreen";
import Login from "./components/Screens/Login/Login";
import Register from "./components/Screens/Register/Register";
import { UserContextProvider } from "./components/usercontext/userContext";
import CreatePost from "./components/Screens/CreatePost/CreatePost";
import SinglePost from "./components/Screens/SinglePost/SinglePost";
import EditPost from "./components/Screens/EditPost/EditPost";

function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/Aboutus" element={<Aboutus />} />

          <Route path="/MainScreen" element={<MainScreen />} />

          <Route path="/Login" element={<Login />} />

          <Route path="/Register" element={<Register />} />

          <Route path="/Create" element={<CreatePost />} />

          <Route path="/SinglePost/:id" element={<SinglePost />} />

          <Route path="/Edit/:id" element={<EditPost />} />
        </Routes>
      </UserContextProvider>
    </div>
  );
}

export default App;
