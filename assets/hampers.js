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
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
}

function buildHamperUrl(hamper) {
    return 'hamper-detail.html?id=' + encodeURIComponent(hamper.id);
}

function renderHamperGrid(hampers) {
    var grid = document.getElementById('hamper-grid');
    if (!grid) return;
    grid.innerHTML = hampers.map(function(h){
        var imageSrc = (h.image || '').match(/^https?:\/\//) ? h.image : ('assets/images/' + h.image);
        return (
            '<article class="card">\n' +
                '<a class="card-link" href="' + buildHamperUrl(h) + '">\n' +
                    '<img alt="' + h.name + ' image" class="card-media" src="' + imageSrc + '" loading="lazy">\n' +
                    '<div class="card-body">\n' +
                        '<h3 class="card-name">' + h.name + '</h3>\n' +
                        '<p class="card-fragrance">' + h.fragrance + '</p>\n' +
                        '<p class="card-price">' + currency(h.price) + '</p>\n' +
                        '<p class="card-desc">' + h.description + '</p>\n' +
                    '</div>\n' +
                '</a>\n' +
            '</article>'
        );
    }).join('');
}

function onReady() {
    setYear();
    readJson('data/hampers.json').then(function(hampers){
        renderHamperGrid(hampers);
    }).catch(function(err){
        var grid = document.getElementById('hamper-grid');
        if (grid) grid.innerHTML = '<p style="color:#c33">' + err.message + '</p>';
        console.error(err);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
} else {
    onReady();
}
