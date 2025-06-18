// Global variables
let orderData = []
let orderId = ""

// Helper function to format currency
function formatCurrency(amount) {
  return "$" + Number.parseFloat(amount).toFixed(2)
}

// Helper function to generate a unique order ID
function generateOrderId() {
  const timestamp = new Date().getTime().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `ORD-${timestamp}-${random}`
}

// Helper function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

// Helper function to get CSRF token from meta tag
function getCSRFTokenFromMeta() {
  const metaTag = document.querySelector('meta[name="csrf-token"]')
  if (metaTag) {
    return metaTag.getAttribute("content")
  }
  return null
}

// Helper function to get CSRF token from hidden input
function getCSRFTokenFromInput() {
  const input = document.querySelector('input[name="csrfmiddlewaretoken"]')
  if (input) {
    return input.value
  }
  return null
}

// Get CSRF token using all available methods
function getCSRFToken() {
  // Try to get from cookie first (most common)
  let token = getCookie("csrftoken")

  // If not found in cookie, try meta tag
  if (!token) {
    token = getCSRFTokenFromMeta()
  }

  // If still not found, try hidden input
  if (!token) {
    token = getCSRFTokenFromInput()
  }

  return token
}

// Load order data from localStorage or from server based on URL parameter
function loadOrderData() {
  // Check if we're viewing a specific order from history
  const urlParams = new URLSearchParams(window.location.search)
  const orderParam = urlParams.get("order")

  if (orderParam) {
    // We're viewing an existing order
    orderId = orderParam
    document.getElementById("orderIdDisplay").textContent = orderId

    // Try to find the order in order history
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]")
    const existingOrder = orderHistory.find((order) => order.orderId === orderId)

    if (existingOrder) {
      // Found the order in history, use its data
      orderData = existingOrder.items

      // Set customer data from the existing order
      document.getElementById("customerName").textContent = existingOrder.customerName || "Not provided"
      document.getElementById("customerId").textContent = existingOrder.customerId || "Not provided"
      document.getElementById("customerEmail").textContent = existingOrder.customerEmail || "Not provided"
      document.getElementById("customerPhone").textContent = existingOrder.customerPhone || "Not provided"

      // Set shipping information if available
      if (existingOrder.shippingAddress) {
        document.getElementById("shippingAddress").textContent = existingOrder.shippingAddress
        document.getElementById("shippingCity").textContent = existingOrder.shippingCity || "Not provided"
        document.getElementById("shippingProvince").textContent = existingOrder.shippingProvince || "Not provided"
        document.getElementById("shippingCountry").textContent = existingOrder.shippingCountry || "Not provided"
        document.getElementById("shippingPostalCode").textContent = existingOrder.shippingPostalCode || "Not provided"
      }

      // Set payment method if available
      if (existingOrder.paymentMethod) {
        document.getElementById("paymentMethod").textContent = existingOrder.paymentMethod
      }

      displayOrderItems()
      calculateOrderSummary()
    } else {
      // Order not found in local history, try to fetch from server
      fetchOrderFromServer(orderId)
    }
  } else {
    // We're creating a new order
    const savedOrderData = localStorage.getItem("orderData")
    if (savedOrderData) {
      try {
        orderData = JSON.parse(savedOrderData)

        // Generate order ID if not already present
        if (!orderId) {
          orderId = generateOrderId()
          document.getElementById("orderIdDisplay").textContent = orderId
        }

        // Display order items
        displayOrderItems()

        // Calculate and display order summary
        calculateOrderSummary()

        // Save order to history
        saveOrderToHistory()
      } catch (e) {
        console.error("Error parsing order data:", e)
        showError("Failed to load order data. Please try again.")
      }
    } else {
      showError("No order data found. Please add items to your cart first.")
      setTimeout(() => {
        window.location.href = "/shop/"
      }, 3000)
    }
  }
}

