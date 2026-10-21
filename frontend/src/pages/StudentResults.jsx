import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function StudentResults() {
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await fetch("http://localhost:5001/api/results/my-results", {
          headers: { Authorization: "Bearer " + token }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setResults(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    loadResults();
  }, [token]);

  return (
    <div className="container">
      <h2>My Exam Results</h2>

      {results.length === 0 ? (
        <p>No published exam results available for your account yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Semester</th>
              <th>Marks</th>
              <th>Percentage</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id}>
                <td>{r.exam ? r.exam.name : "N/A"}</td>
                <td>Sem {r.exam ? r.exam.semester : "N/A"}</td>
                <td>{r.totalMarks} / {r.maxTotalMarks}</td>
                <td>{r.percentage}%</td>
                <td>{r.grade}</td>
                <td>
                  <span className={r.status === "Pass" ? "badge-pass" : "badge-fail"}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <Link to={`/results/${r._id}`}>
                    <button style={{ backgroundColor: "#3498db", color: "#fff" }}>
                      View Report Card
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentResults;
