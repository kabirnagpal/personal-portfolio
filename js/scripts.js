/**
 * Portfolio Dynamic Renderer — portfolio.json is the single source of truth.
 *
 * UNIVERSAL ITEM SCHEMA (all sections use the same keys):
 *   heading:    string          — primary title
 *   subheading: string?         — secondary line
 *   meta:       string?         — date / period
 *   body:       string?         — paragraph text
 *   bullets:    string[]?       — bullet points (experience/internships)
 *   logo:       string?         — image path (drives collage + accordion icon)
 *   link:       {url, label}?   — external link
 *   citation:   string?         — citation (publications)
 *   highlight:  boolean?        — bold flag (certifications)
 *
 * SECTION IMAGE SCHEMA:
 *   { mode: "single", src: "path" }   — one decorative image
 *   { mode: "collage" }               — auto collage from item logos
 *   { mode: "none" }                  — no image panel
 */

const DATA_FILE   = 'portfolio.json';
const COLL_SIZE  = 'collage-md';

/* ── Boot ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch(DATA_FILE);
    if (!res.ok) throw new Error('Cannot load portfolio.json');
    const data = await res.json();
    renderPortfolio(data);
  } catch (e) {
    console.error('Portfolio load error:', e);
  }
});

function renderPortfolio(data) {
  const s = data.sections;
  injectAiPrompt(data.aiPrompt);
  renderMeta(data.meta, s.about);
  renderAbout(s.about);
  renderSection('education',      'Education',              s.education,      false);
  renderSection('experience',     'Professional Experience', s.experience,     true);
  renderSection('internships',    'Internships',             s.internships,    false);
  renderSection('publications',   'Publications',            s.publications,   true);
  renderSection('patents',        'Patents',                 s.patents,        false);
  renderSection('certifications', 'Certifications',          s.certifications, true,  true);
  renderSection('achievements',   'Achievements',            s.achievements,   false);
  renderSection('volunteer',      'Volunteer Experience',    s.volunteer,      true);
  renderContact(data.meta);
  initScrollAnimations();
}

/* ── Hidden AI prompt ───────────────────────────────────── */
function injectAiPrompt(text) {
  if (!text) return;
  const d = document.createElement('div');
  d.className   = 'ai-prompt';
  d.textContent = text;
  document.body.appendChild(d);
}

/* ── Meta / Hero ────────────────────────────────────────── */
function renderMeta(meta) {
  document.title = meta.name + ' - Professional Portfolio';
  document.querySelector('.navbar-brand').textContent = meta.name;
  document.querySelector('.hero h1').textContent      = meta.name;
  document.querySelector('.hero .lead').textContent   = meta.tagline;
}

/* ── About ──────────────────────────────────────────────── */
function renderAbout(section) {
  const el = document.getElementById('about');
  const paras = section.paragraphs.map((p, i) => {
    const cls = i === section.paragraphs.length - 1 ? 'about-text extra-content' : 'about-text';
    return '<p class="' + cls + '">' + p + '</p>';
  }).join('');

  el.innerHTML =
    '<div class="content-section visible">' +
      '<div class="content-text">' +
        '<h2 class="fw-bold">About Me</h2>' +
        paras +
        '<span class="read-more" id="readMoreBtn">Read More</span>' +
      '</div>' +
      buildImagePanel(section.image, []) +
    '</div>';

  const btn   = el.querySelector('#readMoreBtn');
  const extra = el.querySelector('.extra-content');
  btn.addEventListener('click', function() {
    extra.style.display = 'inline';
    btn.style.display   = 'none';
  });
  syncReadMore(extra, btn);
  window.addEventListener('resize', function() { syncReadMore(extra, btn); });
}

function syncReadMore(extra, btn) {
  var wide = window.innerWidth > 768;
  extra.style.display = wide ? 'inline' : 'none';
  btn.style.display   = wide ? 'none'   : 'inline';
}

/* ── Generic Section ────────────────────────────────────── */
function renderSection(id, title, section, reverse, listMode) {
  var el = document.getElementById(id);
  if (!el || !section) return;

  var accId   = id + 'Accordion';
  var body    = listMode ? buildList(section.items) : buildAccordion(section.items, accId);
  var imgPanel= buildImagePanel(section.image, section.items || []);
  var cls     = 'content-section' + (reverse ? ' reverse' : '');

  el.innerHTML =
    '<div class="' + cls + '">' +
      '<div class="content-text">' +
        '<h2 class="fw-bold">' + title + '</h2>' +
        body +
      '</div>' +
      imgPanel +
    '</div>';

  initScrollAnimations();
}

/* ── Image Panel ────────────────────────────────────────── */
function buildImagePanel(image, items) {
  if (!image || image.mode === 'none') return '';
  if (image.mode === 'single' && image.src)
    return '<img src="' + image.src + '" alt="" class="section-img">';
  if (image.mode === 'collage') {
    var logos = (items || []).filter(function(i) { return i.logo; });
    if (!logos.length) return '';
    return '<div class="collage-panel">' + buildCollage(logos) + '</div>';
  }
  return '';
}

