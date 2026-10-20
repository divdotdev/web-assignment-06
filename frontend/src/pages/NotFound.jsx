import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/login">
        <button>Go to Login</button>
      </Link>
    </div>
  );
}

export default NotFound;
