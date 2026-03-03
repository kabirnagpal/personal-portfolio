/**
 * Portfolio Dynamic Renderer
 * All content is driven from portfolio.json — edit that file to update any section.
 */

const DATA_FILE = 'portfolio.json';

async function loadPortfolio() {
  try {
    const res = await fetch(DATA_FILE);
    if (!res.ok) throw new Error('Failed to load portfolio.json');
    const data = await res.json();
    renderAll(data);
  } catch (err) {
    console.error('Portfolio load error:', err);
  }
}

function renderAll(data) {
  renderMeta(data.meta);
  renderAbout(data.about, data.meta);
  renderEducation(data.education);
  renderExperience(data.experience);
  renderInternships(data.internships);
  renderPublications(data.publications);
  renderCertifications(data.certifications);
  renderAchievements(data.achievements);
  renderVolunteer(data.volunteer);
  renderContact(data.meta);
  initScrollAnimations();
}

/* ── META ─────────────────────────────────────────────── */
function renderMeta(meta) {
  document.title = `${meta.name} – Professional Portfolio`;
  document.querySelector('.navbar-brand').textContent = meta.name;
  document.querySelector('.hero h1').textContent = meta.name;
  document.querySelector('.hero .lead').textContent = meta.tagline;
}

/* ── ABOUT ───────────────────────────────────────────── */
function renderAbout(about, meta) {
  const el = document.getElementById('about');
  const paragraphs = about.paragraphs.map((p, i) => {
    const cls = i === about.paragraphs.length - 1 ? 'about-text extra-content' : 'about-text';
    return `<p class="${cls}">${p}</p>`;
  }).join('');

  el.innerHTML = `
    <div class="content-section">
      <div class="content-text">
        <h2 class="fw-bold">About Me</h2>
        ${paragraphs}
        <span class="read-more" id="readMoreBtn">Read More</span>
      </div>
      <img src="${about.image}" alt="About ${meta.name}" class="section-img">
    </div>`;

  // Read More toggle
  const btn = el.querySelector('#readMoreBtn');
  const extra = el.querySelector('.extra-content');
  btn.addEventListener('click', () => {
    extra.style.display = 'inline';
    btn.style.display = 'none';
  });
  checkReadMore(extra, btn);
  window.addEventListener('resize', () => checkReadMore(extra, btn));
}

function checkReadMore(extra, btn) {
  if (window.innerWidth > 768) {
    extra.style.display = 'inline';
    btn.style.display = 'none';
  } else {
    extra.style.display = 'none';
    btn.style.display = 'inline';
  }
}

/* ── EDUCATION ───────────────────────────────────────── */
function renderEducation(items) {
  const el = document.getElementById('education');
  const accordionItems = items.map((item, i) => {
    const id = `edu-${i}`;
    return `
      <div class="accordion-item">
        <h4 class="accordion-header">
          <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false">

            <span><strong>${item.institution}</strong></span>
          </button>
        </h4>
        <div id="${id}" class="accordion-collapse collapse" data-bs-parent="#educationAccordion">
          <div class="accordion-body">
            <p class="text-muted mb-1"><strong>${item.period}</strong></p>
            <p class="fw-semibold mb-2">${item.degree}</p>
            <p>${item.description}</p>
          </div>
        </div>
      </div>`;
  }).join('');

  const logoItems = items.filter(e => e.logo);
  const collageHtml = logoItems.length > 0 ? buildCollage(logoItems) : '';

  el.innerHTML = `
    <div class="content-section">
      <div class="content-text">
        <h2 class="fw-bold">Education</h2>
        <div class="accordion" id="educationAccordion">${accordionItems}</div>
      </div>
      ${collageHtml ? `<div class="collage-panel">${collageHtml}</div>` : ''}
    </div>`;
}

