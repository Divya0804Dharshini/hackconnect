import React, { useState } from "react";
import axios from "axios";

function AddHackathon() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [college, setCollege] = useState("");

  const submit = () => {
    axios.post("http://localhost:5000/add-hackathon", {
      title, description, date, college
    })
    .then(() => alert("Hackathon Added"))
    .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Admin - Add Hackathon</h2>

      <input placeholder="Hackathon Title" onChange={e=>setTitle(e.target.value)} /><br/>
      <input placeholder="Description" onChange={e=>setDescription(e.target.value)} /><br/>
      <input type="date" onChange={e=>setDate(e.target.value)} /><br/>
      <input placeholder="College Name" onChange={e=>setCollege(e.target.value)} /><br/>

      <button onClick={submit}>Add Hackathon</button>
    </div>
  );
}

export default AddHackathon;
