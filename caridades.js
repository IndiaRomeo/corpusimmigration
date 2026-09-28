(function () {
  var script = document.currentScript;
  var assetUrl = new URL('2026/01/caridades.jpg', script.src).href;

  function addStyles() {
    if (document.getElementById('caridadesSharedStyles')) return;
    var style = document.createElement('style');
    style.id = 'caridadesSharedStyles';
    style.textContent = '#caridadesSharedBtn{display:inline-flex;align-items:center;gap:8px;border:0;cursor:pointer;background:#dda762;color:#fff;font:inherit;padding:8px 14px;border-radius:22px;vertical-align:middle}#caridadesSharedBtn img{width:28px;height:28px;object-fit:cover;border-radius:50%;background:#fff}#caridadesSharedModal{display:none;position:fixed;z-index:10000;inset:0;background:rgba(0,0,0,.6);align-items:center;justify-content:center;padding:20px}#caridadesSharedModal.is-open{display:flex}.caridadesSharedDialog{position:relative;width:min(560px,100%);max-height:90vh;overflow:auto;background:#fff;padding:30px;border-top:5px solid #dda762;box-shadow:0 15px 50px rgba(0,0,0,.3)}.caridadesSharedDialog h2{margin:0 0 8px;color:#063b36}.caridadesSharedDialog p{margin:0 0 20px}.caridadesSharedClose{position:absolute;top:10px;right:15px;border:0;background:none;color:#063b36;font-size:28px;cursor:pointer}.caridadesSharedForm{display:grid;grid-template-columns:1fr 1fr;gap:14px}.caridadesSharedForm label{display:flex;flex-direction:column;gap:5px;font-weight:700;color:#063b36}.caridadesSharedForm label:last-of-type{grid-column:1/-1}.caridadesSharedForm input,.caridadesSharedForm textarea{border:1px solid #ccc;padding:10px;font:inherit}.caridadesSharedForm textarea{min-height:110px;resize:vertical}.caridadesSharedSubmit{grid-column:1/-1;border:0;background:#063b36;color:#fff;padding:12px 18px;cursor:pointer;font-weight:700}.caridadesSharedStatus{grid-column:1/-1;margin:0;color:#276749;font-weight:700}@media(max-width:600px){.caridadesSharedForm{grid-template-columns:1fr}.caridadesSharedForm label:last-of-type,.caridadesSharedSubmit,.caridadesSharedStatus{grid-column:auto}}';
    document.head.appendChild(style);
  }

  function createModal() {
    if (document.getElementById('caridadesSharedModal')) return document.getElementById('caridadesSharedModal');
    var modal = document.createElement('div');
    modal.id = 'caridadesSharedModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'caridadesSharedTitle');
    modal.innerHTML = '<div class="caridadesSharedDialog"><button class="caridadesSharedClose" type="button" aria-label="Cerrar">&times;</button><h2 id="caridadesSharedTitle">Registro con Caridades Cat&oacute;licas</h2><p>Complete sus datos y una persona del equipo podr&aacute; comunicarse con usted.</p><form class="caridadesSharedForm"><label>Nombre completo<input name="nombre" type="text" required></label><label>N&uacute;mero de tel&eacute;fono<input name="numero" type="tel" required></label><label>Estado<input name="estado" type="text" required></label><label>Ciudad<input name="ciudad" type="text" required></label><label>C&oacute;digo postal<input name="zip" type="text" inputmode="numeric" required></label><label>Descripci&oacute;n del caso<textarea name="descripcion" required></textarea></label><button class="caridadesSharedSubmit" type="submit">Enviar registro</button><p class="caridadesSharedStatus" role="status" hidden>Registro recibido. Nos pondremos en contacto con usted.</p></form></div>';
    document.body.appendChild(modal);
    var form = modal.querySelector('form');
    var status = modal.querySelector('.caridadesSharedStatus');
    function close() { modal.classList.remove('is-open'); }
    modal.querySelector('.caridadesSharedClose').addEventListener('click', close);
    modal.addEventListener('click', function (event) { if (event.target === modal) close(); });
    form.addEventListener('submit', function (event) { event.preventDefault(); status.hidden = false; form.reset(); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') close(); });
    return modal;
  }

  function openModal(modal) {
    modal.classList.add('is-open');
    var first = modal.querySelector('input');
    if (first) first.focus();
  }

  function init() {
    addStyles();
    var modal = document.getElementById('caridadesModal') || createModal();
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (!link || link.hostname !== 'bbaimmigration.cliogrow.com' || link.pathname !== '/intake/28efc341f3c9c3d64e3c35f6213429d6') return;
      event.preventDefault();
      openModal(modal);
    });

    var top = document.querySelector('.mhrTop');
    if (!top) return;
    var button = document.getElementById('caridadesBtn') || document.getElementById('caridadesSharedBtn');
    if (!button) {
      button = document.createElement('button');
      button.id = 'caridadesSharedBtn';
      button.type = 'button';
      button.setAttribute('aria-haspopup', 'dialog');
      button.innerHTML = '<img src="' + assetUrl + '" alt="">Caridades Cat&oacute;licas';
      top.appendChild(button);
    }
    button.addEventListener('click', function () { openModal(modal); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
