let productosData = [];

// ── Cargar productos ──────────────────────────────────────────
fetch('productos.json')
    .then(r => r.json())
    .then(data => {
        productosData = data;
        cargarCategorias(data);
        mostrarProductos(data);
    })
    .catch(err => console.error('Error cargando productos:', err));

// ── Categorías ────────────────────────────────────────────────
function cargarCategorias(productos) {
    const unicas = [...new Set(productos.map(p => p.categoria))];
    const lista  = document.getElementById('categorias-lista');

    lista.innerHTML = '<li><a href="#" data-categoria="todos" class="activo">Todos</a></li>';

    unicas.forEach(cat => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" data-categoria="${cat}">${cat}</a>`;
        lista.appendChild(li);
    });

    lista.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            lista.querySelectorAll('a').forEach(x => x.classList.remove('activo'));
            a.classList.add('activo');
            const sel = a.dataset.categoria;
            mostrarProductos(sel === 'todos' ? productosData : productosData.filter(p => p.categoria === sel));
            // Cerrar sidebar en mobile al seleccionar categoría
            cerrarSidebar();
        });
    });
}

// ── Mostrar productos ─────────────────────────────────────────
function mostrarProductos(productos) {
    const grid = document.getElementById('productos-grid');
    if (!grid) return;

    grid.innerHTML = '';

    productos.forEach((prod, i) => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        card.style.animationDelay = `${i * 60}ms`;

        const mensajeWA  = encodeURIComponent(`Hola, quiero pedir: ${prod.nombre} — $${prod.precio.toLocaleString()}. ¿Me puedes dar más información?`);
        const urlWA      = `https://wa.me/5356096986?text=${mensajeWA}`;

        // Imagen o placeholder elegante
        const imagenHTML = prod.imagen && prod.imagen !== '' && !prod.imagen.includes('TU_ID')
            ? `<img class="producto-img" src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">`
            : `<div class="img-placeholder">
                    <span class="ph-star">✦</span>
                    <span class="ph-label">Detalles que Enamoran</span>
               </div>`;

        card.innerHTML = `
            <div class="producto-img-wrap">
                ${imagenHTML}
                <span class="badge-categoria">${prod.categoria}</span>
            </div>
            <div class="producto-info">
                <div class="producto-nombre">${prod.nombre}</div>
                <div class="producto-descripcion">${prod.descripcion || ''}</div>
                <div class="card-divider"></div>
                <div class="producto-precio">$${prod.precio.toLocaleString()}</div>
            </div>
        `;

        // Clic en la card abre WhatsApp
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => window.open(urlWA, '_blank'));

        grid.appendChild(card);
    });
}

// ── Sidebar mobile ────────────────────────────────────────────
const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('overlay');
const btnOpen   = document.getElementById('menu-toggle');
const btnClose  = document.getElementById('sidebar-close');

function abrirSidebar() {
    sidebar.classList.add('abierto');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarSidebar() {
    sidebar.classList.remove('abierto');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

btnOpen?.addEventListener('click',  abrirSidebar);
btnClose?.addEventListener('click', cerrarSidebar);
overlay?.addEventListener('click',  cerrarSidebar);

// Cerrar con Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarSidebar();
});
