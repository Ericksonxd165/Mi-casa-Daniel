document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("image-input")
  const imageContainer = document.getElementById("image-container")
  const imageUpload = document.getElementById("image-upload")
  const imageCounter = document.getElementById("image-count")
  const MAX_IMAGES = 5

  // Referencia al management form y al template vacío de imágenes
  const managementFormDiv = document.getElementById("django-image-formset")
  const managementForm = managementFormDiv.querySelector("input[id$='-TOTAL_FORMS']")
  // Se espera que en el template el empty form esté envuelto en un contenedor <div class="image-form" data-index="__prefix__">
  const emptyFormHTML = document.getElementById("image-form-template").innerHTML

  // Referencia a los elementos de proveedores
  const addProviderBtn = document.getElementById("add-provider")
  const providersContainer = document.getElementById("providers-container")
  const providerTemplate = document.getElementById("provider-template")

  let imageCount = 0

  imageInput.addEventListener("change", handleImageUpload)
  addProviderBtn.addEventListener("click", addProvider)

  // Listener para remover imagen (preview y bloque del formset)
  document.addEventListener("click", (e) => {
    // Handle image removal
    const removeImageBtn = e.target.closest(".remove-image")
    if (removeImageBtn) {
      const previewDiv = removeImageBtn.closest(".image-preview")
      if (!previewDiv) return
      // Obtener el índice asignado
      const removedIndex = previewDiv.getAttribute("data-index")

      // Remover la preview
      previewDiv.remove()

      // Remover el bloque del formset correspondiente
      const formBlock = managementFormDiv.querySelector(`.image-form[data-index='${removedIndex}']`)
      if (formBlock) {
        formBlock.remove()
      }

      // Actualizar imageCount y el management form
      imageCount--
      updateImageCounter()
      managementForm.value = imageCount

      // Si ya hay menos imagenes que el máximo, mostrar botón de upload
      if (imageCount < MAX_IMAGES) {
        imageUpload.style.display = "flex"
      }
    }

    // Handle provider removal
    const removeProviderBtn = e.target.closest(".remove-provider")
    if (removeProviderBtn) {
      removeProvider(removeProviderBtn)
    }
  })

  function handleImageUpload(e) {
    if (imageCount >= MAX_IMAGES) return

    const file = e.target.files[0]
    if (!file) return

    // Crear preview usando el template de imagen
    const previewTemplate = document.getElementById("image-preview-template")
    const clonePreview = document.importNode(previewTemplate.content, true)
    // Asignar data-index a la preview
    const previewDiv = clonePreview.querySelector(".image-preview")
    previewDiv.setAttribute("data-index", imageCount)
    const img = previewDiv.querySelector("img")
    img.src = URL.createObjectURL(file)
    imageContainer.insertBefore(clonePreview, imageUpload)

    // Clonar el empty form, envolverlo en un contenedor y asignar data-index
    const formHTML =
      `<div class="image-form" data-index="${imageCount}">` +
      emptyFormHTML.replace(/__prefix__/g, imageCount) +
      `</div>`
    managementFormDiv.insertAdjacentHTML("beforeend", formHTML)

    // Actualizar el input file del clon con el archivo subido
    const fileInput = document.getElementById(`id_images-${imageCount}-image`)
    if (fileInput) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileInput.files = dataTransfer.files
    }

    imageCount++
    updateImageCounter()

    if (imageCount >= MAX_IMAGES) {
      imageUpload.style.display = "none"
    }

    managementForm.value = imageCount
    e.target.value = ""
  }

  function updateImageCounter() {
    imageCounter.textContent = imageCount
  }

  function addProvider() {
    const providerTemplate = document.getElementById("provider-template")
    const providersContainer = document.getElementById("providers-container")
    const totalForms = document.querySelector("#id_providers-TOTAL_FORMS")

    if (!providerTemplate || !providersContainer || !totalForms) {
      console.error("Missing required elements for adding providers.")
      return
    }

    // Obtener el índice actual del formset
    const formIndex = Number.parseInt(totalForms.value, 10)

    // Reemplazar el marcador __PREFIX__ con el índice actual
    const template = providerTemplate.innerHTML.replace(/__PREFIX__/g, formIndex)

    // Crear un nuevo elemento div y agregar el template
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = template

    // Agregar el nuevo formulario al contenedor
    providersContainer.appendChild(tempDiv.firstElementChild)

    // Incrementar el contador de formularios
    totalForms.value = formIndex + 1
  }

  function removeProvider(button) {
    const providerCard = button.closest(".provider-card")
    if (providerCard) {
      // Marcar el campo DELETE como true
      const deleteInput = providerCard.querySelector("input[name$='-DELETE']")
      if (deleteInput) {
        deleteInput.checked = true // Marcar para eliminar
        deleteInput.value = "on" // Asegurarse de que el valor sea "on"
      }
      // Ocultar visualmente el formulario
      providerCard.style.display = "none"
      console.log("Provider marked for deletion")
    } else {
      console.error("Provider card not found.")
    }
  }

  // Make removeProvider available globally
  window.removeProvider = removeProvider
})

