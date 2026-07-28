const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/jpeg';
favicon.href = 'images/logo.jpg';
document.head.append(favicon);

const button = document.querySelector('.menu-button');
const links = document.querySelector('.nav-links');
button?.addEventListener('click', () => {
  const isOpen = links.classList.toggle('open');
  button.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.portrait img').forEach((image) => {
  const fallback = image.nextElementSibling;
  const showPhoto = () => fallback?.remove();
  if (image.complete && image.naturalWidth) showPhoto();
  image.addEventListener('load', showPhoto, { once: true });
  image.addEventListener('error', () => image.remove(), { once: true });
});

const slider = document.querySelector('.team-grid');
const scrollCards = (direction) => slider?.scrollBy({ left: direction * slider.clientWidth, behavior: 'smooth' });
document.querySelector('.previous')?.addEventListener('click', () => scrollCards(-1));
document.querySelector('.next')?.addEventListener('click', () => scrollCards(1));
let autoplay;
const startAutoplay = () => {
  clearInterval(autoplay);
  autoplay = setInterval(() => {
    if (!slider) return;
    const atEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 8;
    slider.scrollTo({ left: atEnd ? 0 : slider.scrollLeft + slider.clientWidth, behavior: 'smooth' });
  }, 4800);
};
slider?.addEventListener('mouseenter', () => clearInterval(autoplay));
slider?.addEventListener('mouseleave', startAutoplay);
slider?.addEventListener('touchstart', () => clearInterval(autoplay), { passive: true });
slider?.addEventListener('touchend', startAutoplay, { passive: true });
startAutoplay();

document.querySelector('.hero-bottom span:first-child')?.remove();
const previous = document.querySelector('.previous');
const next = document.querySelector('.next');
previous?.replaceChildren(Object.assign(document.createElement('span'), { textContent: '←', ariaHidden: 'true' }), Object.assign(document.createElement('small'), { textContent: 'Anterior' }));
next?.replaceChildren(Object.assign(document.createElement('small'), { textContent: 'Siguiente' }), Object.assign(document.createElement('span'), { textContent: '→', ariaHidden: 'true' }));

const reviews = [
  ['Sofía Ramírez', 'Me explicaron cada etapa de mi proceso con mucha paciencia. Me sentí acompañada y segura desde la primera consulta.'],
  ['Carlos Hernández', 'Un equipo serio, humano y muy profesional. Mi caso fue tratado con una atención excelente.'],
  ['Valentina Torres', 'La comunicación fue clara y constante. Recomiendo a Corpus Inmigración con toda confianza.'],
  ['Miguel Álvarez', 'Encontré abogados que realmente se preocuparon por mi familia y por alcanzar el mejor resultado.'],
  ['Andrea López', 'Excelente servicio. Siempre respondieron mis dudas y me dieron tranquilidad durante el proceso.'],
  ['José Martínez', 'Profesionales, organizados y cercanos. Estoy muy agradecido por el acompañamiento recibido.'],
  ['Daniela Cruz', 'El trato fue respetuoso y transparente. Se nota su experiencia en temas de inmigración.'],
  ['Roberto Silva', 'Desde la primera llamada recibí orientación honesta y clara. Una firma que inspira confianza.'],
  ['Paola Jiménez', 'Gracias por defender mi caso con tanta dedicación. La atención fue impecable de principio a fin.'],
  ['Luis García', 'Una experiencia excelente. Todo el equipo fue atento, puntual y comprometido con mi caso.']
];
const reviewsSection = document.createElement('section');
reviewsSection.className = 'reviews';
reviewsSection.id = 'resenas';
reviewsSection.innerHTML = `<div class="container"><div class="reviews-heading"><div><p class="eyebrow red">OPINIONES DE CLIENTES</p><h2>Historias de confianza</h2></div><div class="rating"><b>★ 4.9</b><span>Basado en reseñas de clientes</span></div></div><div class="reviews-grid">${reviews.map(([name, text]) => `<article class="review-card"><div class="review-top"><span class="review-avatar">${name.split(' ').map(part => part[0]).join('').slice(0, 2)}</span><div><h3>${name}</h3><p>★★★★★</p></div></div><blockquote>“${text}”</blockquote><span class="review-source">Reseña de cliente</span></article>`).join('')}</div></div>`;
document.querySelector('.contact')?.before(reviewsSection);

