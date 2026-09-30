/* ================================================================
   AI Safety Mexico — Directorio de recursos (recursos.html)
   Filtrado por texto, tipo, área y categorías rápidas.
   Los datos viven en js/recursos-data.js
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

    var datos = window.RECURSOS_AISMX;
    var rejilla = document.getElementById('rejilla');
    if (!datos || !rejilla) return;

    var recursos = datos.recursos;
    var buscador = document.getElementById('buscador');
    var filtroTipo = document.getElementById('filtro-tipo');
    var filtroArea = document.getElementById('filtro-area');
    var contador = document.getElementById('contador');
    var contenedorChips = document.getElementById('chips');
    var btnLimpiar = document.getElementById('btn-limpiar');
    var btnJson = document.getElementById('btn-json');

    var TODOS = 'Todos';
    var chipActivo = null;

    // Categorías rápidas: cada una define qué recursos deja pasar
    var CHIPS = [
        { etiqueta: 'En español', filtro: function (r) { return r.idioma === 'es'; } },
        { etiqueta: 'América Latina', filtro: function (r) { return r.latam === true; } },
        { etiqueta: 'Cursos', filtro: function (r) { return r.tipo === 'Curso'; } },
        { etiqueta: 'Investigación técnica', filtro: function (r) { return r.tipo === 'Programa de investigación' || r.area === 'Técnica'; } },
        { etiqueta: 'Gobernanza', filtro: function (r) { return r.area.indexOf('Gobernanza') === 0; } },
        { etiqueta: 'Financiamiento', filtro: function (r) { return r.tipo === 'Financiamiento'; } },
        { etiqueta: 'Comunidad', filtro: function (r) { return r.tipo === 'Comunidad' || r.tipo === 'Organización'; } },
        { etiqueta: 'Para empezar', filtro: function (r) { return r.area === 'General' && (r.tipo === 'Curso' || r.tipo === 'Directorio'); } }
    ];

    function escapar(texto) {
        return String(texto).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function valoresUnicos(campo) {
        var vistos = [];
        recursos.forEach(function (r) {
            if (vistos.indexOf(r[campo]) === -1) vistos.push(r[campo]);
        });
        return vistos.sort(function (a, b) { return a.localeCompare(b, 'es'); });
    }

    function llenarSelect(select, valores) {
        [TODOS].concat(valores).forEach(function (valor) {
            var opcion = document.createElement('option');
            opcion.value = valor;
            opcion.textContent = valor;
            select.appendChild(opcion);
        });
    }

    function construirChips() {
        CHIPS.forEach(function (chip) {
            var boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'chip';
            boton.textContent = chip.etiqueta;
            boton.setAttribute('aria-pressed', 'false');
            boton.addEventListener('click', function () {
                var yaActivo = chipActivo === chip.etiqueta;
                chipActivo = yaActivo ? null : chip.etiqueta;
                contenedorChips.querySelectorAll('.chip').forEach(function (otro) {
                    var activo = !yaActivo && otro === boton;
                    otro.classList.toggle('is-active', activo);
                    otro.setAttribute('aria-pressed', String(activo));
                });
                render();
            });
            contenedorChips.appendChild(boton);
        });
    }

    function pasaChip(recurso) {
        if (!chipActivo) return true;
        var chip = CHIPS.filter(function (c) { return c.etiqueta === chipActivo; })[0];
        return chip ? chip.filtro(recurso) : true;
    }

    function pasaBusqueda(recurso, consulta) {
        if (!consulta) return true;
        var campos = [recurso.titulo, recurso.resumen, recurso.tipo, recurso.area, recurso.formato, recurso.duracion, recurso.etiquetas.join(' ')];
        return campos.join(' ').toLowerCase().indexOf(consulta) !== -1;
    }

    function tarjeta(recurso) {
        var banderas = '';
        if (recurso.idioma === 'es') banderas += '<span class="resource-flag resource-flag--es">Español</span>';
        if (recurso.latam) banderas += '<span class="resource-flag resource-flag--latam">LatAm</span>';

        return '<article class="resource-card">' +
            '<div class="resource-card-top">' +
                '<span class="resource-type">' + escapar(recurso.tipo) + '</span>' +
                '<span class="resource-area">' + escapar(recurso.area) + '</span>' +
                banderas +
            '</div>' +
            '<h3 class="resource-card-title">' +
                '<a href="' + escapar(recurso.enlace) + '" target="_blank" rel="noopener noreferrer">' + escapar(recurso.titulo) + '</a>' +
            '</h3>' +
            '<p class="resource-summary">' + escapar(recurso.resumen) + '</p>' +
            '<div class="resource-meta">' +
                '<span>Formato: <strong>' + escapar(recurso.formato) + '</strong></span>' +
                '<span>Duración: <strong>' + escapar(recurso.duracion) + '</strong></span>' +
            '</div>' +
            '<div class="resource-tags">' +
                recurso.etiquetas.slice(0, 3).map(function (etiqueta) {
                    return '<span class="resource-tag">' + escapar(etiqueta) + '</span>';
                }).join('') +
            '</div>' +
        '</article>';
    }

    function render() {
        var consulta = buscador.value.toLowerCase().trim();
        var tipo = filtroTipo.value;
        var area = filtroArea.value;

        var filtrados = recursos.filter(function (r) {
            return pasaBusqueda(r, consulta) &&
                (tipo === TODOS || r.tipo === tipo) &&
                (area === TODOS || r.area === area) &&
                pasaChip(r);
        });

        if (filtrados.length === 0) {
            rejilla.innerHTML = '<div class="resource-empty">' +
                '<h3>Sin resultados</h3>' +
                '<p>Prueba con otra palabra clave o limpia los filtros. Si crees que falta un recurso, escríbenos a contact@aismx.org.</p>' +
            '</div>';
        } else {
            rejilla.innerHTML = filtrados.map(tarjeta).join('');
        }

        contador.innerHTML = '<strong>' + filtrados.length + '</strong> de ' + recursos.length +
            ' recursos · última verificación de enlaces: ' + escapar(datos.actualizado);
    }

    function limpiar() {
        buscador.value = '';
        filtroTipo.value = TODOS;
        filtroArea.value = TODOS;
        chipActivo = null;
        contenedorChips.querySelectorAll('.chip').forEach(function (chip) {
            chip.classList.remove('is-active');
            chip.setAttribute('aria-pressed', 'false');
        });
        render();
    }

    function descargarJson() {
        var contenido = JSON.stringify(datos, null, 2);
        var blob = new Blob([contenido], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = 'recursos-ai-safety-mexico.json';
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
        URL.revokeObjectURL(url);
    }

    llenarSelect(filtroTipo, valoresUnicos('tipo'));
    llenarSelect(filtroArea, valoresUnicos('area'));
    construirChips();
    render();

    buscador.addEventListener('input', render);
    filtroTipo.addEventListener('change', render);
    filtroArea.addEventListener('change', render);
    if (btnLimpiar) btnLimpiar.addEventListener('click', limpiar);
    if (btnJson) btnJson.addEventListener('click', descargarJson);
});
