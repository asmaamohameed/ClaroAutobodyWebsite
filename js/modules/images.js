/**
 * Image fallbacks for photos inside .imgwrap: if a photo fails, try its
 * data-fallback once, then hide it so the illustrated background shows.
 */
window.Claro = window.Claro || {};

window.Claro.images = {
  init: function () {
    document.querySelectorAll('.imgwrap img').forEach(function (img) {
      function onError() {
        var fallback = img.getAttribute('data-fallback');
        if (fallback && img.src !== fallback) {
          img.removeAttribute('data-fallback');
          img.src = fallback;
        } else {
          img.hidden = true;
        }
      }
      img.addEventListener('error', onError);
      if (img.complete && img.naturalWidth === 0) onError();
    });
  }
};
