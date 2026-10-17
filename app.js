const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('#main-nav');
const assetPrefix = document.body.dataset.assetPrefix || '';

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
    diagram: { src: 'assets/diagramas-fluxo/documentos.png', title: 'Fluxo lóxico dos documentos de centro', caption: 'Entrada, decisións, revisión docente e exportación final nun esquema normalizado.', alt: 'Diagrama de fluxo normalizado da automatización de documentos de centro' },
    stages: [
      { title: 'Clasificar', detail: 'Identifica quen vai usar o documento, en que soporte e que acción debe permitir.' },
      { title: 'Compoñer', detail: 'Escolle unha plantilla oficial ou constrúe a xerarquía con tipografía, cor e espazos coherentes.' },
      { title: 'Revisar', detail: 'Comproba datos, accesibilidade, espazo real para responder e fidelidade á identidade.', human: true },
      { title: 'Renderizar', detail: 'Xera o formato solicitado e inspecciona todas as páxinas antes da entrega.' }
    ],
    example: {
      title: 'Ficha, circular e diploma',
      copy: 'A mesma skill pode producir materiais de aula, comunicacións para as familias e pezas institucionais coa identidade do centro.',
      tags: ['A4', 'PDF imprimible', 'DOCX ou ODT editable'],
      note: 'Exemplos reais da biblioteca oficial de estilo do CEIP. Mantéñense os campos como marcadores, sen nomes de persoas.',
      samples: [
        { type: 'document', format: 'Modelo oficial editable', title: 'Circular ás familias', caption: 'Cabeceira, xerarquía, corpo e peche institucional listos para adaptar.', src: 'assets/laboratorio-real/documento-circular.png', alt: 'Plantilla oficial real dunha circular ás familias do CEIP de Belesar' },
        { type: 'document', format: 'Modelo oficial editable', title: 'Certificado', caption: 'Certificado de participación coa identidade completa do centro.', src: 'assets/laboratorio-real/documento-certificado.png', alt: 'Plantilla oficial real dun certificado do CEIP de Belesar' },
        { type: 'document', format: 'Modelo oficial editable', title: 'Diploma', caption: 'Diploma horizontal preparado para personalizar, imprimir ou exportar.', src: 'assets/laboratorio-real/documento-diploma.png', alt: 'Plantilla oficial real dun diploma do CEIP de Belesar' }
      ]
    }
  },
  timbre: {
    kicker: 'Campaña multiformato',
    name: 'Timbre semanal',
    description: 'Coordina música, comunicación e pantallas nun fluxo único, con revisión antes de calquera despregamento.',
    origins: ['MP3 e información musical', 'Letras locais e portadas', 'Calendario lectivo e horarios'],
    products: ['Cartel A3 e PNG', 'Pantallas de letra 4K', 'WhatsApp e paquete para TV'],
    diagram: { src: 'assets/diagramas-fluxo/timbre.png', title: 'Fluxo lóxico do timbre semanal', caption: 'A selección musical convértese nun paquete multiformato só despois dos controis e da aprobación humana.', alt: 'Diagrama de fluxo normalizado da automatización do timbre semanal' },
    stages: [
      { title: 'Inventariar', detail: 'Detecta cancións, horas, idioma, portadas e correspondencia entre os ficheiros.' },
      { title: 'Adecuar', detail: 'Revisa transcrición, galego normativo e posibles expresións non axeitadas para o centro.', human: true },
      { title: 'Producir', detail: 'Compón os carteis, as pantallas de letra e a mensaxe semanal de difusión.' },
      { title: 'Autorizar', detail: 'Presenta o paquete completo e agarda unha aprobación expresa antes de conectar coas pantallas.', human: true },
      { title: 'Despregar', detail: 'Instala temporalmente, proba a restauración e conserva copias recuperables.' }
    ],
    example: {
      title: 'Cartel, pantalla e mensaxe semanal',
      copy: 'Unha mesma selección musical convértese nun paquete coordinado para o corredor, as televisións e a difusión ás familias.',
      tags: ['A3', '3840 × 2160', 'WhatsApp', 'TV'],
      note: 'Produtos reais da campaña do 5 de outubro de 2026 e unha mensaxe semanal xa preparada. Non se publican letras completas.',
      samples: [
        { type: 'poster', format: 'A3 · PNG/PDF', title: 'Cartel semanal', caption: 'Versión vertical para imprimir e colocar no centro.', src: 'assets/laboratorio-real/timbre-cartel-a3.png', alt: 'Cartel A3 real do Timbre Belesar da semana do 5 de outubro de 2026' },
        { type: 'screen', format: '3840 × 2160', title: 'Cartel para as pantallas', caption: 'Versión 16:9 para as televisións do corredor e da biblioteca.', src: 'assets/laboratorio-real/timbre-cartel-16x9.png', alt: 'Cartel horizontal real para as pantallas do Timbre Belesar' },
        { type: 'message', format: 'WhatsApp', title: 'Mensaxe semanal', caption: 'Texto real listo para copiar e difundir á comunidade educativa.', text: '🎶 *Esta semana, o timbre convida a falar, bailar e compartir.*\n\nÁs veces unha pequena conversa é o mellor xeito de empezar o día. Logo chegan novas voces cunha invitación directa: sácame a bailar.\n\n🎧 *Timbre Belesar 26-27*' }
      ]
    }
  },
  semanario: {
    kicker: 'Memoria pública da aula',
    name: 'Semanario de aula',
    description: 'Converte notas e fotografías dispersas nunha crónica fiable, coidadosa coa privacidade e fácil de consultar.',
    origins: ['Notas de feitos realizados', 'Fotos da semana', 'Estado das semanas ISO'],
    products: ['Entrada web en galego', 'Galería con pés propios', 'Arquivo semanal navegable'],
    diagram: { src: 'assets/diagramas-fluxo/semanario.png', title: 'Fluxo lóxico do semanario', caption: 'Contraste, privacidade e revisión docente forman parte do proceso antes de publicar e arquivar.', alt: 'Diagrama de fluxo normalizado da automatización do semanario de aula' },
    stages: [
      { title: 'Situar', detail: 'Distingue semanas publicadas, rematadas, actuais e incompletas antes de escoller.' },
      { title: 'Contrastar', detail: 'Cruza notas, datas e imaxes; unha actividade prevista non se presenta como realizada.' },
      { title: 'Protexer', detail: 'Retén imaxes dubidosas, retira datos persoais e documenta por que non se usa unha foto.', human: true },
      { title: 'Narrar', detail: 'Redacta en galego claro explicando que se fixo, como se organizou e que aprendizaxe deixou.' },
      { title: 'Publicar', detail: 'Só tras aprobación, xera miniaturas, comproba o carrusel e arquiva a semana verificada.', human: true }
    ],
    example: {
      title: 'Un semanario completo de exemplo',
      copy: 'Unha copia navegable da semana 41 permite ver a crónica, a xerarquía editorial e a galería no seu contexto real.',
      tags: ['Web', 'Galería', 'Móbil', 'Arquivo'],
      note: 'Copia pública anonimizada: non aparecen nomes e todos os rostros visibles do alumnado están pixelados.',
      samples: [
        { type: 'page', format: 'Páxina web · S41', title: 'Semanario de exemplo', caption: 'Abre unha semana completa dentro desta web, con fotografías reais anonimizadas.', src: 'assets/semanario-exemplo/vivaldi-aula-pixelada.png', alt: 'Vista previa do semanario de exemplo con alumnado pixelado', href: 'semanario-exemplo/' }
      ]
    }
  },
  avaliacion: {
    kicker: 'Devolución formativa',
    name: 'Traballos escaneados',
    description: 'Organiza lotes complexos e prepara evidencias e comentarios sen automatizar a decisión docente.',
    origins: ['PDF ou imaxes escaneadas', 'Actividade e criterios orixinais', 'Contexto do grupo'],
    products: ['PDF individual revisado', 'Informe xeral codificado', 'Nota para o seguimento docente'],
    diagram: { src: 'assets/diagramas-fluxo/escaneos.png', title: 'Fluxo lóxico dos traballos escaneados', caption: 'As páxinas agrúpanse por código, revísanse con criterios e só se producen despois da validación docente.', alt: 'Diagrama de fluxo normalizado da automatización de traballos escaneados' },
    stages: [
      { title: 'Inventariar', detail: 'Rexistra páxinas, orientación, lexibilidade, duplicados e OCR sen modificar os orixinais.' },
      { title: 'Agrupar', detail: 'Relaciona caras, actividade e código do alumno; as asociacións dubidosas quedan pendentes.' },
      { title: 'Propoñer', detail: 'Formula correccións, valoracións e destino, pero non escribe aínda nos documentos.' },
      { title: 'Validar', detail: 'O docente revisa emparellamentos, interpretación e devolución antes de xerar nada.', human: true },
      { title: 'Producir', detail: 'Crea e reabre os PDF, verifica o lote e consolida un seguimento minimizado.' }
    ],
    example: {
      title: 'Un traballo real e a súa devolución',
      copy: 'Dúas páxinas do mesmo PDF mostran a produción manuscrita xa comentada e a devolución formativa final.',
      tags: ['Traballo real', 'Corrección contextual', 'Devolución final'],
      note: 'Exemplo real anonimizado: seleccionáronse páxinas sen nome, apelidos nin código persoal visible.',
      samples: [
        { type: 'feedback', format: 'PDF · páxina de traballo', title: 'Texto manuscrito corrixido', caption: 'A produción mantense visible e engádese unha indicación formativa concreta ao pé.', src: 'assets/laboratorio-real/escaneo-traballo-corrixido.png', alt: 'Páxina real anonimizada dun texto manuscrito cun comentario de corrección' },
        { type: 'feedback', format: 'PDF · devolución final', title: 'Valoración para continuar', caption: 'A síntese recolle logros observables e aspectos que aínda están en proceso.', src: 'assets/laboratorio-real/escaneo-devolucion-final.png', alt: 'Páxina real anonimizada coa devolución formativa final do mesmo traballo' }
      ]
    }
  }
};

