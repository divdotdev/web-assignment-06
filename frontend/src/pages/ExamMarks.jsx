import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function ExamMarks() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [marksState, setMarksState] = useState({});
  const [resultsMap, setResultsMap] = useState({});
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadData() {
      try {
        const examRes = await fetch("http://localhost:5001/api/exams/" + id, {
          headers: { Authorization: "Bearer " + token }
        });
        const examData = await examRes.json();
        setExam(examData);

        const studentsRes = await fetch(
          "http://localhost:5001/api/auth/students?semester=" + examData.semester,
          {
            headers: { Authorization: "Bearer " + token }
          }
        );
        const studentsData = await studentsRes.json();
        setStudents(Array.isArray(studentsData) ? studentsData : []);

        const resultsRes = await fetch("http://localhost:5001/api/results/exam/" + id, {
          headers: { Authorization: "Bearer " + token }
        });
        const resultsData = await resultsRes.json();

        const initialMarks = {};
        const resultMap = {};

        if (Array.isArray(resultsData)) {
          resultsData.forEach((res) => {
            const studentId = res.student ? res.student._id : res.student;
            resultMap[studentId] = res;
            initialMarks[studentId] = {};
            res.marks.forEach((m) => {
              initialMarks[studentId][m.subjectName] = m.marksObtained;
            });
          });
        }

        setMarksState(initialMarks);
        setResultsMap(resultMap);
      } catch (err) {
        console.log(err);
      }
    }

    loadData();
  }, [id, token]);

  const handleMarkChange = (studentId, subjectName, val) => {
    setMarksState({
      ...marksState,
      [studentId]: {
        ...(marksState[studentId] || {}),
        [subjectName]: val
      }
    });
  };

  const handleSaveStudentMarks = async (studentId) => {
    setMsg("");
    const studentMarksObj = marksState[studentId] || {};

    const formattedMarks = exam.subjects.map((sub) => ({
      subjectName: sub.subjectName,
      marksObtained: Number(studentMarksObj[sub.subjectName] || 0)
    }));

    for (let i = 0; i < exam.subjects.length; i++) {
      const sub = exam.subjects[i];
      const val = Number(studentMarksObj[sub.subjectName]);
      if (isNaN(val) || val < 0) {
        alert("Marks for " + sub.subjectName + " cannot be negative");
        return;
      }
      if (val > sub.maxMarks) {
        alert("Marks for " + sub.subjectName + " cannot exceed " + sub.maxMarks);
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:5001/api/results/marks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ studentId, examId: id, marks: formattedMarks })
      });
      const data = await res.json();

      if (data.result) {
        setResultsMap({ ...resultsMap, [studentId]: data.result });
        setMsg("Marks saved successfully!");
      } else {
        alert(data.message || "Failed to save marks");
      }
    } catch (err) {
      alert("Error saving marks");
    }
  };

  if (!exam) return <div className="container"><h3>Loading exam...</h3></div>;

  return (
    <div className="container" style={{ maxWidth: "1050px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Enter Marks - {exam.name} (Semester {exam.semester})</h2>
        <Link to="/admin/exams">Back to Exams</Link>
      </div>

      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {students.length === 0 ? (
        <p>No students enrolled in Semester {exam.semester}.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              {exam.subjects.map((s) => (
                <th key={s.subjectName}>
                  {s.subjectName}
                  <br />
                  <small>
                    (Max: {s.maxMarks}, Pass: {s.passMarks})
                  </small>
                </th>
              ))}
              <th>Total</th>
              <th>%</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((st) => {
              const res = resultsMap[st._id];
              const stMarks = marksState[st._id] || {};

              return (
                <tr key={st._id}>
                  <td>{st.rollNumber || "N/A"}</td>
                  <td>{st.name}</td>
                  {exam.subjects.map((sub) => (
                    <td key={sub.subjectName}>
                      <input
                        type="number"
                        min="0"
                        max={sub.maxMarks}
                        style={{ width: "65px", padding: "6px" }}
                        value={stMarks[sub.subjectName] !== undefined ? stMarks[sub.subjectName] : ""}
                        onChange={(e) =>
                          handleMarkChange(st._id, sub.subjectName, e.target.value)
                        }
                      />
                    </td>
                  ))}
                  <td>{res ? `${res.totalMarks}/${res.maxTotalMarks}` : "-"}</td>
                  <td>{res ? `${res.percentage}%` : "-"}</td>
                  <td>{res ? res.grade : "-"}</td>
                  <td>
                    {res ? (
                      <span className={res.status === "Pass" ? "badge-pass" : "badge-fail"}>
                        {res.status}
                      </span>
                    ) : (
                      "Not Entered"
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleSaveStudentMarks(st._id)}
                      style={{ backgroundColor: "#27ae60", color: "#fff" }}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ExamMarks;