/* ── EXPERIENCE ──────────────────────────────────────── */
function renderExperience(items) {
  const el = document.getElementById('experience');

  const accordionItems = items.map((exp, i) => {
    const id = `exp-${i}`;
    return `
      <div class="accordion-item">
        <h4 class="accordion-header">
          <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false">
            <span><strong>${exp.title}</strong> &mdash; ${exp.company}</span>
          </button>
        </h4>
        <div id="${id}" class="accordion-collapse collapse" data-bs-parent="#experienceAccordion">
          <div class="accordion-body">
            <p class="text-muted"><strong>${exp.period}</strong></p>
            <ul>${exp.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
          </div>
        </div>
      </div>`;
  }).join('');

  const logoItems = items.filter(e => e.logo);
  const collageHtml = logoItems.length > 0 ? buildCollage(logoItems) : `<img src="images/3.png" alt="Experience">`;

  el.innerHTML = `
    <div class="content-section reverse">
      <div class="content-text">
        <h2 class="fw-bold">Professional Experience</h2>
        <div class="accordion" id="experienceAccordion">${accordionItems}</div>
      </div>
      <div class="collage-panel">${collageHtml}</div>
    </div>`;
}

/* ── INTERNSHIPS ─────────────────────────────────────── */
function renderInternships(items) {
  const el = document.getElementById('internships');

  const accordionItems = items.map((item, i) => {
    const id = `intern-${i}`;
    return `
      <div class="accordion-item">
        <h4 class="accordion-header">
          <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false">
            <span><strong>${item.title}</strong> &mdash; ${item.company}</span>
          </button>
        </h4>
        <div id="${id}" class="accordion-collapse collapse" data-bs-parent="#internshipsAccordion">
          <div class="accordion-body">
            <p class="text-muted"><strong>${item.period}</strong></p>
            <ul>${item.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
          </div>
        </div>
      </div>`;
  }).join('');

  // Collage: only items that have a logo
  const logoItems = items.filter(item => item.logo);
  const collageHtml = logoItems.length > 0 ? buildCollage(logoItems) : '';

  el.innerHTML = `
    <div class="content-section internships-section">
      <div class="content-text">
        <h2 class="fw-bold">Internships</h2>
        <div class="accordion" id="internshipsAccordion">${accordionItems}</div>
      </div>
      ${collageHtml ? `<div class="collage-panel">${collageHtml}</div>` : ''}
    </div>`;
}

function buildCollage(items) {
  // Assign alternating size classes for organic feel
  // Subtle rotation values
  const tiles = items.map((item, i) => {
    return `
      <div class="collage-tile title="${item.company}">
        <img src="${item.logo}" alt="${item.company} logo" loading="lazy">
      </div>`;
  }).join('');

  return `<div class="collage" data-count="${items.length}">${tiles}</div>`;
}