const labPanel = document.querySelector('#lab-panel');
const labTabs = [...document.querySelectorAll('[role="tab"][data-skill]')];
const labOrigins = document.querySelector('#lab-origins-list');
const labProducts = document.querySelector('#lab-products-list');
const labFlow = document.querySelector('#lab-flow');
const labStageDetail = document.querySelector('#lab-stage-detail');
const labDiagram = document.querySelector('#lab-diagram');

function renderProductPreview(samples) {
  return samples.map((sample, index) => {
    const number = String(index + 1).padStart(2, '0');
    if (sample.text) {
      return `
        <article class="preview-sample preview-${escapeHtml(sample.type)} preview-text-sample">
          <div class="preview-sample-head">
            <span>${number}</span>
            <small>${escapeHtml(sample.format)}</small>
          </div>
          <strong>${escapeHtml(sample.title)}</strong>
          <pre>${escapeHtml(sample.text)}</pre>
          <p>${escapeHtml(sample.caption)}</p>
        </article>`;
    }
    if (sample.href) {
      return `
        <figure class="preview-sample preview-${escapeHtml(sample.type)} preview-page-sample">
          <a class="preview-media" href="${escapeHtml(assetPrefix + sample.href)}" aria-label="Abrir dentro da web: ${escapeHtml(sample.title)}">
            <img src="${escapeHtml(assetPrefix + sample.src)}" alt="${escapeHtml(sample.alt)}" loading="lazy" decoding="async">
            <span>Abrir páxina web</span>
          </a>
          <figcaption>
            <div class="preview-sample-head"><span>${number}</span><small>${escapeHtml(sample.format)}</small></div>
            <strong>${escapeHtml(sample.title)}</strong>
            <p>${escapeHtml(sample.caption)}</p>
          </figcaption>
        </figure>`;
    }
    return `
      <figure class="preview-sample preview-${escapeHtml(sample.type)}">
        <button type="button" class="preview-media gallery-trigger" data-gallery-src="${escapeHtml(assetPrefix + sample.src)}" data-gallery-title="${escapeHtml(sample.title)}" data-gallery-caption="${escapeHtml(sample.caption)}" aria-label="Abrir na galería: ${escapeHtml(sample.title)}">
          <img src="${escapeHtml(assetPrefix + sample.src)}" alt="${escapeHtml(sample.alt)}" loading="lazy" decoding="async">
          <span>Ver na galería</span>
        </button>
        <figcaption>
          <div class="preview-sample-head"><span>${number}</span><small>${escapeHtml(sample.format)}</small></div>
          <strong>${escapeHtml(sample.title)}</strong>
          <p>${escapeHtml(sample.caption)}</p>
        </figcaption>
      </figure>`;
  }).join('');
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
  document.querySelector('#lab-preview').innerHTML = renderProductPreview(skill.example.samples);
  labDiagram.innerHTML = `
    <button type="button" class="diagram-media gallery-trigger" data-gallery-src="${escapeHtml(assetPrefix + skill.diagram.src)}" data-gallery-title="${escapeHtml(skill.diagram.title)}" data-gallery-caption="${escapeHtml(skill.diagram.caption)}" aria-label="Ampliar: ${escapeHtml(skill.diagram.title)}">
      <img src="${escapeHtml(assetPrefix + skill.diagram.src)}" alt="${escapeHtml(skill.diagram.alt)}" loading="lazy" decoding="async">
      <span>Ampliar diagrama</span>
    </button>
    <figcaption><strong>${escapeHtml(skill.diagram.title)}</strong><span>${escapeHtml(skill.diagram.caption)}</span></figcaption>`;

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

const mediaDialog = document.querySelector('#media-dialog');
const mediaDialogImage = document.querySelector('#media-dialog-image');
const mediaDialogTitle = document.querySelector('#media-dialog-title');
const mediaDialogCaption = document.querySelector('#media-dialog-caption');
const mediaDialogCounter = document.querySelector('#media-dialog-counter');
let galleryItems = [];
let galleryIndex = 0;

function showGalleryItem(index) {
  if (!galleryItems.length) return;
  galleryIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[galleryIndex];
  mediaDialogImage.src = item.dataset.gallerySrc;
  mediaDialogImage.alt = item.querySelector('img')?.alt || item.dataset.galleryTitle || '';
  mediaDialogTitle.textContent = item.dataset.galleryTitle || '';
  mediaDialogCaption.textContent = item.dataset.galleryCaption || '';
  mediaDialogCounter.textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
}

function openGallery(trigger) {
  galleryItems = [...document.querySelectorAll('.gallery-trigger')];
  showGalleryItem(galleryItems.indexOf(trigger));
  const hasMultipleItems = galleryItems.length > 1;
  document.querySelector('#media-dialog-prev').hidden = !hasMultipleItems;
  document.querySelector('#media-dialog-next').hidden = !hasMultipleItems;
  if (typeof mediaDialog.showModal === 'function') mediaDialog.showModal();
  else mediaDialog.setAttribute('open', '');
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('.gallery-trigger');
  if (trigger) openGallery(trigger);
});

document.querySelector('#media-dialog-close')?.addEventListener('click', () => mediaDialog.close());
document.querySelector('#media-dialog-prev')?.addEventListener('click', () => showGalleryItem(galleryIndex - 1));
document.querySelector('#media-dialog-next')?.addEventListener('click', () => showGalleryItem(galleryIndex + 1));
mediaDialog?.addEventListener('click', (event) => {
  if (event.target === mediaDialog) mediaDialog.close();
});
mediaDialog?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showGalleryItem(galleryIndex - 1);
  if (event.key === 'ArrowRight') showGalleryItem(galleryIndex + 1);
});

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

if (trainingList && trainings.length) {
  populateFilters();
  updateSummary();
  renderTrainings();
}
