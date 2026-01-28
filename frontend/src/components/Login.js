import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    axios.post("http://localhost:5000/login", { email, password })
      .then(res => {
        localStorage.setItem("user", JSON.stringify(res.data));
        alert("Welcome " + res.data.name);
        nav("/student/dashboard");
      })
      .catch(() => alert("Invalid Login"));
  };

  return (
    <div>
      <h2>Student Login</h2>

      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} /><br/>

      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
