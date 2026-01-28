import React, { useState } from "react";
import axios from "axios";

function TeamMembers() {
  const [teamId, setTeamId] = useState("");
  const [members, setMembers] = useState([]);

  const loadMembers = () => {
    axios.get(`http://localhost:5000/team-members/${teamId}`)
      .then(res => setMembers(res.data))
      .catch(() => alert("Error loading members"));
  };

  return (
    <div>
      <h3>View Team Members</h3>

      <input
        placeholder="Enter Team ID"
        onChange={e => setTeamId(e.target.value)}
      />
      <button onClick={loadMembers}>View</button>

      <ul>
        {members.map((m, i) => (
          <li key={i}>
            {m.name} — {m.college}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamMembers;
