/**
 * Before/after sliders.
 * Each .ba holds the "after" photo with the "before" photo clipped on top.
 * A native range input drives the split (--pos), so mouse, touch and
 * keyboard all work. The first time a slider scrolls into view it nudges
 * left and right once to show it can be dragged.
 */
window.Claro = window.Claro || {};

window.Claro.beforeAfter = {
  init: function () {
    var sliders = document.querySelectorAll('.ba');
    if (!sliders.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setPos(el, value) {
      el.style.setProperty('--pos', value + '%');
    }

    function hint(el, range) {
      var frames = [50, 32, 68, 50];
      var duration = 1800;
      var start = null;

      function step(t) {
        if (el.dataset.touched) return;
        if (!start) start = t;
        var p = Math.min((t - start) / duration, 1);
        var seg = p * (frames.length - 1);
        var i = Math.min(Math.floor(seg), frames.length - 2);
        var k = seg - i;
        var ease = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        var value = frames[i] + (frames[i + 1] - frames[i]) * ease;
        setPos(el, value);
        range.value = value;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var observer = !reduce && 'IntersectionObserver' in window
      ? new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            setTimeout(function () {
              hint(entry.target, entry.target.querySelector('.ba__range'));
            }, 400);
          });
        }, { threshold: 0.6 })
      : null;

    sliders.forEach(function (el) {
      var range = el.querySelector('.ba__range');
      if (!range) return;
      setPos(el, range.value);
      range.addEventListener('input', function () {
        el.dataset.touched = '1';
        setPos(el, range.value);
      });
      range.addEventListener('pointerdown', function () { el.dataset.touched = '1'; });
      if (observer) observer.observe(el);
    });
  }
};
