// Cart management with localStorage
class ShoppingCart {
  constructor() {
    this.cartItems = []
    this.loadFromLocalStorage()

    // DOM Elements
    this.cartItemsContainer = document.getElementById("cartItems")
    this.emptyCartElement = document.getElementById("emptyCart")
    this.orderSummaryElement = document.getElementById("orderSummary")
    this.totalItemsElement = document.getElementById("totalItems")
    this.totalPriceElement = document.getElementById("totalPrice")
    this.navigationLinksElement = document.querySelector(".navigation-links") // Nueva referencia

    // Initialize
    this.renderCartItems()
    this.setupEventListeners()
  }

  // Load cart from localStorage
  loadFromLocalStorage() {
    const savedCart = localStorage.getItem("shoppingCart")
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart)
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e)
        this.cartItems = []
      }
    }
  }

  // Save cart to localStorage
  saveToLocalStorage() {
    localStorage.setItem("shoppingCart", JSON.stringify(this.cartItems))
  }

  // Add item to cart
  addItem(product, quantity = 1, selectedSupplier) {
    // Check if product already exists in cart
    const existingItemIndex = this.cartItems.findIndex(
      (item) => item.id === product.id && item.supplier.id === selectedSupplier.id,
    )

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      this.cartItems[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      this.cartItems.push({
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

    this.saveToLocalStorage()
    this.renderCartItems()
  }

  // Remove item from cart
  removeItem(id, supplierId) {
    // Show confirmation modal
    this.showRemoveConfirmationModal(id, supplierId)
  }

  // Increment quantity
  incrementQuantity(id, supplierId) {
    this.cartItems = this.cartItems.map((item) => {
      if (item.id === id && item.supplier.id === supplierId) {
        return { ...item, quantity: item.quantity + 1 }
      }
      return item
    })
    this.saveToLocalStorage()
    this.renderCartItems()
  }

  // Decrement quantity
  decrementQuantity(id, supplierId) {
    const item = this.cartItems.find((item) => item.id === id && item.supplier.id === supplierId)

    if (item && item.quantity === 1) {
      this.removeItem(id, supplierId)
    } else {
      this.cartItems = this.cartItems.map((item) => {
        if (item.id === id && item.supplier.id === supplierId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 }
        }
        return item
      })
      this.saveToLocalStorage()
      this.renderCartItems()
    }
  }

  // Change supplier
  changeSupplier(id, oldSupplierId, newSupplierId, newSupplierName, newPrice) {
    const item = this.cartItems.find((item) => item.id === id && item.supplier.id === oldSupplierId)

    if (item) {
      item.supplier = {
        id: newSupplierId,
        name: newSupplierName,
      }
      item.price = newPrice
      this.saveToLocalStorage()
      this.renderCartItems()
    }
  }

  // Render cart items
  renderCartItems() {
    // Clear container
    if (!this.cartItemsContainer) return
    this.cartItemsContainer.innerHTML = ""

    // Check if cart is empty
    if (this.cartItems.length === 0) {
      if (this.emptyCartElement) this.emptyCartElement.style.display = "block"
      if (this.orderSummaryElement) this.orderSummaryElement.style.display = "none"
      if (this.navigationLinksElement) this.navigationLinksElement.style.display = "none" // Ocultar enlaces
      return
    }

    if (this.emptyCartElement) this.emptyCartElement.style.display = "none"
    if (this.orderSummaryElement) this.orderSummaryElement.style.display = "block"
    if (this.navigationLinksElement) this.navigationLinksElement.style.display = "flex" // Mostrar enlaces

    // Render each item
    this.cartItems.forEach((item) => {
      const cartItemElement = document.createElement("div")
      cartItemElement.className = "cart-item"

      cartItemElement.innerHTML = `
        <div class="cart-item-content">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.title}">
          </div>
          <div class="cart-item-details">
            <div class="cart-item-header">
              <div>
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-description"></p>
              </div>
              <button class="remove-btn" data-id="${item.id}" data-supplier-id="${item.supplier.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            
            <div class="cart-item-footer">
              <div class="cart-item-price">$${item.price.toFixed(2)}</div>
              
              <div class="cart-item-actions">
                <div class="quantity-control">
                  <button class="quantity-btn decrease-btn" data-id="${item.id}" data-supplier-id="${item.supplier.id}">
                    ${item.quantity === 1 ? '<i class="fas fa-trash"></i>' : '<i class="fas fa-minus"></i>'}
                  </button>
                  <span class="quantity-value">${item.quantity}</span>
                  <button class="quantity-btn increase-btn" data-id="${item.id}" data-supplier-id="${item.supplier.id}">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                
                <div class="supplier-info">
                  <span>Supplier: ${item.supplier.name}</span>
                  <button class="change-supplier-btn" data-id="${item.id}" data-supplier-id="${item.supplier.id}" style="
    background-color: #ffd720;
    color: black;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    cursor: pointer;
    margin-left: 8px;
    transition: background-color 0.3s;">
    Change
  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `

      this.cartItemsContainer.appendChild(cartItemElement)
    })

    // Update summary
    this.updateSummary()
  }

  // Update order summary
  updateSummary() {
    if (!this.totalItemsElement || !this.totalPriceElement) return

    const totalItems = this.cartItems.reduce((acc, item) => acc + item.quantity, 0)
    const totalPrice = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

    this.totalItemsElement.textContent = totalItems
    this.totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`
  }

  // Setup event listeners
  setupEventListeners() {
    // Event delegation for cart item actions
    if (this.cartItemsContainer) {
      this.cartItemsContainer.addEventListener("click", (e) => {
        const target = e.target.closest("button")
        if (!target) return

        const id = Number.parseInt(target.getAttribute("data-id"))
        const supplierId = Number.parseInt(target.getAttribute("data-supplier-id"))

        if (target.classList.contains("remove-btn")) {
          this.removeItem(id, supplierId)
        } else if (target.classList.contains("decrease-btn")) {
          this.decrementQuantity(id, supplierId)
        } else if (target.classList.contains("increase-btn")) {
          this.incrementQuantity(id, supplierId)
        } else if (target.classList.contains("change-supplier-btn")) {
          const productId = Number.parseInt(target.getAttribute("data-id"))
          const currentSupplierId = Number.parseInt(target.getAttribute("data-supplier-id"))
          this.openSupplierModal(productId, currentSupplierId)
        }
      })
    }

    // Generate order button
    const generateOrderBtn = document.querySelector(".generate-order-btn")
    if (generateOrderBtn) {
      generateOrderBtn.addEventListener("click", () => {
        this.showOrderConfirmationModal()
      })
    }
  }

  // Show order confirmation modal
  showOrderConfirmationModal() {
    if (this.cartItems.length === 0) {
      alert("Your cart is empty. Please add items before generating an order.")
      return
    }

    // Create modal
    const modal = document.createElement("div")
    modal.className = "order-confirmation-modal"
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
    modalContent.className = "modal-content"
    modalContent.style.cssText = `
      background-color: white;
      padding: 24px;
      border-radius: 10px;
      max-width: 500px;
      width: 90%;
      text-align: center;
    `

    // Add icon
    const icon = document.createElement("div")
    icon.innerHTML =
      '<i class="fas fa-shopping-cart" style="font-size: 48px; color: #081e5b; margin-bottom: 20px;"></i>'

    // Add message
    const message = document.createElement("h3")
    message.textContent = "Confirm Your Order"
    message.style.marginBottom = "16px"
    message.style.color = "#333"

    const subMessage = document.createElement("p")
    subMessage.textContent = "Are you sure you want to generate this order? This will proceed to checkout."
    subMessage.style.marginBottom = "16px"
    subMessage.style.color = "#666"

    // Add order summary
    const totalItems = this.cartItems.reduce((acc, item) => acc + item.quantity, 0)
    const totalPrice = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

    const orderSummary = document.createElement("div")
    orderSummary.style.cssText = `
      background-color: #f9f9f9;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
      text-align: left;
    `

    orderSummary.innerHTML = `
      <p><strong>Total Items:</strong> ${totalItems}</p>
      <p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>
    `

    // Add buttons
    const buttonContainer = document.createElement("div")
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 24px;
    `

    const cancelButton = document.createElement("button")
    cancelButton.textContent = "Cancel"
    cancelButton.style.cssText = `
      padding: 10px 20px;
      border: 1px solid #ddd;
      background-color: #f5f5f5;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
    `

    const confirmButton = document.createElement("button")
    confirmButton.textContent = "Confirm Order"
    confirmButton.style.cssText = `
      padding: 10px 20px;
      border: none;
      background-color: #081e5b;
      color: white;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
    `

    // Add event listeners
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    confirmButton.addEventListener("click", () => {
      document.body.removeChild(modal)
      this.generateOrder()
    })

    // Close when clicking outside
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        document.body.removeChild(modal)
      }
    })

    // Assemble modal
    buttonContainer.appendChild(cancelButton)
    buttonContainer.appendChild(confirmButton)

    modalContent.appendChild(icon)
    modalContent.appendChild(message)
    modalContent.appendChild(subMessage)
    modalContent.appendChild(orderSummary)
    modalContent.appendChild(buttonContainer)

    modal.appendChild(modalContent)

    // Add to page
    document.body.appendChild(modal)
  }

  // Open supplier selection modal
  async openSupplierModal(productId, currentSupplierId) {
    try {
      // Create modal
      const modal = document.createElement("div")
      modal.className = "modal"
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
      modalContent.className = "modal-content"
      modalContent.style.cssText = `
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
      `

      // Add close button
      const closeBtn = document.createElement("span")
      closeBtn.innerHTML = "&times;"
      closeBtn.style.cssText = `
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
      `

      // Add title
      const title = document.createElement("h3")
      title.textContent = "Select a Supplier"
      title.style.marginBottom = "15px"

      // Add supplier options
      const supplierList = document.createElement("div")
      supplierList.style.cssText = `
        margin-top: 20px;
        max-height: 300px;
        overflow-y: auto;
      `

      // Dummy suppliers - in a real app, fetch these from the server
      const suppliers = [
        { id: 1, name: "Provider 1", price: 5.99 },
        { id: 2, name: "Provider 2", price: 4.99 },
        { id: 3, name: "Provider 3", price: 6.99 },
      ]

      suppliers.forEach((supplier) => {
        const supplierOption = document.createElement("div")
        supplierOption.style.cssText = `
          padding: 10px;
          border: 1px solid #ddd;
          margin-bottom: 10px;
          border-radius: 5px;
          cursor: pointer;
          ${supplier.id === currentSupplierId ? "background-color: #f0f0f0;" : ""}
        `

        supplierOption.innerHTML = `
          <h4>${supplier.name}</h4>
          <p>Price: $${supplier.price.toFixed(2)}</p>
          <button class="select-supplier-btn" 
                  data-supplier-id="${supplier.id}" 
                  data-supplier-name="${supplier.name}" 
                  data-price="${supplier.price}"
                  style="padding: 5px 10px; background-color: #ffd720; color: black; border: none; border-radius: 3px; cursor: pointer;">
                  ${supplier.id === currentSupplierId ? "Current Supplier" : "Select"}
          </button>
        `

        supplierList.appendChild(supplierOption)
      })

      // Assemble modal
      modalContent.appendChild(closeBtn)
      modalContent.appendChild(title)
      modalContent.appendChild(supplierList)
      modal.appendChild(modalContent)

      // Add modal to page
      document.body.appendChild(modal)

      // Add event listeners
      closeBtn.addEventListener("click", () => {
        document.body.removeChild(modal)
      })

      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          document.body.removeChild(modal)
        }
      })

      // Add event listeners to supplier buttons
      const supplierBtns = modal.querySelectorAll(".select-supplier-btn")
      supplierBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const newSupplierId = Number.parseInt(btn.getAttribute("data-supplier-id"))
          const newSupplierName = btn.getAttribute("data-supplier-name")
          const newPrice = Number.parseFloat(btn.getAttribute("data-price"))

          this.changeSupplier(productId, currentSupplierId, newSupplierId, newSupplierName, newPrice)

          document.body.removeChild(modal)
        })
      })
    } catch (error) {
      console.error("Error opening supplier modal:", error)
      alert("Failed to load supplier options. Please try again.")
    }
  }

  // Generate order
  generateOrder() {
    if (this.cartItems.length === 0) {
      alert("Your cart is empty. Please add items before generating an order.")
      return
    }

    // Check if user profile data is complete
    const requiredFields = ["fullName", "email", "phone", "address", "city", "province", "postalCode", "country"]

    const missingFields = []

    requiredFields.forEach((field) => {
      if (!localStorage.getItem(field)) {
        missingFields.push(field)
      }
    })

    if (missingFields.length > 0) {
      // Show modal to inform user about missing profile data
      this.showProfileDataModal(missingFields)
      return
    }

    // Create an array to store order details
    const orderDetails = this.cartItems.map((item) => ({
      id: item.id,
      title: item.title,
      supplier: item.supplier,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      invoiceId: this.generateInvoiceId(),
    }))

    // Save order data to localStorage
    localStorage.setItem("orderData", JSON.stringify(orderDetails))

    // Redirect to the checkout page
    window.location.href = "/checkout/"

    // Clear cart after successful order
    this.cartItems = []
    this.saveToLocalStorage()
    this.renderCartItems()
  }

  // Generate a unique invoice ID
  generateInvoiceId() {
    return "INV-" + Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  // Show modal for missing profile data
  showProfileDataModal(missingFields) {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "profile-data-modal"
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
    modalContent.className = "modal-content"
    modalContent.style.cssText = `
      background-color: white;
      padding: 24px;
      border-radius: 10px;
      max-width: 500px;
      width: 90%;
      text-align: center;
    `

    // Add warning icon
    const icon = document.createElement("div")
    icon.innerHTML =
      '<i class="fas fa-exclamation-circle" style="font-size: 48px; color: #f39c12; margin-bottom: 20px;"></i>'

    // Add message
    const message = document.createElement("h3")
    message.textContent = "Complete Your Profile"
    message.style.marginBottom = "16px"
    message.style.color = "#333"

    const subMessage = document.createElement("p")
    subMessage.innerHTML =
      "Please complete your profile information before proceeding with your order. <br>The following information is missing:"
    subMessage.style.marginBottom = "16px"
    subMessage.style.color = "#666"

    // Add missing fields list
    const fieldsList = document.createElement("ul")
    fieldsList.style.cssText = `
      text-align: left;
      margin: 16px auto;
      max-width: 80%;
      color: #666;
    `

    const fieldNames = {
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      address: "Address",
      city: "City",
      province: "Province",
      postalCode: "Postal Code",
      country: "Country",
    }

    missingFields.forEach((field) => {
      const listItem = document.createElement("li")
      listItem.textContent = fieldNames[field] || field
      listItem.style.marginBottom = "8px"
      fieldsList.appendChild(listItem)
    })

    // Add buttons
    const buttonContainer = document.createElement("div")
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 24px;
    `

    const cancelButton = document.createElement("button")
    cancelButton.textContent = "Cancel"
    cancelButton.style.cssText = `
      padding: 10px 20px;
      border: 1px solid #ddd;
      background-color: #f5f5f5;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
    `

    const profileButton = document.createElement("button")
    profileButton.textContent = "Go to Profile"
    profileButton.style.cssText = `
      padding: 10px 20px;
      border: none;
      background-color: #081e5b;
      color: white;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
    `

    // Add event listeners
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    profileButton.addEventListener("click", () => {
      // Save current cart data for later
      localStorage.setItem("pendingOrder", JSON.stringify(this.cartItems))

      // Redirect to profile page
      window.location.href = "/profile/"
    })

    // Close when clicking outside
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        document.body.removeChild(modal)
      }
    })

    // Assemble modal
    buttonContainer.appendChild(cancelButton)
    buttonContainer.appendChild(profileButton)

    modalContent.appendChild(icon)
    modalContent.appendChild(message)
    modalContent.appendChild(subMessage)
    modalContent.appendChild(fieldsList)
    modalContent.appendChild(buttonContainer)

    modal.appendChild(modalContent)

    // Add to page
    document.body.appendChild(modal)
  }

  // Show confirmation modal before removing item
  showRemoveConfirmationModal(id, supplierId) {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "remove-confirmation-modal"
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
    modalContent.className = "modal-content"
    modalContent.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 400px;
    width: 90%;
    text-align: center;
  `

    // Add warning icon
    const icon = document.createElement("div")
    icon.innerHTML =
      '<i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #f44336; margin-bottom: 20px;"></i>'

    // Add message
    const message = document.createElement("h3")
    message.textContent = "Remove Item from Cart?"
    message.style.marginBottom = "10px"

    const subMessage = document.createElement("p")
    subMessage.textContent = "Are you sure you want to remove this item from your cart?"
    subMessage.style.marginBottom = "20px"
    subMessage.style.color = "#666"

    // Add buttons
    const buttonContainer = document.createElement("div")
    buttonContainer.style.cssText = `
    display: flex;
    justify-content: space-between;
    gap: 10px;
  `

    const cancelButton = document.createElement("button")
    cancelButton.textContent = "Cancel"
    cancelButton.style.cssText = `
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    background-color: #f5f5f5;
    border-radius: 5px;
    cursor: pointer;
  `

    const confirmButton = document.createElement("button")
    confirmButton.textContent = "Remove"
    confirmButton.style.cssText = `
    flex: 1;
    padding: 10px;
    border: none;
    background-color: #f44336;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  `

    // Add event listeners
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    confirmButton.addEventListener("click", () => {
      // Actually remove the item
      this.cartItems = this.cartItems.filter((item) => !(item.id === id && item.supplier.id === supplierId))
      this.saveToLocalStorage()
      this.renderCartItems()

      // Close modal
      document.body.removeChild(modal)
    })

    // Close when clicking outside
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        document.body.removeChild(modal)
      }
    })

    // Assemble modal
    buttonContainer.appendChild(cancelButton)
    buttonContainer.appendChild(confirmButton)

    modalContent.appendChild(icon)
    modalContent.appendChild(message)
    modalContent.appendChild(subMessage)
    modalContent.appendChild(buttonContainer)

    modal.appendChild(modalContent)

    // Add to page
    document.body.appendChild(modal)
  }
}

// Initialize cart when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const cart = new ShoppingCart()
})
