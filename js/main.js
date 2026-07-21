document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const header = document.getElementById('header');
  const form = document.getElementById('registerForm');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
    });
  });

  window.addEventListener('scroll', () => {
    header.style.background = window.scrollY > 50
      ? 'rgba(0, 0, 0, 0.98)'
      : 'rgba(0, 0, 0, 0.92)';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const message = encodeURIComponent(
      `Привет! Хочу зарегистрироваться на вебинар «Код тестостерона» 28 июля.\nИмя: ${name}\nКонтакт: ${phone}`
    );

    // Замените username на реальный Telegram-аккаунт
    window.open(`https://t.me/share/url?url=&text=${message}`, '_blank');
    form.reset();
  });

  document.querySelectorAll('.faq__item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq__item').forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
});
