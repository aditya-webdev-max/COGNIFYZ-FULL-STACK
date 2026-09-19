const express = require("express");

const app = express();
const PORT = 3001;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// Temporary server-side storage
const registrations = [];


// Home page
app.get("/", (req, res) => {
    res.render("index", {
        errors: [],
        formData: {}
    });
});


// Handle registration
app.post("/register", (req, res) => {

    const {
        name,
        email,
        college,
        course,
        phone,
        password,
        confirmPassword
    } = req.body;

    const errors = [];


    // Name validation
    if (!name || name.trim().length < 3) {
        errors.push(
            "Full name must contain at least 3 characters."
        );
    }


    // Email validation
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email.trim())) {
        errors.push(
            "Please enter a valid email address."
        );
    }


    // College validation
    if (!college || college.trim().length < 3) {
        errors.push(
            "College name must contain at least 3 characters."
        );
    }


    // Course validation
    if (!course || course.trim().length < 2) {
        errors.push(
            "Please enter a valid course."
        );
    }


    // Phone validation
    const phonePattern = /^[0-9]{10}$/;

    if (!phone || !phonePattern.test(phone)) {
        errors.push(
            "Phone number must contain exactly 10 digits."
        );
    }


    // Strong password validation
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!password || !passwordPattern.test(password)) {
        errors.push(
            "Password must contain 8+ characters, uppercase, lowercase and a number."
        );
    }


    // Confirm password validation
    if (password !== confirmPassword) {
        errors.push(
            "Password and confirm password must match."
        );
    }


    // If validation fails
    if (errors.length > 0) {

        return res.render("index", {
            errors,
            formData: {
                name,
                email,
                college,
                course,
                phone
            }
        });
    }


    // Store only required student information
    // Password is intentionally not stored.
    const student = {

        id: registrations.length + 1,

        name: name.trim(),

        email: email.trim(),

        college: college.trim(),

        course: course.trim(),

        phone

    };


    registrations.push(student);


    // Show successful registration
    res.render("result", {
        student
    });

});


// View temporary registrations
app.get("/students", (req, res) => {

    res.render("students", {
        registrations
    });

});


// Start server
app.listen(PORT, () => {

    console.log(
        `Task 2 server running at http://localhost:${PORT}`
    );

});