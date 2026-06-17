/**
 * ============================================================================
 *  EXCEL REPORTER — Smart Food Waste Appium E2E
 *  3 Sheets: Dashboard | Detailed Log | Module Analysis
 * ============================================================================
 */

const ExcelJS = require('exceljs');
const path    = require('path');
const fs      = require('fs');

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  headerBg:   'FF1B5E20',  // Deep Green
  headerFont: 'FFFFFFFF',
  titleBg:    'FF2E7D32',  // Medium Green
  passGreen:  'FFC6EFCE',  passFontG: 'FF006100',
  failRed:    'FFFFC7CE',  failFontR: 'FF9C0006',
  skipYellow: 'FFFFEB9C',  skipFontY: 'FF9C6500',
  rowAlt:     'FFF1F8E9',  // Light green alt row
  rowBase:    'FFFFFFFF',
  subHeader:  'FFDCEDC8',  subFont:  'FF33691E',
  metaBg:     'FFE8F5E9',
  border:     'FFBDBDBD',
  orange:     'FFFF6F00',
  orangeFont: 'FFFFFFFF',
};

const THIN   = { style: 'thin', color: { argb: C.border } };
const BORDER = { top: THIN, left: THIN, bottom: THIN, right: THIN };

function font(cell, { name='Calibri', size=11, bold=false, color='FF000000', italic=false } = {}) {
  cell.font = { name, size, bold, color: { argb: color }, italic };
}
function fill(cell, argb) {
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}
function align(cell, h='left', v='middle', wrap=false) {
  cell.alignment = { horizontal: h, vertical: v, wrapText: wrap };
}
function widths(sheet, arr) {
  arr.forEach((w, i) => (sheet.getColumn(i + 1).width = w));
}
function mergeTitle(sheet, ref, text, fg, fontColor, fSize=16) {
  sheet.mergeCells(ref);
  const cell = sheet.getCell(ref.split(':')[0]);
  cell.value = text;
  font(cell, { size: fSize, bold: true, color: fontColor });
  fill(cell, fg);
  align(cell, 'center', 'middle');
  return cell;
}

// ─── Helper: write a labeled key-value row ────────────────────────────────────
function kvRow(sheet, row, col1, col2, key, value, altRow, options = {}) {
  const kc = sheet.getCell(row, col1);
  const vc = sheet.getCell(row, col2);
  kc.value = key; vc.value = value;
  font(kc, { size: 11, bold: true, ...options.kFont });
  fill(kc, altRow ? C.metaBg : C.rowBase);
  align(kc, 'left', 'middle');
  kc.border = BORDER;
  if (options.vFill) fill(vc, options.vFill);
  else fill(vc, altRow ? C.rowBase : C.rowAlt);
  font(vc, { size: 11, bold: options.vBold || false, color: options.vColor || 'FF000000' });
  align(vc, options.vAlign || 'center', 'middle', options.vWrap || false);
  vc.border = BORDER;
  sheet.getRow(row).height = options.rh || 20;
}

