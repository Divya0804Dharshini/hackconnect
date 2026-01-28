import React from "react";

function SelectRole({ setRole }) {
  return (
    <div className="card">
      <h2>Select Access</h2>

      <button onClick={() => setRole("student")}>
        Student Access
      </button>

      <br /><br />

      <button onClick={() => setRole("admin")}>
        Admin Access
      </button>
    </div>
  );
}

export default SelectRole;
