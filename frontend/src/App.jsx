import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ExamsList from "./pages/ExamsList";
import ExamCreate from "./pages/ExamCreate";
import ExamEdit from "./pages/ExamEdit";
import ExamMarks from "./pages/ExamMarks";
import StudentResults from "./pages/StudentResults";
import ReportCard from "./pages/ReportCard";
import NotFound from "./pages/NotFound";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <div>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              user.role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/results" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/exams"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <ExamsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/exams/new"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <ExamCreate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/exams/:id/edit"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <ExamEdit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/exams/:id/marks"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <ExamMarks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute user={user} allowedRoles={["student"]}>
              <StudentResults />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results/:id"
          element={
            <ProtectedRoute user={user} allowedRoles={["student", "admin"]}>
              <ReportCard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
