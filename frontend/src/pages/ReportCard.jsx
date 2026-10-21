import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

function ReportCard() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/results/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (data._id) {
          setResult(data);
        } else {
          setError(data.message || "Failed to load report card");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="container"><h3>Loading report card...</h3></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!result) return <div className="container"><p className="error">Result not found</p></div>;

  const subjectMap = {};
  if (result.exam && result.exam.subjects) {
    result.exam.subjects.forEach((s) => {
      subjectMap[s.subjectName] = s;
    });
  }

  return (
    <div className="container" style={{ border: "2px solid #333", padding: "30px" }}>
      <div style={{ textAlign: "center", borderBottom: "2px solid #333", paddingBottom: "15px" }}>
        <h1 style={{ margin: 0 }}>STUDENT REPORT CARD</h1>
        <h3 style={{ margin: "5px 0" }}>{result.exam ? result.exam.name : "Semester Examination"}</h3>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0" }}>
        <div>
          <p><strong>Student Name:</strong> {result.student ? result.student.name : "N/A"}</p>
          <p><strong>Roll Number:</strong> {result.student ? result.student.rollNumber : "N/A"}</p>
        </div>
        <div>
          <p><strong>Semester:</strong> {result.student ? result.student.semester : "N/A"}</p>
          <p><strong>Status:</strong>{" "}
            <span className={result.status === "Pass" ? "badge-pass" : "badge-fail"}>
              {result.status}
            </span>
          </p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Subject Name</th>
            <th>Max Marks</th>
            <th>Pass Marks</th>
            <th>Marks Obtained</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {result.marks.map((m, idx) => {
            const subInfo = subjectMap[m.subjectName] || { maxMarks: 100, passMarks: 40 };
            const isSubPass = m.marksObtained >= subInfo.passMarks;

            return (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{m.subjectName}</td>
                <td>{subInfo.maxMarks}</td>
                <td>{subInfo.passMarks}</td>
                <td>{m.marksObtained}</td>
                <td>
                  <span className={isSubPass ? "badge-pass" : "badge-fail"}>
                    {isSubPass ? "Pass" : "Fail"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", background: "#f2f2f2", padding: "15px" }}>
        <div>
          <p style={{ margin: "4px 0" }}><strong>Total Marks:</strong> {result.totalMarks} / {result.maxTotalMarks}</p>
          <p style={{ margin: "4px 0" }}><strong>Percentage:</strong> {result.percentage}%</p>
        </div>
        <div>
          <p style={{ margin: "4px 0" }}><strong>Final Grade:</strong> {result.grade}</p>
          <p style={{ margin: "4px 0" }}><strong>Final Result:</strong>{" "}
            <span className={result.status === "Pass" ? "badge-pass" : "badge-fail"}>
              {result.status}
            </span>
          </p>
        </div>
      </div>

      <div style={{ marginTop: "25px", display: "flex", gap: "10px" }}>
        <button onClick={() => window.print()} style={{ backgroundColor: "#2ecc71", color: "#fff" }}>
          Print Report Card
        </button>
        <Link to="/results">
          <button>Back to Results</button>
        </Link>
      </div>
    </div>
  );
}

export default ReportCard;
