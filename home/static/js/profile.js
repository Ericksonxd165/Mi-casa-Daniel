// Initialize userData from localStorage or use defaults
let userData = {
  fullName: "",
  chineseId: "",
  email: "",
  phone: localStorage.getItem("phone") || "", // Load from localStorage
  wechatId: "",
  province: "",
  city: "",
  address: "",
  postalCode: "",
  country: localStorage.getItem("country") || "", // Load from localStorage
  // Payment method data
  paymentMethod: "",
  paypalAccountHolderName: "",
  paypalEmail: "",
  bankTransferAccountHolderName: "",
  bankName: "",
  accountNumber: "",
  cardAccountHolderName: "",
  cardNumber: "",
}

// Elements from the DOM
const profileCard = document.getElementById("profileCard")
const editProfileForm = document.getElementById("editProfileForm")
const editProfileBtn = document.getElementById("editProfileBtn")
const logoutBtn = document.getElementById("logoutBtn")
const saveProfileBtn = document.getElementById("saveProfileBtn")
const cancelEditBtn = document.getElementById("cancelEditBtn")
const orderHistorySection = document.getElementById("orderHistorySection")
const finalizeBtn = document.getElementById("finalizeBtn")

// Payment method related elements
const editPaymentMethodSelect = document.getElementById("editPaymentMethod")
const editPaypalFields = document.getElementById("editPaypalFields")
const editBankTransferFields = document.getElementById("editBankTransferFields")
const editCardFields = document.getElementById("editCardFields")

const paypalFieldsDisplay = document.getElementById("paypalFieldsDisplay")
const bankTransferFieldsDisplay = document.getElementById("bankTransferFieldsDisplay")
const cardFieldsDisplay = document.getElementById("cardFieldsDisplay")

// Function to display user data in the profile
function displayUserData() {
  // Personal info
  document.getElementById("userName").textContent = userData.fullName || "Guest User"
  document.getElementById("fullName").textContent = userData.fullName || "Not provided"
  document.getElementById("chineseId").textContent = userData.chineseId || "Not provided"
  document.getElementById("country").textContent = userData.country || "Not provided"

  // Contact info
  document.getElementById("userEmail").textContent = userData.email || "Not provided"
  document.getElementById("userPhone").textContent = userData.phone || "Not provided"
  document.getElementById("wechatId").textContent = userData.wechatId || "Not provided"

  // Address info
  document.getElementById("province").textContent = userData.province || "Not provided"
  document.getElementById("city").textContent = userData.city || "Not provided"
  document.getElementById("address").textContent = userData.address || "Not provided"
  document.getElementById("postalCode").textContent = userData.postalCode || "Not provided"

  // Payment info
  const paymentMethodDisplay = document.getElementById("paymentMethodDisplay")
  paymentMethodDisplay.textContent = getPaymentMethodText(userData.paymentMethod) || "Not configured"
  paymentMethodDisplay.setAttribute("data-value", userData.paymentMethod || "")

  // Hide all payment fields by default
  paypalFieldsDisplay.style.display = "none"
  bankTransferFieldsDisplay.style.display = "none"
  cardFieldsDisplay.style.display = "none"

  // Show the relevant payment fields based on the selected method
  if (userData.paymentMethod === "paypal") {
    paypalFieldsDisplay.style.display = "block"
    document.getElementById("paypalAccountHolderNameDisplay").textContent =
      userData.paypalAccountHolderName || "Not provided"
    document.getElementById("paypalEmailDisplay").textContent = userData.paypalEmail || "Not provided"
  } else if (userData.paymentMethod === "bank_transfer") {
    bankTransferFieldsDisplay.style.display = "block"
    document.getElementById("bankTransferAccountHolderNameDisplay").textContent =
      userData.bankTransferAccountHolderName || "Not provided"
    document.getElementById("bankNameDisplay").textContent = userData.bankName || "Not provided"
    document.getElementById("accountNumberDisplay").textContent = userData.accountNumber || "Not provided"
  } else if (userData.paymentMethod === "card") {
    cardFieldsDisplay.style.display = "block"
    document.getElementById("cardAccountHolderNameDisplay").textContent =
      userData.cardAccountHolderName || "Not provided"
    document.getElementById("cardNumberDisplay").textContent = userData.cardNumber || "Not provided"
  }
}

