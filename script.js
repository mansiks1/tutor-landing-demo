import { site } from "./content.js";

// Экранирование сохраняет введённый текст текстом, а не HTML-разметкой.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (symbol) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[symbol]);
}

function mount(id, markup) {
  document.getElementById(id).innerHTML = markup;
}

function renderList(items, className) {
  return `<ul class="${className}">${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
}

function renderHeading(id, eyebrow, title, text = "") {
  return `<div class="section-heading">
    <p class="eyebrow">${escapeHTML(eyebrow)}</p>
    <h2 id="${id}-title">${escapeHTML(title)}</h2>
    ${text ? `<p class="section-intro">${escapeHTML(text)}</p>` : ""}
  </div>`;
}

function renderHeader() {
  const { brand, ui } = site;
  mount("header", `<a class="skip-link" href="#main">${escapeHTML(ui.skipLink)}</a>
    <div class="container header-inner">
      <a class="brand" href="#hero">
        <span class="brand-mark" aria-hidden="true">${escapeHTML(brand.monogram)}</span>
        <span><strong>${escapeHTML(brand.name)}</strong><small>${escapeHTML(brand.slogan)}</small></span>
      </a>
      <button class="menu-toggle" type="button" aria-controls="navigation" aria-expanded="false"
        aria-label="${escapeHTML(ui.menuOpen)}"><span></span><span></span><span></span></button>
      <nav id="navigation" aria-label="${escapeHTML(ui.navigationLabel)}">
        ${ui.navigation.map((item) => `<a href="${escapeHTML(item.href)}">${escapeHTML(item.label)}</a>`).join("")}
      </nav>
    </div>`);
}

function renderHero() {
  const data = site.hero;
  mount("hero", `<div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">${escapeHTML(data.eyebrow)}</p>
      <h1 id="hero-title">${escapeHTML(data.title)}</h1>
      <p class="hero-description">${escapeHTML(data.subtitle)}</p>
      <div class="hero-actions">
        <a class="button" href="#booking">${escapeHTML(data.buttonText)}<span class="arrow" aria-hidden="true"></span></a>
        <a class="text-link" href="#about">${escapeHTML(data.secondaryText)}</a>
      </div>
      <p class="small-note">${escapeHTML(data.note)}</p>
    </div>
    <div class="lesson-art">
      <span class="art-orbit" aria-hidden="true"></span>
      <div class="lesson-card">
        <p class="eyebrow">${escapeHTML(data.cardLabel)}</p>
        <p class="lesson-title">${escapeHTML(data.cardTitle)}</p>
        <p>${escapeHTML(data.cardNote)}</p>
        <span class="card-flower" aria-hidden="true"></span>
      </div>
      <p class="art-caption">${escapeHTML(data.bottomNote)}</p>
    </div>
  </div><div class="container">${renderList(data.tags, "hero-tags")}</div>`);
}

function renderAbout() {
  const data = site.about;
  const photo = data.photo
    ? `<img src="${escapeHTML(data.photo)}" alt="${escapeHTML(data.photoAlt)}" loading="lazy" width="640" height="720">`
    : `<div class="photo-placeholder" role="img" aria-label="${escapeHTML(data.photoLabel)}">
        <span class="portrait-icon" aria-hidden="true"></span><span>${escapeHTML(data.photoLabel)}</span></div>`;
  mount("about", `<div class="container about-grid">
    <figure class="portrait">${photo}<figcaption>${escapeHTML(data.photoCaption)}</figcaption></figure>
    <div>${renderHeading("about", data.eyebrow, data.heading)}
      <h3>${escapeHTML(data.name)}</h3>
      <p>${escapeHTML(data.text)}</p><p>${escapeHTML(data.details)}</p>
      ${renderList(data.facts, "fact-list")}
    </div>
  </div>`);
}

function renderSubject(subject, index) {
  const labels = site.ui.pricing;
  return `<article class="price-card">
    <div class="card-top"><span class="card-number">${String(index + 1).padStart(2, "0")}</span>
      <span>${escapeHTML(subject.duration)} ${escapeHTML(labels.minutes)}</span></div>
    <h3>${escapeHTML(subject.name)}</h3><p>${escapeHTML(subject.description)}</p>
    <p class="course-tag">${escapeHTML(subject.tag)}</p>
    <div class="price"><strong>${escapeHTML(subject.price)} ${escapeHTML(labels.currency)}</strong>
      <span>${escapeHTML(labels.perLesson)}</span></div>
    <a class="button button-outline" href="#booking" data-subject="${escapeHTML(subject.name)}">
      ${escapeHTML(labels.buttonText)}<span class="arrow" aria-hidden="true"></span></a>
  </article>`;
}

function renderPricing() {
  const data = site.ui.pricing;
  mount("pricing", `<div class="container">
    ${renderHeading("pricing", data.eyebrow, data.title, data.text)}
    <div class="cards-grid">${site.subjects.map(renderSubject).join("")}</div>
    <p class="small-note">${escapeHTML(data.note)}</p>
  </div>`);
}

function renderReview(review) {
  const labels = site.ui.reviews;
  const rating = Math.max(0, Math.min(labels.maxRating, Math.round(review.rating)));
  return `<article class="review-card">
    <p class="stars" aria-label="${escapeHTML(`${labels.ratingLabel}: ${rating} ${labels.ratingOutOf} ${labels.maxRating}`)}">
      <span aria-hidden="true">${escapeHTML(labels.star.repeat(rating))}</span></p>
    <blockquote><p>${escapeHTML(review.text)}</p></blockquote>
    <div class="review-author"><span class="avatar" aria-hidden="true">${escapeHTML(review.name.slice(0, 1))}</span>
      <div><h3>${escapeHTML(review.name)}</h3><p>${escapeHTML(review.detail)}</p></div></div>
  </article>`;
}

function renderReviews() {
  const data = site.ui.reviews;
  mount("reviews", `<div class="container">
    ${renderHeading("reviews", data.eyebrow, data.title, data.text)}
    <div class="cards-grid">${site.reviews.map(renderReview).join("")}</div>
  </div>`);
}

function renderField(name) {
  const data = site.ui.booking.fields[name];
  const common = `id="field-${name}" name="${name}" required aria-describedby="error-${name}"`;
  const control = name === "subject"
    ? `<select ${common}><option value="">${escapeHTML(data.placeholder)}</option>
        ${site.formSubjects.map((subject) => `<option value="${escapeHTML(subject)}">${escapeHTML(subject)}</option>`).join("")}</select>`
    : `<input ${common} type="text" maxlength="${name === "time" ? 200 : 100}"
        autocomplete="${name === "name" ? "name" : "off"}" placeholder="${escapeHTML(data.placeholder)}">`;
  return `<div class="form-field"><label for="field-${name}">${escapeHTML(data.label)}</label>
    ${control}<span class="field-error" id="error-${name}"></span></div>`;
}

function renderBooking() {
  const data = site.ui.booking;
  mount("booking", `<div class="container booking-grid">
    <div>${renderHeading("booking", data.eyebrow, data.title, data.text)}
      ${renderList(data.perks, "booking-perks")}</div>
    <form id="booking-form" novalidate aria-labelledby="form-title">
      <h3 id="form-title">${escapeHTML(data.formTitle)}</h3>
      <p class="small-note">${escapeHTML(data.requiredNote)}</p>
      ${["name", "contact", "subject", "time"].map(renderField).join("")}
      <button class="button" type="submit">${escapeHTML(data.submitText)}<span class="arrow" aria-hidden="true"></span></button>
      <p class="form-note">${escapeHTML(data.demoNote)}</p>
      <div class="form-status" id="form-status" role="status" aria-live="polite" tabindex="-1"></div>
    </form>
  </div>`);
}

function renderFooter() {
  const { brand, contacts, footerNote, ui } = site;
  const data = ui.footer;
  mount("footer", `<div class="container">
    <div class="footer-top"><p class="footer-title">${escapeHTML(data.title)}</p>
      <a class="text-link" href="#hero">${escapeHTML(data.backToTop)}</a></div>
    <div class="footer-bottom"><div><strong>${escapeHTML(brand.name)}</strong><p>${escapeHTML(footerNote)}</p></div>
      <address aria-label="${escapeHTML(data.contactsLabel)}">
        <a href="tel:${escapeHTML(contacts.phone.replace(/[^+\d]/g, ""))}">${escapeHTML(data.phoneLabel)}: ${escapeHTML(contacts.phone)}</a>
        <a href="https://t.me/${encodeURIComponent(contacts.telegram.replace(/^@/, ""))}">${escapeHTML(data.telegramLabel)}: ${escapeHTML(contacts.telegram)}</a>
        <a href="mailto:${escapeHTML(contacts.email)}">${escapeHTML(data.emailLabel)}: ${escapeHTML(contacts.email)}</a>
      </address></div>
  </div>`);
}

function renderSite() {
  document.title = site.ui.pageTitle;
  document.querySelector('meta[name="description"]').content = site.ui.description;
  [renderHeader, renderHero, renderAbout, renderPricing, renderReviews, renderBooking, renderFooter]
    .forEach((render) => render());
}

renderSite();
