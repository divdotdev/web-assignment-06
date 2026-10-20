const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const fetchExams = async (token) => {
  const res = await fetch(`${API_URL}/exams`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const fetchExamById = async (id, token) => {
  const res = await fetch(`${API_URL}/exams/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const createExam = async (examData, token) => {
  const res = await fetch(`${API_URL}/exams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(examData)
  });
  return res.json();
};

export const updateExam = async (id, examData, token) => {
  const res = await fetch(`${API_URL}/exams/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(examData)
  });
  return res.json();
};

export const deleteExam = async (id, token) => {
  const res = await fetch(`${API_URL}/exams/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const togglePublishExam = async (id, token) => {
  const res = await fetch(`${API_URL}/exams/${id}/publish`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};
