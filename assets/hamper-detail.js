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

function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function currency(n) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
}

function renderDetail(hamper) {
    var el = document.getElementById('hamper-detail');
    if (!el) return;
    var imageSrc = (hamper.image || '').match(/^https?:\/\//) ? hamper.image : ('assets/images/' + hamper.image);
    el.innerHTML =
        '<div>' +
            '<img class="detail-media" src="' + imageSrc + '" alt="' + hamper.name + ' image" loading="lazy">' +
        '</div>' +
        '<div>' +
            '<h1 class="detail-title">' + hamper.name + '</h1>' +
            '<p class="detail-fragrance"><strong>Fragrance:</strong> ' + hamper.fragrance + '</p>' +
            '<p class="detail-price">' + currency(hamper.price) + '</p>' +
            '<p class="detail-desc">' + hamper.description + '</p>' +
        '</div>';
}

function onReady() {
    setYear();
    readJson('data/hampers.json').then(function(hampers){
        var id = getQueryParam('id');
        var hamper = hampers.find(function(h){ return String(h.id) === String(id); });
        var detail = document.getElementById('hamper-detail');
        if (!hamper) {
            detail.innerHTML = '<p style="color:#c33">Hamper not found.</p>';
            return;
        }
        renderDetail(hamper);
    }).catch(function(err){
        var detail = document.getElementById('hamper-detail');
        if (detail) detail.innerHTML = '<p style="color:#c33">' + err.message + '</p>';
        console.error(err);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
} else {
    onReady();
}
