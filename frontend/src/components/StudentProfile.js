import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentProfile() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // edit form states (always blank initially)
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [projects, setProjects] = useState("");

  useEffect(() => {
    if (user) {
      loadProfile();
      loadNotifications();
    }

    // always clear form on page load
    setCollege("");
    setDepartment("");
    setYear("");
    setGithub("");
    setLinkedin("");
    setProjects("");
  }, []);

  const loadProfile = () => {
    axios.get(`http://localhost:5000/student-profile/${user.id}`)
      .then(res => setProfile(res.data))
      .catch(err => console.log(err));
  };

  const loadNotifications = () => {
    axios.get(`http://localhost:5000/my-notifications/${user.id}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.log(err));
  };

  const saveProfile = () => {
    axios.post("http://localhost:5000/update-profile", {
      user_id: user.id,
      college,
      department,
      year,
      github,
      linkedin,
      projects
    })
    .then(() => {
      alert("Profile Updated");
      loadProfile();
    })
    .catch(() => alert("Update failed"));
  };

  if (!user) return null;

  const main = profile[0];

  return (
    <div className="profile-container">
      <div className="profile-card">

        <h2>My Profile</h2>

        {main && (
          <>
            <p><b>Name:</b> {main.name}</p>
            <p><b>Email:</b> {main.email}</p>
          </>
        )}

        <h3>Edit Details</h3>

        {/* form without auto-fill */}
        <form autoComplete="off" onSubmit={e => e.preventDefault()}>

          {/* hidden dummy fields to prevent browser autofill */}
          <input type="text" name="fakeuser" style={{ display: "none" }} />
          <input type="password" name="fakepass" style={{ display: "none" }} />

          <input
            placeholder="College"
            value={college}
            onChange={e => setCollege(e.target.value)}
            autoComplete="off"
            name="college_profile"
          />

          <input
            placeholder="Department"
            value={department}
            onChange={e => setDepartment(e.target.value)}
            autoComplete="off"
            name="department_profile"
          />

          <input
            placeholder="Year"
            value={year}
            onChange={e => setYear(e.target.value)}
            autoComplete="off"
            name="year_profile"
          />

          <input
            placeholder="GitHub Link"
            value={github}
            onChange={e => setGithub(e.target.value)}
            autoComplete="off"
            name="github_profile"
          />

          <input
            placeholder="LinkedIn Link"
            value={linkedin}
            onChange={e => setLinkedin(e.target.value)}
            autoComplete="off"
            name="linkedin_profile"
          />

          <textarea
            placeholder="Previous Projects"
            value={projects}
            onChange={e => setProjects(e.target.value)}
            autoComplete="off"
            name="projects_profile"
          />

          <button onClick={saveProfile}>Save Profile</button>
        </form>

        {/* MY TEAMS */}
        <h3>My Teams</h3>

        {profile.length === 0 || !profile[0].team_name ? (
          <p>Not joined in any team yet</p>
        ) : (
          <ul>
            {profile.map((p, i) => (
              <li key={i}>
                {p.team_name} — {p.hackathon_title}
              </li>
            ))}
          </ul>
        )}

        {/* 🔔 NOTIFICATIONS */}
        <h3>Notifications</h3>

        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((n, i) => (
            <div key={i} className="team-card">
              {n.message}<br/>
              <small>{new Date(n.created_at).toLocaleString()}</small>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default StudentProfile;
