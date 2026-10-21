import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav>
      {user ? (
        <>
          {user.role === "admin" && (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/exams">Manage Exams</Link>
              <Link to="/admin/exams/new">Add Exam</Link>
            </>
          )}

          {user.role === "student" && (
            <>
              <Link to="/results">My Results</Link>
            </>
          )}

          <span style={{ color: "#aaa", fontSize: "14px" }}>
            {user.name} ({user.role})
          </span>

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
