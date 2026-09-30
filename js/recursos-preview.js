/* ================================================================
   AI Safety Mexico — Resumen de recursos para la portada
   Cuenta las entradas de js/recursos-data.js para que las cifras
   mostradas en index.html nunca queden desfasadas del catálogo.
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

    var contenedor = document.getElementById('resource-preview');
    var datos = window.RECURSOS_AISMX;
    if (!contenedor || !datos) return;

    var recursos = datos.recursos;

    var resumen = [
        { cifra: recursos.length, etiqueta: 'recursos verificados' },
        { cifra: recursos.filter(function (r) { return r.tipo === 'Curso'; }).length, etiqueta: 'cursos y currículos' },
        { cifra: recursos.filter(function (r) { return r.tipo === 'Programa de investigación' || r.tipo === 'Fellowship de política'; }).length, etiqueta: 'programas y fellowships' },
        { cifra: recursos.filter(function (r) { return r.latam === true; }).length, etiqueta: 'relevantes para América Latina' }
    ];

    contenedor.innerHTML = resumen.map(function (item) {
        return '<div class="resource-preview-item">' +
            '<span class="resource-preview-count">' + item.cifra + '</span>' +
            '<span class="resource-preview-label">' + item.etiqueta + '</span>' +
        '</div>';
    }).join('');
});
