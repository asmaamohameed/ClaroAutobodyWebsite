/**
 * Gallery lightbox.
 * The photo tiles live in index.html (so search engines see them). This
 * module reads those tiles and adds the viewer: prev/next, counter,
 * thumbnails, keyboard and swipe. To add a photo, copy one <li> in
 * #galleryGrid and keep the big, tall, tall / tall, big, tall rhythm.
 */
window.Claro = window.Claro || {};

window.Claro.gallery = (function () {
  var slides = [];
  var current = 0;
  var lastFocus = null;
  var el = {};

  function markFailed(tile, img) {
    tile.classList.add('is-failed');
    img.removeAttribute('src');
  }

  function readTiles(grid) {
    return Array.prototype.map.call(grid.querySelectorAll('.bento__tile'), function (tile, i) {
      var img = tile.querySelector('img');
      img.addEventListener('error', function () { markFailed(tile, img); });
      if (img.complete && img.naturalWidth === 0) markFailed(tile, img);
      tile.addEventListener('click', function () {
        if (!tile.classList.contains('is-failed')) open(i);
      });
      var src = img.getAttribute('src') || '';
      return { full: tile.getAttribute('data-full'), thumb: src.replace(/=w\d+-k-no$/, '=w200-k-no'), alt: img.alt };
    });
  }

  function buildThumbs() {
    slides.forEach(function (slide, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lightbox__thumb';
      b.setAttribute('aria-label', 'Show photo ' + (i + 1));
      var img = document.createElement('img');
      img.alt = '';
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      img.addEventListener('error', function () { b.classList.add('is-failed'); });
      if (slide.thumb) img.src = slide.thumb;
      b.appendChild(img);
      b.addEventListener('click', function () { show(i); });
      el.thumbs.appendChild(b);
    });
  }

  function show(index) {
    current = (index + slides.length) % slides.length;
    var slide = slides[current];
    el.img.classList.add('is-changing');
    el.img.onload = el.img.onerror = function () { el.img.classList.remove('is-changing'); };
    el.img.src = slide.full;
    el.img.alt = slide.alt;
    el.caption.textContent = slide.alt;
    el.count.textContent = (current + 1) + ' / ' + slides.length;
    Array.prototype.forEach.call(el.thumbs.children, function (t, i) {
      var active = i === current;
      t.classList.toggle('is-active', active);
      if (active) t.scrollIntoView({ block: 'nearest', inline: 'center' });
    });
  }

  function open(index) {
    lastFocus = document.activeElement;
    el.box.hidden = false;
    document.body.classList.add('no-scroll');
    show(index);
    requestAnimationFrame(function () { el.box.classList.add('is-open'); });
    el.close.focus();
  }

  function close() {
    el.box.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(function () { el.box.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus();
  }

  function onKey(e) {
    if (el.box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  }

  function enableSwipe() {
    var startX = 0;
    el.stage.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    el.stage.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    });
  }

  function init() {
    var grid = document.getElementById('galleryGrid');
    el = {
      box: document.getElementById('lightbox'),
      stage: document.getElementById('lbStage'),
      img: document.getElementById('lbImg'),
      caption: document.getElementById('lbCaption'),
      count: document.getElementById('lbCount'),
      thumbs: document.getElementById('lbThumbs'),
      close: document.getElementById('lbClose')
    };
    if (!grid || !el.box) return;

    slides = readTiles(grid);
    if (!slides.length) return;
    buildThumbs();

    document.querySelectorAll('[data-gallery-open]').forEach(function (b) {
      b.addEventListener('click', function () { open(Number(b.getAttribute('data-gallery-open')) || 0); });
    });
    el.close.addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
    document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });
    el.box.addEventListener('click', function (e) { if (e.target === el.box || e.target === el.stage) close(); });
    document.addEventListener('keydown', onKey);
    enableSwipe();
  }

  return { init: init };
})();
