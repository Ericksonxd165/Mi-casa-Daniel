// Datos de ejemplo del usuario
let userData = {
    fullName: "Wang Wei",
    chineseId: "110101199001011234",
    birthDate: "1990-01-01",
    email: "wang.wei@example.com",
    phone: "+86 138 1234 5678",
    wechatId: "wangwei_1990",
    province: "Beijing",
    city: "Beijing",
    address: "Chaoyang District, Jianguo Road 88, Building 2, Apt 1503",
    postalCode: "100022",
  }
  
  // Elementos del DOM
  const profileCard = document.getElementById("profileCard")
  const editProfileForm = document.getElementById("editProfileForm")
  const editProfileBtn = document.getElementById("editProfileBtn")
  const logoutBtn = document.getElementById("logoutBtn")
  const saveProfileBtn = document.getElementById("saveProfileBtn")
  const cancelEditBtn = document.getElementById("cancelEditBtn")
  
  // Función para mostrar los datos del usuario en el perfil
  function displayUserData() {
    document.getElementById("userName").textContent = userData.fullName
    document.getElementById("fullName").textContent = userData.fullName
    document.getElementById("chineseId").textContent = userData.chineseId
    document.getElementById("birthDate").textContent = formatDate(userData.birthDate)
    document.getElementById("userEmail").textContent = userData.email
    document.getElementById("userPhone").textContent = userData.phone
    document.getElementById("wechatId").textContent = userData.wechatId
    document.getElementById("province").textContent = userData.province
    document.getElementById("city").textContent = userData.city
    document.getElementById("address").textContent = userData.address
    document.getElementById("postalCode").textContent = userData.postalCode
  }
  
  // Función para llenar el formulario de edición con los datos actuales
  function fillEditForm() {
    document.getElementById("editFullName").value = userData.fullName
    document.getElementById("editChineseId").value = userData.chineseId
    document.getElementById("editBirthDate").value = userData.birthDate
    document.getElementById("editEmail").value = userData.email
    document.getElementById("editPhone").value = userData.phone
    document.getElementById("editWechatId").value = userData.wechatId
    document.getElementById("editProvince").value = userData.province
    document.getElementById("editCity").value = userData.city
    document.getElementById("editAddress").value = userData.address
    document.getElementById("editPostalCode").value = userData.postalCode
  }
  
  // Función para obtener los datos del formulario
  function getFormData() {
    return {
      fullName: document.getElementById("editFullName").value,
      chineseId: document.getElementById("editChineseId").value,
      birthDate: document.getElementById("editBirthDate").value,
      email: document.getElementById("editEmail").value,
      phone: userData.phone, // El teléfono no se puede cambiar
      wechatId: document.getElementById("editWechatId").value,
      province: document.getElementById("editProvince").value,
      city: document.getElementById("editCity").value,
      address: document.getElementById("editAddress").value,
      postalCode: document.getElementById("editPostalCode").value,
    }
  }
  
  // Función para formatear la fecha
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }
  
  // Event Listeners
  editProfileBtn.addEventListener("click", () => {
    profileCard.style.display = "none"
    editProfileForm.style.display = "block"
    fillEditForm()
  })
  
  cancelEditBtn.addEventListener("click", () => {
    profileCard.style.display = "block"
    editProfileForm.style.display = "none"
  })
  
  saveProfileBtn.addEventListener("click", () => {
    // Obtener los datos del formulario
    const formData = getFormData()
  
    // Validar datos (ejemplo básico)
    if (!formData.fullName || !formData.email) {
      alert("Por favor, completa los campos obligatorios.")
      return
    }
  
    // Actualizar los datos del usuario (solo en memoria)
    userData = { ...userData, ...formData }
  
    // Actualizar la visualización
    displayUserData()
  
    // Mostrar mensaje de éxito
    alert("Perfil actualizado correctamente.")
  
    // Volver a la vista de perfil
    profileCard.style.display = "block"
    editProfileForm.style.display = "none"
  
    // Aquí se enviarían los datos al backend si existiera
    console.log("Datos para enviar al backend:", userData)
  })
  
  logoutBtn.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      // Aquí iría la lógica de cierre de sesión
      alert("Has cerrado sesión correctamente.")
      // Redirigir a la página de inicio de sesión
      // window.location.href = 'login.html';
    }
  })
  
  // Inicializar la página
  document.addEventListener("DOMContentLoaded", () => {
    displayUserData()
  })
  
  