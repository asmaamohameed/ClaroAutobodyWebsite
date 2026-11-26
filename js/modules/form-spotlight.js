/**
 * Form spotlight. Any link to #heroForm ("Get my free estimate", the nav
 * pill, service cards) scrolls to the estimate form; once the scroll stops,
 * the card pops, an orange ring pulses around it and the first field gets
 * focus. With reduced motion it only focuses the field.
 */
window.Claro = window.Claro || {};

window.Claro.formSpotlight = {
  DURATION: 2300,

  init: function () {
    var card = document.getElementById('heroForm');
    if (!card) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var duration = this.DURATION;
    var timer = null;

    function focusFirstField() {
      var field = card.querySelector('input:not([type="hidden"]):not([name="bot-field"])');
      if (field) field.focus({ preventScroll: true });
    }

    function play() {
      if (!reduce) {
        card.classList.remove('is-spotlight');
        void card.offsetWidth; // restart the animation on repeat clicks
        card.classList.add('is-spotlight');
        clearTimeout(timer);
        timer = setTimeout(function () { card.classList.remove('is-spotlight'); }, duration);
      }
      setTimeout(focusFirstField, reduce ? 0 : 350);
    }

    // Wait until the smooth scroll has stopped (or 1.5s at most).
    function whenScrollStops(callback) {
      var lastY = -1;
      var stillFrames = 0;
      var started = Date.now();
      (function check() {
        var y = window.pageYOffset;
        stillFrames = y === lastY ? stillFrames + 1 : 0;
        lastY = y;
        if (stillFrames > 4 || Date.now() - started > 1500) return callback();
        requestAnimationFrame(check);
      })();
    }

    document.querySelectorAll('a[href="#heroForm"]').forEach(function (link) {
      link.addEventListener('click', function () { whenScrollStops(play); });
    });
  }
};
