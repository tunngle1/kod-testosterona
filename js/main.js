const TELEGRAM_BOT_USERNAME = 'Kod_testesterona_bot';
const TELEGRAM_START_BASE = 'vebreg';

const SOURCE_LABELS = {
  zdorovie_ru: 'Здоровье ру',
  alpha_protocol_youtube: 'Альфа протокол YouTube',
  zhivaya_stal_youtube: 'Живая сталь YouTube',
  alpha_inst: 'Альфа инст',
  evseev2_inst: 'Евсеев 2 инст',
  tg_main: 'ТГ основной',
  stories: 'Сторис везде',
  tg_closed: 'ТГ закрытый',
  hvatov_taurus: 'hvatov_taurus',
  moshkin_vladislav: 'moshkin_vladislav',
  instagram: 'Instagram',
  telegram: 'Telegram',
  direct: 'Прямой заход',
};

function getSourceFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('from') || params.get('utm_source') || '';
}

function normalizeSource(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function getTrafficSource() {
  const fromUrl = getSourceFromUrl();

  if (fromUrl) {
    const source = normalizeSource(fromUrl);
    sessionStorage.setItem('traffic_source', source);
    return source;
  }

  return sessionStorage.getItem('traffic_source') || 'direct';
}

function getSourceLabel(source) {
  return SOURCE_LABELS[source] || source;
}

function getTelegramRegisterUrl(source) {
  const startParam = source && source !== 'direct'
    ? `${TELEGRAM_START_BASE}_${source}`
    : TELEGRAM_START_BASE;

  return `https://telegram.me/${TELEGRAM_BOT_USERNAME}?start=${startParam}`;
}

function openTelegramBot(source) {
  window.location.replace(getTelegramRegisterUrl(source));
}

function normalizePhoneDigits(value) {
  let digits = value.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`;
  }

  if (digits.length === 10 && digits.startsWith('9')) {
    digits = `7${digits}`;
  }

  return digits;
}

function isValidRussianPhone(value) {
  const digits = normalizePhoneDigits(value);

  if (digits.length !== 11 || !digits.startsWith('7')) {
    return false;
  }

  return /^7[3-9]\d{9}$/.test(digits);
}

function formatPhoneInput(value) {
  const digits = normalizePhoneDigits(value).slice(0, 11);

  if (!digits) return '';

  const national = digits.startsWith('7') ? digits.slice(1) : digits;
  let result = '+7';

  if (national.length > 0) result += ` (${national.slice(0, 3)}`;
  if (national.length >= 3) result += `) ${national.slice(3, 6)}`;
  if (national.length >= 6) result += `-${national.slice(6, 8)}`;
  if (national.length >= 8) result += `-${national.slice(8, 10)}`;

  return result;
}

function setPhoneError(phoneInput, phoneError, message) {
  if (message) {
    phoneError.textContent = message;
    phoneError.hidden = false;
    phoneInput.classList.add('register-form__input--error');
    phoneInput.setAttribute('aria-invalid', 'true');
    return;
  }

  phoneError.hidden = true;
  phoneInput.classList.remove('register-form__input--error');
  phoneInput.removeAttribute('aria-invalid');
}

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const header = document.getElementById('header');
  const form = document.getElementById('registerForm');
  const sourceInput = document.getElementById('trafficSource');
  const phoneInput = document.getElementById('phoneInput');
  const phoneError = document.getElementById('phoneError');
  const trafficSource = getTrafficSource();

  if (sourceInput) {
    sourceInput.value = trafficSource;
  }

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

  phoneInput.addEventListener('input', () => {
    setPhoneError(phoneInput, phoneError, '');
  });

  phoneInput.addEventListener('blur', () => {
    const phone = phoneInput.value.trim();
    if (!phone) return;

    phoneInput.value = formatPhoneInput(phone);

    if (!isValidRussianPhone(phoneInput.value)) {
      setPhoneError(phoneInput, phoneError, 'Введите корректный номер: +7 (999) 123-45-67');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = phoneInput.value.trim();
    const source = form.source?.value || trafficSource;

    setPhoneError(phoneInput, phoneError, '');

    if (!name) return;

    if (!isValidRussianPhone(phone)) {
      setPhoneError(
        phoneInput,
        phoneError,
        'Введите корректный номер телефона в формате +7 (999) 123-45-67'
      );
      phoneInput.focus();
      return;
    }

    openTelegramBot(source);
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
