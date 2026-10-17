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

const skillLabData = {
  documentos: {
    kicker: 'Identidade aplicada',
    name: 'Documentos de centro',
    description: 'Aplica a identidade visual do CEIP sen perder lexibilidade, función nin control sobre a información.',
    origins: ['Contido e finalidade', 'Datos vixentes do centro', 'Guía visual e modelos ODT'],
    products: ['Ficha ou actividade', 'Circular, diploma ou certificado', 'PDF final verificado'],
    stages: [
      { title: 'Clasificar', detail: 'Identifica quen vai usar o documento, en que soporte e que acción debe permitir.' },
      { title: 'Compoñer', detail: 'Escolle unha plantilla oficial ou constrúe a xerarquía con tipografía, cor e espazos coherentes.' },
      { title: 'Revisar', detail: 'Comproba datos, accesibilidade, espazo real para responder e fidelidade á identidade.', human: true },
      { title: 'Renderizar', detail: 'Xera o formato solicitado e inspecciona todas as páxinas antes da entrega.' }
    ],
    example: {
      title: 'Ficha de valor posicional · 3.º EP',
      copy: 'Documento imprimible coa xerarquía visual, os espazos de resposta e a versión final preparados para unha revisión completa.',
      tags: ['A4', 'PDF', 'Actividade imprimible'],
      note: 'Exemplo real sen datos persoais do alumnado.',
      preview: { type: 'document', eyebrow: 'MATEMÁTICAS · 3.º EP', title: 'Valor posicional', meta: 'ENUNCIADO', rows: ['Descompón cada número', 'Representa as unidades', 'Explica o teu proceso'] }
    }
  },
  timbre: {
    kicker: 'Campaña multiformato',
    name: 'Timbre semanal',
    description: 'Coordina música, comunicación e pantallas nun fluxo único, con revisión antes de calquera despregamento.',
    origins: ['MP3 e información musical', 'Letras locais e portadas', 'Calendario lectivo e horarios'],
    products: ['Cartel A3 e PNG', 'Pantallas de letra 4K', 'WhatsApp e paquete para TV'],
    stages: [
      { title: 'Inventariar', detail: 'Detecta cancións, horas, idioma, portadas e correspondencia entre os ficheiros.' },
      { title: 'Adecuar', detail: 'Revisa transcrición, galego normativo e posibles expresións non axeitadas para o centro.', human: true },
      { title: 'Producir', detail: 'Compón os carteis, as pantallas de letra e a mensaxe semanal de difusión.' },
      { title: 'Autorizar', detail: 'Presenta o paquete completo e agarda unha aprobación expresa antes de conectar coas pantallas.', human: true },
      { title: 'Despregar', detail: 'Instala temporalmente, proba a restauración e conserva copias recuperables.' }
    ],
    example: {
      title: 'Campaña semanal · cartel e pantallas',
      copy: 'Unha mesma selección musical convértese en pezas coordinadas para impresión, móbil e as dúas televisións do centro.',
      tags: ['A3', '3840 × 2160', 'WhatsApp', 'TV'],
      note: 'A letra completa procede sempre dunha fonte local autorizada.',
      preview: { type: 'timbre', eyebrow: 'TIMBRE · ESTA SEMANA', title: 'Seis momentos, unha selección', meta: 'CEIP DE BELESAR', rows: ['08:30 · apertura', '11:20 · recreo', '12:10 · peche'] }
    }
  },
  semanario: {
    kicker: 'Memoria pública da aula',
    name: 'Semanario de aula',
    description: 'Converte notas e fotografías dispersas nunha crónica fiable, coidadosa coa privacidade e fácil de consultar.',
    origins: ['Notas de feitos realizados', 'Fotos da semana', 'Estado das semanas ISO'],
    products: ['Entrada web en galego', 'Galería con pés propios', 'Arquivo semanal navegable'],
    stages: [
      { title: 'Situar', detail: 'Distingue semanas publicadas, rematadas, actuais e incompletas antes de escoller.' },
      { title: 'Contrastar', detail: 'Cruza notas, datas e imaxes; unha actividade prevista non se presenta como realizada.' },
      { title: 'Protexer', detail: 'Retén imaxes dubidosas, retira datos persoais e documenta por que non se usa unha foto.', human: true },
      { title: 'Narrar', detail: 'Redacta en galego claro explicando que se fixo, como se organizou e que aprendizaxe deixou.' },
      { title: 'Publicar', detail: 'Só tras aprobación, xera miniaturas, comproba o carrusel e arquiva a semana verificada.', human: true }
    ],
    example: {
      title: 'Semana 41 · entrada con galería',
      copy: 'Unha portada breve conduce a apartados de aula e grupos de fotografías con pés informativos e copia ampliada.',
      tags: ['Web', 'Galería', 'Móbil', 'Arquivo'],
      note: 'A vista é unha representación; as fotografías reais seguen a política de publicación do centro.',
      preview: { type: 'web', eyebrow: 'SEMANARIO · SEMANA 41', title: 'Aprender tamén é deixar pegada', meta: '6 HISTORIAS · 18 FOTOS', rows: ['Investigamos', 'Construímos', 'Compartimos'] }
    }
  },
  avaliacion: {
    kicker: 'Devolución formativa',
    name: 'Traballos escaneados',
    description: 'Organiza lotes complexos e prepara evidencias e comentarios sen automatizar a decisión docente.',
    origins: ['PDF ou imaxes escaneadas', 'Actividade e criterios orixinais', 'Contexto do grupo'],
    products: ['PDF individual revisado', 'Informe xeral codificado', 'Nota para o seguimento docente'],
    stages: [
      { title: 'Inventariar', detail: 'Rexistra páxinas, orientación, lexibilidade, duplicados e OCR sen modificar os orixinais.' },
      { title: 'Agrupar', detail: 'Relaciona caras, actividade e código do alumno; as asociacións dubidosas quedan pendentes.' },
      { title: 'Propoñer', detail: 'Formula correccións, valoracións e destino, pero non escribe aínda nos documentos.' },
      { title: 'Validar', detail: 'O docente revisa emparellamentos, interpretación e devolución antes de xerar nada.', human: true },
      { title: 'Producir', detail: 'Crea e reabre os PDF, verifica o lote e consolida un seguimento minimizado.' }
    ],
    example: {
      title: 'Lote demostrativo · código A01',
      copy: 'A produción reúne as páxinas da actividade e engade unha devolución breve baseada só no que pode observarse.',
      tags: ['PDF individual', 'Informe codificado', 'Seguimento'],
      note: 'Demostración sintética: a web non publica traballos nin datos reais do alumnado.',
      preview: { type: 'evaluation', eyebrow: 'DEVOLUCIÓN · A01', title: 'Actividade de mostra', meta: 'REVISIÓN DOCENTE', rows: ['Logro comprobable', 'Evidencia observada', 'Seguinte paso concreto'] }
    }
  }
};

