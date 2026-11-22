/**
 * Bento gallery + lightbox.
 * Renders tiles from Claro.galleryData into #galleryGrid and drives the
 * #lightbox viewer (prev/next, thumbnails, keyboard, swipe).
 */
window.Claro = window.Claro || {};

window.Claro.gallery = (function () {
  var items = [];
  var current = 0;
  var lastFocus = null;
  var el = {};

  function srcFor(item, width) {
    if (item.src) return item.src;
    return window.Claro.galleryData.googleBase + item.id + '=w' + width + '-k-no';
  }

  function shapeOf(item) {
    return item.size === 'big' ? 'big' : 'tall';
  }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function markFailed(img, holder) {
    holder.classList.add('is-failed');
    img.removeAttribute('src');
  }

  function buildTile(item, index) {
    var tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'bento__tile bento__tile--' + shapeOf(item) + (item.featured ? ' bento__tile--featured' : '') + ' reveal';
    tile.setAttribute('role', 'listitem');
    tile.setAttribute('aria-label', 'Open photo ' + (index + 1) + ' of ' + items.length);
    tile.dataset.index = index;

    var img = document.createElement('img');
    img.alt = item.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.addEventListener('error', function () { markFailed(img, tile); });
    img.src = srcFor(item, item.featured ? 1600 : 900);

    tile.innerHTML =
      '<span class="bento__num">' + pad(index + 1) + '</span>' +
      '<span class="bento__zoom"><i class="ico"><svg aria-hidden="true"><use href="#i-zoom-in"/></svg></i></span>' +
      (item.featured ? '<span class="bento__caption"><b>Inside Claro Auto Body</b>Real photos from our NE Portland shop</span>' : '');
    tile.insertBefore(img, tile.firstChild);
    tile.addEventListener('click', function () { open(index); });
    return tile;
  }

  function buildThumbs() {
    items.forEach(function (item, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lightbox__thumb';
      b.setAttribute('aria-label', 'Show photo ' + (i + 1));
      var img = document.createElement('img');
      img.alt = '';
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      img.addEventListener('error', function () { b.classList.add('is-failed'); });
      img.src = srcFor(item, 200);
      b.appendChild(img);
      b.addEventListener('click', function () { show(i); });
      el.thumbs.appendChild(b);
    });
  }

  function show(index) {
    current = (index + items.length) % items.length;
    var item = items[current];
    el.img.classList.add('is-changing');
    el.img.onload = function () { el.img.classList.remove('is-changing'); };
    el.img.onerror = function () { el.img.classList.remove('is-changing'); };
    el.img.src = srcFor(item, 2000);
    el.img.alt = item.alt;
    el.caption.textContent = item.alt;
    el.count.textContent = (current + 1) + ' / ' + items.length;
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
    var data = window.Claro.galleryData;
    var grid = document.getElementById('galleryGrid');
    if (!data || !grid) return;

    items = data.items.map(function (item, i) {
      item.alt = item.alt || 'Claro Auto Body, photo ' + (i + 1) + ' of ' + data.items.length;
      return item;
    });

    el = {
      box: document.getElementById('lightbox'),
      stage: document.getElementById('lbStage'),
      img: document.getElementById('lbImg'),
      caption: document.getElementById('lbCaption'),
      count: document.getElementById('lbCount'),
      thumbs: document.getElementById('lbThumbs'),
      close: document.getElementById('lbClose')
    };

    var frag = document.createDocumentFragment();
    items.forEach(function (item, i) { frag.appendChild(buildTile(item, i)); });
    grid.appendChild(frag);
    buildThumbs();

    document.querySelectorAll('[data-gallery-count]').forEach(function (n) { n.textContent = items.length; });
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
