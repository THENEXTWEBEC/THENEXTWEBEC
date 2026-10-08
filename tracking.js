(() => {
  'use strict';
  const key = 'nextwebec-cookie-preferences-v2';
  const days = 180 * 86400000;
  let prefs = null;
  try { const saved = JSON.parse(localStorage.getItem(key)); if (saved && Date.now() - saved.savedAt < days) prefs = saved; } catch (_) {}
  const gaId = 'G-9DK5S7Y0S1';
  const clarityId = 'wq1vez3c5m';
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  function load(src) { const script = document.createElement('script'); script.src = src; script.async = true; document.head.appendChild(script); }
  function start() {
    if (prefs?.analytics) {
      window.gtag('consent', 'default', {analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      window.gtag('js', new Date());
      window.gtag('config', gaId, {send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});
      window.gtag('event', 'page_view', {page_location:location.origin + location.pathname,page_title:document.title,page_referrer:document.referrer ? new URL(document.referrer).origin : ''});
      load('https://www.googletagmanager.com/gtag/js?id=' + gaId);
    }
    if (prefs?.experience) { window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); }; window.clarity('consentv2', {ad_Storage:'denied',analytics_Storage:'granted'}); load('https://www.clarity.ms/tag/' + clarityId); }
  }
  window.nextwebecTrack = (name, fields = {}) => { if (prefs?.analytics) window.gtag('event', name, {...fields,page_location:location.origin+location.pathname}); };
  function clearMeasurementCookies() {
    document.cookie.split(';').forEach(part => { const name = part.trim().split('=')[0]; if (/^(_ga|_gid|_gat|_clck|_clsk)/.test(name)) for (const domain of ['', location.hostname, '.' + location.hostname, '.thenextwebec.com']) document.cookie = name + '=; Max-Age=0; Path=/' + (domain ? '; Domain=' + domain : '') + '; SameSite=Lax; Secure'; });
  }
  function save(analytics, experience) {
    const revoke = (prefs?.analytics && !analytics) || (prefs?.experience && !experience);
    prefs = {analytics,experience,savedAt:Date.now()};
    try { localStorage.setItem(key, JSON.stringify(prefs)); localStorage.removeItem('nextwebec-cookie-choice'); } catch (_) {}
    if (revoke) { window.gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'}); window.clarity?.('consentv2',{ad_Storage:'denied',analytics_Storage:'denied'}); clearMeasurementCookies(); }
    // A fresh document stops already loaded trackers after withdrawal and avoids duplicate tags.
    location.reload();
  }
  function configure() {
    let dialog = document.getElementById('cookie-preferences');
    if (!dialog) {
      dialog = document.createElement('dialog'); dialog.id = 'cookie-preferences'; dialog.className = 'cookie-dialog'; dialog.setAttribute('aria-labelledby','cookie-title');
      dialog.innerHTML = '<form method="dialog"><h2 id="cookie-title">Preferencias de privacidad</h2><p>El contacto y la navegación funcionan aunque rechaces la medición.</p><p><strong>Necesarias</strong>: guardan tu elección en este navegador.</p><label><input type="checkbox" id="consent-analytics"> Analítica de visitas con Google Analytics</label><label><input type="checkbox" id="consent-experience"> Análisis de navegación con Microsoft Clarity</label><p>Clarity utiliza mapas de calor y grabaciones de interacción. Los formularios se enmascaran.</p><a href="/privacidad.html">Leer la política de privacidad</a><div class="cookie-dialog-actions"><button type="button" id="cookie-save">Guardar preferencias</button><button type="submit">Cerrar</button></div></form>';
      document.body.appendChild(dialog);
      document.getElementById('cookie-save').addEventListener('click', () => save(document.getElementById('consent-analytics').checked,document.getElementById('consent-experience').checked));
    }
    document.getElementById('consent-analytics').checked = !!prefs?.analytics;
    document.getElementById('consent-experience').checked = !!prefs?.experience;
    dialog.showModal();
  }
  document.querySelectorAll('.cookie-settings').forEach(button => button.addEventListener('click', configure));
  if (!prefs) {
    const banner = document.createElement('aside'); banner.className = 'cookie-banner'; banner.id = 'cookie-banner'; banner.setAttribute('aria-label','Preferencias de privacidad');
    banner.innerHTML = '<p>Con tu permiso usamos Google Analytics y Microsoft Clarity para medir visitas y navegación. <a href="/privacidad.html">Privacidad</a></p><div><button type="button" data-consent="reject">Rechazar</button><button type="button" data-consent="configure">Configurar</button><button type="button" class="cookie-accept" data-consent="accept">Aceptar</button></div>';
    document.body.appendChild(banner);
    banner.querySelectorAll('button').forEach(button => button.addEventListener('click', () => button.dataset.consent === 'configure' ? configure() : save(button.dataset.consent === 'accept',button.dataset.consent === 'accept')));
  }
  start();
  document.addEventListener('click', event => {
    const link = event.target.closest('a'); if (!link) return;
    const channel = link.href.startsWith('https://wa.me/') ? 'whatsapp' : link.href.startsWith('mailto:') ? 'email' : link.href.startsWith('tel:') ? 'phone' : null;
    if (channel) window.nextwebecTrack('contact_click',{channel,placement:link.closest('footer')?'footer':link.closest('header')?'header':'content'});
  });
})();
