import React, { useEffect, useState } from "react";
import axios from "axios";

function HackathonList() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [hackathons, setHackathons] = useState([]);
  const [teams, setTeams] = useState({});
  const [openedHackathon, setOpenedHackathon] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState("");

  const [joinTeamId, setJoinTeamId] = useState(null);

  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");

  const [joinedHackathons, setJoinedHackathons] = useState([]);

  const [search, setSearch] = useState("");

  // ---------------- LOAD HACKATHONS + JOINED ----------------

  useEffect(() => {
    axios.get("http://localhost:5000/hackathons")
      .then(res => setHackathons(res.data));

    if (user) {
      axios.get(`http://localhost:5000/user-joined-hackathons/${user.id}`)
        .then(res => setJoinedHackathons(res.data))
        .catch(err => console.log(err));
    }
  }, []);

  // ---------------- LOAD TEAMS ----------------

  const loadTeams = (hackathonId) => {
    setOpenedHackathon(hackathonId);
    setShowCreateForm(false);
    setJoinTeamId(null);

    axios.get(`http://localhost:5000/hackathon-teams/${hackathonId}`)
      .then(res => {
        setTeams(prev => ({ ...prev, [hackathonId]: res.data }));
      });
  };

  // ---------------- CREATE TEAM ----------------

  const createTeam = (hackathonId) => {

    if (!user) return alert("Login first");

    if (!teamName || !college || !department || !year) {
      alert("Fill all details");
      return;
    }

    axios.post("http://localhost:5000/update-profile", {
      user_id: user.id,
      college, department, year
    })
    .then(() => {
      return axios.post("http://localhost:5000/create-team", {
        hackathon_id: hackathonId,
        team_name: teamName,
        leader_id: user.id
      });
    })
    .then(() => {
      alert("Team created");
      setShowCreateForm(false);
      setTeamName("");
      loadTeams(hackathonId);

      return axios.get(`http://localhost:5000/user-joined-hackathons/${user.id}`);
    })
    .then(res => setJoinedHackathons(res.data))
    .catch(err => {
      if (err.response && err.response.data) {
        alert(err.response.data);
      } else {
        alert("Create team failed");
      }
    });
  };

  // ---------------- JOIN TEAM ----------------

  const startJoin = (teamId) => {
    setJoinTeamId(teamId);
  };

  const submitJoin = (hackathonId) => {

    if (!college || !department || !year) {
      alert("Fill all details");
      return;
    }

    axios.post("http://localhost:5000/update-profile", {
      user_id: user.id,
      college, department, year
    })
    .then(() => {
      return axios.post("http://localhost:5000/join-team", {
        team_id: joinTeamId,
        user_id: user.id
      });
    })
    .then(() => {
      alert("Joined team successfully");
      setJoinTeamId(null);
      loadTeams(hackathonId);

      return axios.get(`http://localhost:5000/user-joined-hackathons/${user.id}`);
    })
    .then(res => setJoinedHackathons(res.data))
    .catch(err => {
      if (err.response && err.response.data) {
        alert(err.response.data);
      } else {
        alert("Server error. Try again.");
      }
    });
  };

  // ---------------- UI ----------------

  return (
    <div className="page-container">
      <h2>Upcoming Hackathons</h2>

      {/* 🔍 SEARCH BAR */}
      <input
        placeholder="Search by hackathon or college..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: "10px", width: "95%", marginBottom: "20px" }}
      />

      <div className="hackathon-grid">

        {hackathons
          .filter(h =>
            h.title.toLowerCase().includes(search.toLowerCase()) ||
            h.college.toLowerCase().includes(search.toLowerCase())
          )
          .map(h => {

            const alreadyJoined = joinedHackathons.includes(h.id);

            return (
              <div key={h.id} className="card">

                <b>{h.title}</b><br/>
                {h.college}<br/>
                {new Date(h.date).toLocaleDateString()}<br/>

                {alreadyJoined && (
                  <p style={{ color: "red" }}>Already joined this hackathon</p>
                )}

                {openedHackathon !== h.id && (
                  <button onClick={() => loadTeams(h.id)}>View Teams</button>
                )}

                {openedHackathon === h.id && teams[h.id] && (

                  <div>

                    {/* NO TEAMS */}
                    {teams[h.id].length === 0 && !showCreateForm && !alreadyJoined && (
                      <div>
                        <p>No teams formed yet</p>
                        <button onClick={() => setShowCreateForm(true)}>
                          Create Team
                        </button>
                      </div>
                    )}

                    {teams[h.id].length === 0 && alreadyJoined && (
                      <p>You already joined a team in this hackathon</p>
                    )}

                    {/* TEAMS EXIST */}
                    {teams[h.id].length > 0 && !showCreateForm && (
                      <div>
                        {teams[h.id].map(t => {
                          const remaining = 4 - t.member_count;

                          return (
                            <div key={t.team_id} className="team-card">

                              <b>{t.team_name}</b><br/>
                              Members: {t.member_count}/4<br/>

                              {!alreadyJoined && remaining > 0 && (
                                <button onClick={() => startJoin(t.team_id)}>
                                  Join Team
                                </button>
                              )}

                              {alreadyJoined && (
                                <button disabled className="joined-btn">

                                  Already Joined
                                </button>
                              )}

                              {joinTeamId === t.team_id && !alreadyJoined && (
                                <div>
                                  <h4>Enter Your Details</h4>
                                  <input placeholder="College" onChange={e=>setCollege(e.target.value)} /><br/>
                                  <input placeholder="Department" onChange={e=>setDepartment(e.target.value)} /><br/>
                                  <input placeholder="Year" onChange={e=>setYear(e.target.value)} /><br/>
                                  <button onClick={() => submitJoin(h.id)}>Submit & Join</button>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {!alreadyJoined && (
                          <button onClick={() => setShowCreateForm(true)}>
                            Create New Team
                          </button>
                        )}
                      </div>
                    )}

                    {/* CREATE TEAM FORM */}
                    {showCreateForm && !alreadyJoined && (
                      <div className="team-card">

                        <h4>Create Team</h4>

                        <input
                          placeholder="Team Name"
                          value={teamName}
                          onChange={e => setTeamName(e.target.value)}
                        /><br/>

                        <input placeholder="College" onChange={e=>setCollege(e.target.value)} /><br/>
                        <input placeholder="Department" onChange={e=>setDepartment(e.target.value)} /><br/>
                        <input placeholder="Year" onChange={e=>setYear(e.target.value)} /><br/>

                        <button onClick={() => createTeam(h.id)}>Create</button>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}
      </div>
    </div>
  );
}

export default HackathonList;
