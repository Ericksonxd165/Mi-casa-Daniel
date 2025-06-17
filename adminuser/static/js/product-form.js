document.addEventListener("DOMContentLoaded", () => {
    // Variables
    const imageInput = document.getElementById("image-input")
    const imageContainer = document.getElementById("image-container")
    const imageUpload = document.getElementById("image-upload")
    const imageCounter = document.getElementById("image-count")
    const imagePreviewTemplate = document.getElementById("image-preview-template")
  
    const addProviderBtn = document.getElementById("add-provider")
    const providersContainer = document.getElementById("providers-container")
    const providerTemplate = document.getElementById("provider-template")
  
    const MAX_IMAGES = 5
    const MAX_PROVIDERS = 5
  
    // Initialize counters
    let imageCount = document.querySelectorAll(".image-preview").length
    let providerCount = document.querySelectorAll(".provider-card").length
  
    // Update image counter
    updateImageCounter()
  
    // Event Listeners
    imageInput.addEventListener("change", handleImageUpload)
    addProviderBtn.addEventListener("click", addProvider)
  
    // Delegate event listeners for dynamic elements
    document.addEventListener("click", (e) => {
      // Remove image
      if (e.target.closest(".remove-image")) {
        const removeBtn = e.target.closest(".remove-image")
        const imagePreview = removeBtn.closest(".image-preview")
        const index = Array.from(imageContainer.children).indexOf(imagePreview)
  
        // Mark the corresponding Django form as deleted
        const deleteCheckbox = document.querySelector(`#id_images-${index}-DELETE`)
        if (deleteCheckbox) {
          deleteCheckbox.checked = true
        }
  
        imagePreview.remove()
        imageCount--
        updateImageCounter()
  
        // Show upload button if below max
        if (imageCount < MAX_IMAGES && imageUpload.style.display === "none") {
          imageUpload.style.display = "flex"
        }
      }
  
      // Remove provider
      if (e.target.closest(".remove-provider")) {
        const removeBtn = e.target.closest(".remove-provider")
        const providerCard = removeBtn.closest(".provider-card")
        const index = providerCard.dataset.index
  
        // Mark the corresponding Django form as deleted
        const deleteCheckbox = document.querySelector(`#id_providers-${index}-DELETE`)
        if (deleteCheckbox) {
          deleteCheckbox.checked = true
        }
  
        providerCard.style.display = "none"
        providerCount--
  
        // Enable add button if below max
        if (providerCount < MAX_PROVIDERS) {
          addProviderBtn.disabled = false
        }
      }
    })
  
    // Functions
    function handleImageUpload(e) {
      if (imageCount >= MAX_IMAGES) return
  
      const file = e.target.files[0]
      if (!file) return
  
      // Create image preview
      const clone = document.importNode(imagePreviewTemplate.content, true)
      const img = clone.querySelector("img")
      img.src = URL.createObjectURL(file)
  
      // Add to container before the upload button
      imageContainer.insertBefore(clone, imageUpload)
  
      // Update Django form
      const formIndex = imageCount
      const fileInput = document.querySelector(`#id_images-${formIndex}-image`)
  
      // Create a new DataTransfer object and add the file
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
  
      // Set the files property of the file input
      if (fileInput) {
        fileInput.files = dataTransfer.files
      }
  
      // Increment counter and update UI
      imageCount++
      updateImageCounter()
  
      // Hide upload button if max reached
      if (imageCount >= MAX_IMAGES) {
        imageUpload.style.display = "none"
      }
  
      // Reset input for next upload
      e.target.value = ""
    }
  
    function updateImageCounter() {
      imageCounter.textContent = imageCount
    }
  
    function addProvider() {
      if (providerCount >= MAX_PROVIDERS) return
  
      // Get the template content
      let template = providerTemplate.innerHTML
  
      // Update the form prefix and counter
      const formIndex = document.querySelectorAll(".provider-card").length
      template = template.replace(/__PREFIX__/g, formIndex)
      template = template.replace(/__COUNTER__/g, formIndex + 1)
  
      // Create a temporary element to hold the template
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = template
  
      // Append the new provider card
      providersContainer.appendChild(tempDiv.firstElementChild)
  
      // Update the management form
      const totalForms = document.querySelector("#id_providers-TOTAL_FORMS")
      if (totalForms) {
        totalForms.value = formIndex + 1
      }
  
      // Increment counter
      providerCount++
  
      // Disable add button if max reached
      if (providerCount >= MAX_PROVIDERS) {
        addProviderBtn.disabled = true
      }
    }
  })
  
  