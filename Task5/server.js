const express = require("express");

const app = express();
const PORT = 3004;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// EJS
app.set("view engine", "ejs");

// Temporary student data
let students = [
    {
        id: 1,
        name: "Aarav Sharma",
        email: "aarav@example.com",
        course: "B.Tech CSE",
        skill: "JavaScript"
    },
    {
        id: 2,
        name: "Priya Singh",
        email: "priya@example.com",
        course: "B.Tech IT",
        skill: "React"
    }
];

let nextId = 3;

// ===============================
// FRONTEND ROUTE
// ===============================

app.get("/", (req, res) => {
    res.render("index");
});

// ===============================
// REST API - READ ALL STUDENTS
// GET /api/students
// ===============================

app.get("/api/students", (req, res) => {
    res.json({
        success: true,
        data: students
    });
});

// ===============================
// REST API - READ ONE STUDENT
// GET /api/students/:id
// ===============================

app.get("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const student = students.find((student) => student.id === id);

    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }

    res.json({
        success: true,
        data: student
    });
});

// ===============================
// REST API - CREATE STUDENT
// POST /api/students
// ===============================

app.post("/api/students", (req, res) => {
    const { name, email, course, skill } = req.body;

    if (!name || !email || !course || !skill) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const newStudent = {
        id: nextId++,
        name,
        email,
        course,
        skill
    };

    students.push(newStudent);

    res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: newStudent
    });
});

// ===============================
// REST API - UPDATE STUDENT
// PUT /api/students/:id
// ===============================

app.put("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const student = students.find((student) => student.id === id);

    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }

    const { name, email, course, skill } = req.body;

    if (!name || !email || !course || !skill) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    student.name = name;
    student.email = email;
    student.course = course;
    student.skill = skill;

    res.json({
        success: true,
        message: "Student updated successfully",
        data: student
    });
});

// ===============================
// REST API - DELETE STUDENT
// DELETE /api/students/:id
// ===============================

app.delete("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const studentIndex = students.findIndex(
        (student) => student.id === id
    );

    if (studentIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }

    const deletedStudent = students.splice(studentIndex, 1);

    res.json({
        success: true,
        message: "Student deleted successfully",
        data: deletedStudent[0]
    });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Task 5 server running at http://localhost:${PORT}`);
});