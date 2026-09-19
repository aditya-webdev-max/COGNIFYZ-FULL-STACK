const express = require("express");

const app = express();
const PORT = 3002;

// Set EJS as the template engine
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Home page
app.get("/", (req, res) => {
    res.render("index");
});

// Start server
app.listen(PORT, () => {
    console.log(`Task 3 server running at http://localhost:${PORT}`);
});