import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchExamById } from "../api/examApi";
import { getStudentsList } from "../api/authApi";
import { fetchResultsByExam, saveExamMarks } from "../api/resultApi";

function ExamMarks() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [marksState, setMarksState] = useState({});
  const [resultsMap, setResultsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const examData = await fetchExamById(id, token);
        setExam(examData);

        const studentsData = await getStudentsList(examData.semester, token);
        setStudents(Array.isArray(studentsData) ? studentsData : []);

        const resultsData = await fetchResultsByExam(id, token);

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
        setMsg({ text: "Failed to load exam data", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id]);

  const handleMarkChange = (studentId, subjectName, val) => {
    setMarksState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subjectName]: val
      }
    }));
  };

  const handleSaveStudentMarks = async (studentId) => {
    setMsg({ text: "", type: "" });
    const studentMarksObj = marksState[studentId] || {};

    const formattedMarks = exam.subjects.map((sub) => ({
      subjectName: sub.subjectName,
      marksObtained: Number(studentMarksObj[sub.subjectName] || 0)
    }));

    for (const sub of exam.subjects) {
      const val = Number(studentMarksObj[sub.subjectName]);
      if (val === undefined || isNaN(val) || val < 0) {
        setMsg({ text: `Marks for ${sub.subjectName} cannot be negative`, type: "error" });
        return;
      }
      if (val > sub.maxMarks) {
        setMsg({ text: `Marks for ${sub.subjectName} cannot exceed max marks (${sub.maxMarks})`, type: "error" });
        return;
      }
    }

    try {
      const res = await saveExamMarks(
        { studentId, examId: id, marks: formattedMarks },
        token
      );

      if (res.result) {
        setResultsMap((prev) => ({ ...prev, [studentId]: res.result }));
        setMsg({ text: "Marks saved and result calculated successfully!", type: "success" });
      } else {
        setMsg({ text: res.message || "Failed to save marks", type: "error" });
      }
    } catch (err) {
      setMsg({ text: "Network error while saving marks", type: "error" });
    }
  };

  if (loading) return <div className="container"><h3>Loading students & marks...</h3></div>;
  if (!exam) return <div className="container"><p className="error">Exam not found</p></div>;

  return (
    <div className="container" style={{ maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Enter Marks - {exam.name} (Semester {exam.semester})</h2>
        <Link to="/admin/exams">Back to Exams</Link>
      </div>

      {msg.text && (
        <div className={msg.type === "error" ? "error" : "success"}>
          {msg.text}
        </div>
      )}

      {students.length === 0 ? (
        <p>No students enrolled in Semester {exam.semester}.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              {exam.subjects.map((s) => (
                <th key={s._id || s.subjectName}>
                  {s.subjectName}
                  <br />
                  <small style={{ fontWeight: "normal" }}>
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
                        style={{ width: "65px" }}
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
