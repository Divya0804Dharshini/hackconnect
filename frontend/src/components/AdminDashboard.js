import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  const admin = JSON.parse(localStorage.getItem("admin"));

  const [hackathons, setHackathons] = useState([]);

  // ADD HACKATHON FORM
  const [title, setTitle] = useState("");
  const [college, setCollege] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    loadHackathons();
  }, []);

  const loadHackathons = () => {
    axios.get("http://localhost:5000/hackathons")
      .then(res => setHackathons(res.data));
  };

  const addHackathon = () => {
    if (!title || !college || !date) {
      alert("Fill all fields");
      return;
    }

    axios.post("http://localhost:5000/add-hackathon", {
      title,
      description: "Hackathon Event",
      date,
      college
    })
    .then(() => {
      alert("Hackathon added");
      setTitle("");
      setCollege("");
      setDate("");
      loadHackathons();
    })
    .catch(() => alert("Add failed"));
  };

  if (!admin) return <p>Unauthorized</p>;

  return (
    <div>

      <h2>Admin Dashboard</h2>

      {/* ADD HACKATHON */}
      <div className="admin-card">
        <h3>Add Hackathon</h3>

        <input
          placeholder="Hackathon Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          placeholder="College"
          value={college}
          onChange={e => setCollege(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <button onClick={addHackathon}>Add Hackathon</button>
      </div>

      {/* VIEW HACKATHONS */}
      <h3>All Hackathons</h3>

      {hackathons.map(h => (
        <div key={h.id} className="admin-card">
          <b>{h.title}</b><br/>
          {h.college}<br/>
          {new Date(h.date).toLocaleDateString()}
        </div>
      ))}

    </div>
  );
}

export default AdminDashboard;
