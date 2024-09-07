import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import "./Login.css";
import { UserContext } from "../../usercontext/userContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  async function login(e) {
    e.preventDefault();
    await fetch("http://localhost:5000/Login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          setUserInfo(data);
          setRedirect(true);
          console.log("Login successful");
          //alert(data.message);
        } else {
          console.log("Login failed");
          alert(data.message);
        }

        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  if (redirect) {
    return <Navigate to={"/MainScreen"} />;
  }

  return (
    <div className="login">
      <div className="form">
        <form className="form-inner" onSubmit={login}>
          <h1 className="head">LOGIN</h1>
          <input
            className="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>

          <input
            className="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <button className="logbutton">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
