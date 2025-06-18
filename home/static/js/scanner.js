// Variables de estado
let scannerActivo = false;
let scanning = false; 

// Elementos del DOM
const videoElement = document.getElementById('videoElement');
const textScan = document.getElementById('text-scan');
const boxScan = document.querySelector('.box-scan');
const message = document.querySelector('.message');
const img = document.getElementById('bgimg');

// Verificar si `qrcode` está disponible antes de continuar
if (typeof qrcode === 'undefined') {
    console.error('Error: qrcode no está definido. Asegúrate de que el script qrCode.min.js está cargado.');
} else {
    // Canvas para capturar el video
    const canvasElement = document.createElement('canvas');
    canvasElement.id = 'qr-canvas';
    canvasElement.style.display = 'none';
    document.body.appendChild(canvasElement);
    const canvasContext = canvasElement.getContext('2d');

    // Función para actualizar el canvas con el video
    function tick() {
        if (!scanning) return;
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        requestAnimationFrame(tick);
    }

    // Función para intentar decodificar un QR
    function scan() {
        if (!scanning) return;
        try {
            qrcode.decode();
        } catch (e) {
            setTimeout(scan, 300);
        }
    }

    // Callback cuando se detecta un QR
    qrcode.callback = function(resultado) {
        if (resultado) {
            console.log('Código QR detectado:', resultado);
            reproducirSonido();
            detenerScanner();
            sessionStorage.setItem('qrData', resultado);
            location.href = resultado; // Redirigir a la URL con el resultado del QR
        }
    };

    async function iniciarScanner() {
        img.classList.toggle('invisible');
        boxScan.style.display = 'flex';
        message.classList.toggle('invisible');

        const constraints = {
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            videoElement.srcObject = stream;
            scanning = true;
            tick();
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
        img.classList.toggle('invisible');
        message.classList.toggle('invisible');
    }

    function reproducirSonido() {
        const audio = new Audio('../assets/sound/sonido.mp3');
        audio.play().catch(e => console.error('Error de audio:', e));
    }

    document.addEventListener('DOMContentLoaded', async () => {
        try {
            await iniciarScanner(); // Inicia el escáner automáticamente al cargar la página
            textScan.textContent = 'TURN OFF';
        } catch (error) {
            console.error('Error al iniciar el escáner automáticamente:', error);
        }
    });
}