/* ── PUBLICATIONS ────────────────────────────────────── */
function renderPublications(items) {
  const el = document.getElementById('publications');
  const accordionItems = items.map((item, i) => {
    const id = `pub-${i}`;
    return `
      <div class="accordion-item">
        <h4 class="accordion-header">
          <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false">
            <strong>${item.title}</strong>
          </button>
        </h4>
        <div id="${id}" class="accordion-collapse collapse" data-bs-parent="#publicationsAccordion">
          <div class="accordion-body">
            <p class="text-muted mb-1"><strong>${item.publisher} &bull; ${item.date}</strong></p>
            <p>${item.summary}</p>
            ${item.url ? `<p><a href="${item.url}" target="_blank" rel="noopener">Read Full Publication →</a></p>` : ''}
            ${item.citation ? `<p class="text-muted small"><strong>Citation:</strong> ${item.citation}</p>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="content-section">
      <div class="content-text">
        <h2 class="fw-bold">Publications</h2>
        <div class="accordion" id="publicationsAccordion">${accordionItems}</div>
      </div>
      <img src="images/research-papers-background.png" alt="Publications">
    </div>`;
}

/* ── CERTIFICATIONS ──────────────────────────────────── */
function renderCertifications(items) {
  const el = document.getElementById('certifications');
  const listItems = items.map(cert => {
    const name = cert.highlight
      ? cert.name.replace(/\b(CSPO|Generative AI|Black Belt|Power BI|Certified Scrum Product Owner)\b/g, '<strong>$1</strong>')
      : cert.name;
    return `<li>${name}</li>`;
  }).join('');

  el.innerHTML = `
    <div class="content-section">
      <div class="content-text">
        <h2 class="fw-bold">Certifications</h2>
        <ul>${listItems}</ul>
      </div>
      <img src="images/certs.png" alt="Certifications">
    </div>`;
}

/* ── ACHIEVEMENTS ────────────────────────────────────── */
function renderAchievements(items) {
  const el = document.getElementById('achievements');
  const accordionItems = items.map((item, i) => {
    const id = `ach-${i}`;
    return `
      <div class="accordion-item">
        <h4 class="accordion-header">
          <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false">
            <strong>${item.title}</strong>
          </button>
        </h4>
        <div id="${id}" class="accordion-collapse collapse" data-bs-parent="#achievementsAccordion">
          <div class="accordion-body">
            <p>${item.description}</p>
          </div>
        </div>
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="content-section">
      <div class="content-text">
        <h2 class="fw-bold">Achievements</h2>
        <div class="accordion" id="achievementsAccordion">${accordionItems}</div>
      </div>
    </div>`;
}

/* ── VOLUNTEER ───────────────────────────────────────── */
function renderVolunteer(items) {
  const el = document.getElementById('volunteer');
  const accordionItems = items.map((item, i) => {
    const id = `vol-${i}`;
    return `
      <div class="accordion-item">
        <h4 class="accordion-header">
          <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false">
            <strong>${item.title} – ${item.organization}</strong>
          </button>
        </h4>
        <div id="${id}" class="accordion-collapse collapse" data-bs-parent="#volunteerAccordion">
          <div class="accordion-body">
            <p>${item.description}</p>
          </div>
        </div>
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="content-section container my-5">
      <div class="content-text">
        <h2 class="fw-bold mb-4 text-center">Volunteer Experience</h2>
        <div class="accordion" id="volunteerAccordion">${accordionItems}</div>
      </div>
    </div>`;
}

/* ── CONTACT ─────────────────────────────────────────── */
function renderContact(meta) {
  const links = [
    { icon: 'bi-envelope-fill', label: 'Email', href: `mailto:${meta.email}`, text: meta.email },
    { icon: 'bi-linkedin', label: 'LinkedIn', href: meta.linkedin, text: 'View Profile' },
    { icon: 'bi-globe', label: 'Portfolio', href: meta.portfolio, text: meta.portfolio.replace('https://', '') },
    { icon: 'bi-journal-text', label: 'Google Scholar', href: meta.scholar, text: 'View Profile' },
    { icon: 'bi-bar-chart-line-fill', label: 'Kaggle', href: meta.kaggle, text: 'View Profile' },
    { icon: 'bi-pencil-square', label: 'Medium', href: meta.medium, text: 'View Profile' }
  ];

  const cards = links.map(link => `
    <div class="col-md-4">
      <div class="card shadow-sm border-0 h-100">
        <div class="card-body d-flex align-items-center">
          <i class="bi ${link.icon} display-6 me-3 text-primary"></i>
          <div>
            <h6 class="mb-1">${link.label}</h6>
            <a href="${link.href}" target="_blank" rel="noopener" class="text-decoration-none text-dark">${link.text}</a>
          </div>
        </div>
      </div>
    </div>`).join('');

  document.getElementById('contact').innerHTML = `
    <div class="content-section">
      <div class="content-text">
        <h2 class="fw-bold mb-5 text-center">Contact Information</h2>
        <div class="container">
          <div class="row g-4 justify-content-center">${cards}</div>
        </div>
      </div>
    </div>`;
}

/* ── SCROLL ANIMATIONS ───────────────────────────────── */
function initScrollAnimations() {
  const sections = document.querySelectorAll('.content-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(section => observer.observe(section));
}

/* ── INIT ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', loadPortfolio);