// Fetch order data from server
function fetchOrderFromServer(orderId) {
  // Show loading state
  document.getElementById("orderItems").innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading order details...</p>
        </div>
    `

  // Fetch order data from server
  fetch(`/shop/api/order/${orderId}/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Order not found")
      }
      return response.json()
    })
    .then((data) => {
      console.log("Order data from server:", data) // Debug log

      // Update order ID display
      document.getElementById("orderIdDisplay").textContent = data.order_id

      // Set customer data
      document.getElementById("customerName").textContent = data.customer_name || "Not provided"
      document.getElementById("customerId").textContent = data.customer_id || "Not provided"
      document.getElementById("customerEmail").textContent = data.customer_email || "Not provided"
      document.getElementById("customerPhone").textContent = data.customer_phone || "Not provided"

      document.getElementById("shippingCountry").textContent = data.shipping_country || "Not provided"
      document.getElementById("shippingProvince").textContent = data.shipping_province || "Not provided"
      document.getElementById("shippingCity").textContent = data.shipping_city || "Not provided"
      document.getElementById("shippingAddress").textContent = data.shipping_address || "Not provided"
      document.getElementById("shippingPostalCode").textContent = data.shipping_postal_code || "Not provided"

      // Set payment method
      const paymentMethodElement = document.getElementById("paymentMethod")
      const paymentDetailsElement = document.getElementById("paymentDetails")

      paymentMethodElement.textContent = data.payment_method || "Not provided"

      // Set order items
      orderData = data.items
      displayOrderItems()

      // Calculate summary
      document.getElementById("subtotal").textContent = formatCurrency(data.total_amount * 0.8) // Aproximación
      document.getElementById("shipping").textContent = formatCurrency(10.0)
      document.getElementById("tax").textContent = formatCurrency(data.total_amount * 0.1) // Aproximación
      document.getElementById("total").textContent = formatCurrency(data.total_amount)
    })
    .catch((error) => {
      console.error("Error fetching order:", error)
      showError("Failed to load order details. The order may not exist or there was a server error.")
    })
}

// Display order items
function displayOrderItems() {
  const orderItemsContainer = document.getElementById("orderItems")
  if (!orderItemsContainer) return

  if (orderData.length === 0) {
    orderItemsContainer.innerHTML = "<p>No items in this order.</p>"
    return
  }

  let itemsHTML = ""

  orderData.forEach((item) => {
    itemsHTML += `
            <div class="order-item">
                <div class="item-image">
                    <img src="${item.image || "/static/images/placeholder.png"}" alt="${item.title}">
                </div>
                <div class="item-details">
                    <h4 class="item-title">${item.title}</h4>
                    <p class="item-supplier">Supplier: ${item.supplier.name}</p>
                    <div class="item-price-qty">
                        <span class="item-quantity">Qty: ${item.quantity}</span>
                        <span class="item-price">${formatCurrency(item.price * item.quantity)}</span>
                    </div>
                </div>
            </div>
        `
  })

  orderItemsContainer.innerHTML = itemsHTML
}

// Load customer data from localStorage
function loadCustomerData() {
  const customerData = {
    fullName: localStorage.getItem("fullName") || "Not provided",
    chineseId: localStorage.getItem("chineseId") || "Not provided",
    email: localStorage.getItem("email") || "Not provided",
    phone: localStorage.getItem("phone") || "Not provided",
    country: localStorage.getItem("country") || "Not provided",
    province: localStorage.getItem("province") || "Not provided",
    city: localStorage.getItem("city") || "Not provided",
    address: localStorage.getItem("address") || "Not provided",
    postalCode: localStorage.getItem("postalCode") || "Not provided",
    paymentMethod: localStorage.getItem("paymentMethod") || "Not provided",
  }

  // Only set customer information if we're not viewing an existing order
  // (for existing orders, this data comes from the server)
  if (!window.location.search.includes("order=")) {
    // Display customer information
    document.getElementById("customerName").textContent = customerData.fullName
    document.getElementById("customerId").textContent = customerData.chineseId
    document.getElementById("customerEmail").textContent = customerData.email
    document.getElementById("customerPhone").textContent = customerData.phone

    document.getElementById("shippingCountry").textContent = customerData.country
    document.getElementById("shippingProvince").textContent = customerData.province
    document.getElementById("shippingCity").textContent = customerData.city
    document.getElementById("shippingAddress").textContent = customerData.address
    document.getElementById("shippingPostalCode").textContent = customerData.postalCode

    // Display payment information
    const paymentMethodElement = document.getElementById("paymentMethod")
    const paymentDetailsElement = document.getElementById("paymentDetails")

    let paymentMethodText = "Not configured"
    let paymentDetailsHTML = ""

    switch (customerData.paymentMethod) {
      case "paypal":
        paymentMethodText = "PayPal"
        paymentDetailsHTML = `
                    <div class="info-item">
                        <span class="info-label">Account Holder:</span>
                        <span class="info-value">${localStorage.getItem("paypalAccountHolderName") || "Not provided"}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${localStorage.getItem("paypalEmail") || "Not provided"}</span>
                    </div>
                `
        break
      case "bank_transfer":
        paymentMethodText = "Bank Transfer"
        paymentDetailsHTML = `
                    <div class="info-item">
                        <span class="info-label">Account Holder:</span>
                        <span class="info-value">${localStorage.getItem("bankTransferAccountHolderName") || "Not provided"}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Bank Name:</span>
                        <span class="info-value">${localStorage.getItem("bankName") || "Not provided"}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Account Number:</span>
                        <span class="info-value">${localStorage.getItem("accountNumber") || "Not provided"}</span>
                    </div>
                `
        break
      case "card":
        paymentMethodText = "Credit Card"
        paymentDetailsHTML = `
                    <div class="info-item">
                        <span class="info-label">Card Holder:</span>
                        <span class="info-value">${localStorage.getItem("cardAccountHolderName") || "Not provided"}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Card Number:</span>
                        <span class="info-value">${localStorage.getItem("cardNumber") ? "****" + localStorage.getItem("cardNumber").slice(-4) : "Not provided"}</span>
                    </div>
                `
        break
      default:
        paymentDetailsHTML = "<p>No payment method configured.</p>"
    }

    paymentMethodElement.textContent = paymentMethodText
    paymentDetailsElement.innerHTML = paymentDetailsHTML
  }
}

