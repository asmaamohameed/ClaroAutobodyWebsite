/**
 * Netlify forms over fetch. Netlify needs a URL-encoded body and reads the
 * Reply-To address from the field named "email". On success (or offline
 * preview) the form is swapped for its thank-you message.
 */
window.Claro = window.Claro || {};

window.Claro.forms = {
  wire: function (formId, successId) {
    var form = document.getElementById(formId);
    var success = document.getElementById(successId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var button = form.querySelector('[type="submit"]');
      if (button) button.disabled = true;

      function done() {
        form.hidden = true;
        if (success) success.hidden = false;
      }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(done).catch(done);
    });
  },

  init: function () {
    this.wire('leadForm', 'formSuccess');
    this.wire('leadForm2', 'formSuccess2');
  }
};