// Helper function to get the display text for payment methods
function getPaymentMethodText(value) {
  switch (value) {
    case "paypal":
      return "PayPal"
    case "bank_transfer":
      return "Bank Transfer"
    case "card":
      return "Credit Card"
    default:
      return ""
  }
}

// Function to fill the edit form with current user data
function fillEditForm() {
  document.getElementById("editFullName").value = userData.fullName || ""
  document.getElementById("editChineseId").value = userData.chineseId || ""
  document.getElementById("editEmail").value = userData.email || ""
  // Phone is displayed but not editable as it comes from sign-up
  document.getElementById("editWechatId").value = userData.wechatId || ""
  document.getElementById("editProvince").value = userData.province || ""
  document.getElementById("editCity").value = userData.city || ""
  document.getElementById("editAddress").value = userData.address || ""
  document.getElementById("editPostalCode").value = userData.postalCode || ""

  // Payment method fields
  if (userData.paymentMethod) {
    editPaymentMethodSelect.value = userData.paymentMethod
    // Trigger change event to show the correct fields
    editPaymentMethodSelect.dispatchEvent(new Event("change"))

    if (userData.paymentMethod === "paypal") {
      document.getElementById("editPaypalAccountHolderName").value = userData.paypalAccountHolderName || ""
      document.getElementById("editPaypalEmail").value = userData.paypalEmail || ""
    } else if (userData.paymentMethod === "bank_transfer") {
      document.getElementById("editBankTransferAccountHolderName").value = userData.bankTransferAccountHolderName || ""
      document.getElementById("editBankName").value = userData.bankName || ""
      document.getElementById("editAccountNumber").value = userData.accountNumber || ""
    } else if (userData.paymentMethod === "card") {
      document.getElementById("editCardAccountHolderName").value = userData.cardAccountHolderName || ""
      document.getElementById("editCardNumber").value = userData.cardNumber || ""
    }
  }
}

// Function to get data from the form
function getFormData() {
  const formData = {
    fullName: document.getElementById("editFullName").value,
    chineseId: document.getElementById("editChineseId").value,
    email: document.getElementById("editEmail").value,
    phone: userData.phone, // Phone is not editable
    wechatId: document.getElementById("editWechatId").value,
    province: document.getElementById("editProvince").value,
    city: document.getElementById("editCity").value,
    address: document.getElementById("editAddress").value,
    postalCode: document.getElementById("editPostalCode").value,
    country: userData.country, // Country is not editable
    paymentMethod: editPaymentMethodSelect.value,
  }

  // Add payment method specific fields based on selection
  if (formData.paymentMethod === "paypal") {
    formData.paypalAccountHolderName = document.getElementById("editPaypalAccountHolderName").value
    formData.paypalEmail = document.getElementById("editPaypalEmail").value
  } else if (formData.paymentMethod === "bank_transfer") {
    formData.bankTransferAccountHolderName = document.getElementById("editBankTransferAccountHolderName").value
    formData.bankName = document.getElementById("editBankName").value
    formData.accountNumber = document.getElementById("editAccountNumber").value
  } else if (formData.paymentMethod === "card") {
    formData.cardAccountHolderName = document.getElementById("editCardAccountHolderName").value
    formData.cardNumber = document.getElementById("editCardNumber").value
  }

  return formData
}

// Function to save user data to localStorage
function saveUserDataToLocalStorage() {
  for (const key in userData) {
    if (userData.hasOwnProperty(key)) {
      localStorage.setItem(key, userData[key])
    }
  }
  // Ensure the email is saved to localStorage
  if (userData.email) {
    localStorage.setItem("email", userData.email)
  }
}

// Function to load user data from localStorage
function loadUserDataFromLocalStorage() {
  // First check if we have any saved profile data
  const savedFullName = localStorage.getItem("fullName")

  // If we have saved profile data, load all fields
  if (savedFullName) {
    for (const key in userData) {
      if (userData.hasOwnProperty(key)) {
        const value = localStorage.getItem(key)
        if (value) {
          userData[key] = value
        }
      }
    }
  }
}

// Function to check if profile is complete
function isProfileComplete() {
  const requiredFields = ["fullName", "email", "phone", "address", "city", "province", "postalCode", "country"]

  for (const field of requiredFields) {
    if (!userData[field]) {
      return false
    }
  }

  return true
}

