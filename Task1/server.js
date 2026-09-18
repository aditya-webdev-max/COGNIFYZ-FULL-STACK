const express = require("express");

const app = express();
const PORT = 3000;

// Set EJS as the template engine
app.set("view engine", "ejs");

// Serve static files from the public folder
app.use(express.static("public"));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
    res.render("index");
});

// Handle registration form submission
app.post("/register", (req, res) => {
    const { name, email, college, course } = req.body;

    res.render("result", {
        name,
        email,
        college,
        course
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});