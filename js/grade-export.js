/**
 * Exportação da grade curricular personalizada (CSV e PDF/impressão).
 * Consumido via window.GRADE_EXPORT a partir de main.js.
 */
(function () {
  'use strict';

  const GRADE_PRINT_CSS = `
.grade-print-body{margin:0;padding:10px 12px;background:#fff;color:#111827;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:10px;line-height:1.35;box-sizing:border-box}
.grade-print-header{margin:0 0 8px;padding:0 0 6px;border-bottom:2px solid #215732}
.grade-print-title{margin:0;font-size:15px;font-weight:700;color:#111827}
.grade-print-meta{margin:2px 0 0;font-size:9px;color:#6b7280}
.grade-print-summary{display:flex;flex-wrap:wrap;gap:8px 16px;margin:0 0 8px;font-size:9px;color:#374151}
.grade-print-summary span{white-space:nowrap}
.grade-print-ch{margin:0 0 8px;padding:6px 8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:4px;font-size:9px;color:#166534}
.grade-print-ch-title{margin:0 0 4px;font-weight:700;font-size:9px}
.grade-print-ch-list{margin:0;padding-left:14px}
.grade-print-table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:9px}
.grade-print-table thead{display:table-header-group}
.grade-print-table thead th{background:#215732;color:#fff;font-weight:600;padding:5px 4px;border:1px solid #1a4528;text-align:left;vertical-align:middle}
.grade-print-table td{border:1px solid #cbd5e1;padding:4px 5px;vertical-align:top;word-wrap:break-word;overflow-wrap:anywhere}
.grade-print-table tbody tr:nth-child(even) td{background:#f8faf9}
.grade-print-status{font-weight:600;white-space:nowrap}
.grade-print-status--done{color:#166534}
.grade-print-status--in_progress{color:#b45309}
.grade-print-status--ready{color:#1d4ed8}
.grade-print-status--locked{color:#6b7280}
.grade-print-foot{margin:8px 0 0;font-size:8px;color:#6b7280}
@media print{
  @page{size:A4 portrait;margin:5mm}
  html,body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .grade-print-body{padding:0;font-size:8px;line-height:1.25}
  .grade-print-header{margin:0 0 3px;padding:0 0 3px;border-bottom-width:1px;page-break-after:avoid;break-after:avoid-page}
  .grade-print-title{font-size:11px}
  .grade-print-meta{font-size:7px;margin-top:1px}
  .grade-print-summary{gap:3px 8px;margin:0 0 3px;font-size:7px;page-break-after:avoid;break-after:avoid-page}
  .grade-print-ch{margin:0 0 3px;padding:2px 4px;font-size:7px;line-height:1.3;page-break-after:avoid;break-after:avoid-page}
  .grade-print-ch-title{display:inline;margin:0 4px 0 0;font-size:7px}
  .grade-print-ch-list{display:inline;margin:0;padding:0;list-style:none}
  .grade-print-ch-list li{display:inline}
  .grade-print-ch-list li+li::before{content:" · "}
  .grade-print-table{font-size:7px;line-height:1.2}
  .grade-print-table thead tr{page-break-inside:avoid;break-inside:avoid-page}
  .grade-print-table thead th{padding:2px 2px;font-size:7px}
  .grade-print-table tbody tr{page-break-inside:auto;break-inside:auto}
  .grade-print-table tbody td{padding:1px 2px;page-break-inside:auto;break-inside:auto}
  .grade-print-foot{display:none}
}
@media print and (orientation:landscape){
  @page{size:A4 landscape;margin:6mm}
  .grade-print-table{font-size:8px}
  .grade-print-table thead th,.grade-print-table tbody td{padding:2px 3px}
  .grade-print-foot{display:block;margin-top:4px;font-size:6px}
}
`;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function csvCell(value) {
    const s = String(value ?? '');
    if (/[";\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  function statusClass(status) {
    if (status === 'Concluída') return 'done';
    if (status === 'Em andamento') return 'in_progress';
    if (status === 'Disponível') return 'ready';
    return 'locked';
  }

  function buildPrintTableHtml(rows) {
    let html =
      '<table class="grade-print-table" aria-label="Disciplinas da grade">' +
      '<thead><tr>' +
      '<th scope="col" style="width:6%">Sem.</th>' +
      '<th scope="col" style="width:9%">Código</th>' +
      '<th scope="col" style="width:28%">Disciplina</th>' +
      '<th scope="col" style="width:18%">Categoria</th>' +
      '<th scope="col" style="width:6%">CH</th>' +
      '<th scope="col" style="width:11%">Status</th>' +
      '<th scope="col" style="width:12%">Pré-requisitos</th>' +
      '<th scope="col" style="width:14%">CCCG escolhidas</th>' +
      '</tr></thead><tbody>';

    for (const row of rows) {
      const cls = statusClass(row.status);
      html += '<tr>';
      html += `<td>${escapeHtml(row.sem)}</td>`;
      html += `<td>${escapeHtml(row.codigo)}</td>`;
      html += `<td>${escapeHtml(row.name)}</td>`;
      html += `<td>${escapeHtml(row.category)}</td>`;
      html += `<td>${escapeHtml(row.chLabel || row.ch)}</td>`;
      html += `<td class="grade-print-status grade-print-status--${cls}">${escapeHtml(row.status)}</td>`;
      html += `<td>${escapeHtml(row.prereqs)}</td>`;
      html += `<td>${escapeHtml(row.cccgPicks)}</td>`;
      html += '</tr>';
    }

    html += '</tbody></table>';
    return html;
  }

  function buildPrintBodyHtml(snapshot) {
    const { title, subtitle, exportedAt, stats, chData, rows } = snapshot;
    let html = `<header class="grade-print-header">`;
    html += `<h1 class="grade-print-title">${escapeHtml(title || 'Grade curricular')}</h1>`;
    html += `<p class="grade-print-meta">UNIPAMPA Alegrete`;
    if (subtitle) html += ` · ${escapeHtml(subtitle)}`;
    html += ` · gerado em ${escapeHtml(exportedAt)}</p>`;
    html += `</header>`;

    html += `<div class="grade-print-summary">`;
    html += `<span><strong>${stats.nDone}</strong> concluídas</span>`;
    html += `<span><strong>${stats.nProg}</strong> em andamento</span>`;
    html += `<span><strong>${stats.nAvail}</strong> disponíveis</span>`;
    html += `<span><strong>${stats.nLocked}</strong> bloqueadas</span>`;
    html += `<span><strong>${stats.total}</strong> total</span>`;
    html += `</div>`;

    if (chData && chData.buckets?.length) {
      html += `<section class="grade-print-ch" aria-label="Integralização de carga horária">`;
      html += `<p class="grade-print-ch-title">Carga horária: ${chData.totalDone}h / ${chData.total}h</p>`;
      html += `<ul class="grade-print-ch-list">`;
      for (const b of chData.buckets) {
        html += `<li>${escapeHtml(b.shortLabel || b.label)}: ${b.done}/${b.required}h</li>`;
      }
      html += `</ul></section>`;
    }

    html += buildPrintTableHtml(rows);
    html += `<p class="grade-print-foot">Grade UNIPAMPA · exportação personalizada com base no progresso salvo no navegador.</p>`;
    return html;
  }

  function getPrintFrame() {
    let frame = document.getElementById('grade-print-frame');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = 'grade-print-frame';
      frame.className = 'grade-print-frame';
      frame.setAttribute('title', 'Impressão da grade curricular');
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('tabindex', '-1');
      document.body.appendChild(frame);
    }
    return frame;
  }

  function openPrintView(snapshot) {
    const frame = getPrintFrame();
    const doc = frame.contentWindow.document;
    const bodyHtml = buildPrintBodyHtml(snapshot);

    doc.open();
    doc.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Grade — ${escapeHtml(snapshot.title || snapshot.sigla)}</title>
  <style>${GRADE_PRINT_CSS}</style>
</head>
<body class="grade-print-body">
  ${bodyHtml}
</body>
</html>`);
    doc.close();

    let printed = false;
    function triggerPrint() {
      if (printed) return;
      printed = true;
      frame.contentWindow.focus();
      frame.contentWindow.print();
    }
    setTimeout(triggerPrint, 80);
  }

  function downloadCsv(snapshot) {
    const header = [
      'Semestre',
      'Código',
      'Disciplina',
      'Categoria',
      'CH (h)',
      'Status',
      'Pré-requisitos',
      'CCCG escolhidas',
    ];
    const lines = [header.map(csvCell).join(';')];

    for (const row of snapshot.rows) {
      lines.push(
        [
          row.sem,
          row.codigo,
          row.name,
          row.category,
          row.ch,
          row.status,
          row.prereqs,
          row.cccgPicks,
        ]
          .map(csvCell)
          .join(';')
      );
    }

    const blob = new Blob(['\uFEFF' + lines.join('\n')], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.download = `grade-${snapshot.sigla}-${date}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  window.GRADE_EXPORT = {
    openPrintView,
    downloadCsv,
  };
})();