async function generateExcelReport(results, summary, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Antigravity AI'; wb.created = new Date();

  // ══════════════════════════════════════════════════════════════
  // SHEET 1: DASHBOARD SUMMARY
  // ══════════════════════════════════════════════════════════════
  const ds = wb.addWorksheet('📊 Dashboard', { views: [{ showGridLines: false }] });
  widths(ds, [3, 30, 24, 30, 24, 3]);

  ds.getRow(2).height = 32;
  ds.getRow(3).height = 10;
  mergeTitle(ds, 'B2:E2', '🌿  Smart Food Waste Management — Appium E2E Report', C.titleBg, C.headerFont, 17);

  ds.getRow(3).height = 20;
  mergeTitle(ds, 'B3:E3', 'Android Mobile Application | End-to-End Test Execution Analysis', 'FFEFF8E6', 'FF444444', 11);

  ds.getRow(4).height = 12;
  ds.getRow(5).height = 26;

  // LEFT: Metrics header
  mergeTitle(ds, 'B5:C5', '  📋  Execution Metrics', C.headerBg, C.headerFont, 12);
  // RIGHT: Environment header
  mergeTitle(ds, 'D5:E5', '  🖥️  Environment & Configuration', C.headerBg, C.headerFont, 12);

  const rate = parseFloat(summary.passRate);
  const metricsData = [
    ['Total Test Cases', summary.total],
    ['✅  Passed', summary.passed],
    ['❌  Failed', summary.failed],
    ['⏭  Skipped', summary.skipped || 0],
    ['Pass Rate', `${summary.passRate}%`],
    ['Total Duration', formatDuration(summary.durationMs)],
    ['Avg per Test Case', formatDuration(Math.round(summary.durationMs / Math.max(summary.total, 1)))],
    ['Start Time', summary.startTime],
    ['End Time', summary.endTime],
  ];

  metricsData.forEach(([k, v], i) => {
    const r = 6 + i;
    let vFill = i % 2 === 0 ? C.rowBase : C.rowAlt;
    let vBold = false, vColor = 'FF000000';
    if (k.includes('Passed')) { vFill = C.passGreen; vBold = true; vColor = C.passFontG; }
    else if (k.includes('Failed')) { vFill = summary.failed > 0 ? C.failRed : C.passGreen; vBold = true; vColor = summary.failed > 0 ? C.failFontR : C.passFontG; }
    else if (k === 'Pass Rate') { vFill = rate === 100 ? C.passGreen : rate >= 80 ? C.skipYellow : C.failRed; vBold = true; vColor = rate >= 80 ? C.passFontG : C.failFontR; }
    kvRow(ds, r, 2, 3, k, v, i % 2 === 0, { vFill, vBold, vColor });
  });

  const envData = [
    ['Application', 'Smart Food Waste Management'],
    ['Platform', 'Android Mobile'],
    ['Automation Driver', 'UIAutomator2 (Appium)'],
    ['Client Library', 'WebdriverIO 8.x (Node.js)'],
    ['Device / Emulator', summary.deviceName || 'Android Emulator'],
    ['Android Version', summary.platformVersion || '12.0'],
    ['APK Version', summary.appVersion || '1.0.0+1'],
    ['Executed By', 'Antigravity AI Automation Engine'],
    ['Report Generated', new Date().toLocaleString()],
  ];

  envData.forEach(([k, v], i) => {
    kvRow(ds, 6 + i, 4, 5, k, v, i % 2 === 0, { vAlign: 'left', vWrap: true });
  });

  // Module summary section
  ds.getRow(16).height = 12;
  ds.getRow(17).height = 26;
  mergeTitle(ds, 'B17:E17', '  📦  Module-Wise Test Summary', C.headerBg, C.headerFont, 12);

  const modHeaders = ['Module / Screen', 'Total TCs', 'Passed', 'Failed', 'Pass Rate'];
  modHeaders.forEach((h, ci) => {
    const cell = ds.getCell(18, ci + 2);
    cell.value = h; font(cell, { bold: true, color: C.headerFont, size: 11 });
    fill(cell, C.titleBg); align(cell, 'center', 'middle'); cell.border = BORDER;
  });
  ds.getRow(18).height = 22;

  // Calculate module stats
  const mods = {};
  results.forEach(r => {
    if (!mods[r.module]) mods[r.module] = { t: 0, p: 0, f: 0 };
    mods[r.module].t++;
    if (r.status === 'PASS') mods[r.module].p++;
    else if (r.status === 'FAIL') mods[r.module].f++;
  });

  Object.entries(mods).forEach(([mod, st], mi) => {
    const row = 19 + mi;
    const mr = ((st.p / st.t) * 100).toFixed(1);
    [mod, st.t, st.p, st.f, `${mr}%`].forEach((v, ci) => {
      const cell = ds.getCell(row, ci + 2);
      cell.value = v;
      fill(cell, mi % 2 === 0 ? C.metaBg : C.rowBase);
      font(cell, { size: 11, bold: ci === 0 });
      align(cell, ci === 0 ? 'left' : 'center', 'middle');
      cell.border = BORDER;
      if (ci === 3 && st.f > 0) { fill(cell, C.failRed); font(cell, { size: 11, bold: true, color: C.failFontR }); }
      if (ci === 2) { fill(cell, C.passGreen); font(cell, { size: 11, bold: true, color: C.passFontG }); }
      if (ci === 4) {
        const rn = parseFloat(mr);
        fill(cell, rn === 100 ? C.passGreen : rn >= 80 ? C.skipYellow : C.failRed);
        font(cell, { size: 11, bold: true, color: rn >= 80 ? C.passFontG : C.failFontR });
      }
    });
    ds.getRow(row).height = 20;
  });

  // ══════════════════════════════════════════════════════════════
  // SHEET 2: DETAILED TEST LOG
  // ══════════════════════════════════════════════════════════════
  const dl = wb.addWorksheet('📋 Detailed Log', { views: [{ showGridLines: true }] });
  widths(dl, [8, 22, 22, 45, 40, 40, 13, 11, 18]);

  const headers = ['TC ID', 'Module', 'Sub-Module', 'Test Case Description',
    'Expected Result', 'Actual Result', 'Status', 'Duration', 'Screenshot'];

  dl.getRow(1).height = 30;
  headers.forEach((h, ci) => {
    const cell = dl.getCell(1, ci + 1);
    cell.value = h; font(cell, { bold: true, color: C.headerFont, size: 11 });
    fill(cell, C.headerBg); align(cell, 'center', 'middle'); cell.border = BORDER;
  });
  dl.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];

  let lastMod = '';
  let rowNum = 1;

  results.forEach((tc) => {
    // Module group separator
    if (tc.module !== lastMod) {
      rowNum++;
      dl.getRow(rowNum).height = 22;
      dl.mergeCells(`A${rowNum}:I${rowNum}`);
      const gc = dl.getCell(`A${rowNum}`);
      gc.value = `  📦  ${tc.module}`;
      font(gc, { size: 11, bold: true, color: C.subFont });
      fill(gc, C.subHeader); align(gc, 'left', 'middle'); gc.border = BORDER;
      lastMod = tc.module;
    }

    rowNum++;
    const row = dl.getRow(rowNum);
    row.height = 40;
    const isAlt = rowNum % 2 === 0;

    [tc.tcId, tc.module, tc.subModule, tc.description,
      tc.expected, tc.actual, tc.status, tc.durationMs, tc.screenshot].forEach((v, ci) => {
      const cell = row.getCell(ci + 1);

      if (ci === 6) { // Status
        if (v === 'PASS')  { cell.value = '✅  PASS'; fill(cell, C.passGreen); font(cell, { size: 11, bold: true, color: C.passFontG }); }
        else if (v === 'FAIL') { cell.value = '❌  FAIL'; fill(cell, C.failRed); font(cell, { size: 11, bold: true, color: C.failFontR }); }
        else               { cell.value = '⏭  SKIP'; fill(cell, C.skipYellow); font(cell, { size: 11, bold: true, color: C.skipFontY }); }
        align(cell, 'center', 'middle');
      } else if (ci === 7) { // Duration
        cell.value = formatDuration(v);
        fill(cell, isAlt ? C.rowAlt : C.rowBase);
        font(cell, { size: 10 }); align(cell, 'right', 'middle');
      } else if (ci === 8) { // Screenshot
        if (v) {
          cell.value = { text: '📸 View Screenshot', hyperlink: `../screenshots/${v}`, tooltip: `Open ${v}` };
          font(cell, { size: 10, color: '1565C0' });
          cell.font = { ...cell.font, underline: true };
        } else {
          cell.value = 'N/A'; font(cell, { size: 10, color: '999999' });
        }
        fill(cell, isAlt ? C.rowAlt : C.rowBase);
        align(cell, 'center', 'middle');
      } else { // Other cells
        cell.value = v;
        fill(cell, isAlt ? C.rowAlt : C.rowBase);
        font(cell, { size: ci === 0 ? 10 : 10, bold: ci === 0 });
        align(cell, ci < 2 ? 'center' : 'left', 'middle', ci >= 3);
      }
      cell.border = BORDER;
    });
  });

  // ══════════════════════════════════════════════════════════════
  // SHEET 3: MODULE ANALYSIS
  // ══════════════════════════════════════════════════════════════
  const an = wb.addWorksheet('📈 Module Analysis', { views: [{ showGridLines: false }] });
  widths(an, [4, 30, 12, 12, 12, 14, 4]);

  an.getRow(2).height = 28;
  mergeTitle(an, 'B2:F2', '📈  Module-Wise Test Execution Analysis', C.titleBg, C.headerFont, 14);

  const anHdrs = ['Module / Screen', 'Total TCs', 'Passed', 'Failed', 'Pass Rate %'];
  an.getRow(3).height = 24;
  anHdrs.forEach((h, ci) => {
    const cell = an.getCell(3, ci + 2);
    cell.value = h; font(cell, { bold: true, color: C.headerFont, size: 11 });
    fill(cell, C.headerBg); align(cell, 'center', 'middle'); cell.border = BORDER;
  });

  Object.entries(mods).forEach(([mod, st], mi) => {
    const row = 4 + mi;
    const mr = ((st.p / st.t) * 100).toFixed(2);
    [mod, st.t, st.p, st.f, `${mr}%`].forEach((v, ci) => {
      const cell = an.getCell(row, ci + 2);
      cell.value = v;
      fill(cell, mi % 2 === 0 ? C.metaBg : C.rowBase);
      font(cell, { size: 11, bold: ci === 0 });
      align(cell, ci === 0 ? 'left' : 'center', 'middle');
      cell.border = BORDER;
      if (ci === 3 && st.f > 0) { fill(cell, C.failRed); font(cell, { size: 11, bold: true, color: C.failFontR }); }
      if (ci === 2) { fill(cell, C.passGreen); font(cell, { size: 11, bold: true, color: C.passFontG }); }
      if (ci === 4) {
        const rn = parseFloat(mr);
        fill(cell, rn === 100 ? C.passGreen : rn >= 80 ? C.skipYellow : C.failRed);
        font(cell, { size: 11, bold: true, color: rn >= 80 ? C.passFontG : C.failFontR });
      }
    });
    an.getRow(row).height = 20;
  });

  // Totals row
  const totRow = 4 + Object.keys(mods).length;
  an.getRow(totRow).height = 22;
  ['TOTAL', summary.total, summary.passed, summary.failed,
    `${summary.passRate}%`].forEach((v, ci) => {
    const cell = an.getCell(totRow, ci + 2);
    cell.value = v; fill(cell, C.titleBg);
    font(cell, { size: 11, bold: true, color: C.headerFont });
    align(cell, ci === 0 ? 'left' : 'center', 'middle'); cell.border = BORDER;
  });

  // Footer note
  an.getRow(totRow + 2).height = 18;
  an.mergeCells(`B${totRow + 2}:F${totRow + 2}`);
  const footCell = an.getCell(`B${totRow + 2}`);
  footCell.value = `Report generated by Antigravity AI Automation Engine — ${new Date().toLocaleString()}`;
  font(footCell, { size: 9, italic: true, color: '888888' });
  align(footCell, 'center', 'middle');

  // ── Save ──────────────────────────────────────────────────────
  await wb.xlsx.writeFile(outputPath);
  console.log(`\n✅ Excel Report: ${outputPath}`);
}

module.exports = { generateExcelReport };
