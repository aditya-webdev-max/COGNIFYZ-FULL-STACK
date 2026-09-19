const express = require("express");

const app = express();
const PORT = 3003;

// EJS template engine
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
    res.render("index");
});

// Start server
app.listen(PORT, () => {
    console.log(`Task 4 server running at http://localhost:${PORT}`);
});