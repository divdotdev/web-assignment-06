const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });
  return res.json();
};

export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  return res.json();
};

export const getStudentsList = async (semester, token) => {
  const url = semester
    ? `${API_URL}/auth/students?semester=${semester}`
    : `${API_URL}/auth/students`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};
