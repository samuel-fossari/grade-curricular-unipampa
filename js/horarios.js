/**
 * Página de horários: disciplinas em andamento + notas (localStorage).
 * Disciplinas avulsas (CCCG, optativas, etc.) em chave global separada.
 * Independente do motor da grade (main.js).
 */
(function () {
  'use strict';

  const SIDEBAR_KEY = 'grade_unipampa_sidebar_v1';
  const CURSO_KEY = 'grade_unipampa_horarios_curso_v1';
  const AVULSAS_KEY = 'grade_unipampa_horarios_avulsas_v1';

  const NOTE_PH = {
    horario: 'Ex.: Terça e Quinta 19:15',
    sala: 'Ex.: Sala 204 — Bloco B',
    prof: 'Ex.: Prof. João Silva',
    email: 'Ex.: joao.silva@unipampa.edu.br',
  };

  const CURSOS = {
    es: { nome: 'Engenharia de Software', url: 'cursos/engenharia-software.html' },
    cc: { nome: 'Ciência da Computação', url: 'cursos/ciencias-computacao.html' },
    ec: { nome: 'Engenharia Civil', url: 'cursos/engenharia-civil.html' },
    ee: { nome: 'Engenharia Elétrica', url: 'cursos/engenharia-eletrica.html' },
    em: { nome: 'Engenharia Mecânica', url: 'cursos/engenharia-mecanica.html' },
    ea: { nome: 'Engenharia Agrícola', url: 'cursos/engenharia-agricola.html' },
    et: { nome: 'Engenharia de Telecomunicações', url: 'cursos/engenharia-telecom.html' },
  };

  const DAY_NAMES = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const DAY_NAMES_FULL = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
  ];
  const TURNS = [
    { id: 'manha', label: 'Manhã', range: '07:30–12:30' },
    { id: 'tarde', label: 'Tarde', range: '13:30–18:30' },
    { id: 'noite', label: 'Noite', range: '19:00–23:00' },
  ];

  /** minutos desde meia-noite */
  const MANHA_START = 7 * 60 + 30;
  const MANHA_END = 12 * 60 + 30;
  const TARDE_START = 13 * 60 + 30;
  const TARDE_END = 18 * 60 + 30;
  const NOITE_START = 19 * 60;
  const NOITE_END = 23 * 60 + 59;

  const DAY_PATTERN = '\\b(segunda|terça|quarta|quinta|sexta|seg|ter|qua|qui|sex)\\b';

  let currentSigla = 'es';
  let notes = {};
  let loadToken = 0;
  let editingDisc = null;
  /** @type {string | null} null = nova avulsa; string = id existente */
  let editingAvulsaId = null;

  function progressKey(sigla) {
    return `grade_unipampa_${sigla}_progress_v1`;
  }
  function notesKey(sigla) {
    return `grade_unipampa_${sigla}_notes_v1`;
  }

  function loadAvulsas() {
    try {
      const raw = JSON.parse(localStorage.getItem(AVULSAS_KEY) || 'null');
      if (!Array.isArray(raw)) return [];
      return raw.filter(
        (x) =>
          x &&
          typeof x === 'object' &&
          typeof x.id === 'string' &&
          typeof x.nome === 'string'
      );
    } catch {
      return [];
    }
  }

  function saveAvulsas(arr) {
    localStorage.setItem(AVULSAS_KEY, JSON.stringify(arr));
  }

  function newAvulsaId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'av-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11);
  }

  function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    if (!sidebar || !toggle) return;

    function applyCollapsed(collapsed) {
      sidebar.classList.toggle('collapsed', collapsed);
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      toggle.setAttribute(
        'aria-label',
        collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'
      );
      toggle.title = collapsed ? 'Expandir menu' : 'Recolher menu';
      toggle.textContent = collapsed ? '☰' : '←';
      localStorage.setItem(SIDEBAR_KEY, collapsed ? 'collapsed' : 'expanded');
    }

    applyCollapsed(localStorage.getItem(SIDEBAR_KEY) === 'collapsed');

    toggle.addEventListener('click', () =>
      applyCollapsed(!sidebar.classList.contains('collapsed'))
    );

    const cur =
      (window.location.pathname.split('/').pop() || '').split('?')[0].toLowerCase();
    document.querySelectorAll('#sidebar a.sb-item[href]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      const file = href
        .replace(/^\.\.\//, '')
        .replace(/^.*\//, '')
        .split('?')[0]
        .toLowerCase();
      a.classList.toggle('active', file === cur);
      if (file === cur) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function dayTokenToIndex(tok) {
    const t = tok
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (t === 'segunda' || t === 'seg') return 0;
    if (t === 'terca' || t === 'ter') return 1;
    if (t === 'quarta' || t === 'qua') return 2;
    if (t === 'quinta' || t === 'qui') return 3;
    if (t === 'sexta' || t === 'sex') return 4;
    return -1;
  }

  function parseDaysInOrder(text) {
    const out = [];
    const seen = new Set();
    let m;
    const re = new RegExp(DAY_PATTERN, 'gi');
    while ((m = re.exec(text)) !== null) {
      const idx = dayTokenToIndex(m[1]);
      if (idx < 0) continue;
      if (!seen.has(idx)) {
        seen.add(idx);
        out.push(idx);
      }
    }
    return out;
  }

  function parseTimesInOrder(text) {
    const lower = text;
    const found = [];

    const re1 = /\b(\d{1,2})\s*[:h]\s*(\d{2})\b/gi;
    let m;
    while ((m = re1.exec(lower)) !== null) {
      const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
      const mi = Math.min(59, Math.max(0, parseInt(m[2], 10)));
      found.push({ h, mi, index: m.index, len: m[0].length });
    }

    const re1b = /\b(\d{1,2})\s*h\s*(\d{2})\b/gi;
    while ((m = re1b.exec(lower)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      const overlap = found.some((f) => start < f.index + f.len && end > f.index);
      if (overlap) continue;
      const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
      const mi = Math.min(59, Math.max(0, parseInt(m[2], 10)));
      found.push({ h, mi, index: start, len: m[0].length });
    }

    const re2 = /\b(\d{1,2})\s*h\b(?!\s*\d)/gi;
    while ((m = re2.exec(lower)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      const overlap = found.some((f) => start < f.index + f.len && end > f.index);
      if (overlap) continue;
      const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
      found.push({ h, mi: 0, index: start, len: m[0].length });
    }

    found.sort((a, b) => a.index - b.index);
    return found.map(({ h, mi }) => ({ h, mi }));
  }

  function minutesOf(h, mi) {
    return h * 60 + mi;
  }

  function turnFromMinutes(totalMin) {
    if (totalMin >= MANHA_START && totalMin <= MANHA_END) return 'manha';
    if (totalMin >= TARDE_START && totalMin <= TARDE_END) return 'tarde';
    if (totalMin >= NOITE_START && totalMin <= NOITE_END) return 'noite';
    return null;
  }

  function formatTime(h, mi) {
    return String(h).padStart(2, '0') + ':' + String(mi).padStart(2, '0');
  }

  /**
   * @returns {Array<{ day: number, turn: string, timeLabel: string, discId: string }>}
   */
  function placementsForDiscipline(discId, horarioStr) {
    const text = String(horarioStr || '').trim();
    if (!text) return [];

    const days = parseDaysInOrder(text);
    const times = parseTimesInOrder(text);

    if (!days.length || !times.length) return [];

    let pairs = [];
    if (times.length === 1) {
      pairs = days.map((day) => ({ day, t: times[0] }));
    } else if (days.length === 1) {
      pairs = times.map((t) => ({ day: days[0], t }));
    } else if (days.length === times.length) {
      pairs = days.map((day, i) => ({ day, t: times[i] }));
    } else {
      return [];
    }

    const slots = [];
    for (const { day, t } of pairs) {
      const tm = minutesOf(t.h, t.mi);
      const turn = turnFromMinutes(tm);
      if (turn == null) continue;
      slots.push({
        day,
        turn,
        timeLabel: formatTime(t.h, t.mi),
        discId,
      });
    }
    return slots;
  }

  function loadJson(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key) || 'null');
      return v && typeof v === 'object' ? v : fallback;
    } catch {
      return fallback;
    }
  }

  function loadCourseScript(sigla) {
    return new Promise((resolve, reject) => {
      const prev = document.getElementById('horarios-course-script');
      if (prev) prev.remove();
      delete window.GRADE_CURSO_CONFIG;

      const s = document.createElement('script');
      s.id = 'horarios-course-script';
      s.async = true;
      s.src = 'js/cursos/' + encodeURIComponent(sigla) + '.js';
      s.onload = () => {
        const cfg = window.GRADE_CURSO_CONFIG;
        if (!cfg || !Array.isArray(cfg.disciplines)) {
          reject(new Error('Config inválida'));
          return;
        }
        resolve(cfg);
      };
      s.onerror = () => reject(new Error('Falha ao carregar dados do curso'));
      document.head.appendChild(s);
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  function saveNotesField(discId, field, value) {
    if (!notes[discId]) notes[discId] = {};
    notes[discId][field] = value.trim();
    localStorage.setItem(notesKey(currentSigla), JSON.stringify(notes));
  }

  function openNotesModal(disc) {
    editingDisc = disc;
    const modal = document.getElementById('notesModal');
    const title = document.getElementById('notes-modal-title');
    const body = document.getElementById('notesModalBody');
    if (!modal || !title || !body) return;

    const n = notes[disc.id] || {};
    const nh = n.horario ?? '';
    const ns = n.sala ?? '';
    const np = n.prof ?? '';
    const ne = n.email ?? '';

    title.textContent = disc.name;
    body.innerHTML = `
      <p class="horarios-modal-hint">As alterações são salvas ao sair de cada campo e ficam iguais às da grade do curso.</p>
      <p class="horarios-modal-link-wrap"><a href="${escapeAttr(
        CURSOS[currentSigla].url
      )}" class="horarios-modal-course-link">Abrir grade do curso</a></p>
      <label class="dlg-field"><span>Horários</span><input type="text" data-note="horario" value="${escapeAttr(
        nh
      )}" placeholder="${escapeAttr(NOTE_PH.horario)}" autocomplete="off" /></label>
      <label class="dlg-field"><span>Sala</span><input type="text" data-note="sala" value="${escapeAttr(
        ns
      )}" placeholder="${escapeAttr(NOTE_PH.sala)}" autocomplete="off" /></label>
      <label class="dlg-field"><span>Professor(a)</span><input type="text" data-note="prof" value="${escapeAttr(
        np
      )}" placeholder="${escapeAttr(NOTE_PH.prof)}" autocomplete="off" /></label>
      <label class="dlg-field"><span>E-mail</span><input type="email" data-note="email" value="${escapeAttr(
        ne
      )}" placeholder="${escapeAttr(NOTE_PH.email)}" autocomplete="off" /></label>
    `;

    body.querySelectorAll('input[data-note]').forEach((inp) => {
      inp.addEventListener('blur', () => {
        const field = inp.getAttribute('data-note');
        if (field) saveNotesField(disc.id, field, inp.value);
        renderSchedule();
      });
    });

    modal.classList.add('open');
    modal.removeAttribute('aria-hidden');
    modal.removeAttribute('inert');
    const closeBtn = modal.querySelector('.dialog-close');
    closeBtn?.focus();
  }

  function closeNotesModal() {
    const modal = document.getElementById('notesModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('inert', '');
    editingDisc = null;
  }

  function avulsaNote(av) {
    return {
      horario: av.horario != null ? String(av.horario) : '',
      sala: av.sala != null ? String(av.sala) : '',
      prof: av.prof != null ? String(av.prof) : '',
      email: av.email != null ? String(av.email) : '',
    };
  }

  function renderScheduleCard(item) {
    const { disc, note, isAvulsa, timeLabel } = item;
    const metaParts = [];
    if (timeLabel) metaParts.push(timeLabel);
    if (note.sala) metaParts.push('Sala: ' + note.sala);
    const metaLine = metaParts.join(' · ');
    let sub = '';
    if (metaLine) sub += `<div class="schedule-card-meta">${escapeHtml(metaLine)}</div>`;
    if (note.prof) sub += `<div class="schedule-card-meta">Prof.: ${escapeHtml(note.prof)}</div>`;

    const cls = isAvulsa ? 'schedule-card schedule-card--avulsa' : 'schedule-card';
    const dataAttr = isAvulsa ? 'data-avulsa-id' : 'data-disc-id';
    const aria = isAvulsa
      ? `Editar disciplina avulsa: ${escapeAttr(disc.name)}`
      : `Editar anotações: ${escapeAttr(disc.name)}`;

    let badge = '';
    if (isAvulsa) {
      badge = '<span class="schedule-card-badge" aria-hidden="true">Avulsa</span>';
    }

    return `<button type="button" class="${cls}" ${dataAttr}="${escapeAttr(
      disc.id
    )}" aria-label="${aria}">${badge}<div class="schedule-card-name">${escapeHtml(
      disc.name
    )}</div>${sub}</button>`;
  }


  function isMobileSchedule() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function buildScheduleGridDesktop(cellMap) {
    let html = '<div class="schedule-grid" role="grid" aria-label="Grade semanal">';
    html += '<div class="schedule-corner" aria-hidden="true"></div>';
    for (let d = 0; d < 5; d++) {
      html += `<div class="schedule-day-header" role="columnheader">${DAY_NAMES[d]}</div>`;
    }
    for (const turn of TURNS) {
      html += `<div class="schedule-turn-label" role="rowheader"><span>${turn.label}</span><span class="schedule-turn-range">${turn.range}</span></div>`;
      for (let d = 0; d < 5; d++) {
        const items = cellMap[turn.id][d];
        html += '<div class="schedule-cell" role="gridcell">';
        for (const item of items) {
          html += renderScheduleCard(item);
        }
        html += '</div>';
      }
    }
    html += '</div>';
    return html;
  }

  function buildScheduleGridMobile(cellMap) {
    let html =
      '<div class="schedule-grid schedule-grid--stacked" role="region" aria-label="Grade semanal">';
    for (let d = 0; d < 5; d++) {
      html += '<div class="schedule-day-col">';
      html += `<div class="schedule-day-header">${DAY_NAMES_FULL[d]}</div>`;
      for (const turn of TURNS) {
        const items = cellMap[turn.id][d];
        html += '<div class="schedule-turn-row">';
        html += `<div class="schedule-turn-label">${turn.label}</div>`;
        html += '<div class="schedule-turn-cards">';
        for (const item of items) {
          html += renderScheduleCard(item);
        }
        html += '</div></div>';
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function buildScheduleGridHtml(cellMap) {
    if (isMobileSchedule()) return buildScheduleGridMobile(cellMap);
    return buildScheduleGridDesktop(cellMap);
  }

  function renderSchedule() {
    const root = document.getElementById('schedule-root');
    if (!root) return;

    const course = CURSOS[currentSigla];
    const progress = loadJson(progressKey(currentSigla), {});
    notes = loadJson(notesKey(currentSigla), {});
    const avulsas = loadAvulsas();

    const cfg = window.GRADE_CURSO_CONFIG;
    const hasCfg = cfg && Array.isArray(cfg.disciplines);
    const inProgress = hasCfg ? cfg.disciplines.filter((d) => progress[d.id] === 'in_progress') : [];

    if (!inProgress.length && !avulsas.length) {
      root.innerHTML = `
        <div class="schedule-no-class">
          <p>Nenhuma disciplina em andamento.</p>
          <p>Marque disciplinas como &quot;em andamento&quot; na página do curso para que apareçam aqui.</p>
          <p><a href="${escapeAttr(course.url)}">${escapeHtml(course.nome)} — grade</a></p>
          <p class="schedule-no-class-avulsa-hint">Ou adicione uma <strong>disciplina avulsa</strong> abaixo (CCCG, optativa, etc.).</p>
        </div>`;
      return;
    }

    const cellMap = {};
    for (const t of TURNS) {
      cellMap[t.id] = {};
      for (let d = 0; d < 5; d++) cellMap[t.id][d] = [];
    }

    const unplaced = [];

    for (const disc of inProgress) {
      const n = notes[disc.id] || {};
      const hor = n.horario != null ? String(n.horario) : '';
      const slots = placementsForDiscipline(disc.id, hor);

      if (!slots.length) {
        unplaced.push({ disc, note: n, isAvulsa: false });
        continue;
      }
      for (const s of slots) {
        const list = cellMap[s.turn][s.day];
        list.push({
          disc,
          timeLabel: s.timeLabel,
          note: n,
          isAvulsa: false,
        });
      }
    }

    for (const av of avulsas) {
      const n = avulsaNote(av);
      const fakeDisc = { id: av.id, name: av.nome };
      const hor = n.horario;
      const slots = placementsForDiscipline(av.id, hor);
      if (!slots.length) {
        unplaced.push({ disc: fakeDisc, note: n, isAvulsa: true });
        continue;
      }
      for (const s of slots) {
        const list = cellMap[s.turn][s.day];
        list.push({
          disc: fakeDisc,
          timeLabel: s.timeLabel,
          note: n,
          isAvulsa: true,
        });
      }
    }

    let html = buildScheduleGridHtml(cellMap);
    if (unplaced.length) {
      html += '<section class="schedule-unplaced" aria-labelledby="unplaced-h">';
      html +=
        '<h2 id="unplaced-h" class="schedule-unplaced-title">Sem horário definido</h2>';
      html += '<div class="schedule-unplaced-cards">';
      for (const row of unplaced) {
        const item = {
          disc: row.disc,
          note: row.note,
          isAvulsa: row.isAvulsa,
          timeLabel: '',
        };
        const cls = row.isAvulsa
          ? 'schedule-card schedule-card--unplaced schedule-card--avulsa'
          : 'schedule-card schedule-card--unplaced';
        const dataAttr = row.isAvulsa ? 'data-avulsa-id' : 'data-disc-id';
        const metaParts = [];
        if (row.note.horario) metaParts.push(String(row.note.horario));
        if (row.note.sala) metaParts.push('Sala: ' + row.note.sala);
        const metaLine = metaParts.join(' · ');
        let sub = '';
        if (metaLine) sub += `<div class="schedule-card-meta">${escapeHtml(metaLine)}</div>`;
        if (row.note.prof)
          sub += `<div class="schedule-card-meta">Prof.: ${escapeHtml(row.note.prof)}</div>`;
        const aria = row.isAvulsa
          ? `Editar disciplina avulsa: ${escapeAttr(row.disc.name)}`
          : `Editar anotações: ${escapeAttr(row.disc.name)}`;
        const badge = row.isAvulsa
          ? '<span class="schedule-card-badge" aria-hidden="true">Avulsa</span>'
          : '';
        html += `<button type="button" class="${cls}" ${dataAttr}="${escapeAttr(
          row.disc.id
        )}" aria-label="${aria}">${badge}<div class="schedule-card-name">${escapeHtml(
          row.disc.name
        )}</div>${sub}</button>`;
      }
      html += '</div></section>';
    }

    root.innerHTML = html;

    root.querySelectorAll('.schedule-card[data-disc-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-disc-id');
        if (!hasCfg) return;
        const disc = cfg.disciplines.find((x) => x.id === id);
        if (disc) openNotesModal(disc);
      });
    });

    root.querySelectorAll('.schedule-card[data-avulsa-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-avulsa-id');
        if (id) openAvulsaPanel(id);
      });
    });
  }

  function getAvulsaEls() {
    return {
      panel: document.getElementById('avulsa-form-panel'),
      nome: document.getElementById('avulsa-input-nome'),
      horario: document.getElementById('avulsa-input-horario'),
      sala: document.getElementById('avulsa-input-sala'),
      prof: document.getElementById('avulsa-input-prof'),
      email: document.getElementById('avulsa-input-email'),
      save: document.getElementById('avulsa-save-btn'),
      cancel: document.getElementById('avulsa-cancel-btn'),
      remove: document.getElementById('avulsa-remove-btn'),
      title: document.getElementById('avulsa-form-title'),
    };
  }

  function refreshAvulsaSaveState() {
    const { nome, save } = getAvulsaEls();
    if (!nome || !save) return;
    const ok = nome.value.trim().length > 0;
    save.disabled = !ok;
  }

  function closeAvulsaPanel() {
    const { panel } = getAvulsaEls();
    if (!panel) return;
    panel.hidden = true;
    panel.setAttribute('inert', '');
    editingAvulsaId = null;
  }

  function openAvulsaPanel(idOrNull) {
    const els = getAvulsaEls();
    if (!els.panel || !els.nome) return;

    editingAvulsaId = idOrNull;

    const list = loadAvulsas();
    if (idOrNull) {
      const av = list.find((x) => x.id === idOrNull);
      if (!av) {
        closeAvulsaPanel();
        return;
      }
      if (els.title) els.title.textContent = 'Editar disciplina avulsa';
      els.nome.value = av.nome || '';
      els.horario.value = av.horario != null ? String(av.horario) : '';
      els.sala.value = av.sala != null ? String(av.sala) : '';
      els.prof.value = av.prof != null ? String(av.prof) : '';
      els.email.value = av.email != null ? String(av.email) : '';
      if (els.remove) els.remove.hidden = false;
    } else {
      if (els.title) els.title.textContent = 'Nova disciplina avulsa';
      els.nome.value = '';
      els.horario.value = '';
      els.sala.value = '';
      els.prof.value = '';
      els.email.value = '';
      if (els.remove) els.remove.hidden = true;
    }

    els.horario.placeholder = NOTE_PH.horario;
    els.sala.placeholder = NOTE_PH.sala;
    els.prof.placeholder = NOTE_PH.prof;
    els.email.placeholder = NOTE_PH.email;

    els.panel.hidden = false;
    els.panel.removeAttribute('inert');
    refreshAvulsaSaveState();
    els.nome.focus();
  }

  function saveAvulsaForm() {
    const els = getAvulsaEls();
    const nome = els.nome?.value.trim() || '';
    if (!nome) return;

    const row = {
      id: editingAvulsaId || newAvulsaId(),
      nome,
      horario: els.horario?.value.trim() ?? '',
      sala: els.sala?.value.trim() ?? '',
      prof: els.prof?.value.trim() ?? '',
      email: els.email?.value.trim() ?? '',
    };

    let list = loadAvulsas();
    if (editingAvulsaId) {
      const idx = list.findIndex((x) => x.id === editingAvulsaId);
      if (idx >= 0) list[idx] = row;
      else list.push(row);
    } else {
      list = list.concat([row]);
    }
    saveAvulsas(list);
    closeAvulsaPanel();
    renderSchedule();
  }

  function removeAvulsa() {
    if (!editingAvulsaId) return;
    if (!window.confirm('Remover esta disciplina avulsa?')) return;
    const list = loadAvulsas().filter((x) => x.id !== editingAvulsaId);
    saveAvulsas(list);
    closeAvulsaPanel();
    renderSchedule();
  }

  function setupAvulsaForm() {
    const els = getAvulsaEls();
    if (!els.panel) return;

    document.getElementById('avulsa-add-btn')?.addEventListener('click', () => {
      openAvulsaPanel(null);
    });

    els.nome?.addEventListener('input', refreshAvulsaSaveState);
    els.save?.addEventListener('click', saveAvulsaForm);
    els.cancel?.addEventListener('click', () => {
      closeAvulsaPanel();
    });
    els.remove?.addEventListener('click', removeAvulsa);
  }

  async function applyCourse(sigla) {
    const token = ++loadToken;
    closeAvulsaPanel();
    closeNotesModal();
    currentSigla = sigla;
    localStorage.setItem(CURSO_KEY, sigla);

    const sel = document.getElementById('curso-select');
    if (sel && sel.value !== sigla) sel.value = sigla;

    const root = document.getElementById('schedule-root');
    if (root) root.innerHTML = '<p class="schedule-no-class">Carregando dados do curso…</p>';

    try {
      await loadCourseScript(sigla);
    } catch {
      if (token !== loadToken) return;
      if (loadAvulsas().length) {
        renderSchedule();
      } else if (root) {
        root.innerHTML =
          '<p class="schedule-no-class">Não foi possível carregar os dados deste curso.</p>';
      }
      return;
    }
    if (token !== loadToken) return;
    renderSchedule();
  }

  function init() {
    initSidebar();
    setupAvulsaForm();

    const sel = document.getElementById('curso-select');
    const saved = localStorage.getItem(CURSO_KEY);
    const initial = saved && CURSOS[saved] ? saved : sel ? sel.value : 'es';
    if (sel) {
      sel.value = initial;
      sel.addEventListener('change', () => applyCourse(sel.value));
    }

    const modal = document.getElementById('notesModal');
    modal?.querySelector('.dialog-close')?.addEventListener('click', closeNotesModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeNotesModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const avPanel = document.getElementById('avulsa-form-panel');
      if (avPanel && !avPanel.hidden) {
        e.preventDefault();
        closeAvulsaPanel();
        return;
      }
      if (modal?.classList.contains('open')) {
        e.preventDefault();
        closeNotesModal();
      }
    });

    applyCourse(initial);

    const scheduleMq = window.matchMedia('(max-width: 768px)');
    scheduleMq.addEventListener('change', () => {
      if (document.getElementById('schedule-root')) renderSchedule();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
