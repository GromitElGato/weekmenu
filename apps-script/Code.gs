// Weekmenu: Google Apps Script. Bewaart alles in het tabblad "data" van deze Google Sheet.
const SHEET_NAME = 'data';
const SEED_ = [
 [
  "balletjes-in-tomatensaus-met-selder",
  "Balletjes in tomatensaus met selder",
  "gehakt: 250 gr, patatten voor balletjes in tomatensaus, selder, ajuin, concentraat"
 ],
 [
  "bulgur-met-rode-saus",
  "Bulgur met rode saus",
  "bulgur, kipfilet, rode paprika, gele paprika, rode saus, ajuin: 2"
 ],
 [
  "chili-con-carne",
  "Chili con carne",
  "gehakt: 500 gr, ajuin: 2, tomatenblokjes, concentraat, blik rode bonen, blik maïs, rode paprika, gele paprika"
 ],
 [
  "couscous",
  "Couscous",
  "ajuin: 4, courgette: 4, rode paprika: 4, tomaat: 6, kipfilet: 2, erwten"
 ],
 [
  "curry",
  "Curry",
  "kipfilet, sugar snaps, rode paprika, ajuin, potje curry, kokosmelk: 200 ml"
 ],
 [
  "erwten-en-wortelen",
  "Erwten en wortelen",
  "erwten, wortelen, ajuin, laurier, patattenbollekes, vleesje tot x"
 ],
 [
  "gevulde-paprika-s",
  "Gevulde paprika’s",
  "rode paprika: 2, gehakt: 250 gr, spagheroni, gewone rijst, paneermeel, ei"
 ],
 [
  "jambalaya",
  "Jambalaya",
  "kipfilet, rode paprika, ajuin, chorizo, selder, passata"
 ],
 [
  "kalkoenragout",
  "Kalkoenragout",
  "selder, ajuin, wortelen, kalkoenfilet: 200 gr, concentraat, gnocchi, rode wijn, rozemarijn, laurier"
 ],
 [
  "kipgoulash",
  "Kipgoulash",
  "ajuin: 2, rode paprika, groene paprika, kipfilet"
 ],
 [
  "kokosrijst-met-kip",
  "Kokosrijst met kip",
  "ajuin, rode paprika, wortelen, kurkuma, kipfilet, kokosmelk: 200 ml"
 ],
 [
  "lasagne",
  "Lasagne",
  "rode paprika, courgette, wortelen, ajuin, passata, concentraat, gehakt: 250 gr, melk, lasagnebladeren, bloem"
 ],
 [
  "nasi-goreng",
  "Nasi Goreng",
  "rode paprika, ajuin, erwten, wortelen, Thaise rijst, kipfilet, ei: 4"
 ],
 [
  "orzo-met-shoarma-en-slaatje",
  "Orzo met shoarma en slaatje",
  "sjalot: 2, rode paprika, komkommer, kipfilet: 2, griekse pasta, shoarmakruiden"
 ],
 [
  "pasta-pesto",
  "Pasta pesto",
  "spirelli, potje rode pesto, kipfilet: 2, kerstomaten, rode paprika, ajuin: 2"
 ],
 [
  "patatten-met-slaatje-en-vleesje",
  "Patatten met slaatje en vleesje",
  "vleesje tot x, patatten voor bij slaatje, komkommer, kerstomaten, rode paprika"
 ],
 [
  "pizza-s",
  "Pizza’s",
  "pizzabodems, rode paprika, gehakt: 250 gr, ajuin, kaas, rode saus"
 ],
 [
  "puree",
  "Puree",
  "vleesje tot x, patatten voor puree, ajuin, groenten voor puree"
 ],
 [
  "rijst-met-kip-en-appelmoes",
  "Rijst met kip en appelmoes",
  "kipfilet: 2, pot appelmoes, blik ananas"
 ],
 [
  "spaghetti",
  "Spaghetti",
  "wortelen, ajuin: 4, courgette: 4, rode paprika: 4, gehakt: 1000 gr, concentraat: 4, passata: 3"
 ],
 [
  "stoofvlees",
  "Stoofvlees",
  "1 kg rundsstoofvlees, ajuin: 2, bruin brood, mosterd, bruin bier, laurier, nootmuskaat, azijn"
 ],
 [
  "tagliatelle-met-scampi-s-in-tomatensaus",
  "Tagliatelle met scampi’s in tomatensaus",
  "scampi’s, tagliatelle, ajuin, rode paprika, room, witte wijn, concentraat"
 ],
 [
  "tomatentaartjes-met-bonen-en-zalm",
  "Tomatentaartjes met bonen en zalm",
  "bonen, kerstomaten, zalm, bladerdeeg, sjalot"
 ],
 [
  "wok",
  "Wok",
  "wokgroenten, kipfilet"
 ],
 [
  "wraps",
  "Wraps",
  "wraps, komkommer, rode paprika, wortelen, kipfilet: 2"
 ],
 [
  "slaatje-met-quinoa",
  "Slaatje met quinoa",
  "quinoa, mango, kerstomaten, sla, walnoten, courgette"
 ],
 [
  "bbq",
  "BBQ",
  "BBQ-vlees, komkommer, paprika, kerstomaten, lookbrood"
 ],
 [
  "bestellen",
  "Bestellen",
  ""
 ]
];

