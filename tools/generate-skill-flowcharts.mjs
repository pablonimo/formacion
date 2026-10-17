import fs from 'node:fs';
import path from 'node:path';

const outputDir = path.resolve('assets/diagramas-fluxo');
fs.mkdirSync(outputDir, { recursive: true });

const diagrams = [
  {
    slug: 'documentos',
    title: 'DOCUMENTOS DE CENTRO',
    input: ['Finalidade + contido', '+ datos vixentes'],
    process1: ['Clasificar o tipo', 'e escoller plantilla'],
    decision1: ['Datos completos', 'e formato axeitado?'],
    correction1: ['Completar datos', 'ou cambiar modelo'],
    process2: ['Compoñer coa', 'identidade do CEIP'],
    decision2: ['Revisión docente', 'e visual superada?'],
    correction2: ['Corrixir contido', 'ou maquetación'],
    output: ['DOCX / ODT', '+ PDF verificado'],
    end: ['Documento listo', 'para usar']
  },
  {
    slug: 'timbre',
    title: 'TIMBRE SEMANAL',
    input: ['Música + calendario', '+ materiais locais'],
    process1: ['Inventariar cancións,', 'horarios e formatos'],
    decision1: ['Fontes e contido', 'son utilizables?'],
    correction1: ['Substituír fonte', 'ou adecuar selección'],
    process2: ['Producir A3, 16:9', 'e mensaxe semanal'],
    decision2: ['Aprobación humana', 'expresa?'],
    correction2: ['Revisar paquete', 'e presentar de novo'],
    output: ['Paquete multiformato', '+ programación temporal'],
    end: ['Campaña publicada', 'e recuperable']
  },
  {
    slug: 'semanario',
    title: 'SEMANARIO DE AULA',
    input: ['Notas + fotografías', '+ estado da semana'],
    process1: ['Ordenar feitos', 'e contrastar datas'],
    decision1: ['Feitos confirmados', 'e privacidade segura?'],
    correction1: ['Retirar, pixelar', 'ou marcar a dúbida'],
    process2: ['Redactar crónica', 'e pés de foto'],
    decision2: ['Revisión docente', 'aprobada?'],
    correction2: ['Axustar texto,', 'imaxes ou orde'],
    output: ['Entrada web + galería', '+ índice semanal'],
    end: ['Semana publicada', 'e arquivada']
  },
  {
    slug: 'escaneos',
    title: 'TRABALLOS ESCANEADOS',
    input: ['Lote PDF / imaxes', '+ tarefa e criterios'],
    process1: ['Separar páxinas', 'e agrupar por código'],
    decision1: ['Emparellamento', 'completo e fiable?'],
    correction1: ['Resolver páxinas', 'coa revisión humana'],
    process2: ['Analizar evidencias', 'e propoñer devolución'],
    decision2: ['Validación docente', 'superada?'],
    correction2: ['Corrixir asociación', 'ou comentario'],
    output: ['PDF individual', '+ informe codificado'],
    end: ['Lote verificado', 'e rexistrado']
  }
];

const esc = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const textLines = (lines, x, y, className = 'node-text', lineHeight = 38) => {
  const start = y - ((lines.length - 1) * lineHeight) / 2;
  return `<text x="${x}" y="${start}" class="${className}">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? lineHeight : 0}">${esc(line)}</tspan>`).join('')}</text>`;
};

function buildSvg(data) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1600" viewBox="0 0 1600 1600" role="img" aria-labelledby="title desc">
  <title id="title">Fluxo lóxico: ${esc(data.title)}</title>
  <desc id="desc">Diagrama de fluxo normalizado con entradas, procesos, decisións, revisión humana, saída e final.</desc>
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L8,4 L0,8 z" fill="#6f8178"/>
    </marker>
    <style>
      .title{font:800 48px Arial,sans-serif;letter-spacing:3px;fill:#f3efe7;text-anchor:middle}
      .legend{font:600 22px Arial,sans-serif;fill:#aeb9b2;text-anchor:middle}
      .node-text{font:700 31px Arial,sans-serif;fill:#172023;text-anchor:middle}
      .decision-text{font:800 30px Arial,sans-serif;fill:#172023;text-anchor:middle}
      .label{font:800 24px Arial,sans-serif;fill:#f3efe7;text-anchor:middle}
      .arrow{fill:none;stroke:#6f8178;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;marker-end:url(#arrow)}
      .loop{stroke:#e57a4a}
    </style>
  </defs>
  <rect width="1600" height="1600" rx="72" fill="#111719"/>
  <text x="800" y="70" class="title">${esc(data.title)}</text>
  <text x="800" y="115" class="legend">elipse: inicio/final · paralelogramo: entrada/saída · rectángulo: proceso · rombo: decisión</text>

  <ellipse cx="800" cy="195" rx="245" ry="52" fill="#a9b7aa"/>
  ${textLines(['INICIO'], 800, 205)}
  <path class="arrow" d="M800 247 V278"/>

  <path d="M525 280 H1115 L1075 390 H485 Z" fill="#f3efe7" stroke="#a9b7aa" stroke-width="8"/>
  ${textLines(data.input, 800, 337)}
  <path class="arrow" d="M800 390 V448"/>

  <rect x="485" y="450" width="630" height="120" rx="18" fill="#dfe7df"/>
  ${textLines(data.process1, 800, 513)}
  <path class="arrow" d="M800 570 V585"/>

  <path d="M800 585 L1040 680 L800 775 L560 680 Z" fill="#f3c94f"/>
  ${textLines(data.decision1, 800, 682, 'decision-text')}
  <text x="855" y="812" class="label">SI</text>
  <path class="arrow" d="M800 775 V840"/>
  <text x="1080" y="648" class="label">NON</text>
  <path class="arrow loop" d="M1040 680 H1115"/>
  <rect x="1115" y="625" width="400" height="110" rx="18" fill="#e57a4a"/>
  ${textLines(data.correction1, 1315, 682)}
  <path class="arrow loop" d="M1315 625 V510 H1125"/>

  <rect x="485" y="840" width="630" height="120" rx="18" fill="#dfe7df"/>
  ${textLines(data.process2, 800, 903)}
  <path class="arrow" d="M800 960 V975"/>

  <path d="M800 975 L1040 1070 L800 1165 L560 1070 Z" fill="#f3c94f"/>
  ${textLines(data.decision2, 800, 1072, 'decision-text')}
  <text x="855" y="1202" class="label">SI</text>
  <path class="arrow" d="M800 1165 V1230"/>
  <text x="1080" y="1038" class="label">NON</text>
  <path class="arrow loop" d="M1040 1070 H1115"/>
  <rect x="1115" y="1015" width="400" height="110" rx="18" fill="#e57a4a"/>
  ${textLines(data.correction2, 1315, 1072)}
  <path class="arrow loop" d="M1315 1015 V900 H1125"/>

  <path d="M525 1230 H1115 L1075 1340 H485 Z" fill="#f3efe7" stroke="#a9b7aa" stroke-width="8"/>
  ${textLines(data.output, 800, 1287)}
  <path class="arrow" d="M800 1340 V1385"/>

  <ellipse cx="800" cy="1450" rx="270" ry="64" fill="#e57a4a"/>
  ${textLines(data.end, 800, 1452)}
</svg>`;
}

for (const diagram of diagrams) {
  fs.writeFileSync(path.join(outputDir, `${diagram.slug}.svg`), buildSvg(diagram), 'utf8');
}

console.log(`Xerados ${diagrams.length} diagramas SVG en ${outputDir}`);