// Calculate and display order summary
function calculateOrderSummary() {
  if (orderData.length === 0) return

  const subtotal = orderData.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 10.0 // Fixed shipping cost
  const taxRate = 0.1 // 10% tax rate
  const tax = subtotal * taxRate
  const total = subtotal + shipping + tax

  document.getElementById("subtotal").textContent = formatCurrency(subtotal)
  document.getElementById("shipping").textContent = formatCurrency(shipping)
  document.getElementById("tax").textContent = formatCurrency(tax)
  document.getElementById("total").textContent = formatCurrency(total)
}

// Save order to history in localStorage
function saveOrderToHistory() {
  if (orderData.length === 0) return

  const subtotal = orderData.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 10.0
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]")

  // Check if this order is already in history
  const existingOrderIndex = orderHistory.findIndex((order) => order.orderId === orderId)

  // Get customer data from localStorage
  const customerName = localStorage.getItem("fullName") || "Not provided"
  const customerEmail = localStorage.getItem("email") || "Not provided"
  const customerPhone = localStorage.getItem("phone") || "Not provided"
  const customerId = localStorage.getItem("chineseId") || "Not provided"
  const shippingAddress = localStorage.getItem("address") || "Not provided"
  const shippingCity = localStorage.getItem("city") || "Not provided"
  const shippingProvince = localStorage.getItem("province") || "Not provided"
  const shippingCountry = localStorage.getItem("country") || "Not provided"
  const shippingPostalCode = localStorage.getItem("postalCode") || "Not provided"
  const paymentMethod = localStorage.getItem("paymentMethod") || "Not provided"

  const orderSummary = {
    orderId: orderId,
    date: new Date().toISOString(),
    items: orderData,
    subtotal: subtotal,
    shipping: shipping,
    tax: tax,
    total: total,
    status: "pending",
    customerName: customerName,
    customerEmail: customerEmail,
    customerPhone: customerPhone,
    customerId: customerId,
    shippingAddress: shippingAddress,
    shippingCity: shippingCity,
    shippingProvince: shippingProvince,
    shippingCountry: shippingCountry,
    shippingPostalCode: shippingPostalCode,
    paymentMethod: paymentMethod,
  }

  if (existingOrderIndex !== -1) {
    // Update existing order
    orderHistory[existingOrderIndex] = orderSummary
  } else {
    // Add new order
    orderHistory.push(orderSummary)
  }

  localStorage.setItem("orderHistory", JSON.stringify(orderHistory))

  // Clear the current order data only if we're creating a new order
  if (!window.location.search.includes("order=")) {
    localStorage.removeItem("orderData")
  }

  // Save order to server
  saveOrderToServer(orderSummary)
}

// Save order to server
function saveOrderToServer(orderSummary) {
  // Prepare data for server
  const serverData = {
    orderId: orderSummary.orderId,
    customerName: orderSummary.customerName,
    customerEmail: orderSummary.customerEmail,
    customerPhone: orderSummary.customerPhone,
    customerId: orderSummary.customerId,
    address: orderSummary.shippingAddress,
    city: orderSummary.shippingCity,
    province: orderSummary.shippingProvince,
    country: orderSummary.shippingCountry,
    postalCode: orderSummary.shippingPostalCode,
    paymentMethod: orderSummary.paymentMethod,
    total: orderSummary.total,
    items: orderSummary.items.map((item) => {
      // Asegurarse de que el objeto supplier tenga la estructura correcta
      const supplier = item.supplier || {}
      return {
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        invoiceId: item.invoiceId || "",
        supplier: {
          id: supplier.id || 1, // Usar un ID por defecto si no existe
          name: supplier.name || "Default Supplier",
        },
      }
    }),
  }

  console.log("Sending order to server:", JSON.stringify(serverData)) // Debug log

  // Get CSRF token
  const csrfToken = getCSRFToken()
  console.log("CSRF Token:", csrfToken) // Debug log

  // Send to server with CSRF token
  fetch("/shop/save_order/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify(serverData),
    credentials: "include", // Important for including cookies in the request
  })
    .then((response) => {
      console.log("Server response status:", response.status)
      if (!response.ok) {
        return response.text().then((text) => {
          console.error("Server response text:", text)
          throw new Error(`Server responded with status: ${response.status}. Response: ${text}`)
        })
      }
      return response.json()
    })
    .then((data) => {
      console.log("Order saved to server:", data)
      // Mostrar mensaje de éxito
      alert("¡Order saved Successfully!")
    })
    .catch((error) => {
      console.error("Error saving order to server:", error)
      // Mostrar mensaje de error
      alert("Error al guardar la orden: " + error.message)
    })
}

