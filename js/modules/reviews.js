/**
 * Reviews loop. The cards are duplicated once and the track slides left
 * forever at a steady speed (CSS animation), so it never jumps back.
 * Pauses on hover or keyboard focus; reduced motion leaves a static,
 * swipeable row instead.
 */
window.Claro = window.Claro || {};

window.Claro.reviews = {
  SECONDS_PER_CARD: 9,

  init: function () {
    var track = document.getElementById('reviewsTrack');
    if (!track || !track.children.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var cards = Array.prototype.slice.call(track.children);
    cards.forEach(function (card) {
      var copy = card.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelectorAll('a, button').forEach(function (el) { el.tabIndex = -1; });
      track.appendChild(copy);
    });

    track.style.setProperty('--duration', cards.length * this.SECONDS_PER_CARD + 's');
    track.classList.add('is-looping');
  }
};
