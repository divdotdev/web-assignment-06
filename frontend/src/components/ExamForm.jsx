import React, { useState, useEffect } from "react";

function ExamForm({ initialData, onSubmit, buttonText }) {
  const [name, setName] = useState("");
  const [semester, setSemester] = useState(1);
  const [subjects, setSubjects] = useState([
    { subjectName: "", maxMarks: 100, passMarks: 40 }
  ]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSemester(initialData.semester || 1);
      if (initialData.subjects && initialData.subjects.length > 0) {
        setSubjects(initialData.subjects);
      }
    }
  }, [initialData]);

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = field === "subjectName" ? value : Number(value);
    setSubjects(updated);
  };

  const addSubjectRow = () => {
    setSubjects([...subjects, { subjectName: "", maxMarks: 100, passMarks: 40 }]);
  };

  const removeSubjectRow = (index) => {
    if (subjects.length === 1) {
      setError("At least one subject is required");
      return;
    }
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Exam name is required");
      return;
    }

    for (const sub of subjects) {
      if (!sub.subjectName.trim()) {
        setError("All subjects must have a name");
        return;
      }
      if (sub.passMarks > sub.maxMarks) {
        setError("Pass marks cannot be greater than max marks");
        return;
      }
    }

    onSubmit({ name, semester: Number(semester), subjects });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}

      <div>
        <label>Exam Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mid-Sem Exam"
          required
        />
      </div>

      <div>
        <label>Semester:</label>
        <input
          type="number"
          min="1"
          max="8"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          required
        />
      </div>

      <h4>Subjects</h4>
      {subjects.map((sub, index) => (
        <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Subject Name"
            value={sub.subjectName}
            onChange={(e) => handleSubjectChange(index, "subjectName", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Max Marks"
            value={sub.maxMarks}
            onChange={(e) => handleSubjectChange(index, "maxMarks", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Pass Marks"
            value={sub.passMarks}
            onChange={(e) => handleSubjectChange(index, "passMarks", e.target.value)}
            required
          />
          <button type="button" onClick={() => removeSubjectRow(index)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={addSubjectRow}>
        + Add Another Subject
      </button>

      <button type="submit" style={{ marginTop: "15px", backgroundColor: "#2ecc71", color: "#fff" }}>
        {buttonText || "Save Exam"}
      </button>
    </form>
  );
}

export default ExamForm;