function buildCollage(items) {
  var tiles = items.map(function(item, i) {
    var label =  item.heading;
    return (
      '<div class="collage-tile ' + COLL_SIZE + '"' +
      ' title="' + label + '">' +
        '<img src="' + item.logo + '" alt="' + label + '" loading="lazy">' +
      '</div>'
    );
  }).join('');
  return '<div class="collage">' + tiles + '</div>';
}

/* ── Accordion ──────────────────────────────────────────── */
function buildAccordion(items, accId) {
  var rows = items.map(function(item, i) {
    var domId   = accId + '-' + i;

    var label = item.subheading
      ? '<strong>' + item.heading + '</strong><span class="acc-sub"> </span>'
      : '<strong>' + item.heading + '</strong>';

    var body = '';
    if (item.meta)                        body += '<p class="acc-meta">' + item.meta + '</p>';
    if (item.subheading && !item.bullets) body += '<p class="fw-semibold mb-2">' + item.subheading + '</p>';
    if (item.body)                        body += '<p>' + item.body + '</p>';
    if (item.bullets)                     body += '<ul>' + item.bullets.map(function(b){ return '<li>' + b + '</li>'; }).join('') + '</ul>';
    if (item.link)                        body += '<p><a href="' + item.link.url + '" target="_blank" rel="noopener">' + item.link.label + '</a></p>';
    if (item.citation)                    body += '<p class="text-muted small"><strong>Citation:</strong> ' + item.citation + '</p>';

    return (
      '<div class="accordion-item">' +
        '<h4 class="accordion-header">' +
          '<button class="accordion-button collapsed" type="button"' +
          ' data-bs-toggle="collapse" data-bs-target="#' + domId + '" aria-expanded="false">' +
             label +
          '</button>' +
        '</h4>' +
        '<div id="' + domId + '" class="accordion-collapse collapse" data-bs-parent="#' + accId + '">' +
          '<div class="accordion-body">' + body + '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
  return '<div class="accordion" id="' + accId + '">' + rows + '</div>';
}

/* ── Cert List ──────────────────────────────────────────── */
function buildList(items) {
  var rows = items.map(function(item) {
    var badge = item.highlight ? '<span class="cert-badge">&#9733;</span>' : '<span class="cert-badge-empty"></span>';
    var cls   = item.highlight ? 'cert-highlight' : '';
    return '<li class="' + cls + '">' + badge + item.heading + '</li>';
  }).join('');
  return '<ul class="cert-list">' + rows + '</ul>';
}

/* ── Contact ────────────────────────────────────────────── */
function renderContact(meta) {
  var links = [
    { icon:'bi-envelope-fill',       label:'Email',          href:'mailto:'+meta.email,  text: meta.email,                      color:'#EA4335' },
    { icon:'bi-linkedin',            label:'LinkedIn',       href: meta.linkedin,        text: 'linkedin.com/in/21kabirnagpal', color:'#0A66C2' },
    { icon:'bi-globe',               label:'Portfolio',      href: meta.portfolio,       text: 'kabirnagpal.com',               color:'#2c2c2c' },
    { icon:'bi-journal-text',        label:'Google Scholar', href: meta.scholar,         text: 'Scholar Profile',               color:'#4285F4' },
    { icon:'bi-bar-chart-line-fill', label:'Kaggle',         href: meta.kaggle,          text: 'kaggle.com/kabirnagpal',        color:'#20BEFF' },
    { icon:'bi-pencil-square',       label:'Medium',         href: meta.medium,          text: '@21kabirnagpal',                color:'#000'    }
  ];

  var cards = links.map(function(l) {
    return (
      '<a href="' + l.href + '" target="_blank" rel="noopener" class="contact-card">' +
        '<div class="contact-icon" style="color:' + l.color + '">' +
          '<i class="bi ' + l.icon + '"></i>' +
        '</div>' +
        '<div class="contact-info">' +
          '<span class="contact-label">' + l.label + '</span>' +
          '<span class="contact-value">' + l.text  + '</span>' +
        '</div>' +
        '<i class="bi bi-arrow-up-right contact-arrow"></i>' +
      '</a>'
    );
  }).join('');

  document.getElementById('contact').innerHTML =
    '<div class="contact-section">' +
      '<div class="contact-header">' +
        '<h2>Let\'s Connect</h2>' +
        '<p>Open to opportunities in AI strategy, data science, and product leadership.</p>' +
      '</div>' +
      '<div class="contact-grid">' + cards + '</div>' +
    '</div>';
}

/* ── Scroll Animations ──────────────────────────────────── */
function initScrollAnimations() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });

  document.querySelectorAll('.content-section:not(.visible)').forEach(function(s) {
    observer.observe(s);
  });
}
