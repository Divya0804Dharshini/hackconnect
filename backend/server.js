const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- MYSQL CONNECTION ----------------

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hackconnect_db"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("MySQL Connected");
});

// ---------------- ROOT CHECK ----------------

app.get("/", (req, res) => {
  res.send("HackConnect Backend Running");
});

// ---------------- HACKATHONS ----------------

// get all hackathons
app.get("/hackathons", (req, res) => {
  db.query("SELECT * FROM hackathons ORDER BY date ASC", (err, result) => {
    if (err) res.status(500).send(err);
    else res.json(result);
  });
});

// add hackathon (admin)
app.post("/add-hackathon", (req, res) => {
  const { title, description, date, college } = req.body;

  const sql =
    "INSERT INTO hackathons (title, description, date, college) VALUES (?, ?, ?, ?)";
  db.query(sql, [title, description, date, college], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("DB Error");
    } else {
      res.send("Hackathon Added");
    }
  });
});

// ---------------- AUTH ----------------

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  const sql =
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Signup failed");
    } else {
      res.send("Signup success");
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";
  db.query(sql, [email, password], (err, result) => {
    if (err) res.status(500).send("DB Error");
    else if (result.length > 0) res.json(result[0]);
    else res.status(401).send("Invalid credentials");
  });
});

// ---------------- UPDATE STUDENT DETAILS AFTER JOIN ----------------

app.post("/update-profile", (req, res) => {
 const { user_id, college, department, year, github, linkedin, projects } = req.body;

const sql =
  "UPDATE users SET college=?, department=?, year=?, github=?, linkedin=?, projects=? WHERE id=?";

  db.query(sql, [college, department, year, github, linkedin, projects, user_id], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Update failed");
    } else {
      res.send("Profile updated");
    }
  });
});

// ---------------- TEAM FORMATION ----------------

// create team
app.post("/create-team", (req, res) => {
  const { hackathon_id, team_name, leader_id } = req.body;

  const sql =
    "INSERT INTO teams (hackathon_id, team_name, leader_id) VALUES (?, ?, ?)";
  db.query(sql, [hackathon_id, team_name, leader_id], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Team creation failed");
    } else {
      res.send("Team created");
    }
  });
});

// join team (prevent duplicate)
app.post("/join-team", (req, res) => {
  const { team_id, user_id } = req.body;

  // 🔥 check if user already joined any team in this hackathon
  const checkHackathonSql = `
    SELECT tm.*
    FROM team_members tm
    JOIN teams t ON tm.team_id = t.id
    WHERE tm.user_id = ?
      AND t.hackathon_id = (
        SELECT hackathon_id FROM teams WHERE id = ?
      )
  `;

  db.query(checkHackathonSql, [user_id, team_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("DB Error");
    }

    if (result.length > 0) {
      return res.status(400).send("Already joined a team in this hackathon");
    }

    // ✅ now insert
    const sql = "INSERT INTO team_members (team_id, user_id) VALUES (?, ?)";
    db.query(sql, [team_id, user_id], (err2) => {
      if (err2) {
        console.log(err2);
        res.status(500).send("Join failed");
      } else {
        res.send("Joined team");
      }
    });
  });
});


// get teams for hackathon + member count
app.get("/hackathon-teams/:hackathonId", (req, res) => {
  const hackathonId = req.params.hackathonId;

  const sql = `
    SELECT 
      teams.id AS team_id,
      teams.team_name,
      COUNT(team_members.id) AS member_count
    FROM teams
    LEFT JOIN team_members ON teams.id = team_members.team_id
    WHERE teams.hackathon_id = ?
    GROUP BY teams.id
  `;

  db.query(sql, [hackathonId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error");
    } else {
      res.json(result);
    }
  });
});

// get members of ONE team (for joined team)
app.get("/team-members/:teamId", (req, res) => {
  const teamId = req.params.teamId;

  const sql = `
    SELECT 
  users.id, users.name, users.email, users.college, users.department, users.year,
  users.github, users.linkedin, users.projects,
  teams.team_name, hackathons.title AS hackathon_title

  `;

  db.query(sql, [teamId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error");
    } else {
      res.json(result);
    }
  });
});
// ---------------- ADMIN ACCESS ----------------
app.post("/admin-signup", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Admin signup failed");
    } else {
      res.send("Admin signup success");
    }
  });
});

app.post("/admin-login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM admins WHERE email=? AND password=?";
  db.query(sql, [email, password], (err, result) => {
    if (err) res.status(500).send("DB Error");
    else if (result.length > 0) res.json(result[0]);
    else res.status(401).send("Invalid admin credentials");
  });
});

