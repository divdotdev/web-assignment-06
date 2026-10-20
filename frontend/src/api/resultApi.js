const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const saveExamMarks = async (marksData, token) => {
  const res = await fetch(`${API_URL}/results/marks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(marksData)
  });
  return res.json();
};

export const fetchResultsByExam = async (examId, token) => {
  const res = await fetch(`${API_URL}/results/exam/${examId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const fetchMyResults = async (token) => {
  const res = await fetch(`${API_URL}/results/my-results`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const fetchResultById = async (id, token) => {
  const res = await fetch(`${API_URL}/results/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const fetchDashboardStats = async (token) => {
  const res = await fetch(`${API_URL}/results/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};
