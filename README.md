# Exam Result & Report Card System (PS2)

A MERN stack web application for examination result processing and digital report cards.

## Problem Statement (PS2)
The examination cell defines exams, enters subject-wise marks for students, and automatically calculates total marks, percentage, grade, and pass/fail results. Students can log in to view their published results and print their report cards.

---

## Features
- **Role-based Authentication**: JWT-based login and registration for Students and Admin (Exam Cell).
- **Exam Management (CRUD)**: Admin can create, view, edit, and delete exams with custom subjects, maximum marks, and pass marks.
- **Marks Entry & Validation**:
  - Marks entry screen listing all students in the exam's semester.
  - Strict validation: rejects negative numbers and scores exceeding maximum marks.
- **Automated Result Calculation**:
  - Total marks and maximum total calculation.
  - Percentage computation.
  - Grading system:
    - A+ (>= 90%)
    - A (>= 80%)
    - B (>= 70%)
    - C (>= 60%)
    - D (>= 50%)
    - F (< 50%)
  - Pass/Fail rule: Automatic failure if any subject score is below the pass mark or percentage is below 50%.
- **Publish / Unpublish Toggle**: Students can only view results of published exams.
- **Student Portal**:
  - View published results summary.
  - Detailed report card page with printable CSS styling.
- **Examination Cell Dashboard**:
  - Overall pass percentage.
  - Subject-wise average and highest marks.
  - Top 5 rankers list.

---

## Tech Stack
- **Frontend**: React.js, React Router DOM, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JSON Web Token (JWT), bcryptjs

---

## Project Structure
```text
web-assignment-06/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Exam.js
│   │   ├── Result.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── examRoutes.js
│   │   └── resultRoutes.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
└── frontend/
    ├── public/
    │   └── _redirects
    ├── src/
    │   ├── components/
    │   │   ├── ExamForm.jsx
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── ExamCreate.jsx
    │   │   ├── ExamEdit.jsx
    │   │   ├── ExamMarks.jsx
    │   │   ├── ExamsList.jsx
    │   │   ├── Login.jsx
    │   │   ├── NotFound.jsx
    │   │   ├── Register.jsx
    │   │   ├── ReportCard.jsx
    │   │   └── StudentResults.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── vercel.json
    └── vite.config.js
```

---

## Setup & Running Locally

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on port 27017 or a MongoDB Atlas URI

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm start
```
The backend server runs on `http://localhost:5001`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```
The frontend application runs on `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/exam_system
JWT_SECRET=supersecretkey123
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api
```

---

## Test Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin (Exam Cell) | `admin@example.com` | `admin123` |
| Student 1 | `rahul@example.com` | `password123` |
| Student 2 | `priya@example.com` | `password123` |
| Student 3 | `aman@example.com` | `password123` |

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and return JWT
- `GET /api/auth/students` - Get students list (Admin only)

### Exams
- `GET /api/exams` - List exams
- `POST /api/exams` - Create a new exam (Admin only)
- `GET /api/exams/:id` - Get exam details
- `PUT /api/exams/:id` - Update exam details (Admin only)
- `DELETE /api/exams/:id` - Delete exam and results (Admin only)
- `PATCH /api/exams/:id/publish` - Toggle publish status (Admin only)

### Results
- `POST /api/results/marks` - Save marks for a student in an exam (Admin only)
- `GET /api/results/exam/:examId` - Get all results for an exam (Admin only)
- `GET /api/results/my-results` - Get published results for logged-in student
- `GET /api/results/dashboard` - Get statistics for dashboard (Admin only)
- `GET /api/results/:id` - Get single report card details
# Assignment-6_Divyansh_Agarwal
