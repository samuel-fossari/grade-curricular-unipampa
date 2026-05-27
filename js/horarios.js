/**
 * @file horarios.js
 * @description Página de horários semanais — disciplinas em andamento, CCCGs e avulsas.
 *
 * Independente do motor da grade (main.js). Persiste anotações em localStorage.
 */
(function () {
  'use strict';

  /* ==========================================================================
   * Constantes e configuração
   * ========================================================================== */

  const CURSO_KEY = 'grade_unipampa_horarios_curso_v1';
  const LEGACY_AVULSAS_KEY = 'grade_unipampa_horarios_avulsas_v1';

  const NOTE_PH = {
    dias: 'Ex.: Terça e Quinta',
    hora_inicio: 'Ex.: 13:30',
    hora_fim: 'Ex.: 17:20',
    sala: 'Ex.: Sala 201 - A1',
    prof: 'Ex.: Prof. João Silva',
    email: 'Ex.: joao.silva@unipampa.edu.br',
  };

  /** Dias exibidos na grade (Segunda–Sábado). */
  const SCHEDULE_DAYS = [
    { idx: 0, short: 'Seg', full: 'Segunda-feira' },
    { idx: 1, short: 'Ter', full: 'Terça-feira' },
    { idx: 2, short: 'Qua', full: 'Quarta-feira' },
    { idx: 3, short: 'Qui', full: 'Quinta-feira' },
    { idx: 4, short: 'Sex', full: 'Sexta-feira' },
    { idx: 5, short: 'Sáb', full: 'Sábado' },
  ];

  const SCHEDULE_DAY_COUNT = SCHEDULE_DAYS.length;
  const DAY_NAMES = SCHEDULE_DAYS.map((d) => d.short);
  const DAY_NAMES_FULL = SCHEDULE_DAYS.map((d) => d.full);

  const CURSOS = {
    es: { nome: 'Engenharia de Software', url: 'cursos/engenharia-software.html' },
    cc: { nome: 'Ciência da Computação', url: 'cursos/ciencias-computacao.html' },
    ec: { nome: 'Engenharia Civil', url: 'cursos/engenharia-civil.html' },
    ee: { nome: 'Engenharia Elétrica', url: 'cursos/engenharia-eletrica.html' },
    em: { nome: 'Engenharia Mecânica', url: 'cursos/engenharia-mecanica.html' },
    ea: { nome: 'Engenharia Agrícola', url: 'cursos/engenharia-agricola.html' },
    et: { nome: 'Engenharia de Telecomunicações', url: 'cursos/engenharia-telecom.html' },
  };

  const DAY_PATTERN =
    '\\b(segunda|terça|quarta|quinta|sexta|sábado|sabado|seg|ter|qua|qui|sex|sáb|sab)\\b';

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

  const TURN_BOUNDS = {
    manha: { start: MANHA_START, end: MANHA_END },
    tarde: { start: TARDE_START, end: TARDE_END },
    noite: { start: NOITE_START, end: NOITE_END },
  };

  /* ==========================================================================
   * Estado da página
   * ========================================================================== */

  let currentSigla = 'es';
  let notes = {};
  let loadToken = 0;
  let editingDisc = null;
  /** @type {string | null} null = nova avulsa; string = id existente */
  let editingAvulsaId = null;

  /* ==========================================================================
   * Chaves e persistência (curso selecionado)
   * ========================================================================== */

  function progressKey(sigla) {
    return `grade_unipampa_${sigla}_progress_v1`;
  }

  function notesKey(sigla) {
    return `grade_unipampa_${sigla}_notes_v1`;
  }

  function avulsasKey(sigla) {
    return window.GRADE_STORAGE?.avulsasKey?.(sigla) || `grade_unipampa_${sigla}_horarios_avulsas_v1`;
  }

  function ensureAvulsasMigrated() {
    window.GRADE_STORAGE?.migrateLegacyHorariosAvulsas?.();
  }

  function cccgPicksKey(sigla) {
    return `grade_unipampa_${sigla}_cccg_picks_v1`;
  }

  function loadCccgPicks(sigla) {
    try {
      return JSON.parse(localStorage.getItem(cccgPicksKey(sigla)) || '{}') || {};
    } catch {
      return {};
    }
  }

  /** Slot reservado a CCCG na grade (cccg5, cccg6, …). */
  function isCccgSlotDisc(disc) {
    return /^cccg/i.test(String(disc?.id || ''));
  }

  function buildCccgCatalogMap(cfg) {
    const map = new Map();
    if (!cfg || !Array.isArray(cfg.cccgs)) return map;
    for (const item of cfg.cccgs) {
      if (item && item.codigo) map.set(String(item.codigo), item);
    }
    return map;
  }

  /** Id estável para anotações de um CCCG escolhido na grade. */
  function cccgNoteId(codigo) {
    return `cccg:${codigo}`;
  }

  /**
   * Substitui slots CCCG genéricos pelos componentes escolhidos na grade,
   * quando o curso expõe catálogo cfg.cccgs (ES hoje; extensível a outros).
   */
  function expandInProgressDisciplines(disciplines, cfg) {
    const catalog = buildCccgCatalogMap(cfg);
    const hasCatalog = catalog.size > 0;
    if (!hasCatalog) return disciplines;

    const picks = loadCccgPicks(currentSigla);
    const expanded = [];

    for (const disc of disciplines) {
      if (!isCccgSlotDisc(disc)) {
        expanded.push(disc);
        continue;
      }

      const slotPicks = Array.isArray(picks[disc.id]) ? picks[disc.id] : [];
      if (!slotPicks.length) {
        expanded.push(disc);
        continue;
      }

      for (const codigo of slotPicks) {
        const item = catalog.get(String(codigo));
        if (!item) continue;
        expanded.push({
          id: cccgNoteId(codigo),
          name: item.nome,
          codigo: item.codigo,
          cccgSlotId: disc.id,
          cccgSlotSem: disc.sem,
          isCccgExpanded: true,
        });
      }
    }

    return expanded;
  }

  /** Mapa id → disciplina exibida na grade de horários (atualizado a cada render). */
  let scheduleDiscById = new Map();

  function loadAvulsas() {
    ensureAvulsasMigrated();
    try {
      const raw = JSON.parse(localStorage.getItem(avulsasKey(currentSigla)) || 'null');
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
    localStorage.setItem(avulsasKey(currentSigla), JSON.stringify(arr));
    if (localStorage.getItem(LEGACY_AVULSAS_KEY) != null) {
      localStorage.removeItem(LEGACY_AVULSAS_KEY);
    }
  }

  function newAvulsaId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'av-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11);
  }

  /* ==========================================================================
   * Parser de horários (texto → grade semanal)
   * ========================================================================== */

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
    if (t === 'sabado' || t === 'sab') return 5;
    return -1;
  }

  function diasStringFromIndices(indices) {
    const sorted = [...indices].sort((a, b) => a - b);
    const names = sorted.map((i) => SCHEDULE_DAYS[i]?.full).filter(Boolean);
    if (!names.length) return '';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} e ${names[1]}`;
    return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;
  }

  /** Valor exibido no campo de horário (HH:MM) ou vazio. */
  function timeInputValue(raw) {
    const normalized = normalizeTimeInput(raw);
    return /^\d{2}:\d{2}$/.test(normalized) ? normalized : '';
  }

  /** Aceita 13:30, 13.30, 13,30, 13h30, 13h → 13:30 (legado/importação). */
  function normalizeTimeInput(raw) {
    let s = String(raw || '').trim();
    if (!s) return '';

    let m = s.match(/^(\d{1,2})[.,](\d{2})$/);
    if (m) {
      return formatTime(
        Math.min(23, Math.max(0, parseInt(m[1], 10))),
        Math.min(59, Math.max(0, parseInt(m[2], 10)))
      );
    }

    m = s.match(/^(\d{3,4})$/);
    if (m) {
      const digits = m[1];
      const mi = parseInt(digits.slice(-2), 10);
      const h = parseInt(digits.slice(0, -2), 10);
      if (h <= 23 && mi <= 59) return formatTime(h, mi);
    }

    const parsed = parseTimesInOrder(s);
    if (parsed.length) return formatTime(parsed[0].h, parsed[0].mi);
    return s;
  }

  function normalizeHorarioTimeField(input) {
    if (!input || !input.dataset.horariosTime) return;
    const normalized = normalizeTimeInput(input.value);
    if (normalized && /^\d{2}:\d{2}$/.test(normalized)) {
      input.value = normalized;
    }
  }

  function bindHorarioTimeInput(input, onUpdate) {
    if (!input || !input.dataset.horariosTime) return;
    if (input.dataset.horariosTimeBound === '1') return;
    input.dataset.horariosTimeBound = '1';

    const handle = () => {
      normalizeHorarioTimeField(input);
      onUpdate?.(input);
    };

    input.addEventListener('blur', handle);
    input.addEventListener('change', handle);
  }

  function renderDayPickerHtml(selectedIndices) {
    const selected = new Set(selectedIndices);
    return SCHEDULE_DAYS.map((day) => {
      const on = selected.has(day.idx);
      return `<button type="button" class="horarios-day-chip${on ? ' is-selected' : ''}" data-day-index="${day.idx}" aria-pressed="${on ? 'true' : 'false'}">${day.short}</button>`;
    }).join('');
  }

  function refreshDayPicker(container, diasText) {
    if (!container) return;
    const indices = parseDaysInOrder(String(diasText || ''));
    container.innerHTML = renderDayPickerHtml(indices);
  }

  function bindDayPicker(container, hiddenInput, onChange) {
    if (!container || !hiddenInput) return;

    function applyIndices(indices) {
      const value = diasStringFromIndices(indices);
      hiddenInput.value = value;
      refreshDayPicker(container, value);
      onChange?.(value);
    }

    refreshDayPicker(container, hiddenInput.value);

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-day-index]');
      if (!btn) return;
      const idx = parseInt(btn.getAttribute('data-day-index'), 10);
      if (Number.isNaN(idx)) return;
      const current = new Set(parseDaysInOrder(hiddenInput.value));
      if (current.has(idx)) current.delete(idx);
      else current.add(idx);
      applyIndices([...current]);
    });
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
    const lower = String(text || '');
    const found = [];

    const reDot = /\b(\d{1,2})[.,](\d{2})\b/g;
    let m;
    while ((m = reDot.exec(lower)) !== null) {
      const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
      const mi = Math.min(59, Math.max(0, parseInt(m[2], 10)));
      found.push({ h, mi, index: m.index, len: m[0].length });
    }

    const re1 = /\b(\d{1,2})\s*[:h]\s*(\d{2})\b/gi;
    while ((m = re1.exec(lower)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      const overlap = found.some((f) => start < f.index + f.len && end > f.index);
      if (overlap) continue;
      const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
      const mi = Math.min(59, Math.max(0, parseInt(m[2], 10)));
      found.push({ h, mi, index: start, len: m[0].length });
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

  /** Normaliza anotação: campos estruturados ou legado `horario` único. */
  function normalizeScheduleNote(raw) {
    const note = raw && typeof raw === 'object' ? { ...raw } : {};
    if (Array.isArray(note.slots) && note.slots.length) {
      note.slots = note.slots.map(normalizeScheduleSlot);
    }
    const dias = String(note.dias || '').trim();
    const ini = String(note.hora_inicio || '').trim();
    if (!(dias && ini)) {
      const legacy = String(note.horario || '').trim();
      if (legacy) {
        const dayIdxs = parseDaysInOrder(legacy);
        const times = parseTimesInOrder(legacy);
        if (!note.dias && dayIdxs.length) {
          note.dias = dayIdxs.map((i) => DAY_NAMES_FULL[i]).join(' e ');
        }
        if (!note.hora_inicio && times.length) {
          note.hora_inicio = formatTime(times[0].h, times[0].mi);
        }
        if (!note.hora_fim && times.length > 1) {
          const last = times[times.length - 1];
          note.hora_fim = formatTime(last.h, last.mi);
        }
      }
    }
    if (note.hora_inicio) note.hora_inicio = normalizeTimeInput(note.hora_inicio);
    if (note.hora_fim) note.hora_fim = normalizeTimeInput(note.hora_fim);
    return note;
  }

  function normalizeScheduleSlot(raw) {
    const slot = raw && typeof raw === 'object' ? { ...raw } : {};
    return {
      dias: String(slot.dias || '').trim(),
      hora_inicio: slot.hora_inicio ? normalizeTimeInput(slot.hora_inicio) : '',
      hora_fim: slot.hora_fim ? normalizeTimeInput(slot.hora_fim) : '',
      sala: String(slot.sala || '').trim(),
    };
  }

  /** Blocos de horário (suporta dias/horários/salas distintos). */
  function scheduleSlotsFromNote(note) {
    const n = normalizeScheduleNote(note);
    if (Array.isArray(n.slots) && n.slots.length) {
      return n.slots.map(normalizeScheduleSlot).filter((s) => s.dias && s.hora_inicio);
    }
    const dias = String(n.dias || '').trim();
    const ini = String(n.hora_inicio || '').trim();
    if (dias && ini) {
      return [
        normalizeScheduleSlot({
          dias,
          hora_inicio: ini,
          hora_fim: n.hora_fim,
          sala: n.sala,
        }),
      ];
    }
    return [];
  }

  function parseTimeToMinutes(raw) {
    const times = parseTimesInOrder(String(raw || ''));
    if (!times.length) return null;
    return minutesOf(times[0].h, times[0].mi);
  }

  function syncLegacyFieldsFromSlots(note) {
    const slots = scheduleSlotsFromNote(note);
    if (slots.length) {
      note.slots = slots;
      note.dias = slots
        .map((s) => s.dias)
        .filter(Boolean)
        .join('; ');
      note.hora_inicio = slots[0].hora_inicio;
      note.hora_fim = slots[0].hora_fim;
      const salas = [...new Set(slots.map((s) => s.sala).filter(Boolean))];
      note.sala = salas.join(' / ');
    } else {
      delete note.slots;
    }
    syncNoteHorarioLegacy(note);
    return note;
  }

  /** Texto combinado para parser legado e backup exportado. */
  function scheduleTextFromNote(note) {
    const slots = scheduleSlotsFromNote(note);
    if (slots.length) {
      return slots
        .map((s) => {
          const fim = s.hora_fim ? ` ${s.hora_fim}` : '';
          return `${s.dias} ${s.hora_inicio}${fim}`.trim();
        })
        .join('; ');
    }
    const n = normalizeScheduleNote(note);
    return String(n.horario || '').trim();
  }

  /** Rótulo legível na grade e na lista “sem horário”. */
  function formatScheduleDisplay(note) {
    const slots = scheduleSlotsFromNote(note);
    if (!slots.length) {
      const n = normalizeScheduleNote(note);
      return String(n.horario || '');
    }
    return slots
      .map((s) => {
        const time = s.hora_fim ? `${s.hora_inicio}–${s.hora_fim}` : s.hora_inicio;
        let line = `${s.dias} · ${time}`;
        if (s.sala) line += ` · Sala: ${s.sala}`;
        return line;
      })
      .join(' | ');
  }

  function formatTimeRangeLabel(noteOrSlot) {
    const s =
      noteOrSlot && noteOrSlot.dias !== undefined
        ? normalizeScheduleSlot(noteOrSlot)
        : scheduleSlotsFromNote(noteOrSlot)[0] || normalizeScheduleNote(noteOrSlot);
    const ini = String(s.hora_inicio || '').trim();
    const fim = String(s.hora_fim || '').trim();
    if (ini && fim) return `${ini}–${fim}`;
    if (ini) return ini;
    return '';
  }

  function syncNoteHorarioLegacy(note) {
    note.horario = scheduleTextFromNote(note);
    return note;
  }

  function placementsForScheduleSlot(discId, slot) {
    const s = normalizeScheduleSlot(slot);
    const days = parseDaysInOrder(s.dias);
    const startMin = parseTimeToMinutes(s.hora_inicio);
    if (startMin == null || !days.length) return [];

    let endMin = parseTimeToMinutes(s.hora_fim);
    if (endMin == null || endMin <= startMin) endMin = startMin + 50;

    const placements = [];
    for (const day of days) {
      for (const turn of TURNS) {
        const bounds = TURN_BOUNDS[turn.id];
        const overlapStart = Math.max(startMin, bounds.start);
        const overlapEnd = Math.min(endMin, bounds.end);
        if (overlapStart >= overlapEnd) continue;

        const turnSpan = bounds.end - bounds.start;
        const segSpan = overlapEnd - overlapStart;
        placements.push({
          day,
          turn: turn.id,
          timeLabel: s.hora_inicio,
          discId,
          fillPct: Math.min(100, (segSpan / turnSpan) * 100),
          slotNote: s,
          continuesBefore: overlapStart > startMin,
          continuesAfter: overlapEnd < endMin,
        });
      }
    }
    return placements;
  }

  /**
   * @returns {Array<{ day: number, turn: string, timeLabel: string, discId: string, fillPct?: number, slotNote?: object }>}
   */
  function placementsForDiscipline(discId, noteOrStr) {
    if (typeof noteOrStr !== 'object') {
      return placementsForDisciplineFromText(discId, noteOrStr);
    }
    const slots = scheduleSlotsFromNote(noteOrStr);
    const all = [];
    for (const slot of slots) {
      all.push(...placementsForScheduleSlot(discId, slot));
    }
    return all;
  }

  function placementsForDisciplineFromText(discId, horarioStr) {
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

  function saveNotesField(discId, field, value, inputEl) {
    if (!notes[discId]) notes[discId] = {};
    let v = String(value || '').trim();
    if (field === 'hora_inicio' || field === 'hora_fim') {
      v = normalizeTimeInput(v);
      if (inputEl && v) inputEl.value = v;
    }
    notes[discId][field] = v;
    if (field === 'dias' || field === 'hora_inicio' || field === 'hora_fim') {
      syncLegacyFieldsFromSlots(notes[discId]);
    }
    localStorage.setItem(notesKey(currentSigla), JSON.stringify(notes));
  }

  function saveNotesFromEditor(discId, editorEl) {
    if (!editorEl) return;
    const slots = readScheduleSlotsFromEditor(editorEl);
    if (!notes[discId]) notes[discId] = {};
    notes[discId].slots = slots;
    notes[discId].prof = editorEl.querySelector('[data-note="prof"]')?.value.trim() ?? notes[discId].prof ?? '';
    notes[discId].email = editorEl.querySelector('[data-note="email"]')?.value.trim() ?? notes[discId].email ?? '';
    syncLegacyFieldsFromSlots(notes[discId]);
    localStorage.setItem(notesKey(currentSigla), JSON.stringify(notes));
  }

  function readScheduleSlotsFromEditor(editorEl) {
    return [...editorEl.querySelectorAll('[data-schedule-slot]')]
      .map((row) =>
        normalizeScheduleSlot({
          dias: row.querySelector('[data-slot-dias]')?.value ?? '',
          hora_inicio: row.querySelector('[data-slot-inicio]')?.value ?? '',
          hora_fim: row.querySelector('[data-slot-fim]')?.value ?? '',
          sala: row.querySelector('[data-slot-sala]')?.value ?? '',
        })
      )
      .filter((s) => s.dias || s.hora_inicio || s.hora_fim || s.sala);
  }

  function scheduleSlotRowHtml(slot, index, canRemove) {
    const s = normalizeScheduleSlot(slot);
    return `
      <div class="horarios-schedule-slot" data-schedule-slot="${index}">
        <div class="horarios-schedule-slot-head">
          <span class="horarios-schedule-slot-title">Horário ${index + 1}</span>
          ${
            canRemove
              ? `<button type="button" class="horarios-schedule-slot-remove" data-slot-remove aria-label="Remover horário ${index + 1}">×</button>`
              : ''
          }
        </div>
        <div class="dlg-field horarios-day-field">
          <span class="horarios-day-label">Dias</span>
          <div class="horarios-day-picker" data-slot-day-picker role="group" aria-label="Dias do horário ${index + 1}"></div>
          <input type="hidden" data-slot-dias value="${escapeAttr(s.dias)}" />
        </div>
        <div class="horarios-time-row">
          <label class="dlg-field"><span>Início</span><input type="text" inputmode="decimal" data-slot-inicio data-horarios-time="hora_inicio" value="${escapeAttr(
            timeInputValue(s.hora_inicio)
          )}" placeholder="${escapeAttr(NOTE_PH.hora_inicio)}" autocomplete="off" /></label>
          <label class="dlg-field"><span>Término</span><input type="text" inputmode="decimal" data-slot-fim data-horarios-time="hora_fim" value="${escapeAttr(
            timeInputValue(s.hora_fim)
          )}" placeholder="${escapeAttr(NOTE_PH.hora_fim)}" autocomplete="off" /></label>
        </div>
        <label class="dlg-field"><span>Sala</span><input type="text" data-slot-sala value="${escapeAttr(
          s.sala
        )}" placeholder="${escapeAttr(NOTE_PH.sala)}" autocomplete="off" /></label>
      </div>`;
  }

  function scheduleSlotsEditorHtml(note) {
    const slots = scheduleSlotsFromNote(note);
    const list = slots.length ? slots : [normalizeScheduleSlot({})];
    const rows = list
      .map((slot, i) => scheduleSlotRowHtml(slot, i, list.length > 1))
      .join('');
    return `
      <div class="horarios-slots-editor" data-slots-editor>
        <p class="horarios-time-hint">Use um bloco por combinação de dias, horário e sala. Ex.: Qua/Sex 18:30–22:20 sala 304; Ter 14:00–16:00 sala 210.</p>
        <div class="horarios-slots-list" data-slots-list>${rows}</div>
        <button type="button" class="horarios-slots-add-btn" data-slots-add>+ Adicionar outro horário</button>
      </div>`;
  }

  function bindScheduleSlotsEditor(editorEl, discId) {
    if (!editorEl) return;
    const bodyEl = editorEl.closest('#notesModalBody');

    function persist() {
      saveNotesFromEditor(discId, bodyEl);
      renderSchedule();
    }

    function bindSlotRow(row) {
      const diasInput = row.querySelector('[data-slot-dias]');
      const dayPicker = row.querySelector('[data-slot-day-picker]');
      bindDayPicker(dayPicker, diasInput, persist);
      row.querySelectorAll('[data-horarios-time], [data-slot-sala]').forEach((inp) => {
        bindHorarioTimeInput(inp, persist);
        if (!inp.dataset.horariosTime) inp.addEventListener('blur', persist);
      });
      row.querySelector('[data-slot-remove]')?.addEventListener('click', () => {
        if (editorEl.querySelectorAll('[data-schedule-slot]').length <= 1) return;
        row.remove();
        editorEl.querySelectorAll('[data-schedule-slot]').forEach((el, i) => {
          el.dataset.scheduleSlot = String(i);
          el.querySelector('.horarios-schedule-slot-title').textContent = `Horário ${i + 1}`;
        });
        persist();
      });
    }

    editorEl.querySelectorAll('[data-schedule-slot]').forEach(bindSlotRow);

    editorEl.querySelector('[data-slots-add]')?.addEventListener('click', () => {
      const list = editorEl.querySelector('[data-slots-list]');
      if (!list) return;
      const index = list.querySelectorAll('[data-schedule-slot]').length;
      list.insertAdjacentHTML('beforeend', scheduleSlotRowHtml({}, index, true));
      const row = list.querySelector(`[data-schedule-slot="${index}"]`);
      if (row) bindSlotRow(row);
      list.querySelectorAll('[data-schedule-slot]').forEach((el, i) => {
        const removeBtn = el.querySelector('[data-slot-remove]');
        if (removeBtn) removeBtn.hidden = false;
      });
    });
  }

  function openNotesModal(disc) {
    editingDisc = disc;
    const modal = document.getElementById('notesModal');
    const title = document.getElementById('notes-modal-title');
    const body = document.getElementById('notesModalBody');
    if (!modal || !title || !body) return;

    const n = normalizeScheduleNote(notes[disc.id] || {});
    const np = n.prof ?? '';
    const ne = n.email ?? '';

    title.textContent = disc.codigo ? `${disc.name} (${disc.codigo})` : disc.name;
    const slotHint =
      disc.isCccgExpanded && disc.cccgSlotSem
        ? `<p class="horarios-modal-hint">Componente CCCG escolhido na grade — slot do ${disc.cccgSlotSem}º semestre.</p>`
        : '';
    body.innerHTML = `
      ${slotHint}
      <p class="horarios-modal-hint">Informe um ou mais blocos de horário. As alterações são salvas ao sair de cada campo.</p>
      <p class="horarios-modal-link-wrap"><a href="${escapeAttr(
        CURSOS[currentSigla].url
      )}" class="horarios-modal-course-link">Abrir grade do curso</a></p>
      ${scheduleSlotsEditorHtml(n)}
      <label class="dlg-field"><span>Professor(a)</span><input type="text" data-note="prof" value="${escapeAttr(
        np
      )}" placeholder="${escapeAttr(NOTE_PH.prof)}" autocomplete="off" /></label>
      <label class="dlg-field"><span>E-mail</span><input type="email" data-note="email" value="${escapeAttr(
        ne
      )}" placeholder="${escapeAttr(NOTE_PH.email)}" autocomplete="off" /></label>
      <div class="horarios-form-clear-wrap">
        <button type="button" class="horarios-form-clear-btn" data-notes-clear>Limpar anotações</button>
      </div>
    `;

    body.querySelectorAll('input[data-note="prof"], input[data-note="email"]').forEach((inp) => {
      inp.addEventListener('blur', () => {
        saveNotesField(disc.id, inp.getAttribute('data-note'), inp.value, inp);
      });
    });

    bindScheduleSlotsEditor(body.querySelector('[data-slots-editor]'), disc.id);

    body.querySelector('[data-notes-clear]')?.addEventListener('click', () => {
      confirmClearDisciplineNotes(disc.id);
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

  /* ==========================================================================
   * Renderização da agenda
   * ========================================================================== */

  function avulsaNote(av) {
    return normalizeScheduleNote({
      dias: av.dias,
      hora_inicio: av.hora_inicio,
      hora_fim: av.hora_fim,
      horario: av.horario,
      sala: av.sala,
      prof: av.prof,
      email: av.email,
    });
  }

  function renderScheduleCard(item, opts) {
    const options = opts || {};
    const staticView = !!options.static;
    const { disc, note, isAvulsa, timeLabel, fillPct, slotNote, continuesBefore, continuesAfter } =
      item;
    const displayNote = slotNote ? { ...note, ...slotNote } : note;
    const metaParts = [];
    const timeDisp = formatTimeRangeLabel(displayNote) || timeLabel;
    if (timeDisp) metaParts.push(timeDisp);
    else {
      const sched = formatScheduleDisplay(displayNote);
      if (sched) metaParts.push(sched);
    }
    if (displayNote.sala) metaParts.push('Sala: ' + displayNote.sala);
    const metaLine = metaParts.join(' · ');
    let sub = '';
    if (metaLine) sub += `<div class="schedule-card-meta">${escapeHtml(metaLine)}</div>`;
    if (note.prof) sub += `<div class="schedule-card-meta">Prof.: ${escapeHtml(note.prof)}</div>`;
    if (staticView && note.email) {
      sub += `<div class="schedule-card-meta">${escapeHtml(note.email)}</div>`;
    }
    if (disc.isCccgExpanded && disc.codigo) {
      sub += `<div class="schedule-card-meta schedule-card-meta--code">${escapeHtml(disc.codigo)}</div>`;
    }

    let cls = [
      isAvulsa ? 'schedule-card schedule-card--avulsa' : 'schedule-card',
      staticView ? 'schedule-card--static' : '',
    ];
    if (fillPct && fillPct > 0) {
      cls.push('schedule-card--timed');
      if (continuesAfter) cls.push('schedule-card--segment-continues');
      if (continuesBefore) cls.push('schedule-card--segment-continued');
    }
    cls = cls.filter(Boolean).join(' ');
    const dataAttr = isAvulsa ? 'data-avulsa-id' : 'data-disc-id';
    const aria = isAvulsa
      ? `Disciplina avulsa: ${escapeAttr(disc.name)}`
      : `${escapeAttr(disc.name)}`;

    let badge = '';
    if (isAvulsa) {
      badge = '<span class="schedule-card-badge" aria-hidden="true">Avulsa</span>';
    } else if (disc.isCccgExpanded) {
      badge = '<span class="schedule-card-badge schedule-card-badge--cccg" aria-hidden="true">CCCG</span>';
    }

    const fillStyle =
      fillPct && fillPct > 0
        ? ` style="--schedule-fill:${Math.max(28, Math.min(100, fillPct)).toFixed(1)}"`
        : '';

    const inner = `${badge}<div class="schedule-card-name">${escapeHtml(
      disc.name
    )}</div>${sub}`;

    if (staticView) {
      return `<div class="${cls}"${fillStyle}>${inner}</div>`;
    }

    return `<button type="button" class="${cls}"${fillStyle} ${dataAttr}="${escapeAttr(
      disc.id
    )}" aria-label="Editar anotações: ${aria}">${inner}</button>`;
  }


  function isMobileSchedule() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function buildScheduleGridDesktop(cellMap, staticView) {
    let html = '<div class="schedule-grid" role="grid" aria-label="Grade semanal">';
    html += '<div class="schedule-corner" aria-hidden="true"></div>';
    for (let d = 0; d < SCHEDULE_DAY_COUNT; d++) {
      html += `<div class="schedule-day-header" role="columnheader">${DAY_NAMES[d]}</div>`;
    }
    for (const turn of TURNS) {
      html += `<div class="schedule-turn-label" role="rowheader"><span>${turn.label}</span><span class="schedule-turn-range">${turn.range}</span></div>`;
      for (let d = 0; d < SCHEDULE_DAY_COUNT; d++) {
        const items = cellMap[turn.id][d];
        html += '<div class="schedule-cell" role="gridcell">';
        for (const item of items) {
          html += renderScheduleCard(item, staticView ? { static: true } : undefined);
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
    for (let d = 0; d < SCHEDULE_DAY_COUNT; d++) {
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
    return buildScheduleGridDesktop(cellMap, false);
  }

  /** Monta grade semanal e lista de disciplinas sem horário parseável. */
  function gatherScheduleLayout() {
    const course = CURSOS[currentSigla];
    const progress = loadJson(progressKey(currentSigla), {});
    notes = loadJson(notesKey(currentSigla), {});
    const avulsas = loadAvulsas();

    const cfg = window.GRADE_CURSO_CONFIG;
    const hasCfg = cfg && Array.isArray(cfg.disciplines);
    const inProgressRaw = hasCfg
      ? cfg.disciplines.filter((d) => progress[d.id] === 'in_progress')
      : [];
    const inProgress = expandInProgressDisciplines(inProgressRaw, cfg);

    if (!inProgress.length && !avulsas.length) {
      return { course, inProgress, avulsas, cellMap: null, unplaced: [], isEmpty: true };
    }

    const cellMap = {};
    for (const t of TURNS) {
      cellMap[t.id] = {};
      for (let d = 0; d < SCHEDULE_DAY_COUNT; d++) cellMap[t.id][d] = [];
    }

    const unplaced = [];

    for (const disc of inProgress) {
      const n = normalizeScheduleNote(notes[disc.id] || {});
      const slots = placementsForDiscipline(disc.id, n);

      if (!slots.length) {
        unplaced.push({ disc, note: n, isAvulsa: false });
        continue;
      }
      for (const s of slots) {
        cellMap[s.turn][s.day].push({
          disc,
          timeLabel: s.timeLabel,
          note: n,
          isAvulsa: false,
          fillPct: s.fillPct,
          slotNote: s.slotNote,
          continuesBefore: s.continuesBefore,
          continuesAfter: s.continuesAfter,
        });
      }
    }

    for (const av of avulsas) {
      const n = avulsaNote(av);
      const fakeDisc = { id: av.id, name: av.nome };
      const slots = placementsForDiscipline(av.id, n);

      if (!slots.length) {
        unplaced.push({ disc: fakeDisc, note: n, isAvulsa: true });
        continue;
      }
      for (const s of slots) {
        cellMap[s.turn][s.day].push({
          disc: fakeDisc,
          timeLabel: s.timeLabel,
          note: n,
          isAvulsa: true,
          fillPct: s.fillPct,
          slotNote: s.slotNote,
          continuesBefore: s.continuesBefore,
          continuesAfter: s.continuesAfter,
        });
      }
    }

    return { course, inProgress, avulsas, cellMap, unplaced, isEmpty: false };
  }

  function buildUnplacedSectionHtml(unplaced, staticView) {
    if (!unplaced.length) return '';
    let html = '<section class="schedule-unplaced" aria-labelledby="unplaced-h">';
    html += '<h2 id="unplaced-h" class="schedule-unplaced-title">Sem horário definido</h2>';
    html += '<div class="schedule-unplaced-cards">';
    for (const row of unplaced) {
      const item = {
        disc: row.disc,
        note: row.note,
        isAvulsa: row.isAvulsa,
        timeLabel: '',
      };
      if (staticView) {
        html += renderScheduleCard(item, { static: true });
        continue;
      }
      const cls = row.isAvulsa
        ? 'schedule-card schedule-card--unplaced schedule-card--avulsa'
        : 'schedule-card schedule-card--unplaced';
      const dataAttr = row.isAvulsa ? 'data-avulsa-id' : 'data-disc-id';
      const metaParts = [];
      const sched = formatScheduleDisplay(row.note);
      if (sched) metaParts.push(sched);
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
        : row.disc.isCccgExpanded
          ? '<span class="schedule-card-badge schedule-card-badge--cccg" aria-hidden="true">CCCG</span>'
          : '';
      const codeLine =
        row.disc.isCccgExpanded && row.disc.codigo
          ? `<div class="schedule-card-meta schedule-card-meta--code">${escapeHtml(row.disc.codigo)}</div>`
          : '';
      html += `<button type="button" class="${cls}" ${dataAttr}="${escapeAttr(
        row.disc.id
      )}" aria-label="${aria}">${badge}<div class="schedule-card-name">${escapeHtml(
        row.disc.name
      )}</div>${sub}${codeLine}</button>`;
    }
    html += '</div></section>';
    return html;
  }

  function refreshScheduleExportButton(isEmpty) {
    const disabled = !!isEmpty;
    document.getElementById('schedule-export-pdf')?.toggleAttribute('disabled', disabled);
    document.getElementById('schedule-export-image')?.toggleAttribute('disabled', disabled);
  }

  /** Conteúdo compartilhado entre impressão PDF e exportação PNG. */
  function buildScheduleExportContent(layout) {
    const generatedAt = new Date().toLocaleString('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
    const sheetHtml = buildScheduleSpreadsheetHtml(layout);
    const unplacedHtml = buildUnplacedPrintListHtml(layout.unplaced);
    const mainHtml = buildPrintMainHtml(layout, sheetHtml, unplacedHtml);
    const bodyHtml =
      `<header class="schedule-print-header">` +
      `<h1 class="schedule-print-title">Horários do semestre — ${escapeHtml(layout.course.nome)}</h1>` +
      `<p class="schedule-print-meta">UNIPAMPA Alegrete · gerado em ${escapeHtml(generatedAt)}</p>` +
      `</header>` +
      `<main class="schedule-print-main">${mainHtml}</main>`;
    return { generatedAt, bodyHtml, courseName: layout.course.nome };
  }

  function writeSchedulePrintDocument(doc, layout) {
    const { bodyHtml, courseName } = buildScheduleExportContent(layout);
    doc.open();
    doc.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Horários — ${escapeHtml(courseName)}</title>
  <style>${SCHEDULE_PRINT_CSS}</style>
</head>
<body class="schedule-print-body">
  ${bodyHtml}
</body>
</html>`);
    doc.close();
  }

  function prepareSchedulePrintFrame(layout) {
    const frame = getSchedulePrintFrame();
    const prevStyle = frame.getAttribute('style') || '';
    frame.setAttribute(
      'style',
      'position:fixed;left:-10000px;top:0;width:1120px;min-height:200px;opacity:1;overflow:visible;border:0;margin:0;padding:0;pointer-events:none;z-index:-1;'
    );
    writeSchedulePrintDocument(frame.contentWindow.document, layout);
    return { frame, prevStyle };
  }

  function restoreSchedulePrintFrame(frame, prevStyle) {
    if (prevStyle) frame.setAttribute('style', prevStyle);
    else frame.removeAttribute('style');
  }

  /** Carrega html-to-image (local) sob demanda. */
  function loadHtmlToImageLib() {
    if (window.htmlToImage) return Promise.resolve(window.htmlToImage);
    return new Promise((resolve, reject) => {
      const existing = document.getElementById('html-to-image-script');
      if (existing) {
        if (window.htmlToImage) {
          resolve(window.htmlToImage);
          return;
        }
        existing.addEventListener('load', () => resolve(window.htmlToImage));
        existing.addEventListener('error', () => reject(new Error('html-to-image')));
        return;
      }
      const script = document.createElement('script');
      script.id = 'html-to-image-script';
      script.src = 'js/vendor/html-to-image.js';
      script.onload = () => {
        if (window.htmlToImage) resolve(window.htmlToImage);
        else reject(new Error('html-to-image indisponível'));
      };
      script.onerror = () => reject(new Error('Falha ao carregar html-to-image'));
      document.head.appendChild(script);
    });
  }

  async function captureSchedulePng(frame) {
    const doc = frame.contentDocument;
    const body = doc?.body;
    if (!body) throw new Error('Conteúdo de impressão indisponível');

    await new Promise((resolve) => setTimeout(resolve, 150));

    const htmlToImage = await loadHtmlToImageLib();
    const dataUrl = await htmlToImage.toPng(body, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      skipFonts: true,
      cacheBust: true,
    });

    if (!dataUrl || dataUrl.length < 2000) {
      throw new Error('Imagem gerada vazia');
    }
    return dataUrl;
  }

  function scheduleExportFilename(ext) {
    const date = new Date().toISOString().slice(0, 10);
    return `horarios-${currentSigla}-${date}.${ext}`;
  }

  function downloadDataUrl(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }

  function timeSortKey(timeLabel) {
    const parts = String(timeLabel || '0:0').split(':');
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return h * 60 + m;
  }

  function formatSheetTime(timeLabel) {
    const parts = String(timeLabel).split(':');
    const h = String(parseInt(parts[0], 10) || 0).padStart(2, '0');
    const m = String(parseInt(parts[1], 10) || 0).padStart(2, '0');
    return `${h}:${m}`;
  }

  /** Uma linha por bloco de horário (sem duplicar segmentos entre turnos). */
  function collectPlacedPrintItems(cellMap) {
    const seen = new Set();
    const out = [];
    for (const turn of TURNS) {
      for (let day = 0; day < SCHEDULE_DAY_COUNT; day++) {
        for (const item of cellMap[turn.id][day]) {
          const note = item.slotNote || item.note;
          const printStart = formatSheetTime(note.hora_inicio || item.timeLabel);
          const endRaw = note.hora_fim != null ? String(note.hora_fim).trim() : '';
          const printEnd = endRaw ? formatSheetTime(endRaw) : '';
          const sala = note.sala != null ? String(note.sala).trim() : '';
          const key = `${item.disc.id}|${day}|${printStart}|${printEnd}|${sala}`;
          if (seen.has(key)) continue;
          seen.add(key);
          out.push({
            ...item,
            day,
            printStart,
            printEnd,
            displayNote: note,
          });
        }
      }
    }
    return out;
  }

  /** Eixo da planilha: só horários de início e término reais das aulas. */
  function getPrintTimeSlots(placed) {
    const usedTimes = new Set();
    for (const p of placed) {
      if (p.printStart) usedTimes.add(p.printStart);
      if (p.printEnd && p.printEnd !== p.printStart) usedTimes.add(p.printEnd);
    }
    return [...usedTimes].sort((a, b) => timeSortKey(a) - timeSortKey(b));
  }

  function printItemKey(item) {
    const note = item.displayNote || item.slotNote || item.note;
    const sala = note.sala != null ? String(note.sala).trim() : '';
    return `${item.disc.id}|${item.day}|${item.printStart}|${item.printEnd}|${sala}`;
  }

  function printRowIndex(times, timeLabel) {
    const norm = formatSheetTime(timeLabel);
    const idx = times.indexOf(norm);
    return idx >= 0 ? idx : -1;
  }

  function printRowSpanForItem(item, times) {
    const startRow = printRowIndex(times, item.printStart);
    if (startRow < 0) return 1;
    const endRow =
      item.printEnd && item.printEnd !== item.printStart
        ? printRowIndex(times, item.printEnd)
        : startRow;
    if (endRow < startRow) return 1;
    return endRow - startRow + 1;
  }

  /** Faixas paralelas por dia quando há aulas sobrepostas no horário. */
  function assignPrintLanes(placed, times) {
    const lanesByDay = Array.from({ length: SCHEDULE_DAY_COUNT }, () => 1);
    const itemLane = new Map();

    for (let day = 0; day < SCHEDULE_DAY_COUNT; day++) {
      const dayItems = placed
        .filter((p) => p.day === day)
        .slice()
        .sort((a, b) => {
          const diff = timeSortKey(a.printStart) - timeSortKey(b.printStart);
          if (diff !== 0) return diff;
          return printRowSpanForItem(b, times) - printRowSpanForItem(a, times);
        });

      const laneEnds = [];
      for (const item of dayItems) {
        const startMin = timeSortKey(item.printStart);
        const endMin = timeSortKey(item.printEnd || item.printStart);
        let lane = 0;
        while (lane < laneEnds.length && laneEnds[lane] > startMin) {
          lane++;
        }
        if (lane === laneEnds.length) laneEnds.push(0);
        laneEnds[lane] = endMin;
        itemLane.set(printItemKey(item), lane);
      }
      lanesByDay[day] = Math.max(1, laneEnds.length);
    }

    return { lanesByDay, itemLane };
  }

  function renderSheetCellItem(item) {
    const { disc, isAvulsa, displayNote, printStart, printEnd } = item;
    const note = displayNote || item.note;
    const salaRaw = note.sala != null ? String(note.sala).trim() : '';
    const sala = salaRaw ? (/^sala/i.test(salaRaw) ? salaRaw : `Sala ${salaRaw}`) : '';
    const prof = note.prof != null ? String(note.prof).trim() : '';
    let tag = '';
    if (isAvulsa) tag = '<span class="schedule-sheet-tag">Avulsa</span>';
    else if (disc.isCccgExpanded) tag = '<span class="schedule-sheet-tag schedule-sheet-tag--cccg">CCCG</span>';

    let html = `<div class="schedule-sheet-class">${tag}`;
    html += `<div class="schedule-sheet-class-name">${escapeHtml(disc.name)}</div>`;
    if (printEnd && printEnd !== printStart) {
      html += `<div class="schedule-sheet-class-time">${escapeHtml(`${printStart}–${printEnd}`)}</div>`;
    } else if (printStart) {
      html += `<div class="schedule-sheet-class-time">${escapeHtml(printStart)}</div>`;
    }
    if (sala) html += `<div class="schedule-sheet-class-room">${escapeHtml(sala)}</div>`;
    if (prof) html += `<div class="schedule-sheet-class-prof">${escapeHtml(prof)}</div>`;
    html += '</div>';
    return html;
  }

  /** Tabela hora × dias com rowspan (limites reais de início/fim). */
  function buildScheduleSpreadsheetHtml(layout) {
    const placed = collectPlacedPrintItems(layout.cellMap);
    const times = getPrintTimeSlots(placed);

    if (!times.length) return '';

    const { lanesByDay, itemLane } = assignPrintLanes(placed, times);
    const startsAt = Array.from({ length: times.length }, () =>
      Array.from({ length: SCHEDULE_DAY_COUNT }, () => [])
    );

    for (const item of placed) {
      const startRow = printRowIndex(times, item.printStart);
      if (startRow < 0) continue;
      startsAt[startRow][item.day].push(item);
    }

    const covered = Array.from({ length: times.length }, () =>
      Array.from({ length: SCHEDULE_DAY_COUNT }, (_, d) =>
        Array.from({ length: lanesByDay[d] }, () => false)
      )
    );

    let html =
      `<table class="schedule-sheet-table" aria-label="Grade semanal de horários">` +
      `<caption class="schedule-sheet-caption">Horários por dia — linhas marcam início e término das aulas</caption>` +
      `<thead><tr><th scope="col" class="schedule-sheet-time-col">Hora</th>`;

    for (let d = 0; d < SCHEDULE_DAY_COUNT; d++) {
      const lanes = lanesByDay[d];
      if (lanes > 1) {
        html += `<th scope="col" colspan="${lanes}">${escapeHtml(DAY_NAMES_FULL[d])}</th>`;
      } else {
        html += `<th scope="col">${escapeHtml(DAY_NAMES_FULL[d])}</th>`;
      }
    }
    html += '</tr></thead><tbody>';

    for (let row = 0; row < times.length; row++) {
      html += `<tr><th scope="row" class="schedule-sheet-time-col">${escapeHtml(
        formatSheetTime(times[row])
      )}</th>`;

      for (let day = 0; day < SCHEDULE_DAY_COUNT; day++) {
        const lanes = lanesByDay[day];
        for (let lane = 0; lane < lanes; lane++) {
          if (covered[row][day][lane]) continue;

          const candidates = startsAt[row][day].filter(
            (item) => itemLane.get(printItemKey(item)) === lane
          );

          if (!candidates.length) {
            html += '<td class="schedule-sheet-cell"></td>';
            continue;
          }

          const item = candidates[0];
          const rowspan = printRowSpanForItem(item, times);
          for (let r = row; r < row + rowspan && r < times.length; r++) {
            covered[r][day][lane] = true;
          }

          html += `<td class="schedule-sheet-cell" rowspan="${rowspan}">`;
          html += renderSheetCellItem(item);
          html += '</td>';
        }
      }

      html += '</tr>';
    }

    html += '</tbody></table>';
    return html;
  }

  function buildUnplacedPrintListHtml(unplaced) {
    if (!unplaced.length) return '';
    let html =
      '<section class="schedule-sheet-unplaced" aria-labelledby="sheet-unplaced-h">';
    html +=
      '<h2 id="sheet-unplaced-h" class="schedule-sheet-unplaced-title">Sem horário definido na grade</h2>';
    html += '<ul class="schedule-sheet-unplaced-list">';
    for (const row of unplaced) {
      const parts = [row.disc.name];
      const sched = formatScheduleDisplay(row.note);
      if (sched) parts.push(sched);
      if (row.note.sala) parts.push(row.note.sala);
      if (row.note.prof) parts.push(row.note.prof);
      html += `<li>${escapeHtml(parts.join(' · '))}</li>`;
    }
    html += '</ul></section>';
    return html;
  }

  function buildPrintMainHtml(layout, sheetHtml, unplacedHtml) {
    const hasUnplaced = layout.unplaced.length > 0;

    if (!sheetHtml) {
      return (
        `<p class="schedule-print-empty">Nenhum horário foi reconhecido na grade. Preencha dias e horário de início (ex.: Terça e Quinta · 19:15).</p>` +
        (hasUnplaced ? `<div class="schedule-unplaced-zone">${unplacedHtml}</div>` : '')
      );
    }

    return (
      `<div class="schedule-sheet-zone">` +
      `<div class="schedule-sheet-wrap">${sheetHtml}</div></div>` +
      (hasUnplaced ? `<div class="schedule-unplaced-zone">${unplacedHtml}</div>` : '')
    );
  }

  const SCHEDULE_PRINT_CSS = `
.schedule-print-body{margin:0;padding:10px 12px;background:#fff;color:#111827;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:10px;line-height:1.35;box-sizing:border-box;display:flex;flex-direction:column}
.schedule-print-header{flex-shrink:0;margin:0 0 6px;padding:0 0 5px;border-bottom:2px solid #215732}
.schedule-print-title{margin:0;font-size:15px;font-weight:700;color:#111827}
.schedule-print-meta{margin:2px 0 0;font-size:9px;color:#6b7280}
.schedule-print-main{flex:1 1 auto;display:flex;flex-direction:column}
.schedule-sheet-zone{flex:0 0 auto;box-sizing:border-box}
.schedule-sheet-wrap{width:100%}
.schedule-sheet-table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:10px}
.schedule-sheet-caption{caption-side:top;text-align:left;font-size:8.5px;color:#6b7280;margin:0 0 6px;padding:0}
.schedule-sheet-table thead th{background:#215732;color:#fff;font-weight:600;padding:6px 4px;border:1px solid #1a4528;text-align:center;vertical-align:middle;font-size:9px}
.schedule-sheet-table thead th.schedule-sheet-time-col{width:56px}
.schedule-sheet-table tbody th{background:#eef2f0;color:#1f2937;font-weight:600;padding:6px 4px;border:1px solid #cbd5e1;text-align:center;vertical-align:middle;font-size:9px;white-space:nowrap}
.schedule-sheet-table td{border:1px solid #cbd5e1;padding:6px 5px;vertical-align:top;background:#fff;word-wrap:break-word;overflow-wrap:anywhere}
.schedule-sheet-table tbody tr:nth-child(even) td{background:#f8faf9}
.schedule-sheet-class{height:100%;min-height:2.5rem;border-left:3px solid #215732;padding-left:5px;box-sizing:border-box}
.schedule-sheet-class+.schedule-sheet-class{margin-top:4px;padding-top:4px;border-top:1px dashed #d1d5db}
.schedule-sheet-tag{display:inline-block;font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;padding:0 3px;border-radius:2px;background:#e5e7eb;color:#374151;margin-bottom:2px}
.schedule-sheet-tag--cccg{background:#dbeafe;color:#1e40af}
.schedule-sheet-class-name{font-weight:600;font-size:10px;line-height:1.3;color:#111827}
.schedule-sheet-class-time{font-size:9px;color:#374151;line-height:1.25;margin-top:2px}
.schedule-sheet-class-room{font-size:9px;color:#374151;line-height:1.25;margin-top:2px}
.schedule-sheet-class-prof{font-size:8px;color:#6b7280;line-height:1.25;margin-top:2px}
.schedule-unplaced-zone{flex:0 0 auto;margin-top:3mm;padding-top:3mm;border-top:2px solid #215732;box-sizing:border-box}
.schedule-sheet-unplaced{margin:0}
.schedule-sheet-unplaced-title{margin:0 0 4px;font-size:10px;font-weight:700;color:#374151}
.schedule-sheet-unplaced-list{margin:0;padding-left:16px;font-size:8.5px;color:#4b5563}
.schedule-sheet-unplaced-list li{margin:2px 0}
.schedule-print-empty{margin:0 0 6px;font-size:10px;color:#6b7280}
@media print{
  @page{size:A4 landscape;margin:7mm}
  html,body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .schedule-print-body{padding:0}
  .schedule-print-header{margin-bottom:3mm;padding-bottom:2mm}
  .schedule-print-title{font-size:13px}
  .schedule-sheet-table thead th{font-size:9px;padding:5px 3px}
  .schedule-sheet-table tbody th,.schedule-sheet-table td{padding:5px 4px;font-size:9px}
  .schedule-sheet-class-name{font-size:9.5px}
  .schedule-sheet-class-room{font-size:8.5px}
  .schedule-sheet-table tr,.schedule-sheet-table td,.schedule-sheet-table th{page-break-inside:avoid;break-inside:avoid}
}
`;

  function clearDisciplineNotes(discId) {
    delete notes[discId];
    localStorage.setItem(notesKey(currentSigla), JSON.stringify(notes));
    closeNotesModal();
    renderSchedule();
  }

  function confirmClearDisciplineNotes(discId) {
    const ok = window.confirm(
      'Apagar horários, sala, professor e e-mail desta disciplina?\n\nO status na grade (em andamento, concluída…) não muda.'
    );
    if (!ok) return;
    clearDisciplineNotes(discId);
  }

  function clearAvulsaFormFields() {
    const els = getAvulsaEls();
    if (els.dias) els.dias.value = '';
    refreshDayPicker(els.dayPicker, '');
    if (els.horaInicio) els.horaInicio.value = '';
    if (els.horaFim) els.horaFim.value = '';
    if (els.sala) els.sala.value = '';
    if (els.prof) els.prof.value = '';
    if (els.email) els.email.value = '';
  }

  function confirmClearAvulsaNotes() {
    const ok = window.confirm('Apagar dias, horários, sala, professor e e-mail desta disciplina avulsa?');
    if (!ok) return;

    clearAvulsaFormFields();

    if (editingAvulsaId) {
      const els = getAvulsaEls();
      const nome = els.nome?.value.trim() || '';
      if (!nome) return;

      const row = {
        id: editingAvulsaId,
        nome,
        dias: '',
        hora_inicio: '',
        hora_fim: '',
        horario: '',
        sala: '',
        prof: '',
        email: '',
      };

      const list = loadAvulsas();
      const idx = list.findIndex((x) => x.id === editingAvulsaId);
      if (idx >= 0) {
        list[idx] = row;
        saveAvulsas(list);
        renderSchedule();
      }
    }
  }

  /** iframe oculto para impressão/PDF sem depender de pop-up. */
  function getSchedulePrintFrame() {
    let frame = document.getElementById('schedule-print-frame');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = 'schedule-print-frame';
      frame.className = 'schedule-print-frame';
      frame.setAttribute('title', 'Impressão da grade de horários');
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('tabindex', '-1');
      document.body.appendChild(frame);
    }
    return frame;
  }

  /** Preenche iframe e abre diálogo de impressão (“Salvar como PDF”). */
  function openSchedulePrintView() {
    const layout = gatherScheduleLayout();
    if (layout.isEmpty || !layout.cellMap) {
      window.alert(
        'Não há disciplinas na agenda. Marque componentes como em andamento na grade ou adicione uma disciplina avulsa.'
      );
      return;
    }

    const frame = getSchedulePrintFrame();
    writeSchedulePrintDocument(frame.contentWindow.document, layout);

    let printed = false;
    function triggerPrint() {
      if (printed) return;
      printed = true;
      frame.contentWindow.focus();
      frame.contentWindow.print();
    }

    setTimeout(triggerPrint, 80);
  }

  /** Gera PNG da grade e dispara download no navegador. */
  async function exportScheduleImage() {
    const layout = gatherScheduleLayout();
    if (layout.isEmpty || !layout.cellMap) {
      window.alert(
        'Não há disciplinas na agenda. Marque componentes como em andamento na grade ou adicione uma disciplina avulsa.'
      );
      return;
    }

    const btn = document.getElementById('schedule-export-image');
    const prevLabel = btn?.textContent;
    const isEmpty = layout.isEmpty;
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Gerando imagem…';
    }

    try {
      const { frame, prevStyle } = prepareSchedulePrintFrame(layout);
      try {
        const dataUrl = await captureSchedulePng(frame);
        downloadDataUrl(dataUrl, scheduleExportFilename('png'));
      } finally {
        restoreSchedulePrintFrame(frame, prevStyle);
      }
    } catch (err) {
      console.error('[horarios] exportScheduleImage:', err);
      window.alert(
        'Não foi possível gerar a imagem. Tente imprimir para PDF ou use outro navegador (Chrome ou Firefox recomendados).'
      );
    } finally {
      if (btn) {
        btn.disabled = isEmpty;
        btn.textContent = prevLabel || 'Salvar imagem';
      }
    }
  }

  function renderSchedule() {
    const root = document.getElementById('schedule-root');
    if (!root) return;

    const layout = gatherScheduleLayout();
    const { course, inProgress, isEmpty, cellMap, unplaced } = layout;

    scheduleDiscById = new Map(inProgress.map((d) => [d.id, d]));
    refreshScheduleExportButton(isEmpty);

    if (isEmpty) {
      root.innerHTML = `
        <div class="schedule-no-class">
          <p>Nenhuma disciplina em andamento.</p>
          <p>Marque disciplinas como &quot;em andamento&quot; na página do curso para que apareçam aqui.</p>
          <p><a href="${escapeAttr(course.url)}">${escapeHtml(course.nome)} — grade</a></p>
          <p class="schedule-no-class-avulsa-hint">Ou adicione uma <strong>disciplina avulsa</strong> abaixo (CCCG, optativa, etc.).</p>
        </div>`;
      return;
    }

    let html = buildScheduleGridHtml(cellMap);
    html += buildUnplacedSectionHtml(unplaced, false);

    root.innerHTML = html;

    root.querySelectorAll('.schedule-card[data-disc-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-disc-id');
        const disc = scheduleDiscById.get(id);
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
      dias: document.getElementById('avulsa-input-dias'),
      dayPicker: document.getElementById('avulsa-day-picker'),
      horaInicio: document.getElementById('avulsa-input-hora-inicio'),
      horaFim: document.getElementById('avulsa-input-hora-fim'),
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
    panel.setAttribute('hidden', '');
    panel.setAttribute('inert', '');
    panel.classList.remove('is-open');
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
      const avNote = avulsaNote(av);
      els.dias.value = avNote.dias || '';
      refreshDayPicker(els.dayPicker, els.dias.value);
      els.horaInicio.value = timeInputValue(avNote.hora_inicio);
      els.horaFim.value = timeInputValue(avNote.hora_fim);
      els.sala.value = av.sala != null ? String(av.sala) : '';
      els.prof.value = av.prof != null ? String(av.prof) : '';
      els.email.value = av.email != null ? String(av.email) : '';
      if (els.remove) els.remove.hidden = false;
    } else {
      if (els.title) els.title.textContent = 'Nova disciplina avulsa';
      els.nome.value = '';
      els.dias.value = '';
      refreshDayPicker(els.dayPicker, '');
      els.horaInicio.value = '';
      els.horaFim.value = '';
      els.sala.value = '';
      els.prof.value = '';
      els.email.value = '';
      if (els.remove) els.remove.hidden = true;
    }

    els.sala.placeholder = NOTE_PH.sala;
    els.prof.placeholder = NOTE_PH.prof;
    els.email.placeholder = NOTE_PH.email;
    if (els.horaInicio) els.horaInicio.placeholder = NOTE_PH.hora_inicio;
    if (els.horaFim) els.horaFim.placeholder = NOTE_PH.hora_fim;

    els.panel.hidden = false;
    els.panel.removeAttribute('hidden');
    els.panel.removeAttribute('inert');
    els.panel.classList.add('is-open');
    refreshAvulsaSaveState();
    try {
      els.panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } catch {
      /* scrollIntoView options não suportados em alguns navegadores */
    }
    els.nome.focus({ preventScroll: true });
  }

  function saveAvulsaForm() {
    const els = getAvulsaEls();
    const nome = els.nome?.value.trim() || '';
    if (!nome) return;

    const noteDraft = syncNoteHorarioLegacy({
      dias: els.dias?.value.trim() ?? '',
      hora_inicio: normalizeTimeInput(els.horaInicio?.value.trim() ?? ''),
      hora_fim: normalizeTimeInput(els.horaFim?.value.trim() ?? ''),
    });

    const row = {
      id: editingAvulsaId || newAvulsaId(),
      nome,
      dias: noteDraft.dias,
      hora_inicio: noteDraft.hora_inicio,
      hora_fim: noteDraft.hora_fim,
      horario: noteDraft.horario,
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

  function bindAvulsaAddButton() {
    const extras = document.getElementById('schedule-avulsas-extras');
    if (!extras || extras.dataset.avulsaBound === '1') return;
    extras.dataset.avulsaBound = '1';
    extras.addEventListener('click', (e) => {
      const btn = e.target.closest('#avulsa-add-btn');
      if (!btn) return;
      e.preventDefault();
      openAvulsaPanel(null);
    });
  }

  function setupAvulsaForm() {
    bindAvulsaAddButton();

    const els = getAvulsaEls();
    if (!els.panel || !els.nome) return;

    els.nome.addEventListener('input', refreshAvulsaSaveState);
    bindDayPicker(els.dayPicker, els.dias, () => renderSchedule());
    bindHorarioTimeInput(els.horaInicio);
    bindHorarioTimeInput(els.horaFim);
    els.save?.addEventListener('click', saveAvulsaForm);
    els.cancel?.addEventListener('click', () => {
      closeAvulsaPanel();
    });
    els.remove?.addEventListener('click', removeAvulsa);
    document.getElementById('avulsa-clear-btn')?.addEventListener('click', confirmClearAvulsaNotes);
  }

  async function applyCourse(sigla) {
    const token = ++loadToken;
    closeAvulsaPanel();
    closeNotesModal();
    currentSigla = sigla;
    localStorage.setItem(CURSO_KEY, sigla);
    ensureAvulsasMigrated();

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
        refreshScheduleExportButton(true);
      }
      return;
    }
    if (token !== loadToken) return;
    renderSchedule();
  }

  /** Com conta: só o curso do perfil (sem seletor). */
  function resolveInitialCourse() {
    const profile = window.GRADE_PROFILE;
    if (profile?.isAccountUser?.()) {
      const sigla = profile.readProfile().curso;
      if (sigla && CURSOS[sigla]) {
        const picker = document.getElementById('horariosCursoPicker');
        const fixed = document.getElementById('horariosCursoFixed');
        const nameEl = document.getElementById('horariosCursoName');
        picker?.setAttribute('hidden', '');
        if (fixed) fixed.hidden = false;
        if (nameEl) nameEl.textContent = CURSOS[sigla].nome;
        document.body.classList.add('page-horarios--personalized');
        return sigla;
      }
    }
    return null;
  }

  function init() {
    try {
      setupAvulsaForm();
    } catch (err) {
      console.error('[horarios] setupAvulsaForm falhou:', err);
      bindAvulsaAddButton();
    }

    const sel = document.getElementById('curso-select');
    const saved = localStorage.getItem(CURSO_KEY);
    const urlCurso = new URLSearchParams(window.location.search).get('curso');
    const fromUrl = urlCurso && CURSOS[urlCurso] ? urlCurso : null;
    const fromProfile = resolveInitialCourse();
    const initial =
      fromProfile || fromUrl || (saved && CURSOS[saved] ? saved : sel ? sel.value : 'es');
    if (sel) {
      sel.value = initial;
      sel.addEventListener('change', () => applyCourse(sel.value));
    }

    document.getElementById('schedule-export-pdf')?.addEventListener('click', openSchedulePrintView);
    document.getElementById('schedule-export-image')?.addEventListener('click', exportScheduleImage);

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

    document.addEventListener('visibilitychange', () => {
      if (
        document.visibilityState === 'visible' &&
        document.getElementById('schedule-root')?.innerHTML
      ) {
        renderSchedule();
      }
    });

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
