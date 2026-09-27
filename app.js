const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('#main-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mainNav?.classList.toggle('open', !open);
});

mainNav?.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menuButton?.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('open');
  }
});

const trainings = Array.isArray(window.TRAINING_DATA) ? window.TRAINING_DATA : [];
const trainingList = document.querySelector('#training-list');
const searchInput = document.querySelector('#training-search');
const topicSelect = document.querySelector('#training-topic');
const yearSelect = document.querySelector('#training-year');
const sortSelect = document.querySelector('#training-sort');
const countLabel = document.querySelector('#training-count');
const clearButton = document.querySelector('#clear-filters');
const loadMoreButton = document.querySelector('#load-more');
let visibleLimit = 10;

const normalize = (value) => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function populateFilters() {
  const topics = [...new Set(trainings.map((item) => item.topic))].sort((a, b) => a.localeCompare(b, 'gl'));
  const years = [...new Set(trainings.map((item) => item.year))].sort((a, b) => b - a);
  topics.forEach((topic) => topicSelect?.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(topic)}">${escapeHtml(topic)}</option>`));
  years.forEach((year) => yearSelect?.insertAdjacentHTML('beforeend', `<option value="${year}">${year}</option>`));
}

function matchingTrainings() {
  const query = normalize(searchInput?.value.trim());
  const topic = topicSelect?.value ?? '';
  const year = Number(yearSelect?.value || 0);
  const order = sortSelect?.value === 'asc' ? 1 : -1;

  return trainings
    .filter((item) => !topic || item.topic === topic)
    .filter((item) => !year || item.year === year)
    .filter((item) => !query || normalize([item.code, item.title, item.entity, item.detail, item.topic].join(' ')).includes(query))
    .sort((a, b) => ((a.year - b.year) || a.code.localeCompare(b.code)) * order);
}

function renderTrainings(reset = false) {
  if (!trainingList) return;
  if (reset) visibleLimit = 10;
  const matches = matchingTrainings();
  const visible = matches.slice(0, visibleLimit);
  countLabel.textContent = `${matches.length} ${matches.length === 1 ? 'resultado' : 'resultados'}`;

  if (!visible.length) {
    trainingList.innerHTML = '<p class="no-results">Non hai rexistros que coincidan coa busca. Proba outro termo ou limpa os filtros.</p>';
  } else {
    trainingList.innerHTML = visible.map((item) => `
      <article class="training-item">
        <div class="training-year">${item.year}</div>
        <div class="training-main">
          <span class="training-topic">${escapeHtml(item.topic)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.code)} · ${escapeHtml(item.detail)}</p>
        </div>
        <p class="training-entity">${escapeHtml(item.entity)}</p>
        <div class="training-hours">${item.hours} h</div>
      </article>`).join('');
  }

  loadMoreButton.hidden = visible.length >= matches.length;
  loadMoreButton.textContent = `Mostrar máis (${matches.length - visible.length})`;
}

function updateSummary() {
  const totalHours = trainings.reduce((sum, item) => sum + Number(item.hours || 0), 0);
  const years = trainings.map((item) => item.year);
  document.querySelector('#training-total').textContent = trainings.length;
  document.querySelector('#training-hours').textContent = totalHours.toLocaleString('gl-ES');
  document.querySelector('#training-range').textContent = `${Math.min(...years)}–${Math.max(...years)}`;
}

[searchInput, topicSelect, yearSelect, sortSelect].forEach((control) => {
  control?.addEventListener(control === searchInput ? 'input' : 'change', () => renderTrainings(true));
});

clearButton?.addEventListener('click', () => {
  searchInput.value = '';
  topicSelect.value = '';
  yearSelect.value = '';
  sortSelect.value = 'desc';
  searchInput.focus();
  renderTrainings(true);
});

loadMoreButton?.addEventListener('click', () => {
  visibleLimit += 10;
  renderTrainings();
});

if (trainings.length) {
  populateFilters();
  updateSummary();
  renderTrainings();
}
