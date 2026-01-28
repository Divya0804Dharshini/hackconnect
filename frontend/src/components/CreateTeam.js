import React, { useState } from "react";
import axios from "axios";

function CreateTeam() {
  const [teamName, setTeamName] = useState("");
  const [hackathonId, setHackathonId] = useState("");

  const createTeam = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }

    axios.post("http://localhost:5000/create-team", {
      hackathon_id: hackathonId,
      team_name: teamName,
      leader_id: user.id
    })
    .then(() => alert("Team Created"))
    .catch(() => alert("Error creating team"));
  };

  return (
    <div>
      <h3>Create Team</h3>

      <input
        placeholder="Hackathon ID"
        onChange={e => setHackathonId(e.target.value)}
      /><br/>

      <input
        placeholder="Team Name"
        onChange={e => setTeamName(e.target.value)}
      /><br/>

      <button onClick={createTeam}>Create Team</button>
    </div>
  );
}

export default CreateTeam;
