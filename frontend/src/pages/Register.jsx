import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [rollNumber, setRollNumber] = useState("");
  const [semester, setSemester] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          rollNumber: role === "student" ? rollNumber : "",
          semester: role === "student" ? Number(semester) : 1
        })
      });
      const data = await res.json();

      if (data.message === "User registered successfully") {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "450px" }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label>Email: </label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label>Role: </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box" }}
          >
            <option value="student">Student</option>
            <option value="admin">Exam Cell / Admin</option>
          </select>
        </div>

        {role === "student" && (
          <>
            <div>
              <label>Roll Number: </label>
              <input
                type="text"
                placeholder="e.g. 23CS01"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label>Semester: </label>
              <input
                type="number"
                min="1"
                max="8"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </>
        )}

        <button type="submit" style={{ backgroundColor: "#2ecc71", color: "#fff", marginTop: "10px" }}>
          Register
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
