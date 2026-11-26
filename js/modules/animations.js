/**
 * Scroll animations with GSAP + ScrollTrigger on native scroll.
 * Content is never left hidden: if motion is reduced, GSAP is missing,
 * or anything throws, every .reveal element is shown immediately.
 */
window.Claro = window.Claro || {};

window.Claro.animations = {
  revealAll: function () {
    document.querySelectorAll('.reveal, .hero-word').forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  },

  init: function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    if (reduce || !hasGsap) { this.revealAll(); return; }

    try {
      var gsap = window.gsap;
      gsap.registerPlugin(window.ScrollTrigger);

      gsap.set('.hero-word', { yPercent: 110, opacity: 0 });
      gsap.to('.hero-word', { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.15 });


      gsap.utils.toArray('.reveal').forEach(function (el) {
        gsap.to(el, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' } });
      });


      window.ScrollTrigger.refresh();
      window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
    } catch (err) {
      this.revealAll();
    }
  }
};
