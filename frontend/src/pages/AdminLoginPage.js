import React, { useState } from "react";
import AdminLogin from "../components/AdminLogin";
import AdminSignup from "../components/AdminSignup";

function AdminLoginPage() {

  const [page, setPage] = useState("login"); // login | signup

  return (
    <div className="center-box">

      {page === "login" && (
        <div className="card auth-box">
          <AdminLogin />
          <p>
            New Admin?{" "}
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
          <AdminSignup />
          <p>
            Already have account?{" "}
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

export default AdminLoginPage;
