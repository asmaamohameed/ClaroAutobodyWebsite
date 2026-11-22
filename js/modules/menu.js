/**
 * Full-screen mobile menu (hamburger), shown below 1280px.
 */
window.Claro = window.Claro || {};

window.Claro.menu = {
  init: function () {
    var menu = document.getElementById('mmenu');
    var openBtn = document.getElementById('burger');
    var closeBtn = document.getElementById('mclose');
    if (!menu || !openBtn || !closeBtn) return;

    function set(open) {
      menu.classList.toggle('open', open);
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', open);
      (open ? closeBtn : openBtn).focus();
    }

    openBtn.addEventListener('click', function () { set(true); });
    closeBtn.addEventListener('click', function () { set(false); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { set(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) set(false);
    });
  }
};
