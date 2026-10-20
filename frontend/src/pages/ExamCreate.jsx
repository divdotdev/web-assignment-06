import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExamForm from "../components/ExamForm";
import { createExam } from "../api/examApi";

function ExamCreate() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleCreate = async (formData) => {
    try {
      const res = await createExam(formData, token);
      if (res._id) {
        navigate("/admin/exams");
      } else {
        setServerError(res.message || "Failed to create exam");
      }
    } catch (err) {
      setServerError("Network error");
    }
  };

  return (
    <div className="container">
      <h2>Add New Exam</h2>
      {serverError && <p className="error">{serverError}</p>}
      <ExamForm onSubmit={handleCreate} buttonText="Create Exam" />
    </div>
  );
}

export default ExamCreate;
