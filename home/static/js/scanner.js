// Se elimina el uso de QrScanner
// Variables de estado
let scannerActivo = false;
let scanning = false; // para el bucle de tick/scan

// Elementos del DOM
const videoElement = document.getElementById('videoElement');
const toggleBtn = document.getElementById('toggleScannerBtn');
const textScan = document.getElementById('text-scan');
const resultQr = document.getElementById('result-qr');
const boxScan = document.querySelector('.box-scan');
const message = document.querySelector('.message');

// Se crea un canvas offscreen para capturar el video
const canvasElement = document.createElement('canvas');
canvasElement.id = 'qr-canvas';
canvasElement.style.display = 'none';
document.body.appendChild(canvasElement);
const canvasContext = canvasElement.getContext('2d');

// Función para dibujar el video en el canvas
function tick() {
    if (!scanning) return;
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    requestAnimationFrame(tick);
}

// Función para invocar la lectura del QR
function scan() {
    if (!scanning) return;
    try {
        // qrcode.decode toma la imagen del canvas que debe tener id "qr-canvas"
        qrcode.decode();
    } catch (e) {
        setTimeout(scan, 300);
    }
}

// Callback del plugin (se llama cuando se detecta un QR)
qrcode.callback = function(resultado) {
    if (resultado) {
        console.log('Código QR detectado:', resultado);
        alert(resultado)
        reproducirSonido();
        detenerScanner();
        location.href = 'product.html' 
    }
};

<<<<<<< HEAD
    // Callback cuando se detecta un QR
    qrcode.callback = function(resultado) {
        if (resultado) {
            console.log('Código QR detectado:', resultado);
            alert(resultado);
            reproducirSonido();
            detenerScanner();
            sessionStorage.setItem('qrData', resultado);
            location.href = resultado; // Redirigir a la URL con el resultado del QR
=======
async function iniciarScanner() {
    // Mostrar el contenedor de escaneo
    boxScan.style.display = 'flex';
    message.classList.toggle('invisible');

    // Configuración de la cámara
    const constraints = {
        video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
>>>>>>> parent of a04833c (Merge branch 'feature-branch---Erick' of https://github.com/Rafael-Barrios/china-prototipo into feature-branch---Erick)
        }
    };

    try {
        // Obtener stream de video
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
        // Indica que se inicia el bucle de escaneo
        scanning = true;
        // Inicia la animación para dibujar el video en el canvas
        tick();
        // Comienza a intentar decodificar
        scan();
        scannerActivo = true;
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        alert(`Error: ${error.message}`);
    }
}

async function detenerScanner() {
    scanning = false;
    if (videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }
    scannerActivo = false;
    message.classList.toggle('invisible');

}

function reproducirSonido() {
    const audio = new Audio('../assets/sound/sonido.mp3');
    audio.play().catch(e => console.error('Error de audio:', e));
}

// Función principal
async function toggleScanner() {
    try {
        if (scannerActivo) {
            await detenerScanner();
            textScan.textContent = 'TURN ON';
        } else {
            await iniciarScanner();
            textScan.textContent = 'TURN OFF';
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    toggleBtn.addEventListener('click', toggleScanner);
    // Configuración inicial del contenedor
    boxScan.style.transition = 'all 0.3s ease';
    
    // Solución alternativa para localhost
    if (window.location.protocol !== 'https:') {
        console.warn('Estás en desarrollo local - algunas funciones pueden estar limitadas');
    }
});