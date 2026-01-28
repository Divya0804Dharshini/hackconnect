import React from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard";

function AdminDashboardPage() {

  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin");
    nav("/");
  };

  return (
    <div>

      {/* TOP BAR */}
      <div className="top-bar">
        <h3 style={{ color: "white", margin: 0 }}>Admin Dashboard</h3>
        <button onClick={logout}>Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-container">
        <AdminDashboard />
      </div>

    </div>
  );
}

export default AdminDashboardPage;
