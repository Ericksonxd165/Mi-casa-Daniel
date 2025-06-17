document.addEventListener("DOMContentLoaded", function () {
    const alert = document.getElementById("alert");
  
    // Check if there is already a language stored in localStorage
    const languageSaved = localStorage.getItem("language");
    if (languageSaved) {
      // If a language is already selected, redirect directly to the landing page
      window.location.href = "/";
    } else {
      // Show modal if no language is saved
      alert.style.display = "flex";
    }
  });
  
  function selectLanguage(language) {
   // Save the selected language in localStorage
    localStorage.setItem("language", language);
  
    // Automatically redirect to landing page without displaying alerts
    window.location.href = "/";
  }
  

  // In the index.html file
document.querySelector("#opcion").addEventListener("click", function() {
  // Stores in localStorage that the user passed through index
  localStorage.setItem("visitedIndex", "true");
  
  // Redirects to landing page
  window.location.href = "/";
});