// Function to fetch order history from the server
async function fetchOrderHistoryFromServer() {
  try {
    const currentUserEmail = localStorage.getItem("email"); // Asegúrate de usar la clave correcta
    if (!currentUserEmail) {
      console.error("User email not found in localStorage.");
      return [];
    }

    const response = await fetch(`/api/orders/?email=${currentUserEmail}`); // Ajusta la URL para que coincida con el backend
    if (!response.ok) {
      throw new Error("Failed to fetch order history from server.");
    }

    const orders = await response.json();
    return orders;
  } catch (error) {
    console.error("Error fetching order history from server:", error);
    return [];
  }
}

// Function to load order history
async function loadOrderHistory() {
  if (!orderHistorySection) return;

  const orders = await fetchOrderHistoryFromServer();

  if (orders.length === 0) {
    orderHistorySection.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history"></i>
                <h3>No Order History</h3>
                <p>You haven't placed any orders yet.</p>
            </div>
        `;
    return;
  }

  let ordersHTML = `
        <h3 class="section-title">Order History</h3>
        <div class="orders-list">
    `;

  orders.forEach((order) => {
    ordersHTML += `
            <div class="order-item">
                <div class="order-header">
                    <div>
                        <span class="order-id">Order #${order.orderId}</span>
                        <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-details">
                    <div class="order-products">
                        <ul>
                            ${order.items.map(item => `<li>${item.productName} (x${item.quantity})</li>`).join("")}
                        </ul>
                    </div>
                    <div class="order-total">
                        <span>Total: $${order.total.toFixed(2)}</span>
                    </div>
                </div>
                <div class="order-actions">
                    <button class="btn view-order-btn" data-order-id="${order.orderId}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn download-invoice-btn" data-order-id="${order.orderId}">
                        <i class="fas fa-file-download"></i> Download Invoice
                    </button>
                </div>
            </div>
        `;
  });

  ordersHTML += `</div>`;
  orderHistorySection.innerHTML = ordersHTML;

  // Add event listeners for buttons
  document.querySelectorAll(".view-order-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const orderId = this.getAttribute("data-order-id");
      window.location.href = `/checkout/?order=${orderId}`;
    });
  });

  document.querySelectorAll(".download-invoice-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const orderId = this.getAttribute("data-order-id");
      downloadInvoice(orderId);
    });
  });
}

// Function to generate and download the invoice
function downloadInvoice(orderId) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("jsPDF library is not loaded. Please check your HTML file.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Fetch order data from localStorage
  const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
  const order = orderHistory.find(o => o.orderId === orderId);

  if (!order) {
    alert("Order not found in localStorage.");
    return;
  }

  // Customer data
  const customerData = {
    fullName: order.customerName,
    chineseId: order.customerId || "N/A",
    email: order.customerEmail,
    phone: order.customerPhone,
    country: order.shippingCountry,
    province: order.shippingProvince,
    city: order.shippingCity,
    address: order.shippingAddress,
    postalCode: order.shippingPostalCode,
  };

  // Calculate totals
  const subtotal = order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = order.shipping || 10.0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // Add company header
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0) 
  doc.text("MI CASA", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("INVESTMENTS", 14, 25);

  // Add invoice title and info
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("INVOICE", 14, 35);

  doc.setFontSize(10);
  doc.text(`Invoice #: ${orderId}`, 14, 42);
  doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 14, 47);

  // Add customer info
  doc.setFontSize(12);
  doc.text("Bill To:", 14, 57);

  doc.setFontSize(10);
  doc.text(customerData.fullName, 14, 63);
  doc.text(customerData.address, 14, 68);
  doc.text(`${customerData.city}, ${customerData.province} ${customerData.postalCode}`, 14, 73);
  doc.text(customerData.country, 14, 78);
  doc.text(`Phone: ${customerData.phone}`, 14, 83);
  doc.text(`Email: ${customerData.email}`, 14, 88);

  // Add order items table
  const tableColumn = ["Item", "Supplier", "Qty", "Price", "Total"];
  const tableRows = [];

  order.items.forEach((item) => {
    const itemData = [
      item.title,
      item.supplier.name || "N/A",
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`,
    ];
    tableRows.push(itemData);
  });

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
  });

  // Add summary
  const finalY = doc.lastAutoTable.finalY + 10;

  doc.text("Summary:", 130, finalY);
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 130, finalY + 6);
  doc.text(`Shipping: $${shipping.toFixed(2)}`, 130, finalY + 12);
  doc.text(`Tax (10%): $${tax.toFixed(2)}`, 130, finalY + 18);

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(`Total: $${total.toFixed(2)}`, 130, finalY + 26);

  // Add footer
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Thank you for your business!", 14, finalY + 35);
  doc.text("For questions about this invoice, please contact support@micasa.com", 14, finalY + 41);

  // Save the PDF
  doc.save(`Invoice-${orderId}.pdf`);
}

// Event Listeners
if (editProfileBtn) {
  editProfileBtn.addEventListener("click", () => {
    profileCard.style.display = "none"
    editProfileForm.style.display = "block"
    fillEditForm()
  })
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", () => {
    profileCard.style.display = "block"
    editProfileForm.style.display = "none"
  })
}

if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", () => {
    // Get form data
    const formData = getFormData()

    // Basic validation
    if (!formData.fullName) {
      alert("Please enter your full name.")
      return
    }

    // Update user data
    userData = { ...userData, ...formData }

    // Save to localStorage
    saveUserDataToLocalStorage()

    // Update display
    displayUserData()

    // Show success message
    alert("Profile updated successfully.")

    // Return to profile view
    profileCard.style.display = "block"
    editProfileForm.style.display = "none"

    // Check if there's a pending order
    if (localStorage.getItem("pendingOrder")) {
      // Ask if user wants to proceed to checkout
      if (confirm("Your profile has been updated. Would you like to proceed to generate your order?")) {
        window.location.href = "/carrito"
      }
    }
  })
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to log out?")) {
      // Clear localStorage data
      localStorage.clear()

      // Redirect to login page
      window.location.href = "/login/"
    }
  })
}

if (finalizeBtn) {
  finalizeBtn.addEventListener("click", () => {
    // Check if profile is complete
    if (isProfileComplete()) {
      // If profile is complete, redirect to checkout
      window.location.href = "/checkout/"
    } else {
      // If profile is incomplete, show alert
      alert("Please complete your profile information before proceeding to checkout.")
    }
  })
}

// Payment method selection handler
if (editPaymentMethodSelect) {
  editPaymentMethodSelect.addEventListener("change", function () {
    // Hide all payment fields
    editPaypalFields.style.display = "none"
    editBankTransferFields.style.display = "none"
    editCardFields.style.display = "none"

    // Show the relevant fields based on selection
    const selectedMethod = this.value
    if (selectedMethod === "paypal") {
      editPaypalFields.style.display = "block"
    } else if (selectedMethod === "bank_transfer") {
      editBankTransferFields.style.display = "block"
    } else if (selectedMethod === "card") {
      editCardFields.style.display = "block"
    }
  })
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Load data from localStorage
  loadUserDataFromLocalStorage()

  // Display user data
  displayUserData()

  // Load order history
  loadOrderHistory()

  // Add a read-only phone field to the form if needed
  const phoneField = document.createElement("div")
  phoneField.className = "form-group"
  phoneField.innerHTML = `
    <label for="editPhone">Phone Number (from sign-up):</label>
    <input type="text" id="editPhone" class="form-input" value="${userData.phone}" disabled>
  `

  // Insert after email field
  const emailField = document.getElementById("editEmail")
  if (emailField && emailField.parentNode) {
    emailField.parentNode.parentNode.insertBefore(phoneField, emailField.parentNode.nextSibling)
  }

  // Add a read-only country field to the form if needed
  const countryField = document.createElement("div")
  countryField.className = "form-group"
  countryField.innerHTML = `
    <label for="editCountry">Country (from sign-up):</label>
    <input type="text" id="editCountry" class="form-input" value="${userData.country}" disabled>
  `

  // Insert before province field
  const provinceField = document.getElementById("editProvince")
  if (provinceField && provinceField.parentNode) {
    provinceField.parentNode.parentNode.insertBefore(countryField, provinceField.parentNode)
  }

  // Update the Finalize button text based on profile completeness
  if (finalizeBtn) {
    if (isProfileComplete()) {
      finalizeBtn.textContent = "Proceed to Checkout"
    } else {
      finalizeBtn.textContent = "Complete Profile to Checkout"
    }
  }
})
