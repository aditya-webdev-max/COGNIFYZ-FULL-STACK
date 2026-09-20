const studentForm = document.getElementById("studentForm");
const studentId = document.getElementById("studentId");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const skillInput = document.getElementById("skill");

const studentList = document.getElementById("studentList");
const studentCount = document.getElementById("studentCount");
const apiStatus = document.getElementById("apiStatus");

const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");

const message = document.getElementById("message");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const refreshBtn = document.getElementById("refreshBtn");


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(text, type = "success") {
    message.textContent = text;
    message.className = `message ${type}`;

    setTimeout(() => {
        message.textContent = "";
        message.className = "message";
    }, 3000);
}


// ==========================================
// LOAD ALL STUDENTS
// GET /api/students
// ==========================================

async function loadStudents() {
    loading.classList.remove("hidden");
    studentList.innerHTML = "";
    emptyState.classList.add("hidden");

    try {
        const response = await fetch("/api/students");

        if (!response.ok) {
            throw new Error("Unable to fetch students");
        }

        const result = await response.json();
        const students = result.data;

        studentCount.textContent = students.length;
        apiStatus.textContent = "Online";

        if (students.length === 0) {
            emptyState.classList.remove("hidden");
            return;
        }

        students.forEach((student) => {
            createStudentCard(student);
        });

    } catch (error) {
        console.error(error);

        apiStatus.textContent = "Offline";

        showMessage(
            error.message || "Unable to connect to the API.",
            "error"
        );

    } finally {
        loading.classList.add("hidden");
    }
}


// ==========================================
// CREATE STUDENT CARD
// ==========================================

function createStudentCard(student) {
    const card = document.createElement("article");

    card.className = "student-card";

    card.innerHTML = `
        <div class="student-avatar">
            ${getInitials(student.name)}
        </div>

        <div class="student-info">

            <h3>${escapeHTML(student.name)}</h3>

            <p class="student-email">
                ${escapeHTML(student.email)}
            </p>

            <div class="student-meta">

                <span>
                    ${escapeHTML(student.course)}
                </span>

                <span>
                    ${escapeHTML(student.skill)}
                </span>

            </div>

        </div>

        <div class="student-actions">

            <button
                class="action-btn edit-btn"
                onclick="editStudent('${student._id}')"
            >
                Edit
            </button>

            <button
                class="action-btn delete-btn"
                onclick="deleteStudent('${student._id}')"
            >
                Delete
            </button>

        </div>
    `;

    studentList.appendChild(card);
}


// ==========================================
// ADD / UPDATE STUDENT
// POST / PUT
// ==========================================

studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = studentId.value;

    const studentData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        course: courseInput.value,
        skill: skillInput.value.trim()
    };

    if (
        !studentData.name ||
        !studentData.email ||
        !studentData.course ||
        !studentData.skill
    ) {
        showMessage(
            "Please fill in all fields.",
            "error"
        );

        return;
    }

    const isEditing = Boolean(id);

    const url = isEditing
        ? `/api/students/${id}`
        : "/api/students";

    const method = isEditing
        ? "PUT"
        : "POST";

    submitBtn.disabled = true;

    submitBtn.textContent = isEditing
        ? "Updating..."
        : "Adding...";

    try {
        const response = await fetch(url, {
            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(studentData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Operation failed"
            );
        }

        showMessage(
            result.message,
            "success"
        );

        resetForm();

        await loadStudents();

    } catch (error) {
        console.error(error);

        showMessage(
            error.message,
            "error"
        );

    } finally {
        submitBtn.disabled = false;

        submitBtn.textContent = isEditing
            ? "Update Student"
            : "Add Student";
    }
});


// ==========================================
// EDIT STUDENT
// GET /api/students/:id
// ==========================================

async function editStudent(id) {
    try {
        const response = await fetch(
            `/api/students/${id}`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Student not found"
            );
        }

        const student = result.data;

        // MongoDB uses _id
        studentId.value = student._id;

        nameInput.value = student.name;
        emailInput.value = student.email;
        courseInput.value = student.course;
        skillInput.value = student.skill;

        formTitle.textContent = "Edit Student";

        submitBtn.textContent = "Update Student";

        cancelEditBtn.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {
        console.error(error);

        showMessage(
            error.message,
            "error"
        );
    }
}


// ==========================================
// DELETE STUDENT
// DELETE /api/students/:id
// ==========================================

async function deleteStudent(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `/api/students/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to delete student"
            );
        }

        showMessage(
            result.message,
            "success"
        );

        await loadStudents();

    } catch (error) {
        console.error(error);

        showMessage(
            error.message,
            "error"
        );
    }
}


// ==========================================
// CANCEL EDIT
// ==========================================

cancelEditBtn.addEventListener(
    "click",
    resetForm
);


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {
    studentForm.reset();

    studentId.value = "";

    formTitle.textContent = "Add Student";

    submitBtn.textContent = "Add Student";

    cancelEditBtn.classList.add("hidden");
}


// ==========================================
// REFRESH BUTTON
// ==========================================

refreshBtn.addEventListener(
    "click",
    loadStudents
);


// ==========================================
// CREATE INITIALS
// ==========================================

function getInitials(name) {
    return name
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();
}


// ==========================================
// BASIC HTML ESCAPING
// ==========================================

function escapeHTML(value) {
    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ==========================================
// LOAD CURRENT USER
// GET /api/auth/me
// ==========================================

async function loadCurrentUser() {
    try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
            window.location.href = "/login";
            return;
        }

        const result = await response.json();

        // Support both possible API response structures
        const user = result.user || result.data;

        if (user && user.name) {
            document.getElementById("userName").textContent =
                user.name;
        }

    } catch (error) {
        console.error(
            "Unable to load current user:",
            error
        );
    }
}


// ==========================================
// LOGOUT
// POST /api/auth/logout
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {
    try {
        logoutBtn.disabled = true;
        logoutBtn.textContent = "Logging out...";

        const response = await fetch(
            "/api/auth/logout",
            {
                method: "POST"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Logout failed"
            );
        }

        window.location.href = "/login";

    } catch (error) {
        console.error(error);

        showMessage(
            error.message || "Unable to logout",
            "error"
        );

        logoutBtn.disabled = false;
        logoutBtn.textContent = "Logout";
    }
});


// ==========================================
// INITIAL API REQUEST
// ==========================================

loadStudents();


// ==========================================
// INITIAL AUTHENTICATION CHECK
// ==========================================

loadCurrentUser();