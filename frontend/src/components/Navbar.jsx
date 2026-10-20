import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

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
              <NavLink to="/admin/dashboard">Dashboard</NavLink>
              <NavLink to="/admin/exams">Manage Exams</NavLink>
              <NavLink to="/admin/exams/new">Add Exam</NavLink>
            </>
          )}

          {user.role === "student" && (
            <>
              <NavLink to="/results">My Results</NavLink>
            </>
          )}

          <span style={{ color: "#aaa", fontSize: "14px" }}>
            {user.name} ({user.role})
          </span>

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </>
      )}
    </nav>
  );
}

export default Navbar;
