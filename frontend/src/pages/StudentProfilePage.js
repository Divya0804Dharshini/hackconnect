import React from "react";
import { useNavigate } from "react-router-dom";
import StudentProfile from "../components/StudentProfile";

function StudentProfilePage() {

  const nav = useNavigate();

  return (
    <div>

      <div className="top-bar">
        <button onClick={() => nav("/student/dashboard")}>Back</button>
        <button onClick={() => {
          localStorage.removeItem("user");
          nav("/");
        }}>Logout</button>
      </div>

      <StudentProfile />

    </div>
  );
}

export default StudentProfilePage;
