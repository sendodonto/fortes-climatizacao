/* =========================================================================
   CONFIGURACAO: o unico lugar para mexer no contato.
   whatsapp: so digitos, com 55 + DDD + numero. Ex.: '5551987654321'.
   Enquanto estiver vazio, todos os botoes abrem o Direct do Instagram.
   ========================================================================= */
const CONFIG = {
  whatsapp: '', // TROCAR pelo numero oficial confirmado pelo Matheus
  instagram: 'fortes_ar_condicionado',
};

const MESSAGES = {
  geral: 'Olá, Matheus! Conheci a Fortes Climatização pelo site e gostaria de solicitar um orçamento.',
  venda: 'Olá, Matheus! Vim pelo site e gostaria de consultar opções de ar-condicionado para o meu ambiente.',
  instalacao: 'Olá, Matheus! Vim pelo site e gostaria de um orçamento para instalação de ar-condicionado.',
  manutencao: 'Olá, Matheus! Vim pelo site e gostaria de solicitar manutenção ou higienização do meu ar-condicionado.',
  infra: 'Olá, Matheus! Vim pelo site e gostaria de um orçamento para infraestrutura de climatização.',
  comecar: 'Olá, Matheus! Vim pelo site e gostaria de começar meu atendimento. Meu ambiente é: ',
  area: 'Olá, Matheus! Vim pelo site e gostaria de confirmar se vocês atendem na minha região. Minha cidade/bairro é: ',
  duvida: 'Olá, Matheus! Vim pelo site e tenho uma dúvida sobre os serviços.',
};

(() => {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- Contato: WhatsApp quando houver numero, Instagram enquanto nao ----------
  const phone = String(CONFIG.whatsapp).replace(/\D/g, '');
  const hasWhatsApp = /^55\d{10,11}$/.test(phone);
  const contactUrl = (key) => hasWhatsApp
    ? `https://wa.me/${phone}?text=${encodeURIComponent(MESSAGES[key] || MESSAGES.geral)}`
    : `https://ig.me/m/${CONFIG.instagram}`;

  $$('[data-wa]').forEach((a) => { a.href = contactUrl(a.dataset.wa); });
  if (hasWhatsApp) {
    $$('[data-channel]').forEach((el) => { el.textContent = 'WhatsApp'; });
    $$('[data-channel-icon]').forEach((use) => use.setAttribute('href', '#i-brand-whatsapp'));
    $$('.float-btn').forEach((a) => a.setAttribute('aria-label', 'Solicitar orçamento pelo WhatsApp'));
    const local = phone.slice(4);
    const pretty = `(${phone.slice(2, 4)}) ${local.slice(0, -4)}-${local.slice(-4)}`;
    $$('[data-wa-number]').forEach((el) => { el.textContent = pretty; });
    $$('[data-wa-only]').forEach((el) => { el.hidden = false; });
  } else if (CONFIG.whatsapp) {
    console.warn('CONFIG.whatsapp invalido: use so digitos, com 55 + DDD + numero.');
  }

  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Rolagem: tudo por IntersectionObserver, sem listener de scroll ----------
  if (!('IntersectionObserver' in window)) {
    $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
    root.classList.add('is-past-hero');
  } else {
    const header = $('.header');
    new IntersectionObserver(([e]) => header.classList.toggle('is-scrolled', !e.isIntersecting))
      .observe($('.top-sentinel'));

    // Botao flutuante e barra do celular: aparecem depois dos botoes do hero...
    new IntersectionObserver(([e]) => {
      root.classList.toggle('is-past-hero', !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe($('.hero__actions'));

    // ...e somem no CTA final e no rodape, para nao repetir o botao
    const atCta = new Set();
    const ctaObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? atCta.add(e.target) : atCta.delete(e.target)));
      root.classList.toggle('is-at-cta', atCta.size > 0);
    });
    ctaObs.observe($('.cta'));
    ctaObs.observe($('.footer'));

    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        reveal.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal]').forEach((el) => reveal.observe(el));
  }

  // ---------- Menu do celular ----------
  const header = $('.header');
  const menuBtn = $('.menu-btn');
  const menu = $('#menu');
  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    $('use', menuBtn).setAttribute('href', open ? '#i-x' : '#i-menu-2');
    header.classList.toggle('is-open', open);
    root.classList.toggle('menu-open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });
  matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  // ---------- Galeria ampliada ----------
  const box = $('.lightbox');
  const items = $$('.g__btn');
  if (!box || !items.length || typeof box.showModal !== 'function') return;

  const img = $('.lightbox__img', box);
  const cap = $('.lightbox__cap', box);
  let index = 0;
  const show = (i) => {
    index = (i + items.length) % items.length;
    const item = items[index];
    img.src = item.dataset.full;
    img.alt = $('img', item).alt;
    cap.textContent = `${item.dataset.caption}  ·  ${index + 1} de ${items.length}`;
  };

  items.forEach((item, i) => item.addEventListener('click', () => { show(i); box.showModal(); }));
  $('.lightbox__close', box).addEventListener('click', () => box.close());
  $('.lightbox__prev', box).addEventListener('click', () => show(index - 1));
  $('.lightbox__next', box).addEventListener('click', () => show(index + 1));
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  let startX = null;
  box.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  box.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 48) show(index + (dx < 0 ? 1 : -1));
  });
})();