const labPanel = document.querySelector('#lab-panel');
const labTabs = [...document.querySelectorAll('[role="tab"][data-skill]')];
const labOrigins = document.querySelector('#lab-origins-list');
const labProducts = document.querySelector('#lab-products-list');
const labFlow = document.querySelector('#lab-flow');
const labStageDetail = document.querySelector('#lab-stage-detail');

function renderProductPreview(preview) {
  const rows = preview.rows.map((row) => `<span>${escapeHtml(row)}</span>`).join('');
  return `
    <div class="preview-art preview-${escapeHtml(preview.type)}">
      <p>${escapeHtml(preview.eyebrow)}</p>
      <strong>${escapeHtml(preview.title)}</strong>
      <small>${escapeHtml(preview.meta)}</small>
      <div>${rows}</div>
    </div>`;
}

function selectLabStage(index) {
  const activeKey = labPanel?.dataset.activeSkill;
  const stage = skillLabData[activeKey]?.stages[index];
  if (!stage || !labStageDetail) return;
  labFlow.querySelectorAll('button').forEach((button, buttonIndex) => {
    button.setAttribute('aria-pressed', String(buttonIndex === index));
  });
  labStageDetail.innerHTML = `
    <span>${stage.human ? 'Punto de control humano' : 'Paso do proceso'}</span>
    <strong>${escapeHtml(stage.title)}</strong>
    <p>${escapeHtml(stage.detail)}</p>`;
  labStageDetail.classList.toggle('is-human', Boolean(stage.human));
}

function renderSkillLab(key) {
  const skill = skillLabData[key];
  if (!skill || !labPanel) return;
  labPanel.dataset.activeSkill = key;
  labPanel.setAttribute('aria-labelledby', `tab-${key}`);
  document.querySelector('#lab-kicker').textContent = skill.kicker;
  document.querySelector('#lab-name').textContent = skill.name;
  document.querySelector('#lab-description').textContent = skill.description;
  labOrigins.innerHTML = skill.origins.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  labProducts.innerHTML = skill.products.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  labFlow.style.setProperty('--stage-count', skill.stages.length);
  labFlow.innerHTML = skill.stages.map((stage, index) => `
    <button type="button" class="${stage.human ? 'is-human' : ''}" data-stage="${index}" aria-pressed="${index === 0}">
      <span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(stage.title)}${stage.human ? '<i aria-hidden="true">●</i>' : ''}
    </button>`).join('');
  document.querySelector('#lab-example-title').textContent = skill.example.title;
  document.querySelector('#lab-example-copy').textContent = skill.example.copy;
  document.querySelector('#lab-example-tags').innerHTML = skill.example.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('');
  document.querySelector('#lab-example-note').textContent = skill.example.note;
  document.querySelector('#lab-preview').innerHTML = renderProductPreview(skill.example.preview);

  labTabs.forEach((tab) => {
    const selected = tab.dataset.skill === key;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  selectLabStage(0);
}

labTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderSkillLab(tab.dataset.skill));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + labTabs.length) % labTabs.length;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % labTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = labTabs.length - 1;
    labTabs[nextIndex].focus();
    renderSkillLab(labTabs[nextIndex].dataset.skill);
  });
});

labFlow?.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-stage]');
  if (button) selectLabStage(Number(button.dataset.stage));
});

document.querySelectorAll('[data-open-skill]').forEach((link) => {
  link.addEventListener('click', () => renderSkillLab(link.dataset.openSkill));
});

if (labPanel) renderSkillLab('documentos');

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
