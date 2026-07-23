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

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const header = document.getElementById('header');
  const form = document.getElementById('registerForm');
  const sourceInput = document.getElementById('trafficSource');
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();

    const source = form.source?.value || trafficSource;

    if (!name || !phone) return;

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
