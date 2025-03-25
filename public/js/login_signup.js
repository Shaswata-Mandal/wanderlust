const toggleButton = document.getElementById("toggle-button");
const floatingPanel = document.getElementById("floating-panel");
const panelText = document.getElementById("panel-text");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

let isLogin = true;
toggleButton.addEventListener("click", () => {
    isLogin = !isLogin;
    floatingPanel.style.transform = isLogin ? "translateX(0)" : "translateX(101%)";
    panelText.innerText = isLogin ? "New here?" : "Already have an account?";
    toggleButton.innerText = isLogin ? "Sign Up" : "Login";

    // Clear input fields
    loginForm.querySelectorAll("input").forEach(input => input.value = "");
    signupForm.querySelectorAll("input").forEach(input => input.value = "");
});



window.onload = function () {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("success")) {
        alert(urlParams.get("success")); // ✅ Show success alert
    }
    if (urlParams.has("error")) {
        alert(urlParams.get("error")); // ❌ Show error alert
    }
};