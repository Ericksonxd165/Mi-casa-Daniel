// Product detail page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Image carousel functionality
  setupImageCarousel()

  // Modal functionality
  setupProviderModal()

  // Add to cart functionality
  setupAddToCartButton()
})

// Set up image carousel
function setupImageCarousel() {
  const mainImage = document.getElementById("main-product-image")
  const leftArrow = document.getElementById("left-arrow")
  const rightArrow = document.getElementById("right-arrow")
  const thumbnails = document.querySelectorAll(".hover-container img")

  let currentIndex = 0
  const maxIndex = thumbnails.length - 1

  // Function to change main image
  function changeMainImage(imageUrl) {
    mainImage.src = imageUrl

    // Update current index
    thumbnails.forEach((thumb, index) => {
      if (thumb.src === imageUrl) {
        currentIndex = index
      }
    })
  }

  // Left arrow click
  if (leftArrow) {
    leftArrow.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--
      } else {
        currentIndex = maxIndex
      }
      changeMainImage(thumbnails[currentIndex].src)
    })
  }

  // Right arrow click
  if (rightArrow) {
    rightArrow.addEventListener("click", () => {
      if (currentIndex < maxIndex) {
        currentIndex++
      } else {
        currentIndex = 0
      }
      changeMainImage(thumbnails[currentIndex].src)
    })
  }
}

// Set up provider modal
function setupProviderModal() {
  const modal = document.getElementById("provider-modal")
  const btn = document.getElementById("provider-select")
  const closeBtn = document.querySelector(".close")
  const addToCartBtn = document.querySelector(".add-cart-btn")

  if (!modal || !btn || !addToCartBtn) return

  // Disable "Add to Cart" button initially
  addToCartBtn.disabled = true
  addToCartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> Provider needed`

  // Open modal
  btn.addEventListener("click", () => {
    modal.style.display = "block"
  })

  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none"
    })
  }

  // Click outside to close
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  })

  // Provider selection
  const selectProviderBtns = document.querySelectorAll(".select-provider-btn")
  selectProviderBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const price = Number.parseFloat(this.getAttribute("data-price"))
      const supplierName = this.getAttribute("data-supplier")

      // Update UI to show selected provider
      addToCartBtn.innerHTML = `Add to cart - $${price.toFixed(2)} - ${supplierName}`
      addToCartBtn.setAttribute("data-price", price)
      addToCartBtn.setAttribute("data-supplier", supplierName)

      // Enable "Add to Cart" button
      addToCartBtn.disabled = false

      // Close modal
      modal.style.display = "none"
    })
  })
}

// Set up add to cart button
function setupAddToCartButton() {
  const addToCartBtn = document.querySelector(".add-cart-btn")
  if (!addToCartBtn) return

  addToCartBtn.addEventListener("click", function () {
    // Ensure a provider is selected
    if (addToCartBtn.disabled) return

    // Get product data from the page
    const productId = Number.parseInt(getProductIdFromUrl())
    const productName = document.querySelector(".product-name")?.textContent || "Product"
    const productDescription = document.querySelector(".product-description")?.textContent || "Description"
    // Try to get the main image first (from data attribute if available)
    let productImage = ""
    const mainImageElement = document.querySelector("[data-main-image='true']")
    if (mainImageElement && mainImageElement.src) {
      productImage = mainImageElement.src
    } else {
      // Fall back to the displayed image
      productImage = document.getElementById("main-product-image")?.src || ""
    }

    // Get selected supplier data
    const selectedPrice = Number.parseFloat(this.getAttribute("data-price"))
    const selectedSupplierName = this.getAttribute("data-supplier")
    const selectedSupplierId = Number.parseInt(
      document
        .querySelector(".select-provider-btn[data-supplier='" + selectedSupplierName + "']")
        ?.getAttribute("data-supplier-id") || "0",
    )

    // If no supplier is selected, show modal to select one
    if (!selectedPrice || !selectedSupplierName) {
      showSelectProviderModal()
      return
    }

    // Create supplier object
    const selectedSupplier = {
      id: selectedSupplierId,
      name: selectedSupplierName,
      price: selectedPrice,
    }

    // Create product object
    const product = {
      id: productId,
      name: productName,
      description: productDescription,
      image: productImage,
    }

    // Add to cart
    addToCart(product, 1, selectedSupplier)

    // Show confirmation modal
    showAddedToCartModal()
  })
}

// Function to get product ID from URL
function getProductIdFromUrl() {
  // Assuming URL pattern is /product/{id}/{slug}/
  const pathParts = window.location.pathname.split("/")
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i] === "product" && i + 1 < pathParts.length) {
      return pathParts[i + 1]
    }
  }

  // Fallback: try to find a data-product-id attribute on the page
  const productIdElement = document.querySelector("[data-product-id]")
  if (productIdElement) {
    return productIdElement.getAttribute("data-product-id")
  }

  return "0" // Default if no ID found
}

// Add to cart function
function addToCart(product, quantity, selectedSupplier) {
  // Get existing cart or initialize empty array
  const cart = JSON.parse(localStorage.getItem("shoppingCart")) || []

  // Check if product with same supplier already exists
  const existingItemIndex = cart.findIndex((item) => item.id === product.id && item.supplier.id === selectedSupplier.id)

  if (existingItemIndex !== -1) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += quantity
  } else {
    // Add new item
    cart.push({
      id: product.id,
      title: product.name,
      description: product.description,
      price: selectedSupplier.price,
      image: product.image,
      quantity: quantity,
      supplier: {
        id: selectedSupplier.id,
        name: selectedSupplier.name,
      },
    })
  }

  // Save updated cart
  localStorage.setItem("shoppingCart", JSON.stringify(cart))
}

// Function to show modal when product is added to cart
function showAddedToCartModal() {
  // Create modal element
  const modal = document.createElement("div")
  modal.className = "cart-modal"
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `

  // Create modal content
  const modalContent = document.createElement("div")
  modalContent.className = "cart-modal-content"
  modalContent.style.cssText = `
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  `

  // Add success icon
  const icon = document.createElement("div")
  icon.innerHTML = '<i class="fas fa-check-circle" style="font-size: 48px; color: #4CAF50; margin-bottom: 20px;"></i>'

  // Add message
  const message = document.createElement("h3")
  message.textContent = "Product added to cart!"
  message.style.marginBottom = "20px"

  // Add buttons
  const buttonContainer = document.createElement("div")
  buttonContainer.style.display = "flex"
  buttonContainer.style.justifyContent = "space-between"
  buttonContainer.style.gap = "10px"

  const continueButton = document.createElement("button")
  continueButton.textContent = "Continue Shopping"
  continueButton.className = "btn secondary-btn"
  continueButton.style.cssText = `
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #f1f1f1;
  `

  const viewCartButton = document.createElement("button")
  viewCartButton.textContent = "View Cart"
  viewCartButton.className = "btn primary-btn"
  viewCartButton.style.cssText = `
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #ffd720;
    color: black;
    border: 2px solid black;
  `

  // Add event listeners to buttons
  continueButton.addEventListener("click", () => {
    document.body.removeChild(modal)
  })

  viewCartButton.addEventListener("click", () => {
    window.location.href = "/carrito"
  })

  // Assemble modal
  buttonContainer.appendChild(continueButton)
  buttonContainer.appendChild(viewCartButton)

  modalContent.appendChild(icon)
  modalContent.appendChild(message)
  modalContent.appendChild(buttonContainer)

  modal.appendChild(modalContent)

  // Add modal to page
  document.body.appendChild(modal)

  // Close modal when clicking outside
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      document.body.removeChild(modal)
    }
  })
}

