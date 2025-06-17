// In landing.html
document.addEventListener("DOMContentLoaded", function () {
    // Check if a language has already been selected
    const languageSaved = localStorage.getItem("language");

    if (!languageSaved) {
        // If there is no language selected, redirect to index.html
        window.location.href = "/index/";
    }
    // Otherwise, it does nothing and the page loads correctly.
});
