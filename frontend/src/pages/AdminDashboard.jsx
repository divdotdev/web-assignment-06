import React, { useState, useEffect } from "react";
import { fetchDashboardStats } from "../api/resultApi";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats(token);
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="container"><h3>Loading dashboard...</h3></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!stats || stats.totalResults === 0) {
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

      <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
        <div style={{ flex: 1, padding: "15px", border: "1px solid #ccc", background: "#fdfdfd" }}>
          <h3>Total Results</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{stats.totalResults}</p>
        </div>
        <div style={{ flex: 1, padding: "15px", border: "1px solid #ccc", background: "#fdfdfd" }}>
          <h3>Overall Pass %</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0, color: "#27ae60" }}>
            {stats.passPercentage}%
          </p>
        </div>
      </div>

      <h3 style={{ marginTop: "30px" }}>Top 5 Performing Students</h3>
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
              <td>#{idx + 1}</td>
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

      <h3 style={{ marginTop: "30px" }}>Subject-wise Performance</h3>
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
