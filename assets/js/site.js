(function () {
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const message = document.querySelector('[data-form-message]');
  const form = document.querySelector('[data-contact-form]');
  const year = document.querySelector('[data-year]');

  document.body.classList.add('is-loaded');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
    });

    nav.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '메뉴 열기');
      }
    });
  }

  if (form && message) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      message.classList.remove('error');

      const formData = new FormData(form);
      const requiredValues = ['name', 'phone', 'email', 'type', 'message'];
      const missing = requiredValues.some((key) => !String(formData.get(key) || '').trim());
      const privacy = formData.get('privacy') === 'on';
      const email = String(formData.get('email') || '').trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (missing) {
        message.textContent = '필수 항목을 모두 입력해주세요.';
        message.classList.add('error');
        return;
      }

      if (!emailValid) {
        message.textContent = '이메일 형식을 확인해주세요.';
        message.classList.add('error');
        return;
      }

      if (!privacy) {
        message.textContent = '개인정보 수집 및 이용 동의가 필요합니다.';
        message.classList.add('error');
        return;
      }

      message.textContent = '문의 내용이 접수되었습니다. 넥스젠큐어 담당자가 순차적으로 확인합니다.';
      form.reset();
    });
  }
})();
