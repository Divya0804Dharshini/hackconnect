import React, { useState } from "react";
import axios from "axios";

function AdminSignup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = () => {
    axios.post("http://localhost:5000/admin-signup", {
      name, email, password
    })
    .then(() => alert("Admin account created. Please login."))
    .catch(() => alert("Signup failed"));
  };

  return (
    <div>
      <h2>Admin Signup</h2>

      <input placeholder="Name" onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />

      <button onClick={signup}>Signup</button>
    </div>
  );
}

export default AdminSignup;
