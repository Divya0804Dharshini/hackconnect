import React, { useState } from "react";
import axios from "axios";

function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    axios.post("http://localhost:5000/admin-login", { email, password })
      .then(res => {
        localStorage.setItem("admin", JSON.stringify(res.data));
        alert("Admin Logged In");
        window.location.href = "/admin/dashboard";
      })
      .catch(() => alert("Invalid admin login"));
  };

  return (
    <div>
      <h2>Admin Login</h2>

      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default AdminLogin;
