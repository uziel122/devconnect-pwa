// js/app.js - Renderizado Dinámico de Contenido (CSR)

const postsDeEjemplo = [
    {
        autor: "Ana Martínez",
        tiempo: "Hace 5 minutos",
        contenido: "¡Logré configurar mi Service Worker con estrategia Cache First! 🚀",
        avatar: "A"
    },
    {
        autor: "Carlos López",
        tiempo: "Hace 15 minutos",
        contenido: "Probando el renderizado dinámico en el cliente para el App Shell de DevConnect.",
        avatar: "C"
    },
    {
        autor: "Uziel Herrera",
        tiempo: "Hace 25 minutos",
        contenido: "Validando la Splash Screen y la instalación de la PWA en dispositivos móviles. Todo funcionando al 100%.",
        avatar: "U"
    }
];

function renderizarFeed(posts) {
    const contenedorFeed = document.getElementById('feed');
    if (!contenedorFeed) return;

    contenedorFeed.innerHTML = '';

    posts.forEach(post => {
        const tarjetaHTML = `
            <article class="bg-white p-4 rounded-lg shadow mb-4 animate-fade-in">
                <div class="flex items-center mb-3">
                    <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mr-3">
                        ${post.avatar}
                    </div>
                    <div>
                        <h2 class="font-bold text-gray-800">${post.autor}</h2>
                        <p class="text-xs text-gray-500">${post.tiempo}</p>
                    </div>
                </div>
                <p class="text-gray-700">${post.contenido}</p>
            </article>
        `;
        contenedorFeed.innerHTML += tarjetaHTML;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarFeed(postsDeEjemplo);
});