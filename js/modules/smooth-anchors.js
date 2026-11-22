/**
 * In-page links scroll natively with an offset for the fixed header.
 */
window.Claro = window.Claro || {};

window.Claro.anchors = {
  HEADER_OFFSET: 80,

  init: function () {
    var offset = this.HEADER_OFFSET;
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
      });
    });
  }
};