// Function to show modal to select a provider
function showSelectProviderModal() {
  // Create modal element
  const modal = document.createElement("div")
  modal.className = "provider-select-modal"
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `

  // Create modal content
  const modalContent = document.createElement("div")
  modalContent.className = "provider-select-modal-content"
  modalContent.style.cssText = `
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  `

  // Add warning icon
  const icon = document.createElement("div")
  icon.innerHTML =
    '<i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #FFC107; margin-bottom: 20px;"></i>'

  // Add message
  const message = document.createElement("h3")
  message.textContent = "Please select a provider first"
  message.style.marginBottom = "20px"

  // Add button
  const button = document.createElement("button")
  button.textContent = "Select Provider"
  button.className = "btn primary-btn"
  button.style.cssText = `
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #ffd720;;
    color: black;
  `

  // Add event listener to button
  button.addEventListener("click", () => {
    document.body.removeChild(modal)
    // Open the provider selection modal
    const providerModal = document.getElementById("provider-modal")
    if (providerModal) {
      providerModal.style.display = "block"
    }
  })

  // Assemble modal
  modalContent.appendChild(icon)
  modalContent.appendChild(message)
  modalContent.appendChild(button)

  modal.appendChild(modalContent)

  // Add modal to page
  document.body.appendChild(modal)

  // Close modal when clicking outside
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      document.body.removeChild(modal)
    }
  })
}

// Keep all your existing code below this line
// This includes the image carousel, star rating, etc.
// I'm only adding the cart functionality above

const allHoverImages = document.querySelectorAll(".hover-container div img")
const imgContainer = document.querySelector(".img-container")
const leftArrow = document.getElementById("left-arrow")
const rightArrow = document.getElementById("right-arrow")
const providerSelect = document.getElementById("provider-select")
const modal_var = document.getElementById("provider-modal")
const closeModal = modal_var ? modal_var.querySelector(".close") : null
const modalCards = modal_var
  ? modal_var.querySelectorAll(".modal-scroll .card-green, .modal-scroll .card-blue, .modal-scroll .card-red")
  : []

let currentIndex = 0

// Open modal when clicking on "Select Provider"
if (providerSelect) {
  providerSelect.addEventListener("click", () => {
    if (modal_var) modal_var.style.display = "block"
  })
}

// Close modal when clicking on "X" or outside the modal
if (closeModal) {
  closeModal.addEventListener("click", () => {
    modal_var.style.display = "none"
  })
}

window.addEventListener("click", (event) => {
  if (modal_var && event.target === modal_var) {
    modal_var.style.display = "none"
  }
})

// Handle provider selection
modalCards.forEach((card) => {
  card.addEventListener("click", () => {
    alert(`You selected: ${card.querySelector(".tip").textContent.trim()}`)
    modal_var.style.display = "none"
  })
})

window.addEventListener("DOMContentLoaded", () => {
  if (allHoverImages.length > 0) {
    allHoverImages[0].parentElement.classList.add("active")
    const mainImg = imgContainer ? imgContainer.querySelector("img") : null
    if (mainImg) mainImg.src = allHoverImages[0].src
  }
})

// Handle hover over images
allHoverImages.forEach((image, index) => {
  image.addEventListener("mouseover", () => {
    const mainImg = imgContainer ? imgContainer.querySelector("img") : null
    if (mainImg) mainImg.src = image.src
    resetActiveImg()
    image.parentElement.classList.add("active")
    currentIndex = index // Update the current index
  })
})

// Handle left arrow click
if (leftArrow) {
  leftArrow.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + allHoverImages.length) % allHoverImages.length // Loop back to the last image
    updateActiveImage()
  })
}

// Handle right arrow click
if (rightArrow) {
  rightArrow.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % allHoverImages.length // Loop back to the first image
    updateActiveImage()
  })
}

// Update the active image based on the current index
function updateActiveImage() {
  resetActiveImg()
  const activeImage = allHoverImages[currentIndex]
  const mainImg = imgContainer ? imgContainer.querySelector("img") : null
  if (mainImg) mainImg.src = activeImage.src
  activeImage.parentElement.classList.add("active")
}

// Reset all images to remove the active class
function resetActiveImg() {
  allHoverImages.forEach((img) => {
    img.parentElement.classList.remove("active")
  })
}

// Star Rating System
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".star")
  let selectedRating = 0

  // Function to update stars appearance
  function updateStars(rating, isHover = false) {
    stars.forEach((star, index) => {
      const starValue = Number.parseInt(star.dataset.value)

      // If we're hovering or have selected this star or a higher one
      if (starValue <= rating) {
        star.innerHTML = '<i class="fas fa-star" style="color: #FFD700;"></i>' // Solid yellow star
      } else {
        star.innerHTML = '<i class="far fa-star"></i>' // Empty star
      }
    })
  }

  // Add event listeners to each star
  stars.forEach((star) => {
    const starValue = Number.parseInt(star.dataset.value)

    // Hover effects
    star.addEventListener("mouseenter", () => {
      updateStars(starValue, true)
    })

    // When mouse leaves the rating area, restore to selected rating
    if (star.parentElement) {
      star.parentElement.addEventListener("mouseleave", () => {
        updateStars(selectedRating)
      })
    }

    // Click to set rating
    star.addEventListener("click", () => {
      selectedRating = starValue
      updateStars(selectedRating)

      // You can add AJAX call here to save the rating to your backend
      console.log(`User rated: ${selectedRating} stars`)
    })
  })
})

// Image Carousel Logic
document.addEventListener("DOMContentLoaded", () => {
  const mainImage = document.getElementById("main-product-image")
  const leftArrow = document.getElementById("left-arrow")
  const rightArrow = document.getElementById("right-arrow")
  const thumbnails = document.querySelectorAll(".hover-container div img")

  let currentImageIndex = 0
  const imageUrls = Array.from(thumbnails).map((img) => img.src)

  // Function to change main image
  window.changeMainImage = (url) => {
    if (mainImage) mainImage.src = url
    // Update current index
    currentImageIndex = imageUrls.indexOf(url)

    // Update active thumbnail
    document.querySelectorAll(".hover-container div").forEach((div, index) => {
      if (index === currentImageIndex) {
        div.classList.add("active")
      } else {
        div.classList.remove("active")
      }
    })
  }

  // Set first thumbnail as active by default
  if (thumbnails.length > 0) {
    thumbnails[0].parentElement.classList.add("active")
  }

  // Navigate to previous image
  if (leftArrow) {
    leftArrow.addEventListener("click", () => {
      if (imageUrls.length === 0 || !mainImage) return

      currentImageIndex = (currentImageIndex - 1 + imageUrls.length) % imageUrls.length
      mainImage.src = imageUrls[currentImageIndex]

      // Update active thumbnail
      document.querySelectorAll(".hover-container div").forEach((div, index) => {
        if (index === currentImageIndex) {
          div.classList.add("active")
        } else {
          div.classList.remove("active")
        }
      })
    })
  }

  // Navigate to next image
  if (rightArrow) {
    rightArrow.addEventListener("click", () => {
      if (imageUrls.length === 0 || !mainImage) return

      currentImageIndex = (currentImageIndex + 1) % imageUrls.length
      mainImage.src = imageUrls[currentImageIndex]

      // Update active thumbnail
      document.querySelectorAll(".hover-container div").forEach((div, index) => {
        if (index === currentImageIndex) {
          div.classList.add("active")
        } else {
          div.classList.remove("active")
        }
      })
    })
  }

  // Modal functionality
  const providerSelectBtn = document.getElementById("provider-select")
  const providerModal = document.getElementById("provider-modal")
  const closeBtn = providerModal ? providerModal.querySelector(".close") : null

  if (providerSelectBtn && providerModal) {
    providerSelectBtn.addEventListener("click", () => {
      providerModal.style.display = "block"
    })
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (providerModal) providerModal.style.display = "none"
    })
  }

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (providerModal && event.target === providerModal) {
      providerModal.style.display = "none"
    }
  })

  // Add click event to provider selection buttons
  const selectProviderBtns = document.querySelectorAll(".select-provider-btn")
  selectProviderBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const price = this.getAttribute("data-price")
      const supplier = this.getAttribute("data-supplier")

      console.log(`Selected provider: ${supplier} with price: $${price}`)

      // Update the Add to Cart button text to show the selected provider
      const addToCartBtn = document.querySelector(".add-cart-btn")
      if (addToCartBtn) {
        addToCartBtn.innerHTML = `<span><i class="fas fa-shopping-cart"></i>Add to Cart - $${price} - ${supplier}</span>`
        addToCartBtn.setAttribute("data-price", price)
        addToCartBtn.setAttribute("data-supplier", supplier)
      }

      // Close the modal after selection
      if (providerModal) providerModal.style.display = "none"
    })
  })
})

// Añadir esta función para centrar las miniaturas
document.addEventListener("DOMContentLoaded", () => {
  // Función para ajustar el centrado de las miniaturas
  function adjustThumbnailsAlignment() {
    const container = document.querySelector(".hover-container")
    if (!container) return

    const thumbnails = container.querySelectorAll("div")
    const isMobile = window.innerWidth <= 576

    if (isMobile) {
      // Si hay menos de 5 miniaturas en móvil, centramos con CSS
      if (thumbnails.length < 5) {
        container.style.justifyContent = "center"

        // Calculamos el ancho total de las miniaturas + gaps
        const thumbnailWidth = 80 // Ancho de miniatura en móvil
        const gap = 12 // Espacio entre miniaturas
        const totalWidth = thumbnailWidth * thumbnails.length + gap * (thumbnails.length - 1)

        // Si el ancho total es menor que el contenedor, centramos
        if (totalWidth < container.clientWidth) {
          // Añadimos padding izquierdo y derecho para centrar
          const padding = (container.clientWidth - totalWidth) / 2
          container.style.paddingLeft = `${padding}px`
          container.style.paddingRight = `${padding}px`
        } else {
          // Si no caben todas, usamos el padding predeterminado
          container.style.paddingLeft = "2px"
          container.style.paddingRight = "2px"
        }
      } else {
        // Si hay 5 o más, dejamos el padding predeterminado
        container.style.justifyContent = "flex-start"
        container.style.paddingLeft = "2px"
        container.style.paddingRight = "2px"
      }
    } else {
      // En escritorio siempre centramos
      container.style.justifyContent = "center"
      container.style.paddingLeft = "0"
      container.style.paddingRight = "0"
    }
  }

  // Ejecutar al cargar la página
  adjustThumbnailsAlignment()

  // Ejecutar cuando cambie el tamaño de la ventana
  window.addEventListener("resize", adjustThumbnailsAlignment)
})
