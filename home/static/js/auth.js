document.addEventListener("DOMContentLoaded", () => {
    // Check if user has required authentication data
    const phone = localStorage.getItem("phone")
    const country = localStorage.getItem("country")
  
    if (!phone || !country) {
      // Redirect to login page if authentication data is missing
      window.location.href = "/login"
    }
  })
  