import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {

  const nav = useNavigate();

  return (
    <div className="center-box">

      <h1>HackConnect Platform</h1>

      <button className="big-btn" onClick={() => nav("/student-auth")}>
        Student Access
      </button>

      <button className="big-btn admin" onClick={() => nav("/admin/login")}>
        Admin Access
      </button>

    </div>
  );
}

export default Home;