app.get("/student-profile/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT DISTINCT
      users.id, users.name, users.email, users.college, users.department, users.year,
      users.github, users.linkedin, users.projects,
      teams.team_name,
      hackathons.title AS hackathon_title
    FROM team_members
    JOIN users ON team_members.user_id = users.id
    JOIN teams ON team_members.team_id = teams.id
    JOIN hackathons ON teams.hackathon_id = hackathons.id
    WHERE users.id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error");
    } else {
      res.json(result);
    }
  });
});

app.get("/user-joined-hackathons/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT DISTINCT t.hackathon_id
    FROM team_members tm
    JOIN teams t ON tm.team_id = t.id
    WHERE tm.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) res.status(500).send("Error");
    else res.json(result.map(r => r.hackathon_id));
  });
});
// -------- ADMIN DASHBOARD STATS --------

app.get("/admin-stats", (req, res) => {

  const stats = {};

  db.query("SELECT COUNT(*) AS totalUsers FROM users", (e1, r1) => {
    if (e1) return res.status(500).send("Error");

    stats.totalUsers = r1[0].totalUsers;

    db.query("SELECT COUNT(*) AS totalHackathons FROM hackathons", (e2, r2) => {
      if (e2) return res.status(500).send("Error");

      stats.totalHackathons = r2[0].totalHackathons;

      db.query("SELECT COUNT(*) AS totalTeams FROM teams", (e3, r3) => {
        if (e3) return res.status(500).send("Error");

        stats.totalTeams = r3[0].totalTeams;

        db.query("SELECT COUNT(*) AS totalMembers FROM team_members", (e4, r4) => {
          if (e4) return res.status(500).send("Error");

          stats.totalMembers = r4[0].totalMembers;

          // hackathon-wise teams
          const sql = `
            SELECT h.title, COUNT(t.id) AS teamCount
            FROM hackathons h
            LEFT JOIN teams t ON h.id = t.hackathon_id
            GROUP BY h.id
          `;

          db.query(sql, (e5, r5) => {
            if (e5) return res.status(500).send("Error");

            stats.hackathonTeams = r5;
            res.json(stats);
          });
        });
      });
    });
  });
});

// -------- GET STUDENTS OF A TEAM --------
app.get("/team-students/:teamId", (req, res) => {
  const teamId = req.params.teamId;

  const sql = `
    SELECT u.id, u.name, u.college, u.department, u.year, u.email
    FROM team_members tm
    JOIN users u ON tm.user_id = u.id
    WHERE tm.team_id = ?
  `;

  db.query(sql, [teamId], (err, result) => {
    if (err) res.status(500).send("Error");
    else res.json(result);
  });
});


// -------- ALL TEAMS FOR ADMIN --------
app.get("/all-teams", (req, res) => {

  const sql = `
    SELECT t.id, t.team_name, h.title AS hackathon_title
    FROM teams t
    JOIN hackathons h ON t.hackathon_id = h.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error");
    } else {
      res.json(result);
    }
  });
});

// -------- DELETE TEAM --------
app.delete("/delete-team/:teamId", (req, res) => {
  const teamId = req.params.teamId;

  // first delete members
  db.query("DELETE FROM team_members WHERE team_id = ?", [teamId], (e1) => {
    if (e1) {
      console.log(e1);
      return res.status(500).send("Error deleting members");
    }

    // then delete team
    db.query("DELETE FROM teams WHERE id = ?", [teamId], (e2) => {
      if (e2) {
        console.log(e2);
        return res.status(500).send("Error deleting team");
      }

      res.send("Team deleted");
    });
  });
});

// -------- REMOVE STUDENT FROM TEAM --------
app.delete("/remove-student", (req, res) => {
  const { team_id, user_id } = req.body;

  const sql = "DELETE FROM team_members WHERE team_id = ? AND user_id = ?";

  db.query(sql, [team_id, user_id], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error removing student");
    } else {
      res.send("Student removed");
    }
  });
});

app.post("/send-notification", (req, res) => {
  const { user_id, message } = req.body;

  const sql = "INSERT INTO notifications (user_id, message) VALUES (?, ?)";

  db.query(sql, [user_id, message], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error");
    } else {
      res.send("Notification sent");
    }
  });
});

app.get("/my-notifications/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT message, created_at
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) res.status(500).send("Error");
    else res.json(result);
  });
});

// ---------------- SERVER ----------------

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
