const components = [
  ['header-slot', 'components/header/header.html'],
  ['hero-slot', 'components/hero/hero.html'],
  ['problem-slot', 'components/about/about.html'],
  ['consulting-slot', 'components/consulting/consulting.html'],
  ['process-slot', 'components/process/process.html'],
  ['application-slot', 'components/application/application.html'],
  ['style-slot', 'components/style/style.html'],
  ['image-branding-slot', 'components/image-branding/image-branding.html'],
  ['personalization-slot', 'components/personalization/personalization.html'],
  ['before-after-slot', 'components/before-after/before-after.html'],
  ['review-slot', 'components/review/review.html'],
  ['philosophy-slot', 'components/philosophy/philosophy.html'],
  ['faq-slot', 'components/faq/faq.html'],
  ['footer-slot', 'components/footer/footer.html'],
];

async function loadComponent(slotId, path) {
  const slot = document.getElementById(slotId);
  if (!slot) return;

  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  slot.innerHTML = await response.text();
}

async function loadComponents() {
  await Promise.all(components.map(([slotId, path]) => loadComponent(slotId, path)));
  document.dispatchEvent(new CustomEvent('componentsloaded'));
}

loadComponents().catch((error) => {
  console.error('MOV components failed to load.', error);
  document.body.classList.add('components-load-error');
});