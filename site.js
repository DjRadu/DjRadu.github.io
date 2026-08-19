// Shared site behavior for all language versions of djradu.com (/, /en/, /ro/).
// Language-specific strings are provided per-page via window.SITE_LANG_STRINGS
// before this script runs (see the inline <script> block right above the
// <script src="/site.js"> tag on each page).
const LANG = window.SITE_LANG_STRINGS || {};

function toggleAccordion(header){
  const content = header.nextElementSibling;
  const isActive = content.classList.contains("active");

  document.querySelectorAll(".accordion-content").forEach(c => c.classList.remove("active"));
  document.querySelectorAll(".accordion-header").forEach(h => h.classList.remove("active"));

  if (!isActive) {
    content.classList.add("active");
    header.classList.add("active");
  }
}

document.querySelectorAll(".accordion-header").forEach(header => {
  header.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleAccordion(header);
    }
  });
});

const reveals = document.querySelectorAll(".reveal");
function revealElements() {
  reveals.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add("active"); });
}
window.addEventListener("scroll", revealElements, {passive:true});
revealElements();

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
function closeMenu() { mobileMenu.classList.remove("active"); menuToggle.classList.remove("active"); menuToggle.setAttribute("aria-expanded","false"); document.body.classList.remove("menu-open"); }
function openMenu() { mobileMenu.classList.add("active"); menuToggle.classList.add("active"); menuToggle.setAttribute("aria-expanded","true"); document.body.classList.add("menu-open"); }
menuToggle.addEventListener("click", () => { if (mobileMenu.classList.contains("active")) closeMenu(); else openMenu(); });
document.querySelectorAll('.mobile-menu a, nav a[href^="#"]').forEach(link => { link.addEventListener("click", () => closeMenu()); });

const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const lightboxActions = document.getElementById("lightboxActions");
const lightboxClose = document.getElementById("lightboxClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
let galleryIndex = -1;

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden","true");
  lightboxContent.innerHTML = "";
  lightboxActions.innerHTML = "";
  lbPrev.classList.remove("show"); lbNext.classList.remove("show");
  galleryIndex = -1;
  document.body.classList.remove("menu-open");
}
function showGalleryImage(i) {
  if (!galleryItems.length) return;
  galleryIndex = (i + galleryItems.length) % galleryItems.length;
  const item = galleryItems[galleryIndex];
  const img = item.querySelector("img");
  lightboxContent.innerHTML = '<img src="' + item.dataset.image + '" alt="' + (img ? img.alt : '') + '">';
  lightboxActions.innerHTML = "";
  lbPrev.classList.add("show"); lbNext.classList.add("show");
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden","false");
  document.body.classList.add("menu-open");
}
function openVideoLightbox(videoId, type) {
  galleryIndex = -1;
  lbPrev.classList.remove("show"); lbNext.classList.remove("show");
  const embedUrl = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0&modestbranding=1";
  const youtubeUrl = type === "short" ? "https://www.youtube.com/shorts/" + videoId : "https://www.youtube.com/watch?v=" + videoId;
  lightboxContent.innerHTML = '<iframe id="ytFrame" src="' + embedUrl + '" title="DJ Radu video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
  lightboxActions.innerHTML = '<button class="lightbox-action" id="fullscreenBtn" type="button">' + LANG.fullscreen + '</button><a class="lightbox-action" href="' + youtubeUrl + '" target="_blank" rel="noopener noreferrer">' + LANG.openYoutube + '</a>';
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden","false");
  document.body.classList.add("menu-open");
  const ytFrame = document.getElementById("ytFrame");
  document.getElementById("fullscreenBtn").addEventListener("click", () => {
    if (ytFrame.requestFullscreen) ytFrame.requestFullscreen();
    else if (ytFrame.webkitRequestFullscreen) ytFrame.webkitRequestFullscreen();
  });
}

galleryItems.forEach((item, i) => {
  item.addEventListener("click", () => showGalleryImage(i));
  item.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showGalleryImage(i); } });
});
document.querySelectorAll(".video-card").forEach(card => {
  const go = () => openVideoLightbox(card.dataset.videoId, card.dataset.videoType);
  card.addEventListener("click", go);
  card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
});
lbPrev.addEventListener("click", e => { e.stopPropagation(); showGalleryImage(galleryIndex - 1); });
lbNext.addEventListener("click", e => { e.stopPropagation(); showGalleryImage(galleryIndex + 1); });
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox || e.target === lightbox.firstElementChild) closeLightbox(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeLightbox(); closeMenu(); }
  if (lightbox.classList.contains("active") && galleryIndex >= 0) {
    if (e.key === "ArrowLeft") showGalleryImage(galleryIndex - 1);
    if (e.key === "ArrowRight") showGalleryImage(galleryIndex + 1);
  }
});

