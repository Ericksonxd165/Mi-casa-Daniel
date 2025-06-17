const allHoverImages = document.querySelectorAll('.hover-container div img');
const imgContainer = document.querySelector('.img-container');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
const providerSelect = document.getElementById('provider-select');
const modal = document.getElementById('provider-modal');
const closeModal = modal.querySelector('.close');
const modalCards = modal.querySelectorAll('.modal-scroll .card-green, .modal-scroll .card-blue, .modal-scroll .card-red');



let currentIndex = 0; 

// Open modal when clicking on "Select Provider"
providerSelect.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Close modal when clicking on "X" or outside the modal
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Handle provider selection
modalCards.forEach((card) => {
  card.addEventListener('click', () => {
    alert(`You selected: ${card.querySelector('.tip').textContent.trim()}`);
    modal.style.display = 'none';
  });
});



window.addEventListener('DOMContentLoaded', () => {
    allHoverImages[0].parentElement.classList.add('active');
    imgContainer.querySelector('img').src = allHoverImages[0].src;
});

// Handle hover over images
allHoverImages.forEach((image, index) => {
    image.addEventListener('mouseover', () => {
        imgContainer.querySelector('img').src = image.src;
        resetActiveImg();
        image.parentElement.classList.add('active');
        currentIndex = index; // Update the current index
    });
});

// Handle left arrow click
leftArrow.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + allHoverImages.length) % allHoverImages.length; // Loop back to the last image
    updateActiveImage();
});

// Handle right arrow click
rightArrow.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % allHoverImages.length; // Loop back to the first image
    updateActiveImage();
});

// Update the active image based on the current index
function updateActiveImage() {
    resetActiveImg();
    const activeImage = allHoverImages[currentIndex];
    imgContainer.querySelector('img').src = activeImage.src;
    activeImage.parentElement.classList.add('active');
}

// Reset all images to remove the active class
function resetActiveImg() {
    allHoverImages.forEach((img) => {
        img.parentElement.classList.remove('active');
    });
}

// Star Rating System
document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;
    
    // Function to update stars appearance
    function updateStars(rating, isHover = false) {
        stars.forEach((star, index) => {
            const starValue = parseInt(star.dataset.value);
            
            // If we're hovering or have selected this star or a higher one
            if (starValue <= rating) {
                star.innerHTML = '<i class="fas fa-star" style="color: #FFD700;"></i>'; // Solid yellow star
            } else {
                star.innerHTML = '<i class="far fa-star"></i>'; // Empty star
            }
        });
    }
    
    // Add event listeners to each star
    stars.forEach(star => {
        const starValue = parseInt(star.dataset.value);
        
        // Hover effects
        star.addEventListener('mouseenter', () => {
            updateStars(starValue, true);
        });
        
        // When mouse leaves the rating area, restore to selected rating
        star.parentElement.addEventListener('mouseleave', () => {
            updateStars(selectedRating);
        });
        
        // Click to set rating
        star.addEventListener('click', () => {
            selectedRating = starValue;
            updateStars(selectedRating);
            
            // You can add AJAX call here to save the rating to your backend
            console.log(`User rated: ${selectedRating} stars`);
        });
    });
});

