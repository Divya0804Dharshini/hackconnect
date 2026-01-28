import React, { useState } from "react";
import axios from "axios";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");

  const signup = () => {
    axios.post("http://localhost:5000/signup", {
      name, email, password, college
    })
    .then(() => alert("Signup successful. Please login."))
    .catch(() => alert("Signup failed"));
  };

  return (
    <div>
      <h2>Student Signup</h2>

      <input placeholder="Name" onChange={e=>setName(e.target.value)} /><br/>
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} /><br/>
      <input placeholder="College" onChange={e=>setCollege(e.target.value)} /><br/>

      <button onClick={signup}>Signup</button>
    </div>
  );
}

export default Signup;
