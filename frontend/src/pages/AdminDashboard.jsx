import React, { useState, useEffect } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("http://localhost:5001/api/results/dashboard", {
          headers: { Authorization: "Bearer " + token }
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.log(err);
      }
    }
    loadStats();
  }, [token]);

  if (!stats) return <div className="container"><h3>Loading dashboard...</h3></div>;

  if (stats.totalResults === 0) {
    return (
      <div className="container">
        <h2>Admin Dashboard</h2>
        <p>No exam results available yet. Create exams and enter student marks.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Examination Cell Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ flex: 1, padding: "20px", border: "1px solid #ddd", borderRadius: "6px", background: "#fdfdfd" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>Total Results Evaluated</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#2c3e50" }}>{stats.totalResults}</p>
        </div>
        <div style={{ flex: 1, padding: "20px", border: "1px solid #ddd", borderRadius: "6px", background: "#fdfdfd" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>Overall Pass Percentage</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#27ae60" }}>
            {stats.passPercentage}%
          </p>
        </div>
      </div>

      <h3 style={{ marginTop: "35px" }}>Top 5 Performing Students</h3>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Roll Number</th>
            <th>Student Name</th>
            <th>Percentage</th>
            <th>Grade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {stats.topStudents.map((st, idx) => (
            <tr key={idx}>
              <td>#{st.rank}</td>
              <td>{st.rollNumber}</td>
              <td>{st.name}</td>
              <td>{st.percentage}%</td>
              <td>{st.grade}</td>
              <td>
                <span className={st.status === "Pass" ? "badge-pass" : "badge-fail"}>
                  {st.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "35px" }}>Subject-wise Performance</h3>
      <table>
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Average Marks</th>
            <th>Highest Marks</th>
          </tr>
        </thead>
        <tbody>
          {stats.subjectStats.map((sub, idx) => (
            <tr key={idx}>
              <td>{sub.subjectName}</td>
              <td>{sub.average}</td>
              <td>{sub.highest}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