// Show error message
function showError(message) {
  const orderItemsContainer = document.getElementById("orderItems")
  if (orderItemsContainer) {
    orderItemsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Add hidden CSRF token input if it doesn't exist
  if (!document.querySelector('input[name="csrfmiddlewaretoken"]')) {
    const csrfToken = getCookie("csrftoken")
    if (csrfToken) {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = "csrfmiddlewaretoken"
      input.value = csrfToken
      document.body.appendChild(input)
    }
  }

  // Load order and customer data
  loadOrderData()
  loadCustomerData()

  // Back to shop button
  const backToShopBtn = document.getElementById("backToShopBtn")
  if (backToShopBtn) {
    backToShopBtn.addEventListener("click", () => {
      window.location.href = "/shop/"
    })
  }

  // Download invoice button
  const downloadInvoiceBtn = document.getElementById("downloadInvoiceBtn")
  if (downloadInvoiceBtn) {
    downloadInvoiceBtn.addEventListener("click", generatePDF)
  }
})

// Generate and download PDF invoice
function generatePDF() {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()

  // Customer data
  const customerData = {
    fullName: document.getElementById("customerName").textContent,
    chineseId: document.getElementById("customerId").textContent,
    email: document.getElementById("customerEmail").textContent,
    phone: document.getElementById("customerPhone").textContent,
    country: document.getElementById("shippingCountry").textContent,
    province: document.getElementById("shippingProvince").textContent,
    city: document.getElementById("shippingCity").textContent,
    address: document.getElementById("shippingAddress").textContent,
    postalCode: document.getElementById("shippingPostalCode").textContent,
  }

  // Calculate totals
  const subtotal = orderData.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 10.0
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  // Add company header
  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0) // Primary color
  doc.text("MI CASA", 14, 20)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text("INVESTMENTS", 14, 25)

  // Add invoice title and info
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text("INVOICE", 14, 35)

  doc.setFontSize(10)
  doc.text(`Invoice #: ${orderId}`, 14, 42)
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 47)

  // Add customer info
  doc.setFontSize(12)
  doc.text("Bill To:", 14, 57)

  doc.setFontSize(10)
  doc.text(customerData.fullName, 14, 63)
  doc.text(customerData.address, 14, 68)
  doc.text(`${customerData.city}, ${customerData.province} ${customerData.postalCode}`, 14, 73)
  doc.text(customerData.country, 14, 78)
  doc.text(`Phone: ${customerData.phone}`, 14, 83)
  doc.text(`Email: ${customerData.email}`, 14, 88)

  // Add order items table
  const tableColumn = ["Item", "Supplier", "Qty", "Price", "Total"]
  const tableRows = []

  orderData.forEach((item) => {
    const itemData = [
      item.title,
      item.supplier.name,
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`,
    ]
    tableRows.push(itemData)
  })

  doc.autoTable({
    startY: 95,
    head: [tableColumn],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: [255, 204, 0 ],
      textColor: [0, 0, 0],
    },
    styles: {
      cellPadding: 3,
      fontSize: 10,
    },
  })

  // Add summary
  const finalY = doc.lastAutoTable.finalY + 10

  doc.text("Summary:", 130, finalY)
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 130, finalY + 6)
  doc.text(`Shipping: $${shipping.toFixed(2)}`, 130, finalY + 12)
  doc.text(`Tax (10%): $${tax.toFixed(2)}`, 130, finalY + 18)

  doc.setFontSize(12)
  doc.setFont(undefined, "bold")
  doc.text(`Total: $${total.toFixed(2)}`, 130, finalY + 26)

  // Add footer
  doc.setFontSize(10)
  doc.setFont(undefined, "normal")
  doc.setTextColor(100, 100, 100)
  doc.text("Thank you for your business!", 14, finalY + 35)
  doc.text("For questions about this invoice, please contact support@micasa.com", 14, finalY + 41)

  // Save the PDF
  doc.save(`Invoice-${orderId}.pdf`)
}
