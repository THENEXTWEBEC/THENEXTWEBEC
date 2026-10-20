(function(){
      const nav = document.querySelector('.site-header');
      const toggle = document.querySelector('.nav-toggle');
      const menu = document.querySelector('.nav-menu');
      const setMenu = (open) => { nav.classList.toggle('menu-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.querySelector('.nav-toggle-label').textContent = open ? 'Cerrar' : 'Menú'; toggle.querySelector('.sr-only').textContent = open ? 'Cerrar menú' : 'Abrir menú'; };
      const closeMenu = () => setMenu(false);
      toggle.addEventListener('click', () => setMenu(!nav.classList.contains('menu-open')));
      menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
      document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && nav.classList.contains('menu-open')) { closeMenu(); toggle.focus(); } });
      document.documentElement.classList.add('js-ready');
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
        document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
      } else { document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible')); }
      const clean = (value) => value.trim().replace(/[<>]/g, '');
      const form = document.getElementById('contactForm');
      const message = document.getElementById('formMsg');
      form.addEventListener('submit', (event) => {
        event.preventDefault(); const fields = Object.fromEntries(new FormData(form)); const required = ['nombre', 'empresa', 'actividad', 'necesidad', 'whatsapp'];
        if (required.some((name) => !clean(String(fields[name] || '')))) { message.textContent = 'Completa los campos requeridos para continuar.'; form.querySelector('[required]:invalid')?.focus(); return; }
        if (!form.reportValidity()) return;
        const text = ['Hola José, quisiera conversar sobre una web para mi empresa.', '', 'Nombre: ' + clean(String(fields.nombre)), 'Empresa: ' + clean(String(fields.empresa)), 'Actividad: ' + clean(String(fields.actividad)), 'Web actual: ' + (clean(String(fields.sitio || '')) || 'No indicada'), 'Objetivo de la web: ' + clean(String(fields.necesidad)), 'WhatsApp: ' + clean(String(fields.whatsapp))].join('\n');
        window.nextwebecTrack?.('whatsapp_summary_opened', {form_name:'project_diagnosis'});
        location.assign('https://wa.me/593969349833?text=' + encodeURIComponent(text));
      });
    })();

(function(){
  const metrics = document.querySelector('.metrics-section');
  if (!metrics) return;
  const numbers = metrics.querySelectorAll('.metric-number');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const format = (value) => new Intl.NumberFormat('en-US').format(value);
  const animate = (element) => {
    const target = Number(element.dataset.target || 0);
    if (reduceMotion) { element.textContent = format(target); return; }
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = format(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver((entries, instance) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      numbers.forEach(animate);
      instance.disconnect();
    }
  }, { threshold: 0.35 });
  observer.observe(metrics);
})();
