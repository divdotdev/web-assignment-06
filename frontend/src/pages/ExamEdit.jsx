import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExamForm from "../components/ExamForm";
import { fetchExamById, updateExam } from "../api/examApi";

function ExamEdit() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchExamById(id, token);
        if (data._id) {
          setExam(data);
        } else {
          setError(data.message || "Failed to load exam");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      const res = await updateExam(id, formData, token);
      if (res._id) {
        navigate("/admin/exams");
      } else {
        setError(res.message || "Failed to update exam");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  if (loading) return <div className="container"><h3>Loading exam details...</h3></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <div className="container">
      <h2>Edit Exam</h2>
      <ExamForm initialData={exam} onSubmit={handleUpdate} buttonText="Update Exam" />
    </div>
  );
}

export default ExamEdit;
