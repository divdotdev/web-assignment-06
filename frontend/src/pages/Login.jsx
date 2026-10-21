import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/results");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "450px" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" style={{ backgroundColor: "#3498db", color: "#fff", marginTop: "10px" }}>
          Login
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
