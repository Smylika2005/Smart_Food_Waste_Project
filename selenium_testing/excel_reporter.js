const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  const s = (ms / 1000).toFixed(2);
  return `${s}s`;
}

function formatTimestamp(date) {
  return date.toLocaleString('en-IN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  });
}

// ─── Color Palette ───────────────────────────────────────────────────────────
const COLORS = {
  headerBg:     'FF1B5E20',   // Dark Green header
  headerFont:   'FFFFFFFF',
  titleBg:      'FF2E7D32',   // Medium Green
  titleFont:    'FFFFFFFF',
  passGreen:    'FFC6EFCE',
  passFontG:    'FF006100',
  failRed:      'FFFFC7CE',
  failFontR:    'FF9C0006',
  skipYellow:   'FFFFEB9C',
  skipFontY:    'FF9C6500',
  rowAlt:       'FFF1F8E9',   // Light green alternating row
  rowNormal:    'FFFFFFFF',
  subHeader:    'FFDCEDC8',   // Module sub-header
  subFont:      'FF33691E',
  borderColor:  'FFBDBDBD',
  metaBg:       'FFE8F5E9',
  accentOrange: 'FFFF6F00',
  accentFont:   'FFFFFFFF',
  summaryBg:    'FFFAFAFA',
};

const THIN = { style: 'thin', color: { argb: COLORS.borderColor } };
const BORDER = { top: THIN, left: THIN, bottom: THIN, right: THIN };

function applyFont(cell, opts = {}) {
  cell.font = {
    name: opts.name || 'Calibri',
    size: opts.size || 11,
    bold: opts.bold || false,
    color: { argb: opts.color || 'FF000000' },
    italic: opts.italic || false
  };
}

function applyFill(cell, argb) {
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}

function applyAlignment(cell, h = 'left', v = 'middle', wrap = false) {
  cell.alignment = { horizontal: h, vertical: v, wrapText: wrap };
}

function setColWidths(sheet, widths) {
  widths.forEach((w, i) => {
    sheet.getColumn(i + 1).width = w;
  });
}

async function generateExcelReport(results, summary, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Antigravity AI';
  wb.created = new Date();
  wb.modified = new Date();

  // ════════════════════════════════════════════════════════════════
  // SHEET 1: DASHBOARD SUMMARY
  // ════════════════════════════════════════════════════════════════
  const dash = wb.addWorksheet('📊 Dashboard', { views: [{ showGridLines: false }] });
  setColWidths(dash, [3, 28, 22, 28, 22, 3]);

  // Main Title Banner
  dash.mergeCells('B2:E3');
  const titleCell = dash.getCell('B2');
  titleCell.value = '🌿  SMART FOOD WASTE MANAGEMENT';
  applyFont(titleCell, { size: 18, bold: true, color: COLORS.titleFont, name: 'Calibri' });
  applyFill(titleCell, COLORS.titleBg);
  applyAlignment(titleCell, 'center', 'middle');

  dash.getRow(2).height = 30;
  dash.getRow(3).height = 20;

  // Sub-title
  dash.mergeCells('B4:E4');
  const subTitle = dash.getCell('B4');
  subTitle.value = 'Selenium Web E2E Automation — Test Execution Report';
  applyFont(subTitle, { size: 12, bold: false, color: 'FF444444', italic: true });
  applyFill(subTitle, 'FFEFF8E6');
  applyAlignment(subTitle, 'center', 'middle');
  dash.getRow(4).height = 22;

  // Spacer
  dash.getRow(5).height = 10;

  // ── Left Column: Execution Metrics ───────────────────────────────
  const metricsLabel = dash.getCell('B6');
  metricsLabel.value = '  📋  Execution Metrics';
  applyFont(metricsLabel, { size: 12, bold: true, color: COLORS.headerFont });
  applyFill(metricsLabel, COLORS.headerBg);
  applyAlignment(metricsLabel, 'left', 'middle');
  dash.getRow(6).height = 24;

  const metrics = [
    ['Total Test Cases', summary.total],
    ['✅  Passed', summary.passed],
    ['❌  Failed', summary.failed],
    ['⏭  Skipped', summary.skipped],
    ['Pass Rate', `${summary.passRate}%`],
    ['Total Duration', formatDuration(summary.durationMs)],
    ['Avg per Test', formatDuration(Math.round(summary.durationMs / Math.max(summary.total, 1)))],
  ];

  metrics.forEach(([k, v], i) => {
    const r = 7 + i;
    const kCell = dash.getCell(`B${r}`);
    const vCell = dash.getCell(`C${r}`);
    kCell.value = k;
    vCell.value = v;
    applyFont(kCell, { size: 11, bold: true });
    applyFill(kCell, i % 2 === 0 ? COLORS.metaBg : COLORS.rowNormal);
    kCell.border = BORDER;
    applyAlignment(kCell, 'left', 'middle');

    // Color-coded value cells
    if (k.includes('Passed')) {
      applyFill(vCell, COLORS.passGreen);
      applyFont(vCell, { size: 11, bold: true, color: COLORS.passFontG });
    } else if (k.includes('Failed')) {
      const hasFails = summary.failed > 0;
      applyFill(vCell, hasFails ? COLORS.failRed : COLORS.passGreen);
      applyFont(vCell, { size: 11, bold: true, color: hasFails ? COLORS.failFontR : COLORS.passFontG });
    } else if (k === 'Pass Rate') {
      const rate = parseFloat(summary.passRate);
      applyFill(vCell, rate === 100 ? COLORS.passGreen : rate >= 80 ? COLORS.skipYellow : COLORS.failRed);
      applyFont(vCell, { size: 11, bold: true, color: rate >= 80 ? COLORS.passFontG : COLORS.failFontR });
    } else {
      applyFill(vCell, i % 2 === 0 ? 'FFFFFFFF' : COLORS.rowAlt);
      applyFont(vCell, { size: 11 });
    }
    vCell.border = BORDER;
    applyAlignment(vCell, 'center', 'middle');
    dash.getRow(r).height = 20;
  });

  // ── Right Column: Environment Info ────────────────────────────────
  const envLabel = dash.getCell('D6');
  envLabel.value = '  🖥️  Environment Details';
  applyFont(envLabel, { size: 12, bold: true, color: COLORS.headerFont });
  applyFill(envLabel, COLORS.headerBg);
  applyAlignment(envLabel, 'left', 'middle');

  const envInfo = [
    ['Application', 'Smart Food Waste Mgmt Web'],
    ['Base URL', summary.baseUrl || 'http://localhost:62978'],
    ['Browser', summary.browser || 'Google Chrome'],
    ['Test Framework', 'Selenium WebDriver 4.x'],
    ['Test Language', 'JavaScript (Node.js)'],
    ['Executed By', 'Antigravity AI Automation'],
    ['Execution Date', summary.startTime],
  ];

  envInfo.forEach(([k, v], i) => {
    const r = 7 + i;
    const kCell = dash.getCell(`D${r}`);
    const vCell = dash.getCell(`E${r}`);
    kCell.value = k;
    vCell.value = v;
    applyFont(kCell, { size: 11, bold: true });
    applyFill(kCell, i % 2 === 0 ? COLORS.metaBg : COLORS.rowNormal);
    kCell.border = BORDER;
    applyAlignment(kCell, 'left', 'middle');
    applyFill(vCell, i % 2 === 0 ? 'FFFFFFFF' : COLORS.rowAlt);
    applyFont(vCell, { size: 11 });
    vCell.border = BORDER;
    applyAlignment(vCell, 'left', 'middle', true);
  });

  // ── Module Summary ────────────────────────────────────────────────
  dash.getRow(15).height = 10;
  const modLabelRow = 16;
  dash.mergeCells(`B${modLabelRow}:E${modLabelRow}`);
  const modLabel = dash.getCell(`B${modLabelRow}`);
  modLabel.value = '  📦  Module-Wise Summary';
  applyFont(modLabel, { size: 12, bold: true, color: COLORS.headerFont });
  applyFill(modLabel, COLORS.headerBg);
  applyAlignment(modLabel, 'left', 'middle');
  dash.getRow(modLabelRow).height = 24;

  // Module header row
  ['Module / Screen', 'Total', 'Passed', 'Failed', 'Pass Rate'].forEach((h, ci) => {
    const cell = dash.getCell(modLabelRow + 1, ci + 2);
    cell.value = h;
    applyFont(cell, { bold: true, color: COLORS.headerFont, size: 11 });
    applyFill(cell, COLORS.titleBg);
    applyAlignment(cell, 'center', 'middle');
    cell.border = BORDER;
  });
  dash.getRow(modLabelRow + 1).height = 22;

  // Calculate module stats
  const modules = {};
  results.forEach(r => {
    if (!modules[r.module]) modules[r.module] = { total: 0, passed: 0, failed: 0 };
    modules[r.module].total++;
    if (r.status === 'PASS') modules[r.module].passed++;
    else if (r.status === 'FAIL') modules[r.module].failed++;
  });

  Object.entries(modules).forEach(([mod, stats], mi) => {
    const r = modLabelRow + 2 + mi;
    const rate = ((stats.passed / stats.total) * 100).toFixed(1);
    [mod, stats.total, stats.passed, stats.failed, `${rate}%`].forEach((v, ci) => {
      const cell = dash.getCell(r, ci + 2);
      cell.value = v;
      applyFill(cell, mi % 2 === 0 ? COLORS.metaBg : COLORS.rowNormal);
      applyFont(cell, { size: 11, bold: ci === 0 });
      applyAlignment(cell, ci === 0 ? 'left' : 'center', 'middle');
      cell.border = BORDER;
      if (ci === 3 && stats.failed > 0) { applyFill(cell, COLORS.failRed); applyFont(cell, { size: 11, bold: true, color: COLORS.failFontR }); }
      if (ci === 4) {
        const rateNum = parseFloat(rate);
        applyFill(cell, rateNum === 100 ? COLORS.passGreen : rateNum >= 80 ? COLORS.skipYellow : COLORS.failRed);
        applyFont(cell, { size: 11, bold: true, color: rateNum >= 80 ? COLORS.passFontG : COLORS.failFontR });
      }
    });
    dash.getRow(r).height = 20;
  });

  // ════════════════════════════════════════════════════════════════
  // SHEET 2: DETAILED TEST LOG
  // ════════════════════════════════════════════════════════════════
  const detail = wb.addWorksheet('📋 Detailed Log', { views: [{ showGridLines: true }] });
  setColWidths(detail, [7, 22, 25, 42, 38, 38, 12, 12, 20]);

  // Header
  const headers = [
    'TC ID', 'Module', 'Sub-Module', 'Test Case Description',
    'Expected Result', 'Actual Result', 'Status', 'Duration', 'Screenshot'
  ];
  detail.getRow(1).height = 30;
  headers.forEach((h, ci) => {
    const cell = detail.getCell(1, ci + 1);
    cell.value = h;
    applyFont(cell, { bold: true, color: COLORS.headerFont, size: 11 });
    applyFill(cell, COLORS.headerBg);
    applyAlignment(cell, 'center', 'middle');
    cell.border = BORDER;
  });

  // Freeze header row
  detail.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];

  let lastModule = '';
  let rowIdx = 1;
  results.forEach((tc, i) => {
    rowIdx++;

    // Module group header row
    if (tc.module !== lastModule) {
      detail.getRow(rowIdx).height = 22;
      detail.mergeCells(`A${rowIdx}:I${rowIdx}`);
      const groupCell = detail.getCell(`A${rowIdx}`);
      groupCell.value = `  📦  ${tc.module}`;
      applyFont(groupCell, { size: 11, bold: true, color: COLORS.subFont });
      applyFill(groupCell, COLORS.subHeader);
      applyAlignment(groupCell, 'left', 'middle');
      groupCell.border = BORDER;
      lastModule = tc.module;
      rowIdx++;
    }

    const row = detail.getRow(rowIdx);
    row.height = 38;

    const vals = [
      tc.tcId, tc.module, tc.subModule, tc.description,
      tc.expected, tc.actual, tc.status, formatDuration(tc.durationMs), tc.screenshot ? 'View 📸' : 'N/A'
    ];

    vals.forEach((v, ci) => {
      const cell = row.getCell(ci + 1);
      const alt = rowIdx % 2 === 0 ? COLORS.rowAlt : COLORS.rowNormal;

      if (ci === 6) {
        // Status cell
        if (v === 'PASS') {
          cell.value = '✅  PASS';
          applyFill(cell, COLORS.passGreen);
          applyFont(cell, { size: 11, bold: true, color: COLORS.passFontG });
        } else if (v === 'FAIL') {
          cell.value = '❌  FAIL';
          applyFill(cell, COLORS.failRed);
          applyFont(cell, { size: 11, bold: true, color: COLORS.failFontR });
        } else {
          cell.value = '⏭  SKIP';
          applyFill(cell, COLORS.skipYellow);
          applyFont(cell, { size: 11, bold: true, color: COLORS.skipFontY });
        }
      } else if (ci === 8 && tc.screenshot) {
        // Screenshot hyperlink
        cell.value = { text: 'View Screenshot 📸', hyperlink: `../screenshots/${tc.screenshot}`, tooltip: `Open ${tc.screenshot}` };
        applyFont(cell, { size: 10, color: '1565C0' });
        cell.font = { ...cell.font, underline: true };
        applyFill(cell, alt);
      } else {
        cell.value = v;
        applyFill(cell, alt);
        applyFont(cell, { size: ci === 0 ? 10 : 10, bold: ci === 0 });
      }
      applyAlignment(cell, ci < 3 ? 'center' : 'left', 'middle', ci >= 3);
      cell.border = BORDER;
    });
  });

  // ════════════════════════════════════════════════════════════════
  // SHEET 3: PASS / FAIL ANALYSIS
  // ════════════════════════════════════════════════════════════════
  const analysis = wb.addWorksheet('📈 Analysis', { views: [{ showGridLines: false }] });
  setColWidths(analysis, [4, 30, 14, 14, 14, 14, 4]);

  analysis.mergeCells('B2:F2');
  const aTitle = analysis.getCell('B2');
  aTitle.value = '📈  Module-Wise Test Analysis';
  applyFont(aTitle, { size: 14, bold: true, color: COLORS.titleFont });
  applyFill(aTitle, COLORS.titleBg);
  applyAlignment(aTitle, 'center', 'middle');
  analysis.getRow(2).height = 28;

  const aHeaders = ['Module', 'Total TCs', 'Passed', 'Failed', 'Skipped'];
  aHeaders.forEach((h, ci) => {
    const cell = analysis.getCell(3, ci + 2);
    cell.value = h;
    applyFont(cell, { bold: true, color: COLORS.headerFont, size: 11 });
    applyFill(cell, COLORS.headerBg);
    applyAlignment(cell, 'center', 'middle');
    cell.border = BORDER;
  });
  analysis.getRow(3).height = 22;

  const totRow = Object.entries(modules).length + 4;
  Object.entries(modules).forEach(([mod, stats], mi) => {
    const r = 4 + mi;
    const skipped = stats.total - stats.passed - stats.failed;
    [mod, stats.total, stats.passed, stats.failed, skipped].forEach((v, ci) => {
      const cell = analysis.getCell(r, ci + 2);
      cell.value = v;
      applyFill(cell, mi % 2 === 0 ? COLORS.metaBg : COLORS.rowNormal);
      applyFont(cell, { size: 11, bold: ci === 0 });
      applyAlignment(cell, ci === 0 ? 'left' : 'center', 'middle');
      cell.border = BORDER;
      if (ci === 3 && v > 0) { applyFill(cell, COLORS.failRed); applyFont(cell, { size: 11, bold: true, color: COLORS.failFontR }); }
      if (ci === 2 && v > 0) { applyFill(cell, COLORS.passGreen); applyFont(cell, { size: 11, bold: true, color: COLORS.passFontG }); }
    });
    analysis.getRow(r).height = 20;
  });

  // Totals row
  const tCell = analysis.getCell(totRow, 2);
  tCell.value = 'TOTAL';
  applyFont(tCell, { size: 11, bold: true, color: COLORS.titleFont });
  applyFill(tCell, COLORS.titleBg);
  tCell.border = BORDER;
  [summary.total, summary.passed, summary.failed, summary.skipped].forEach((v, ci) => {
    const cell = analysis.getCell(totRow, ci + 3);
    cell.value = v;
    applyFont(cell, { size: 11, bold: true, color: COLORS.titleFont });
    applyFill(cell, COLORS.titleBg);
    applyAlignment(cell, 'center', 'middle');
    cell.border = BORDER;
  });
  analysis.getRow(totRow).height = 22;

  // ── Save workbook ────────────────────────────────────────────────
  await wb.xlsx.writeFile(outputPath);
  console.log(`\n✅ Excel Report Generated: ${outputPath}\n`);
}

module.exports = { generateExcelReport };
