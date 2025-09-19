"use strict";

function setYear() {
    var yearEls = document.querySelectorAll('#year');
    var year = new Date().getFullYear();
    yearEls.forEach(function(el){ el.textContent = String(year); });
}

function readJson(url) {
    return fetch(url, { cache: 'no-store' }).then(function(res){
        if (!res.ok) throw new Error('Failed to load ' + url);
        return res.json();
    });
}

function currency(n) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR' }).format(n);
}

function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildProductUrl(product) {
    return 'product.html?id=' + encodeURIComponent(product.id);
}

function renderGrid(products) {
    var grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = products.map(function(p){
        var imageSrc = (p.image || '').match(/^https?:\/\//) ? p.image : ('assets/images/' + p.image);
        return (
            '<article class="card">\n' +
                '<a class="card-link" href="' + buildProductUrl(p) + '">\n' +
                    '<img alt="' + p.name + ' image" class="card-media" src="' + imageSrc + '" loading="lazy">\n' +
                    '<div class="card-body">\n' +
                        '<h3 class="card-name">' + p.name + '</h3>\n' +
                        '<p class="card-fragrance">' + p.fragrance + '</p>\n' +
                        '<p class="card-price">' + currency(p.price) + '</p>\n' +
                    '</div>\n' +
                '</a>\n' +
            '</article>'
        );
    }).join('');
}

function renderDetail(product) {
    var el = document.getElementById('product-detail');
    if (!el) return;
    var imageSrc = (product.image || '').match(/^https?:\/\//) ? product.image : ('assets/images/' + product.image);
    el.innerHTML = '' +
        '<div>' +
            '<img class="detail-media" src="' + imageSrc + '" alt="' + product.name + ' image" loading="lazy">' +
        '</div>' +
        '<div>' +
            '<h1 class="detail-title">' + product.name + '</h1>' +
            '<p class="detail-fragrance">Fragrance: ' + product.fragrance + '</p>' +
            '<p class="detail-price">' + currency(product.price) + '</p>' +
            '<p class="detail-desc">' + product.description + '</p>' +
            '<div class="meta">' +
                '<div class="meta-row"><span>Wax</span><span>' + (product.wax || 'Soy blend') + '</span></div>' +
                '<div class="meta-row"><span>Wick</span><span>' + (product.wick || 'Cotton') + '</span></div>' +
                '<div class="meta-row"><span>Size</span><span>' + (product.size || '8 oz') + '</span></div>' +
                '<div class="meta-row"><span>Burn Time</span><span>' + (product.burnTime || '40+ hrs') + '</span></div>' +
            '</div>' +
        '</div>';
}

function onReady() {
    setYear();
    readJson('data/products.json').then(function(products){
        // Normalize ids and slugs if absent
        products.forEach(function(p){
            if (!p.id) p.id = slugify(p.name);
        });

        var grid = document.getElementById('product-grid');
        var detail = document.getElementById('product-detail');

        if (grid) {
            renderGrid(products);
        }
        if (detail) {
            var id = getQueryParam('id');
            var product = products.find(function(p){ return String(p.id) === String(id); });
            if (!product) {
                detail.innerHTML = '<p style="color:#c33">Product not found.</p>';
                return;
            }
            renderDetail(product);
        }
    }).catch(function(err){
        var grid = document.getElementById('product-grid') || document.getElementById('product-detail');
        if (grid) grid.innerHTML = '<p style="color:#c33">' + err.message + '</p>';
        // eslint-disable-next-line no-console
        console.error(err);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
} else {
    onReady();
}

