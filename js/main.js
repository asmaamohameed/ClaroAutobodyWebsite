/**
 * Entry point. Each module is isolated so one failure can't break the rest.
 * Animations run last so every section is in place before reveals start.
 */
(function () {
  var C = window.Claro || {};
  var order = ['images', 'header', 'menu', 'forms', 'faq', 'anchors', 'beforeAfter', 'gallery', 'animations'];

  order.forEach(function (name) {
    try {
      if (C[name] && typeof C[name].init === 'function') C[name].init();
    } catch (err) {
      if (window.console) console.error('[Claro] ' + name + ' failed:', err);
      if (name === 'animations' && C.animations) C.animations.revealAll();
    }
  });
})();
