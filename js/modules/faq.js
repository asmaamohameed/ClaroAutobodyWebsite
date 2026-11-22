/**
 * FAQ accordion. Items with class "open" start expanded.
 */
window.Claro = window.Claro || {};

window.Claro.faq = {
  init: function () {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var question = item.querySelector('.faq-q');
      var answer = item.querySelector('.faq-a');
      if (!question || !answer) return;

      function set(open) {
        item.classList.toggle('open', open);
        question.setAttribute('aria-expanded', open ? 'true' : 'false');
        answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0px';
      }

      set(item.classList.contains('open'));
      question.addEventListener('click', function () { set(!item.classList.contains('open')); });
    });
  }
};