// Image Carousel Logic
document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.getElementById('main-product-image');
    const leftArrow = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');
    const thumbnails = document.querySelectorAll('.hover-container div img');
    
    let currentImageIndex = 0;
    const imageUrls = Array.from(thumbnails).map(img => img.src);
    
    // Function to change main image
    window.changeMainImage = function(url) {
        mainImage.src = url;
        // Update current index
        currentImageIndex = imageUrls.indexOf(url);
        
        // Update active thumbnail
        document.querySelectorAll('.hover-container div').forEach((div, index) => {
            if (index === currentImageIndex) {
                div.classList.add('active');
            } else {
                div.classList.remove('active');
            }
        });
    };
    
    // Set first thumbnail as active by default
    if (thumbnails.length > 0) {
        thumbnails[0].parentElement.classList.add('active');
    }
    
    // Navigate to previous image
    leftArrow.addEventListener('click', function() {
        if (imageUrls.length === 0) return;
        
        currentImageIndex = (currentImageIndex - 1 + imageUrls.length) % imageUrls.length;
        mainImage.src = imageUrls[currentImageIndex];
        
        // Update active thumbnail
        document.querySelectorAll('.hover-container div').forEach((div, index) => {
            if (index === currentImageIndex) {
                div.classList.add('active');
            } else {
                div.classList.remove('active');
            }
        });
    });
    
    // Navigate to next image
    rightArrow.addEventListener('click', function() {
        if (imageUrls.length === 0) return;
        
        currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
        mainImage.src = imageUrls[currentImageIndex];
        
        // Update active thumbnail
        document.querySelectorAll('.hover-container div').forEach((div, index) => {
            if (index === currentImageIndex) {
                div.classList.add('active');
            } else {
                div.classList.remove('active');
            }
        });
    });
    
    // Modal functionality
    const providerSelectBtn = document.getElementById('provider-select');
    const providerModal = document.getElementById('provider-modal');
    const closeBtn = document.querySelector('.close');
    
    if (providerSelectBtn) {
        providerSelectBtn.addEventListener('click', function() {
            providerModal.style.display = 'block';
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            providerModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === providerModal) {
            providerModal.style.display = 'none';
        }
    });
    
    // Add click event to provider selection buttons
    const selectProviderBtns = document.querySelectorAll('.select-provider-btn');
    selectProviderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const price = this.getAttribute('data-price');
            const supplier = this.getAttribute('data-supplier');
            
            console.log(`Selected provider: ${supplier} with price: $${price}`);
            // Here you can add logic to handle the provider selection
            
            // Close the modal after selection
            providerModal.style.display = 'none';
        });
    });
});

// Star Rating System y otras funciones existentes...

// Añadir esta función para centrar las miniaturas
document.addEventListener('DOMContentLoaded', function() {
    // Función para ajustar el centrado de las miniaturas
    function adjustThumbnailsAlignment() {
        const container = document.querySelector('.hover-container');
        const thumbnails = container.querySelectorAll('div');
        const isMobile = window.innerWidth <= 576;
        
        if (isMobile) {
            // Si hay menos de 5 miniaturas en móvil, centramos con CSS
            if (thumbnails.length < 5) {
                container.style.justifyContent = 'center';
                
                // Calculamos el ancho total de las miniaturas + gaps
                const thumbnailWidth = 80; // Ancho de miniatura en móvil
                const gap = 12; // Espacio entre miniaturas
                const totalWidth = (thumbnailWidth * thumbnails.length) + (gap * (thumbnails.length - 1));
                
                // Si el ancho total es menor que el contenedor, centramos
                if (totalWidth < container.clientWidth) {
                    // Añadimos padding izquierdo y derecho para centrar
                    const padding = (container.clientWidth - totalWidth) / 2;
                    container.style.paddingLeft = `${padding}px`;
                    container.style.paddingRight = `${padding}px`;
                } else {
                    // Si no caben todas, usamos el padding predeterminado
                    container.style.paddingLeft = '2px';
                    container.style.paddingRight = '2px';
                }
            } else {
                // Si hay 5 o más, dejamos el padding predeterminado
                container.style.justifyContent = 'flex-start';
                container.style.paddingLeft = '2px';
                container.style.paddingRight = '2px';
            }
        } else {
            // En escritorio siempre centramos
            container.style.justifyContent = 'center';
            container.style.paddingLeft = '0';
            container.style.paddingRight = '0';
        }
    }
    
    // Ejecutar al cargar la página
    adjustThumbnailsAlignment();
    
    // Ejecutar cuando cambie el tamaño de la ventana
    window.addEventListener('resize', adjustThumbnailsAlignment);
    
    // Ejecutar cuando se añadan o eliminen miniaturas (si es aplicable)
    // Esto dependerá de cómo se manejen las miniaturas en tu aplicación
});

// Resto del código JavaScript existente...