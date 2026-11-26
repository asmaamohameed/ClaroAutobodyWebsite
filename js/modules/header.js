/**
 * Header state (adds a shadow after 60px of scroll), the top
 * scroll-progress bar, and the floating call button, which on phones
 * waits until the hero CTA has scrolled away. Also fills the footer year.
 */
window.Claro = window.Claro || {};

window.Claro.header = {
  init: function () {
    var header = document.getElementById('siteHeader');
    var progress = document.getElementById('progress');
    var year = document.getElementById('year');
    var call = document.querySelector('.float-call');
    if (year) year.textContent = new Date().getFullYear();
    if (!header) return;

    var ticking = false;
    function update() {
      var y = window.scrollY || window.pageYOffset;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      header.classList.toggle('scrolled', y > 60);
      if (call) call.classList.toggle('is-visible', y > window.innerHeight * 0.6);
      if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
};
