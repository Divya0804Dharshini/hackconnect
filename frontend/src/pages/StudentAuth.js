import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

function StudentAuth() {

  const [page, setPage] = useState("login"); // login | signup

  return (
    <div className="center-box">

      {page === "login" && (
        <div className="card">
          <Login switchToSignup={() => setPage("signup")} />
          <p>
            New user?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setPage("signup")}
            >
              Create Account
            </span>
          </p>
        </div>
      )}

      {page === "signup" && (
        <div className="card auth-box">

          <Signup switchToLogin={() => setPage("login")} />
          <p>
            Already have an account?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setPage("login")}
            >
              Login
            </span>
          </p>
        </div>
      )}

    </div>
  );
}

export default StudentAuth;
