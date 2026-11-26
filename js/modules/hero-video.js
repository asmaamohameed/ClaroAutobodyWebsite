/**
 * Hero background video. The poster image shows instantly; the video is
 * chosen by screen size (portrait clip on phones, 1080p on wider screens)
 * and fades in once it can play. Skipped on reduced motion, data saver
 * and 2G, where the poster stays.
 */
window.Claro = window.Claro || {};

window.Claro.heroVideo = {
  init: function () {
    var video = document.getElementById('heroVideo');
    if (!video) return;

    var conn = navigator.connection || {};
    var slow = /(^|-)(2g|slow-2g)$/.test(conn.effectiveType || '');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || conn.saveData === true || slow) return;

    var isMobile = window.matchMedia('(max-width: 767px)').matches;
    var src = video.getAttribute(isMobile ? 'data-src-mobile' : 'data-src-desktop');
    if (!src) return;

    function show() { video.classList.add('is-playing'); }
    video.addEventListener('playing', show, { once: true });
    video.addEventListener('error', function () { video.hidden = true; });

    video.src = src;
    video.preload = 'auto';
    var playing = video.play();
    if (playing && playing.catch) playing.catch(function () { /* autoplay blocked: poster stays */ });
  }
};
