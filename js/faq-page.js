/**
 * @file faq-page.js
 * @description Busca no FAQ com filtro e destaque de termos.
 */
(function () {
  'use strict';

  const searchInput = document.getElementById('faqSearch');
  const statusEl = document.getElementById('faqSearchStatus');
  const bodyEl = document.querySelector('.faq-body');
  if (!searchInput || !bodyEl) return;

  const items = [...bodyEl.querySelectorAll('.faq-item')];
  const sections = [...bodyEl.querySelectorAll('.faq-section')];
  const tocLinks = [...document.querySelectorAll('.faq-toc a[href^="#"]')];

  /** @type {Map<HTMLElement, string>} */
  const originalHtml = new Map();
  for (const item of items) {
    originalHtml.set(item, item.innerHTML);
  }

  function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function parseTerms(raw) {
    return raw
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length >= 2);
  }

  function clearHighlights() {
    for (const item of items) {
      const saved = originalHtml.get(item);
      if (saved != null) item.innerHTML = saved;
    }
  }

  function highlightTextNode(node, terms) {
    const text = node.nodeValue;
    const pattern = new RegExp(
      `(${terms.map(escapeRegExp).join('|')})`,
      'gi'
    );
    if (!pattern.test(text)) return;
    pattern.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let last = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match.index > last) {
        frag.appendChild(document.createTextNode(text.slice(last, match.index)));
      }
      const mark = document.createElement('mark');
      mark.className = 'faq-highlight';
      mark.textContent = match[0];
      frag.appendChild(mark);
      last = match.index + match[0].length;
      if (!match[0].length) break;
    }
    if (last < text.length) {
      frag.appendChild(document.createTextNode(text.slice(last)));
    }
    node.parentNode?.replaceChild(frag, node);
  }

  function highlightInRoot(root, terms) {
    if (!terms.length) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
        const tag = node.parentElement?.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'MARK') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) highlightTextNode(node, terms);
  }

  function itemMatches(item, terms) {
    const hay = (originalHtml.get(item) || item.textContent || '')
      .replace(/<[^>]+>/g, ' ')
      .toLowerCase();
    return terms.every((t) => hay.includes(t));
  }

  function updateToc() {
    for (const link of tocLinks) {
      const id = link.getAttribute('href')?.slice(1);
      const section = id ? document.getElementById(id) : null;
      const empty = section?.classList.contains('faq-section--empty');
      link.classList.toggle('faq-toc__link--muted', !!empty);
    }
  }

  function applySearch() {
    const terms = parseTerms(searchInput.value);
    clearHighlights();

    if (!terms.length) {
      for (const item of items) {
        item.classList.remove('faq-item--hidden');
        item.open = false;
      }
      for (const section of sections) {
        section.classList.remove('faq-section--empty');
      }
      if (statusEl) statusEl.hidden = true;
      updateToc();
      return;
    }

    let visibleCount = 0;
    for (const item of items) {
      const match = itemMatches(item, terms);
      item.classList.toggle('faq-item--hidden', !match);
      if (match) {
        visibleCount += 1;
        highlightInRoot(item, terms);
        item.open = true;
      } else {
        item.open = false;
      }
    }

    for (const section of sections) {
      const hasVisible = !!section.querySelector('.faq-item:not(.faq-item--hidden)');
      section.classList.toggle('faq-section--empty', !hasVisible);
    }

    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent =
        visibleCount === 0
          ? 'Nenhum resultado para essa busca.'
          : `${visibleCount} pergunta${visibleCount > 1 ? 's' : ''} encontrada${visibleCount > 1 ? 's' : ''}.`;
    }
    updateToc();
  }

  let debounce = 0;
  searchInput.addEventListener('input', () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(applySearch, 120);
  });

  searchInput.addEventListener('search', applySearch);
})();
