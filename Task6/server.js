require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();
const PORT = 3005;

// ===============================
// DATABASE CONNECTION
// ===============================

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });

// ===============================
// MODELS
// ===============================

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        course: {
            type: String,
            required: true,
            trim: true
        },
        skill: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Student = mongoose.model("Student", studentSchema);
const User = mongoose.model("User", userSchema);

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        }
    })
);

// EJS
app.set("view engine", "ejs");

// ===============================
// AUTHENTICATION MIDDLEWARE
// ===============================

function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: "Please login first"
        });
    }

    next();
}

// ===============================
// FRONTEND ROUTES
// ===============================

// Login page
app.get("/login", (req, res) => {
    if (req.session.userId) {
        return res.redirect("/");
    }

    res.render("login");
});

// Register page
app.get("/register", (req, res) => {
    if (req.session.userId) {
        return res.redirect("/");
    }

    res.render("register");
});

// Dashboard
app.get("/", (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    res.render("index");
});

// ===============================
// AUTH API - REGISTER
// POST /api/auth/register
// ===============================

app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        req.session.userId = user._id;
        req.session.userName = user.name;

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
});

// ===============================
// AUTH API - LOGIN
// POST /api/auth/login
// ===============================

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        req.session.userId = user._id;
        req.session.userName = user.name;

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
});

// ===============================
// AUTH API - LOGOUT
// POST /api/auth/logout
// ===============================

app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: "Logout failed"
            });
        }

        res.json({
            success: true,
            message: "Logout successful"
        });
    });
});

// ===============================
// AUTH API - CURRENT USER
// GET /api/auth/me
// ===============================

app.get("/api/auth/me", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: "Not logged in"
            });
        }

        const user = await User.findById(req.session.userId).select(
            "-password"
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to get user"
        });
    }
});

// ===============================
// STUDENT API - READ ALL
// GET /api/students
// ===============================

app.get("/api/students", requireAuth, async (req, res) => {
    try {
        const students = await Student.find().sort({
            createdAt: -1
        });

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch students"
        });
    }
});

// ===============================
// STUDENT API - READ ONE
// GET /api/students/:id
// ===============================

app.get("/api/students/:id", requireAuth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

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
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid student ID"
        });
    }
});

// ===============================
// STUDENT API - CREATE
// POST /api/students
// ===============================

app.post("/api/students", requireAuth, async (req, res) => {
    try {
        const { name, email, course, skill } = req.body;

        if (!name || !email || !course || !skill) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const student = await Student.create({
            name,
            email,
            course,
            skill
        });

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create student"
        });
    }
});

// ===============================
// STUDENT API - UPDATE
// PUT /api/students/:id
// ===============================

app.put("/api/students/:id", requireAuth, async (req, res) => {
    try {
        const { name, email, course, skill } = req.body;

        if (!name || !email || !course || !skill) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                course,
                skill
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student updated successfully",
            data: student
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update student"
        });
    }
});

// ===============================
// STUDENT API - DELETE
// DELETE /api/students/:id
// ===============================

app.delete("/api/students/:id", requireAuth, async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully",
            data: student
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to delete student"
        });
    }
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Task 6 server running at http://localhost:${PORT}`);
});