// De webapp is nu alleen nog een JSON-API. De pagina zelf staat op GitHub Pages,
// dus Google toont zijn waarschuwingsbalk niet meer.
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.action === 'dump') return json_(api_dump(p.wk || '', p.v || ''));
    return json_({ ok: true, info: 'Weekmenu API' });
  } catch (err) { return json_({ error: String(err) }); }
}

// De pagina stuurt tekst/plain (geen preflight nodig) met JSON erin.
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.action === 'write') return json_(api_write(body.ops || []));
    return json_({ error: 'onbekende actie' });
  } catch (err) { return json_({ error: String(err) }); }
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(SHEET_NAME);
  if (!s) {
    try {
      s = ss.insertSheet(SHEET_NAME);
      s.getRange(1, 1, 1, 2).setValues([['pad', 'json']]);
      s.setFrozenRows(1);
    } catch (e) { s = ss.getSheetByName(SHEET_NAME); }
  }
  return s;
}

function rows_(s) {
  const n = s.getLastRow() - 1;
  return n < 1 ? [] : s.getRange(2, 1, n, 2).getValues();
}

function bump_() {
  const v = String(Date.now());
  CacheService.getScriptCache().put('v', v, 21600);
  return v;
}

function merge_(a, b) {
  Object.keys(b).forEach(function (k) {
    const x = b[k];
    if (x && typeof x === 'object' && !Array.isArray(x)) {
      a[k] = merge_(a[k] && typeof a[k] === 'object' && !Array.isArray(a[k]) ? a[k] : {}, x);
    } else { a[k] = x; }
  });
  return a;
}

function hasRecipes_(rows) {
  return rows.some(function (r) { return String(r[0]).indexOf('recipes/') === 0; });
}

function seed_(s) {
  const rows = SEED_.map(function (r) {
    return ['recipes/' + r[0], JSON.stringify({ n: r[1], i: r[2], seed: true })];
  });
  s.getRange(s.getLastRow() + 1, 1, rows.length, 2).setValues(rows);
}

// De pagina vraagt dit om de paar seconden. Zonder wijziging komt er bijna niets terug.
function api_dump(wk, clientV) {
  const cache = CacheService.getScriptCache();
  let v = cache.get('v');
  if (v && clientV && v === clientV) return { same: true, v: v };
  const s = sheet_();
  let rows = rows_(s);
  if (!hasRecipes_(rows)) {
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      rows = rows_(s);
      if (!hasRecipes_(rows)) { seed_(s); rows = rows_(s); }
      v = bump_();
    } finally { lock.releaseLock(); }
  }
  if (!v) v = bump_();
  const docs = {};
  const pre = 'weeks/' + wk;
  rows.forEach(function (r) {
    const p = String(r[0]);
    if (p.indexOf('recipes/') === 0 || p === pre || p.indexOf(pre + '/') === 0) {
      try { docs[p] = JSON.parse(r[1]); } catch (e) {}
    }
  });
  return { same: false, v: v, docs: docs };
}

// Schrijft een rij wijzigingen in één keer. ops: [{op:'set'|'update'|'delete', path, data}]
function api_write(ops) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const s = sheet_();
    const rows = rows_(s);
    const idx = {};
    rows.forEach(function (r, i) { idx[String(r[0])] = i; });
    const cur = {};
    const get = function (p) {
      if (p in cur) return cur[p];
      return p in idx ? JSON.parse(rows[idx[p]][1]) : null;
    };
    ops.forEach(function (o) {
      if (o.op === 'delete') cur[o.path] = null;
      else if (o.op === 'set') cur[o.path] = o.data;
      else if (o.op === 'update') cur[o.path] = merge_(get(o.path) || {}, o.data);
    });
    const del = {};
    const add = [];
    Object.keys(cur).forEach(function (p) {
      if (cur[p] === null) { if (p in idx) del[idx[p] + 2] = true; }
      else {
        const js = JSON.stringify(cur[p]);
        if (p in idx) s.getRange(idx[p] + 2, 2).setValue(js);
        else add.push([p, js]);
      }
    });
    // weken ouder dan 10 weken opruimen
    const cut = new Date(Date.now() - 70 * 86400000).toISOString().slice(0, 10);
    rows.forEach(function (r, i) {
      const m = /^weeks\/(\d{4}-\d{2}-\d{2})(\/|$)/.exec(String(r[0]));
      if (m && m[1] < cut) del[i + 2] = true;
    });
    Object.keys(del).map(Number).sort(function (a, b) { return b - a; })
      .forEach(function (r) { s.deleteRow(r); });
    if (add.length) s.getRange(s.getLastRow() + 1, 1, add.length, 2).setValues(add);
    bump_();
    return { ok: true };
  } finally { lock.releaseLock(); }
}
