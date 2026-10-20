import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchExams, deleteExam, togglePublishExam } from "../api/examApi";

function ExamsList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const loadExams = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchExams(token);
      if (Array.isArray(data)) {
        setExams(data);
      } else {
        setError(data.message || "Failed to load exams");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      await deleteExam(id, token);
      setExams(exams.filter((exam) => exam._id !== id));
    } catch (err) {
      alert("Failed to delete exam");
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const res = await togglePublishExam(id, token);
      if (res.exam) {
        setExams(
          exams.map((e) => (e._id === id ? { ...e, isPublished: res.exam.isPublished } : e))
        );
      }
    } catch (err) {
      alert("Failed to update publish status");
    }
  };

  if (loading) return <div className="container"><h3>Loading exams...</h3></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Manage Exams</h2>
        <Link to="/admin/exams/new">
          <button style={{ backgroundColor: "#2ecc71", color: "#fff" }}>+ Add New Exam</button>
        </Link>
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
            {exams.map((exam) => (
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
