/**
 * @file profile.js
 * @description Perfil do usuário, modo visitante e catálogo de cursos.
 */
(function () {
  'use strict';

  const PROFILE_KEY = 'grade_unipampa_profile_v1';
  const GUEST_KEY = 'grade_unipampa_guest_v1';
  const LOGGED_IN_KEY = 'grade_unipampa_logged_in_v1';
  const SHOW_ALL_KEY = 'grade_unipampa_show_all_courses_v1';

  /** @type {{ sigla: string, name: string, html: string, icon: string, meta: string }[]} */
  const CURSOS = [
    {
      sigla: 'es',
      name: 'Engenharia de Software',
      html: 'engenharia-software.html',
      icon: 'ti-code',
      meta: '9 semestres · PPC 2020',
    },
    {
      sigla: 'cc',
      name: 'Ciência da Computação',
      html: 'ciencias-computacao.html',
      icon: 'ti-cpu',
      meta: '9 semestres · PPC 2023',
    },
    {
      sigla: 'ec',
      name: 'Engenharia Civil',
      html: 'engenharia-civil.html',
      icon: 'ti-building',
      meta: '10 semestres · PPC 2023',
    },
    {
      sigla: 'ee',
      name: 'Engenharia Elétrica',
      html: 'engenharia-eletrica.html',
      icon: 'ti-bolt',
      meta: '10 semestres · PPC 2023',
    },
    {
      sigla: 'em',
      name: 'Engenharia Mecânica',
      html: 'engenharia-mecanica.html',
      icon: 'ti-tool',
      meta: '10 semestres · PPC 2023',
    },
    {
      sigla: 'ea',
      name: 'Engenharia Agrícola',
      html: 'engenharia-agricola.html',
      icon: 'ti-seeding',
      meta: '10 semestres · PPC 2023',
    },
    {
      sigla: 'et',
      name: 'Engenharia de Telecomunicações',
      html: 'engenharia-telecom.html',
      icon: 'ti-antenna',
      meta: '10 semestres · PPC vigente',
    },
  ];

  const SIGLA_SET = new Set(CURSOS.map((c) => c.sigla));

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null || raw === '') return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  /** @returns {{ nome: string, curso: string, periodo: number|null, anoIngresso: number|null, matricula: string, onboardingDone: boolean }} */
  function readProfile() {
    const p = readJson(PROFILE_KEY, {});
    const curso = typeof p.curso === 'string' && SIGLA_SET.has(p.curso) ? p.curso : '';
    const periodo = Number(p.periodo);
    const anoIngresso = Number(p.anoIngresso);
    return {
      nome: typeof p.nome === 'string' ? p.nome.trim() : '',
      curso,
      periodo: Number.isFinite(periodo) && periodo >= 1 && periodo <= 12 ? periodo : null,
      anoIngresso:
        Number.isFinite(anoIngresso) && anoIngresso >= 2000 && anoIngresso <= 2100
          ? anoIngresso
          : null,
      matricula: typeof p.matricula === 'string' ? p.matricula.trim() : '',
      onboardingDone: !!p.onboardingDone,
    };
  }

  /** @param {Partial<ReturnType<typeof readProfile>>} patch */
  function saveProfile(patch) {
    const cur = readProfile();
    const next = { ...cur, ...patch };
    if (patch.curso !== undefined) {
      next.curso = SIGLA_SET.has(patch.curso) ? patch.curso : '';
    }
    if (patch.periodo !== undefined) {
      const n = Number(patch.periodo);
      next.periodo = Number.isFinite(n) && n >= 1 && n <= 12 ? n : null;
    }
    if (patch.anoIngresso !== undefined) {
      const y = Number(patch.anoIngresso);
      next.anoIngresso = Number.isFinite(y) && y >= 2000 && y <= 2100 ? y : null;
    }
    if (patch.nome !== undefined) {
      next.nome = String(patch.nome).trim();
    }
    if (patch.matricula !== undefined) {
      next.matricula = String(patch.matricula).trim();
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    if (next.curso) {
      localStorage.setItem('grade_unipampa_horarios_curso_v1', next.curso);
    }
    return next;
  }

  function isGuest() {
    return localStorage.getItem(GUEST_KEY) === 'true';
  }

  /** @param {boolean} guest */
  function setGuest(guest) {
    if (guest) {
      localStorage.setItem(GUEST_KEY, 'true');
      clearLoggedIn();
    } else {
      localStorage.removeItem(GUEST_KEY);
    }
  }

  function isLoggedIn() {
    return localStorage.getItem(LOGGED_IN_KEY) === 'true';
  }

  function setLoggedIn(on) {
    if (on) {
      localStorage.setItem(LOGGED_IN_KEY, 'true');
      localStorage.removeItem(GUEST_KEY);
    } else {
      localStorage.removeItem(LOGGED_IN_KEY);
    }
  }

  function clearLoggedIn() {
    localStorage.removeItem(LOGGED_IN_KEY);
  }

  /** Mostra item Conta na sidebar (usuário com sessão ativa). */
  function isAccountUser() {
    return isLoggedIn() && !isGuest();
  }

  function getShowAllCourses() {
    return sessionStorage.getItem(SHOW_ALL_KEY) === 'true';
  }

  function setShowAllCourses(show) {
    if (show) {
      sessionStorage.setItem(SHOW_ALL_KEY, 'true');
    } else {
      sessionStorage.removeItem(SHOW_ALL_KEY);
    }
  }

  /** Falta curso/perfil após login. */
  function needsOnboarding() {
    const p = readProfile();
    return !p.onboardingDone || !p.curso;
  }

  /** Sidebar/index filtram para um curso só. */
  function isPersonalizedNav() {
    const p = readProfile();
    return isAccountUser() && p.onboardingDone && !!p.curso && !getShowAllCourses();
  }

  /** @param {string} sigla */
  function getCurso(sigla) {
    return CURSOS.find((c) => c.sigla === sigla) || null;
  }

  /** @param {boolean} [isSubpage] */
  function courseHref(html, isSubpage) {
    return isSubpage ? html : 'cursos/' + html;
  }

  /** @param {boolean} [isSubpage] */
  function primaryCourseHref(isSubpage) {
    const p = readProfile();
    const c = getCurso(p.curso);
    if (!c) return null;
    return courseHref(c.html, isSubpage);
  }

  window.GRADE_PROFILE = {
    CURSOS,
    PROFILE_KEY,
    GUEST_KEY,
    LOGGED_IN_KEY,
    readProfile,
    saveProfile,
    isGuest,
    setGuest,
    isLoggedIn,
    setLoggedIn,
    clearLoggedIn,
    isAccountUser,
    needsOnboarding,
    getShowAllCourses,
    setShowAllCourses,
    isPersonalizedNav,
    getCurso,
    courseHref,
    primaryCourseHref,
  };
})();
