/**
 * Entry point. Each module is isolated so one failure can't break the rest.
 * Gallery runs before animations so its tiles get scroll reveals too.
 */
(function () {
  var C = window.Claro || {};
  var order = ['images', 'header', 'menu', 'forms', 'faq', 'anchors', 'gallery', 'animations'];

  order.forEach(function (name) {
    try {
      if (C[name] && typeof C[name].init === 'function') C[name].init();
    } catch (err) {
      if (window.console) console.error('[Claro] ' + name + ' failed:', err);
      if (name === 'animations' && C.animations) C.animations.revealAll();
    }
  });
})();
