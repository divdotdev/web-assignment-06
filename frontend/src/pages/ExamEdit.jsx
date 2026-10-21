import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExamForm from "../components/ExamForm";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

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
        const res = await fetch(`${API_URL}/exams/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

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
      const res = await fetch(`${API_URL}/exams/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
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