const scrollIndicator = document.getElementById("scrollIndicator");
if (scrollIndicator) {
  scrollIndicator.addEventListener("click", () => {
    const target = document.getElementById("despre");
    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
  });
}

(function heroParallax(){
  const content = document.querySelector(".hero-content");
  const hero = document.querySelector(".hero");
  if (!content || !hero) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let ticking = false;
  function update(){
    const rect = hero.getBoundingClientRect();
    const p = Math.min(Math.max(-rect.top / (window.innerHeight || 1), 0), 1);
    content.style.transform = "translateY(" + (p * 26) + "px)";
    content.style.opacity = String(1 - p * 0.5);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, {passive:true});
  update();
})();

(function heroParticles(){
  const canvas = document.getElementById("heroParticles");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  let particles = [], raf = null, running = true;
  function resize(){
    const r = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * r;
    canvas.height = canvas.clientHeight * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
  }
  function create(){
    const count = Math.min(40, Math.round(canvas.clientWidth * canvas.clientHeight / 26000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight,
        r: Math.random() * 1.6 + 0.5,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(Math.random() * 0.22 + 0.05),
        a: Math.random() * 0.4 + 0.15
      });
    }
  }
  function tick(){
    if (!running) return;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = canvas.clientHeight + 10; p.x = Math.random() * canvas.clientWidth; }
      if (p.x < -10) p.x = canvas.clientWidth + 10;
      if (p.x > canvas.clientWidth + 10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,217,255," + p.a + ")";
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }
  function start(){ running = true; if (!raf) tick(); }
  function stop(){ running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }
  window.addEventListener("resize", () => { resize(); create(); }, {passive:true});
  document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });
  resize(); create(); start();
})();

// ===== COOKIE CONSENT MANAGEMENT =====
function loadAnalytics(){
  // Google Tag Manager
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PKH9JPMD');
  // Google tag (gtag.js)
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-E1P3WG6YHH';
  document.head.appendChild(gtagScript);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', 'G-E1P3WG6YHH');
}

function loadSocialEmbeds(){
  // Instagram embed script
  if (!document.getElementById('ig-embed-script')) {
    const ig = document.createElement('script');
    ig.id = 'ig-embed-script';
    ig.async = true;
    ig.src = 'https://www.instagram.com/embed.js';
    document.body.appendChild(ig);
  }
  // TikTok embed script
  if (!document.getElementById('tiktok-embed-script')) {
    const tt = document.createElement('script');
    tt.id = 'tiktok-embed-script';
    tt.async = true;
    tt.src = 'https://www.tiktok.com/embed.js';
    document.body.appendChild(tt);
  }
  // Facebook + Instagram iframes: activate real src from data-src (they are blocked by default in the HTML)
  document.querySelectorAll('iframe[data-src]').forEach(f => { f.src = f.dataset.src; });
}

function setCookieConsent(status){
  localStorage.setItem('djradu_cookie_consent', status);
  document.getElementById('cookieBanner').classList.remove('show');
  if (status === 'accepted') {
    loadAnalytics();
    loadSocialEmbeds();
  }
}

function initCookieBanner(){
  const consent = localStorage.getItem('djradu_cookie_consent');
  const t = LANG.cookie;
  if (t) {
    document.getElementById('cookieText').innerHTML = t.text;
    document.getElementById('cookieReject').textContent = t.reject;
    document.getElementById('cookieAccept').textContent = t.accept;
  }

  if (!consent) {
    setTimeout(() => document.getElementById('cookieBanner').classList.add('show'), 800);
  } else if (consent === 'accepted') {
    loadAnalytics();
    loadSocialEmbeds();
  }
}

document.getElementById('cookieAccept').addEventListener('click', () => setCookieConsent('accepted'));
document.getElementById('cookieReject').addEventListener('click', () => setCookieConsent('essential'));

initCookieBanner();