const whatsapp = document.createElement('a');
whatsapp.className = 'whatsapp'; whatsapp.href = 'https://wa.me/12792051468'; whatsapp.target = '_blank'; whatsapp.rel = 'noopener'; whatsapp.setAttribute('aria-label', 'Contactar por WhatsApp');
whatsapp.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M27.1 4.9A15.8 15.8 0 0 0 1.8 23.4L0 32l8.8-1.7A15.8 15.8 0 1 0 27.1 4.9ZM16 29.1c-2.4 0-4.8-.6-6.9-1.8l-.5-.3-5.2 1 1.1-5-.3-.5a13 13 0 1 1 12 6.6Zm7.1-9.8c-.4-.2-2.5-1.2-2.9-1.3-.4-.2-.7-.2-1 .2s-1.1 1.3-1.3 1.6c-.2.3-.5.3-.9.1-2.6-1.3-4.3-2.3-6-5.2-.4-.7.4-.6 1.2-2.1.1-.3 0-.6-.1-.8-.1-.2-1-2.3-1.3-3.2-.3-.8-.7-.7-1-.7h-.8c-.3 0-.8.1-1.2.6-.4.5-1.6 1.5-1.6 3.7s1.6 4.3 1.8 4.6c.2.3 3.1 4.7 7.5 6.6 2.8 1.2 3.8 1.3 5.1 1.1.8-.1 2.5-1 2.8-2 .4-1 .4-1.9.3-2.1-.1-.2-.4-.3-.8-.5Z"/></svg><span>WhatsApp</span>';
document.body.append(whatsapp);

const style = document.createElement('style');
style.textContent = `.hero-bottom{justify-content:flex-end!important}.portrait{height:260px!important;position:relative!important}.portrait img{height:100%!important;width:100%!important;object-fit:cover!important;object-position:center!important}.portrait span{height:100%;width:100%;display:grid;place-items:center}.lawyer-card{height:100%!important;display:flex!important;flex-direction:column!important}.card-info{min-height:191px!important;display:flex!important;flex-direction:column!important}.card-info a{margin-top:auto}.slider-control{min-width:118px!important;height:44px!important;display:flex!important;gap:8px!important;align-items:center!important;justify-content:center!important;color:#b10f1d!important;border:1px solid #d5c7c8!important;border-radius:999px!important;background:#fff!important;font-size:1.25rem!important;cursor:pointer}.slider-control small{font-family:"DM Sans",sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase}.slider-control:hover{background:#b10f1d!important;border-color:#b10f1d!important;color:#fff!important}.reviews{padding:105px 0;background:#faf9f7}.reviews-heading{display:flex;justify-content:space-between;align-items:end;margin-bottom:45px}.reviews-heading h2{font-size:clamp(2.25rem,4vw,4rem);letter-spacing:-.045em}.rating{display:flex;flex-direction:column;gap:5px;color:#716c6e;font-size:.8rem}.rating b{font-size:1.15rem;color:#c87a10}.reviews-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}.review-card{background:#fff;border:1px solid #ebe5e2;padding:22px;min-height:232px;display:flex;flex-direction:column;box-shadow:0 4px 16px rgba(20,10,10,.03)}.review-top{display:flex;align-items:center;gap:11px}.review-avatar{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#171719;color:#fff;font-size:.7rem;font-weight:700}.review-top h3{font-family:"DM Sans",sans-serif;font-size:.87rem;line-height:1.2}.review-top p{margin:3px 0 0;color:#e39b16;font-size:.76rem;letter-spacing:.08em}.review-card blockquote{margin:19px 0;font-size:.84rem;line-height:1.62;color:#4f4a4c}.review-source{margin-top:auto;color:#999194;font-size:.67rem}.whatsapp{position:fixed;right:24px;bottom:24px;z-index:20;display:flex;align-items:center;gap:9px;padding:13px 17px 13px 13px;border-radius:999px;background:#25d366;color:#fff;text-decoration:none;font-family:"DM Sans",sans-serif;font-weight:700;font-size:.82rem;box-shadow:0 8px 22px rgba(0,0,0,.28);transition:transform .2s,background .2s}.whatsapp:hover{background:#1ebe5b;transform:translateY(-3px)}.whatsapp svg{width:25px;height:25px;fill:currentColor}@media(max-width:850px){.reviews-grid{grid-template-columns:repeat(2,1fr)}.reviews-heading{align-items:start;flex-direction:column;gap:20px}}@media(max-width:600px){.slider-control{min-width:40px!important;width:40px!important;height:40px!important;padding:0!important;border-radius:50%!important}.slider-control small{display:none}.reviews{padding:72px 0}.reviews-grid{grid-template-columns:1fr}.review-card{min-height:0}}`;
document.head.append(style);
