# 🚀 HackConnect Platform

HackConnect is a full-stack web application designed to help students discover hackathons, form teams, and collaborate easily, while providing admins tools to manage hackathons, teams, and participants.

---

## 📌 Features

### 👩‍🎓 Student Features
- Student Signup & Login
- View upcoming hackathons
- Search hackathons by name or college
- Create a team for a hackathon
- Join existing teams
- Prevent multiple joins in same hackathon
- Student profile with:
  - College
  - Department
  - Year
  - GitHub link
  - LinkedIn link
  - Previous projects
- View joined teams and hackathons
- Receive notifications from admin

### 👑 Admin Features
- Admin Signup & Login
- Add new hackathons
- View all hackathons
- View teams under each hackathon
- View students in each team
- Remove students from teams
- Delete teams
- View platform statistics
- Send notifications to students

---

## 🛠 Tech Stack

### Frontend
- Javascript
- React.js
- React Router DOM
- CSS

### Backend
- Node.js
- Express.js

### Database
- MySQL

---

## 📂 Project Structure

HackConnect/
├── backend/
│ ├── server.js
│ ├── package.json
│ └── ...
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── ...
├── README.md

🔐 Login Details
Student

Signup from Student Access

Login using email & password

Admin

Signup from Admin Access

Login using admin credentials

🌐 API Endpoints (Sample)

GET /hackathons

POST /add-hackathon

POST /signup

POST /login

POST /create-team

POST /join-team

GET /hackathon-teams/:id

GET /team-students/:id

POST /send-notification
