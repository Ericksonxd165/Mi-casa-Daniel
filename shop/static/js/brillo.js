document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname;
    
    const pages = {
        "/carrito": "cart",      
        "/shop/": "store",     
        "/home/": "home",         
        "/scanner": "favorite",
        "/profile/": "notifications" 
    };

    Object.entries(pages).forEach(([path, id]) => {
        if (currentPath.includes(path)) {
            const radio = document.getElementById(id);
            if (radio) radio.checked = true;
        }
    });
});