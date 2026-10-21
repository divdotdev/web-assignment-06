import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExamForm from "../components/ExamForm";

function ExamEdit() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function getExam() {
      try {
        const res = await fetch("http://localhost:5001/api/exams/" + id, {
          headers: { Authorization: "Bearer " + token }
        });
        const data = await res.json();
        if (data._id) {
          setExam(data);
        } else {
          setError(data.message || "Failed to load exam");
        }
      } catch (err) {
        setError("Server error");
      }
    }
    getExam();
  }, [id, token]);

  const handleUpdate = async (formData) => {
    try {
      const res = await fetch("http://localhost:5001/api/exams/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data._id) {
        navigate("/admin/exams");
      } else {
        setError(data.message || "Failed to update exam");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  if (!exam) return <div className="container"><h3>Loading exam...</h3></div>;

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      <h2>Edit Exam</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ExamForm initialData={exam} onSubmit={handleUpdate} buttonText="Update Exam" />
    </div>
  );
}

export default ExamEdit;
