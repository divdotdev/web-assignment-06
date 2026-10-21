import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExamForm from "../components/ExamForm";

const API_URL = "http://localhost:5001/api";

function ExamCreate() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleCreate = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/exams`, {
        method: "POST",
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
        setError(data.message || "Failed to create exam");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="container">
      <h2>Add New Exam</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ExamForm onSubmit={handleCreate} buttonText="Create Exam" />
    </div>
  );
}

export default ExamCreate;
