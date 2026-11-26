/**
 * Reviews carousel. A scroll-snap track (so swipe works natively) that
 * auto-advances every 5 seconds and loops. Arrows and dots for manual
 * control. Autoplay pauses on hover, focus, touch, when the tab is hidden
 * or the carousel is off screen, and is off for reduced motion.
 */
window.Claro = window.Claro || {};

window.Claro.reviews = {
  INTERVAL: 5000,

  init: function () {
    var track = document.getElementById('reviewsTrack');
    var dotsBox = document.getElementById('reviewsDots');
    if (!track || !dotsBox) return;

    var cards = track.children;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var interval = this.INTERVAL;
    var timer = null;
    var paused = false;
    var onScreen = false;

    function step() {
      if (cards.length < 2) return track.clientWidth;
      return cards[1].offsetLeft - cards[0].offsetLeft;
    }
    function pages() {
      return Math.max(1, Math.round((track.scrollWidth - track.clientWidth) / step()) + 1);
    }
    function current() {
      return Math.round(track.scrollLeft / step());
    }
    function goTo(i) {
      var count = pages();
      var target = ((i % count) + count) % count; // loop both ways
      track.scrollTo({ left: target * step(), behavior: reduce ? 'auto' : 'smooth' });
    }

    function buildDots() {
      dotsBox.innerHTML = '';
      for (var i = 0; i < pages(); i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'reviews__dot';
        dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
        dot.addEventListener('click', (function (n) { return function () { goTo(n); restart(); }; })(i));
        dotsBox.appendChild(dot);
      }
      updateDots();
    }
    function updateDots() {
      var active = current();
      Array.prototype.forEach.call(dotsBox.children, function (d, i) {
        d.classList.toggle('is-active', i === active);
      });
    }

    function tick() { if (!paused && onScreen && !document.hidden) goTo(current() + 1); }
    function restart() {
      clearInterval(timer);
      if (!reduce) timer = setInterval(tick, interval);
    }

    document.getElementById('reviewsPrev').addEventListener('click', function () { goTo(current() - 1); restart(); });
    document.getElementById('reviewsNext').addEventListener('click', function () { goTo(current() + 1); restart(); });

    var scrollTimer = null;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateDots, 80);
    }, { passive: true });

    var box = track.parentElement;
    box.addEventListener('mouseenter', function () { paused = true; });
    box.addEventListener('mouseleave', function () { paused = false; });
    box.addEventListener('focusin', function () { paused = true; });
    box.addEventListener('focusout', function () { paused = false; });
    track.addEventListener('touchstart', function () { paused = true; restart(); }, { passive: true });
    track.addEventListener('touchend', function () { paused = false; }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
      }, { threshold: 0.4 }).observe(box);
    } else {
      onScreen = true;
    }

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildDots, 150);
    });

    buildDots();
    restart();
  }
};
