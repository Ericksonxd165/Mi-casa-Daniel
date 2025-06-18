// product-edit.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const imageContainer = document.getElementById('image-container');
    const newImageInput = document.getElementById('new-image-input');
    const addProviderBtn = document.getElementById('add-provider');
    const providersContainer = document.getElementById('providers-container');
    const imageCountDisplay = document.getElementById('image-count');
    const productForm = document.getElementById('product-form');
    
    // Obtener datos iniciales
    const appData = document.getElementById('app-data');
    const initialImageCount = parseInt(appData.dataset.imageCount) || 0;
    const initialProviderCount = parseInt(appData.dataset.providerCount) || 0;
    const maxImages = parseInt(appData.dataset.maxImages) || 5;
    const maxProviders = parseInt(appData.dataset.maxProviders) || 5;
    
    // Contadores
    let imageCount = initialImageCount;
    let providerCount = initialProviderCount;
    let newImageIndex = initialImageCount;
    let newProviderIndex = initialProviderCount;
    
    // Actualizar contador de imágenes
    function updateImageCount() {
        imageCountDisplay.textContent = imageCount;
        
        // Mostrar/ocultar botón de añadir imagen
        const imageUpload = document.getElementById('image-upload');
        if (imageUpload) {
            imageUpload.style.display = (imageCount >= maxImages) ? 'none' : 'block';
        }
        
        // Actualizar total forms
        document.getElementById('id_images-TOTAL_FORMS').value = newImageIndex;
    }
    
    // Marcar imagen para eliminación
    window.markImageForDeletion = function(index) {
        const deleteCheckbox = document.getElementById(`id_images-${index}-DELETE`);
        if (deleteCheckbox) {
            deleteCheckbox.checked = true;
            document.getElementById(`image-preview-${index}`).style.display = 'none';
            imageCount--;
            updateImageCount();
        }
    };
    
    // Marcar proveedor para eliminación
    window.markProviderForDeletion = function(index) {
        const deleteCheckbox = document.getElementById(`id_providers-${index}-DELETE`);
        if (deleteCheckbox) {
            deleteCheckbox.checked = true;
            document.getElementById(`provider-card-${index}`).style.display = 'none';
            providerCount--;
            
            // Actualizar botón de añadir proveedor
            if (providerCount < maxProviders) {
                addProviderBtn.style.display = 'block';
            }
        }
    };
    
    // Añadir nueva imagen
    if (newImageInput) {
        newImageInput.addEventListener('change', function(e) {
            if (imageCount >= maxImages) return;
            
            const file = e.target.files[0];
            if (!file) return;
            
            // Crear nuevo elemento de imagen
            const template = document.getElementById('new-image-template').innerHTML;
            const newImageHtml = template.replace(/__INDEX__/g, newImageIndex);
            
            // Crear elemento temporal
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newImageHtml;
            const newImageElement = tempDiv.firstElementChild;
            
            // Insertar antes del botón de añadir
            const imageUpload = document.getElementById('image-upload');
            imageContainer.insertBefore(newImageElement, imageUpload);
            
            // Mostrar vista previa
            const previewImg = newImageElement.querySelector('.preview-img');
            previewImg.src = URL.createObjectURL(file);
            
            // Asignar archivo al input
            const fileInput = document.getElementById(`id_images-${newImageIndex}-image`);
            
            // Crear DataTransfer y añadir archivo
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            // Incrementar contadores
            imageCount++;
            newImageIndex++;
            
            // Actualizar contador
            updateImageCount();
            
            // Resetear input
            e.target.value = '';
        });
    }
    
    // Añadir nuevo proveedor
    if (addProviderBtn) {
        addProviderBtn.addEventListener('click', function() {
            if (providerCount >= maxProviders) return;
            
            // Crear nuevo elemento de proveedor
            const template = document.getElementById('new-provider-template').innerHTML;
            const newProviderHtml = template.replace(/__INDEX__/g, newProviderIndex);
            
            // Crear elemento temporal
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newProviderHtml;
            const newProviderElement = tempDiv.firstElementChild;
            
            // Añadir al contenedor
            providersContainer.appendChild(newProviderElement);
            
            // Incrementar contadores
            providerCount++;
            newProviderIndex++;
            
            // Actualizar management form
            document.getElementById('id_providers-TOTAL_FORMS').value = newProviderIndex;
            
            // Ocultar botón si se alcanza el máximo
            if (providerCount >= maxProviders) {
                addProviderBtn.style.display = 'none';
            }
        });
    }
    
    // Manejar selección de imagen principal
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('primary-radio')) {
            // Desmarcar todos los campos is_primary
            const primaryInputs = document.querySelectorAll('[name$="-is_primary"]');
            primaryInputs.forEach(input => {
                input.value = "false";
            });
            
            // Marcar el seleccionado como principal
            const index = e.target.closest('.image-preview').id.split('-').pop();
            const primaryInput = document.getElementById(`id_images-${index}-is_primary`);
            if (primaryInput) {
                primaryInput.value = "true";
            }
        }
    });
    
    // Validar formulario antes de enviar
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            // Verificar que al menos un proveedor no esté marcado para eliminación
            let hasValidProvider = false;
            for (let i = 0; i < newProviderIndex; i++) {
                const deleteCheckbox = document.getElementById(`id_providers-${i}-DELETE`);
                const supplierSelect = document.getElementById(`id_providers-${i}-supplier`);
                
                if (deleteCheckbox && !deleteCheckbox.checked && 
                    supplierSelect && supplierSelect.value) {
                    hasValidProvider = true;
                    break;
                }
            }
            
            // Si no hay proveedores válidos y hay proveedores en el formulario,
            // marcar el primero como no eliminado
            if (!hasValidProvider && newProviderIndex > 0) {
                const firstDeleteCheckbox = document.getElementById('id_providers-0-DELETE');
                if (firstDeleteCheckbox) {
                    firstDeleteCheckbox.checked = false;
                }
            }
        });
    }
    
    // Inicializar
    updateImageCount();
});