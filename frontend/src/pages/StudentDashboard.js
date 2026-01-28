import React from "react";
import { useNavigate } from "react-router-dom";
import HackathonList from "../components/HackathonList";

function StudentDashboard() {

  const nav = useNavigate();

  return (
    <div>

      <div className="top-bar">
        <button onClick={() => nav("/student/profile")}>Profile</button>
        <button onClick={() => {
          localStorage.removeItem("user");
          nav("/");
        }}>Logout</button>
      </div>

      <HackathonList />

    </div>
  );
}

export default StudentDashboard;
