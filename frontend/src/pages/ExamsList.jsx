import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5001/api";

function ExamsList() {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const token = localStorage.getItem("token");

  const loadExams = async () => {
    try {
      const res = await fetch(`${API_URL}/exams`, {
        headers: { Authorization: "Bearer " + token }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setExams(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      await fetch(`${API_URL}/exams/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
      });
      setExams(exams.filter((exam) => exam._id !== id));
    } catch (err) {
      alert("Failed to delete exam");
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const res = await fetch(`${API_URL}/exams/${id}/publish`, {
        method: "PATCH",
        headers: { Authorization: "Bearer " + token }
      });
      const data = await res.json();
      if (data.exam) {
        setExams(
          exams.map((e) => (e._id === id ? { ...e, isPublished: data.exam.isPublished } : e))
        );
      }
    } catch (err) {
      alert("Failed to update publish status");
    }
  };

  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.name.toLowerCase().includes(search.toLowerCase());
    const matchesSemester = semesterFilter ? exam.semester === Number(semesterFilter) : true;
    return matchesSearch && matchesSemester;
  });

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Manage Exams</h2>
        <Link to="/admin/exams/new">
          <button style={{ backgroundColor: "#2ecc71", color: "#fff" }}>+ Add New Exam</button>
        </Link>
      </div>

      <div style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
        <input
          type="text"
          placeholder="Search exam by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
        >
          <option value="">All Semesters</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="5">Semester 5</option>
          <option value="6">Semester 6</option>
          <option value="7">Semester 7</option>
          <option value="8">Semester 8</option>
        </select>
      </div>

      {exams.length === 0 ? (
        <p>No exams created yet. Click "+ Add New Exam" to create one.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Semester</th>
              <th>Subjects</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.map((exam) => (
              <tr key={exam._id}>
                <td>{exam.name}</td>
                <td>Sem {exam.semester}</td>
                <td>{exam.subjects ? exam.subjects.length : 0}</td>
                <td>
                  <span style={{ color: exam.isPublished ? "green" : "orange", fontWeight: "bold" }}>
                    {exam.isPublished ? "Published" : "Draft (Unpublished)"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <button onClick={() => handleTogglePublish(exam._id)}>
                    {exam.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <Link to={`/admin/exams/${exam._id}/marks`}>
                    <button style={{ backgroundColor: "#3498db", color: "#fff" }}>Enter Marks</button>
                  </Link>
                  <Link to={`/admin/exams/${exam._id}/edit`}>
                    <button>Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(exam._id)}
                    style={{ backgroundColor: "#e74c3c", color: "#fff" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ExamsList;
