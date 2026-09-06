document.addEventListener('componentsloaded', () => {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menuPanel = document.querySelector('[data-menu-panel]');

  if (menuToggle && menuPanel) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuPanel.classList.toggle('is-open', !isOpen);
    });

    menuPanel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuPanel.classList.remove('is-open');
      });
    });
  }

  const form = document.querySelector('#application-form');
  if (!form) return;

  const dateInput = form.querySelector('[name="preferred_date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  const phoneInput = form.querySelector('[name="phone"]');
  phoneInput?.addEventListener('input', () => {
    const digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);
    phoneInput.value = digits.length > 7
      ? `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
      : digits.length > 3
        ? `${digits.slice(0, 3)}-${digits.slice(3)}`
        : digits;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (status) status.textContent = '신청 내용을 확인했습니다. 곧 연락드리겠습니다.';
  });
});