// ===============================
// ELEMENT REFERENCES
// ===============================

const form = document.getElementById("profileForm");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const course = document.getElementById("course");
const skills = document.getElementById("skills");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

// Preview elements
const previewName = document.getElementById("previewName");
const previewAvatar = document.getElementById("previewAvatar");
const previewEmail = document.getElementById("previewEmail");
const previewPhone = document.getElementById("previewPhone");
const previewCourse = document.getElementById("previewCourse");
const previewSkills = document.getElementById("previewSkills");
const successMessage = document.getElementById("successMessage");


// ===============================
// ERROR ELEMENTS
// ===============================

const errors = {
    fullName: document.getElementById("fullNameError"),
    email: document.getElementById("emailError"),
    phone: document.getElementById("phoneError"),
    course: document.getElementById("courseError"),
    skills: document.getElementById("skillsError"),
    password: document.getElementById("passwordError"),
    confirmPassword: document.getElementById("confirmPasswordError"),
    terms: document.getElementById("termsError")
};


// ===============================
// VALIDATION FUNCTIONS
// ===============================

// Full name validation
function validateFullName() {

    const value = fullName.value.trim();

    if (value === "") {
        errors.fullName.textContent = "Full name is required.";
        return false;
    }

    if (value.length < 3) {
        errors.fullName.textContent =
            "Name must contain at least 3 characters.";
        return false;
    }

    if (!/^[A-Za-z ]+$/.test(value)) {
        errors.fullName.textContent =
            "Name can contain only letters and spaces.";
        return false;
    }

    errors.fullName.textContent = "";
    return true;
}


// Email validation
function validateEmail() {

    const value = email.value.trim();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === "") {
        errors.email.textContent = "Email is required.";
        return false;
    }

    if (!emailPattern.test(value)) {
        errors.email.textContent =
            "Enter a valid email address.";
        return false;
    }

    errors.email.textContent = "";
    return true;
}


// Phone validation
function validatePhone() {

    const value = phone.value.trim();

    if (value === "") {
        errors.phone.textContent = "Phone number is required.";
        return false;
    }

    if (!/^[0-9]{10}$/.test(value)) {
        errors.phone.textContent =
            "Phone number must contain exactly 10 digits.";
        return false;
    }

    errors.phone.textContent = "";
    return true;
}


// Course validation
function validateCourse() {

    if (course.value === "") {
        errors.course.textContent =
            "Please select your course.";
        return false;
    }

    errors.course.textContent = "";
    return true;
}


// Skills validation
function validateSkills() {

    const value = skills.value.trim();

    if (value === "") {
        errors.skills.textContent =
            "Please enter your primary skill.";
        return false;
    }

    if (value.length < 2) {
        errors.skills.textContent =
            "Skill must contain at least 2 characters.";
        return false;
    }

    errors.skills.textContent = "";
    return true;
}


// Password validation
function validatePassword() {

    const value = password.value;

    const hasLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);

    updatePasswordRule(
        "lengthRule",
        hasLength
    );

    updatePasswordRule(
        "uppercaseRule",
        hasUppercase
    );

    updatePasswordRule(
        "numberRule",
        hasNumber
    );

    updatePasswordRule(
        "specialRule",
        hasSpecial
    );

    if (!hasLength || !hasUppercase || !hasNumber || !hasSpecial) {

        errors.password.textContent =
            "Password does not meet all security requirements.";

        return false;
    }

    errors.password.textContent = "";

    return true;
}


// Password rule UI
function updatePasswordRule(id, valid) {

    const rule = document.getElementById(id);
    const icon = rule.querySelector("span");

    if (valid) {

        icon.textContent = "✓";
        rule.classList.add("valid");

    } else {

        icon.textContent = "○";
        rule.classList.remove("valid");
    }
}


// Confirm password validation
function validateConfirmPassword() {

    if (confirmPassword.value === "") {

        errors.confirmPassword.textContent =
            "Please confirm your password.";

        return false;
    }

    if (confirmPassword.value !== password.value) {

        errors.confirmPassword.textContent =
            "Passwords do not match.";

        return false;
    }

    errors.confirmPassword.textContent = "";

    return true;
}


// Terms validation
function validateTerms() {

    if (!terms.checked) {

        errors.terms.textContent =
            "Please confirm the information provided.";

        return false;
    }

    errors.terms.textContent = "";

    return true;
}


// ===============================
// DYNAMIC DOM PREVIEW
// ===============================

function updatePreview() {

    const nameValue = fullName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const courseValue = course.value;
    const skillsValue = skills.value.trim();

    // Name
    previewName.textContent =
        nameValue || "Your Name";

    // Avatar
    if (nameValue) {

        previewAvatar.textContent =
            nameValue.charAt(0).toUpperCase();

    } else {

        previewAvatar.textContent = "S";
    }

    // Email
    previewEmail.textContent =
        emailValue || "Not added yet";

    // Phone
    previewPhone.textContent =
        phoneValue || "Not added yet";

    // Course
    previewCourse.textContent =
        courseValue || "Not selected";

    // Skills
    previewSkills.textContent =
        skillsValue || "Not added yet";
}


// ===============================
// REAL-TIME VALIDATION
// ===============================

fullName.addEventListener("input", () => {

    validateFullName();
    updatePreview();

});


email.addEventListener("input", () => {

    validateEmail();
    updatePreview();

});


phone.addEventListener("input", () => {

    // Allow only numbers
    phone.value = phone.value.replace(/\D/g, "");

    validatePhone();
    updatePreview();

});


course.addEventListener("change", () => {

    validateCourse();
    updatePreview();

});


skills.addEventListener("input", () => {

    validateSkills();
    updatePreview();

});


password.addEventListener("input", () => {

    validatePassword();
    validateConfirmPassword();

});


confirmPassword.addEventListener("input", () => {

    validateConfirmPassword();

});


terms.addEventListener("change", () => {

    validateTerms();

});


// ===============================
// FORM SUBMISSION
// ===============================

form.addEventListener("submit", (event) => {

    event.preventDefault();

    const isValid =
        validateFullName() &&
        validateEmail() &&
        validatePhone() &&
        validateCourse() &&
        validateSkills() &&
        validatePassword() &&
        validateConfirmPassword() &&
        validateTerms();

    if (!isValid) {

        successMessage.classList.remove("show");

        return;
    }


    // Dynamic DOM update
    successMessage.textContent =
        `Welcome ${fullName.value.trim()}! Your student profile has been created successfully.`;

    successMessage.classList.add("show");


    // Scroll to preview
    document.getElementById("preview").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});


// ===============================
// CLIENT-SIDE ROUTING
// ===============================

function handleRoute() {

    const hash = window.location.hash;

    if (hash) {

        const target = document.querySelector(hash);

        if (target) {

            setTimeout(() => {

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }, 100);

        }
    }
}


// Handle initial route
handleRoute();


// Handle browser URL changes
window.addEventListener("hashchange", handleRoute);