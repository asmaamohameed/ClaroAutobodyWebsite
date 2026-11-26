/**
 * Form spotlight. Any link to #heroForm ("Get my free estimate", the nav
 * pill, service cards) makes the estimate form pop, pulses an orange ring
 * around it and focuses the first field. If the form is already on screen
 * the page does not scroll at all; if it is off screen (lower sections,
 * mobile) the page scrolls to it first. Reduced motion only focuses.
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

    // Is most of the card (60%+) visible below the fixed header?
    function isOnScreen() {
      var r = card.getBoundingClientRect();
      var header = document.getElementById('siteHeader');
      var top = Math.max(r.top, header ? header.offsetHeight : 0);
      var bottom = Math.min(r.bottom, window.innerHeight);
      return (bottom - top) / r.height >= 0.6;
    }

    // Capture phase runs before the smooth-scroll handler on the link,
    // so an on-screen form can skip the scroll entirely.
    document.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('a[href="#heroForm"]');
      if (!link) return;
      if (isOnScreen()) {
        e.preventDefault();
        e.stopPropagation();
        play();
      } else {
        whenScrollStops(play);
      }
    }, true);
  }
};
