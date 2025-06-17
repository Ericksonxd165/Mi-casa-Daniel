
// Datos de ejemplo para el carrito

let cartItems = [
    {
      id: 1,
      title: "Product",
      description: "Product description",
      price: 499.49,
      image: "../assets/img/template.jpeg",
      quantity: 2,
      provider: "provider1",
    },
    {
      id: 2,
      title: "Product",
      description: "Product description",
      price: 399.99,
      image: "../assets/img/template.jpeg",
      quantity: 1,
      provider: "provider1",
    },
    {
      id: 3,
      title: "Product",
      description: "Product description",
      price: 449.99,
      image: "./statics/images/template.jpeg'",
      quantity: 3,
      provider: "provider1",
    },
  ]
  
  // Elementos del DOM
  const cartItemsContainer = document.getElementById("cartItems")
  const emptyCartElement = document.getElementById("emptyCart")
  const orderSummaryElement = document.getElementById("orderSummary")
  const totalItemsElement = document.getElementById("totalItems")
  const totalPriceElement = document.getElementById("totalPrice")
  
  // Función para renderizar los items del carrito
  function renderCartItems() {
    // Limpiar el contenedor
    cartItemsContainer.innerHTML = ""
  
    // Verificar si el carrito está vacío
    if (cartItems.length === 0) {
      emptyCartElement.style.display = "block"
      orderSummaryElement.style.display = "none"
      return
    }
  
    emptyCartElement.style.display = "none"
    orderSummaryElement.style.display = "block"
  
    // Renderizar cada item
    cartItems.forEach((item) => {
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
                <p class="cart-item-description">${item.description}</p>
              </div>
              <button class="remove-btn" data-id="${item.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            
            <div class="cart-item-footer">
              <div class="cart-item-price">$${item.price.toFixed(2)}</div>
              
              <div class="cart-item-actions">
                <div class="quantity-control">
                  <button class="quantity-btn decrease-btn" data-id="${item.id}">
                    ${item.quantity === 1 ? '<i class="fas fa-trash"></i>' : '<i class="fas fa-minus"></i>'}
                  </button>
                  <span class="quantity-value">${item.quantity}</span>
                  <button class="quantity-btn increase-btn" data-id="${item.id}">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                
                <select class="provider-select" data-id="${item.id}">
                  <option value="provider1" ${item.provider === "provider1" ? "selected" : ""}>Provider 1</option>
                  <option value="provider2" ${item.provider === "provider2" ? "selected" : ""}>Providerr 2</option>
                  <option value="provider3" ${item.provider === "provider3" ? "selected" : ""}>Providerr 3</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      `
  
      cartItemsContainer.appendChild(cartItemElement)
    })
  
    // Actualizar el resumen
    updateSummary()
  
    // Agregar event listeners
    addEventListeners()
  }
  
  // Función para actualizar el resumen
  function updateSummary() {
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  
    totalItemsElement.textContent = totalItems
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`
  }
  
  // Función para agregar event listeners
  function addEventListeners() {
    // Botones de eliminar
    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const id = Number.parseInt(this.getAttribute("data-id"))
        removeItem(id)
      })
    })
  
    // Botones de disminuir cantidad
    document.querySelectorAll(".decrease-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const id = Number.parseInt(this.getAttribute("data-id"))
        const item = cartItems.find((item) => item.id === id)
  
        if (item.quantity === 1) {
          removeItem(id)
        } else {
          decrementQuantity(id)
        }
      })
    })
  
    // Botones de aumentar cantidad
    document.querySelectorAll(".increase-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const id = Number.parseInt(this.getAttribute("data-id"))
        incrementQuantity(id)
      })
    })
  
    // Selectores de proveedor
    document.querySelectorAll(".provider-select").forEach((select) => {
      select.addEventListener("change", function () {
        const id = Number.parseInt(this.getAttribute("data-id"))
        const provider = this.value
        changeProvider(id, provider)
      })
    })
  }
  
  // Función para incrementar la cantidad
  function incrementQuantity(id) {
    cartItems = cartItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    renderCartItems()
  }
  
  // Función para decrementar la cantidad
  function decrementQuantity(id) {
    cartItems = cartItems.map((item) =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item,
    )
    renderCartItems()
  }
  
  // Función para eliminar un item
  function removeItem(id) {
    cartItems = cartItems.filter((item) => item.id !== id)
    renderCartItems()
  }
  
  // Función para cambiar el proveedor
  function changeProvider(id, provider) {
    cartItems = cartItems.map((item) => (item.id === id ? { ...item, provider } : item))
    // No es necesario volver a renderizar todo para este cambio
  }
  
  // Inicializar la página
  document.addEventListener("DOMContentLoaded", () => {
    renderCartItems()
  
    // Event listener para el botón de generar orden
    document.querySelector(".generate-order-btn").addEventListener("click", () => {
      alert("¡Order succesfully generated!")
      // Aquí iría la lógica para procesar la orden
    })
  })