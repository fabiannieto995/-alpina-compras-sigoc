/* =========================================================
   Alpina Compras · SIGOC — Lógica del prototipo
   Tres sesiones: Solicitante · Jefe aprobador · Comprador
   Los datos se guardan en el navegador (localStorage).
   ========================================================= */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Utilidades ---------- */
const money = n => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fmtDate = iso => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MESES[m - 1]} ${y}`;
};
const isoOf = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const todayISO = () => isoOf(new Date());
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return isoOf(d); };
const pad = n => String(n).padStart(4, '0');
const firstName = n => n.split(' ')[0];

/* ---------- Iconos (SVG en línea) ---------- */
const ICONS = {
  grid: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  filecheck: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>',
  approve: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  tick: '<path d="M20 6 9 17l-5-5"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  menu: '<path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  switch: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>',
  money: '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
};
const icon = n => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

const ROLE_COLOR = { solicitante: '#2c7fb8', jefe: '#c0912b', comprador: '#1d7f5b' };

/* ---------- Estado y persistencia ---------- */
const STORE_KEY = 'sigoc_prototipo_v2';
const SESSION_KEY = 'sigoc_sesion_v2';
let db = loadDB();
let me = null;
let page = 'dashboard';
let itemCount = 1;
let lastReport = null;

function loadDB() {
  try { const raw = localStorage.getItem(STORE_KEY); if (raw) return JSON.parse(raw); } catch (e) { /* sin almacenamiento */ }
  return seedData();
}
function saveDB() { try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); } catch (e) { /* ignorar */ } }

/* ---------- Consultas de datos ---------- */
const byId = (arr, id) => arr.find(x => x.id === id);
const supplierName = id => byId(db.suppliers, id)?.name || '—';
const orderStatus = o => o.received <= 0 ? 'Abierta' : o.received < o.total ? 'Recepción parcial' : 'Recibida';
const reqOf = o => byId(db.requests, o.requestId);
const myRequests = () => me.role === 'solicitante' ? db.requests.filter(r => r.ownerId === me.id) : db.requests;
const myOrders = () => me.role === 'solicitante' ? db.orders.filter(o => reqOf(o)?.ownerId === me.id) : db.orders;
const pendingReqs = () => db.requests.filter(r => r.status === 'Pendiente');
const toOrderReqs = () => db.requests.filter(r => r.status === 'Aprobada');
const openOrders = () => db.orders.filter(o => orderStatus(o) !== 'Recibida');
const lastDecision = r => [...r.history].reverse().find(h => h.role === 'jefe');
const approvedDate = r => [...r.history].reverse().find(h => h.action === 'Aprobada')?.date;
const sum = (arr, fn) => arr.reduce((s, x) => s + fn(x), 0);

/* ---------- Navegación por rol ---------- */
const NAV = {
  solicitante: [
    ['Principal',    [['dashboard', 'Resumen', 'grid'], ['new-request', 'Nueva solicitud', 'plus']]],
    ['Seguimiento',  [['requests', 'Mis solicitudes', 'file'], ['orders', 'Órdenes de mis solicitudes', 'package']]]
  ],
  jefe: [
    ['Principal',    [['dashboard', 'Resumen', 'grid'], ['approvals', 'Aprobaciones', 'approve']]],
    ['Consulta',     [['requests', 'Todas las solicitudes', 'file'], ['reports', 'Reportes', 'chart']]]
  ],
  comprador: [
    ['Principal',    [['dashboard', 'Resumen', 'grid'], ['to-order', 'Por ordenar', 'cart']]],
    ['Gestión',      [['suppliers', 'Proveedores', 'truck'], ['orders', 'Órdenes de compra', 'package'], ['receipts', 'Recepciones', 'download']]],
    ['Consulta',     [['requests', 'Solicitudes', 'file'], ['reports', 'Reportes', 'chart']]]
  ]
};
const allowedPages = () => NAV[me.role].flatMap(s => s[1].map(i => i[0]));
const pageLabel = p => { for (const [, items] of NAV[me.role]) { const f = items.find(i => i[0] === p); if (f) return f[1]; } return 'Resumen'; };
function navCount(p) {
  if (p === 'approvals') return pendingReqs().length;
  if (p === 'to-order') return toOrderReqs().length;
  if (p === 'requests' && me.role === 'solicitante') return myRequests().filter(r => r.status === 'Devuelta').length;
  return 0;
}

/* ---------- Estados (etiquetas de color) ---------- */
const STATUS_CLASS = { 'Pendiente': 'pending', 'Aprobada': 'approved', 'Con orden': 'order', 'Devuelta': 'returned', 'Rechazada': 'rejected', 'Abierta': 'open', 'Recepción parcial': 'progress', 'Recibida': 'approved', 'Activo': 'approved' };
const badge = s => `<span class="status ${STATUS_CLASS[s] || 'open'}">${esc(s)}</span>`;
const STATUS_COLOR = { 'Pendiente': '#d9a441', 'Aprobada': '#1d7f5b', 'Con orden': '#2b78b8', 'Devuelta': '#7c5cb3', 'Rechazada': '#c0504d' };

/* ---------- Piezas de interfaz ---------- */
const btn = (label, attrs = '', cls = 'btn-primary', ic = '') => `<button type="button" class="btn ${cls}" ${attrs}>${ic ? icon(ic) : ''}${label}</button>`;
const heading = (title, desc, actions = '') => `<div class="page-heading"><div><span class="eyebrow">${ROLES[me.role].label.toUpperCase()} · SIGOC</span><h1>${title}</h1><p>${desc}</p></div>${actions ? `<div class="heading-actions">${actions}</div>` : ''}</div>`;
const stat = (label, value, foot, ic, tone = 'green') => `<div class="stat-card tone-${tone}"><div class="stat-top">${label}<span class="stat-icon">${icon(ic)}</span></div><div class="stat-value">${value}</div><div class="stat-foot">${foot}</div></div>`;
const emptyState = (ic, title, text) => `<div class="empty-state"><div class="empty-icon">${icon(ic)}</div><strong>${title}</strong><p>${text}</p></div>`;
const progress = (done, total) => `<div class="progress-line"><span style="width:${total ? Math.min(100, done / total * 100) : 0}%"></span></div>`;
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const TL_COLOR = { 'Registrada': '#2b78b8', 'Reenviada': '#2b78b8', 'Aprobada': '#1d7f5b', 'Devuelta': '#7c5cb3', 'Rechazada': '#c0504d', 'Orden generada': '#c4891c' };
const timeline = h => `<div class="timeline">${h.map(x => `<div class="timeline-item" style="--c:${TL_COLOR[x.action] || '#6eaa83'}"><strong>${esc(x.action)}</strong><span>${esc(x.by)} · ${fmtDate(x.date)}</span>${x.note ? `<p>${esc(x.note)}</p>` : ''}</div>`).join('')}</div>`;

/* Acción principal contextual según rol y estado */
function ctxButton(r, small = true) {
  const c = small ? 'btn-sm' : '';
  if (me.role === 'jefe' && r.status === 'Pendiente') return btn('Revisar', `data-action="review" data-id="${r.id}"`, `btn-primary ${c}`);
  if (me.role === 'comprador' && r.status === 'Aprobada') return btn('Generar orden', `data-action="gen-order" data-id="${r.id}"`, `btn-primary ${c}`);
  if (me.role === 'solicitante' && r.status === 'Devuelta' && r.ownerId === me.id) return btn('Corregir', `data-action="fix" data-id="${r.id}"`, `btn-primary ${c}`);
  return '';
}

/* =========================================================
   PÁGINAS
   ========================================================= */
const PAGES = { dashboard: dashboardPage, 'new-request': newRequestPage, requests: requestsPage, approvals: approvalsPage, 'to-order': toOrderPage, suppliers: suppliersPage, orders: ordersPage, receipts: receiptsPage, reports: reportsPage };

/* ---------- Resumen según rol ---------- */
function dashboardPage() {
  return { solicitante: dashSolicitante, jefe: dashJefe, comprador: dashComprador }[me.role]();
}

function dashSolicitante() {
  const mine = myRequests();
  const n = list => mine.filter(r => list.includes(r.status)).length;
  const need = mine.filter(r => r.status === 'Devuelta');
  return `${heading(`Hola, ${esc(firstName(me.name))}`, 'Crea solicitudes de compra y sigue su estado en cada etapa del proceso.', btn('Crear solicitud', 'data-page="new-request"', 'btn-primary', 'plus'))}
  <div class="stats-grid">
    ${stat('Mis solicitudes', mine.length, 'Registradas en el sistema', 'file', 'blue')}
    ${stat('En revisión', n(['Pendiente']), 'Esperan decisión del jefe', 'clock', 'amber')}
    ${stat('Aprobadas', n(['Aprobada', 'Con orden']), 'Listas o en gestión de compra', 'approve', 'green')}
    ${stat('Requieren ajustes', n(['Devuelta']), 'Devueltas por el jefe', 'alert', 'violet')}
  </div>
  <div class="dashboard-grid">
    <section class="panel"><div class="panel-head"><h3>Mis solicitudes recientes</h3><a data-page="requests">Ver todas →</a></div>
      <div class="table-wrap"><table><thead><tr><th>Solicitud</th><th>Fecha</th><th>Valor</th><th>Estado</th></tr></thead><tbody>
      ${mine.slice(0, 5).map(r => `<tr><td><strong>${r.id}</strong><small>${esc(r.title)}</small></td><td>${fmtDate(r.created)}</td><td class="num">${money(r.amount)}</td><td>${badge(r.status)}</td></tr>`).join('') || `<tr><td colspan="4">${emptyState('file', 'Aún no tienes solicitudes', 'Crea tu primera solicitud de compra.')}</td></tr>`}
      </tbody></table></div></section>
    <div>
      <section class="panel"><div class="panel-head"><h3>Requieren tu atención</h3></div>
        ${need.length ? need.map(r => `<div class="list-row"><span class="dd-ico t-violet">${icon('undo')}</span><div class="grow"><strong>${r.id} · ${esc(r.title)}</strong><p>Devuelta por ${esc(lastDecision(r)?.by || 'el jefe')}</p><div class="note-box">${esc(lastDecision(r)?.note || '')}</div><div style="margin-top:11px">${btn('Corregir y reenviar', `data-action="fix" data-id="${r.id}"`, 'btn-primary btn-sm')}</div></div></div>`).join('') : emptyState('approve', 'Todo al día', 'No tienes solicitudes pendientes de ajustes.')}
      </section>
      <section class="panel"><div class="panel-head"><h3>Accesos rápidos</h3></div><div class="quick-grid">
        <button class="quick-action" data-page="new-request"><span class="quick-icon">${icon('plus')}</span><b>Nueva solicitud</b><small>Registrar una necesidad de compra</small></button>
        <button class="quick-action" data-page="requests"><span class="quick-icon">${icon('file')}</span><b>Mis solicitudes</b><small>Consultar estados</small></button>
        <button class="quick-action" data-page="orders"><span class="quick-icon">${icon('package')}</span><b>Mis órdenes</b><small>Ver avance de recepción</small></button>
        <button class="quick-action" data-action="help"><span class="quick-icon">${icon('help')}</span><b>Guía rápida</b><small>Cómo funciona el proceso</small></button>
      </div></section>
    </div></div>`;
}

function dashJefe() {
  const pend = pendingReqs();
  const all = db.requests;
  const decisions = db.requests.flatMap(r => r.history.filter(h => h.role === 'jefe').map(h => ({ ...h, r }))).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const states = ['Pendiente', 'Aprobada', 'Con orden', 'Devuelta', 'Rechazada'];
  return `${heading(`Hola, ${esc(firstName(me.name))}`, 'Revisa las solicitudes de tus áreas y registra tu decisión con una observación.', btn('Ir a aprobaciones', 'data-page="approvals"', 'btn-primary', 'approve'))}
  <div class="stats-grid">
    ${stat('Por aprobar', pend.length, 'Esperan tu decisión', 'clock', 'amber')}
    ${stat('Valor en revisión', money(sum(pend, r => r.amount)), 'Suma de solicitudes pendientes', 'money', 'blue')}
    ${stat('Aprobadas', all.filter(r => ['Aprobada', 'Con orden'].includes(r.status)).length, 'Autorizadas en total', 'approve', 'green')}
    ${stat('Devueltas / rechazadas', all.filter(r => ['Devuelta', 'Rechazada'].includes(r.status)).length, 'Con observación registrada', 'undo', 'violet')}
  </div>
  <div class="dashboard-grid">
    <section class="panel"><div class="panel-head"><h3>Pendientes de tu decisión</h3><a data-page="approvals">Ver bandeja →</a></div>
      <div class="table-wrap"><table><thead><tr><th>Solicitud</th><th>Solicitante</th><th>Valor</th><th></th></tr></thead><tbody>
      ${pend.slice(0, 5).map(r => `<tr><td><strong>${r.id}</strong><small>${esc(r.title)}</small></td><td>${esc(r.owner)}<small>${esc(r.area)}</small></td><td class="num">${money(r.amount)}</td><td>${ctxButton(r)}</td></tr>`).join('') || `<tr><td colspan="4">${emptyState('approve', 'No hay solicitudes pendientes', 'Cuando lleguen nuevas solicitudes aparecerán aquí.')}</td></tr>`}
      </tbody></table></div></section>
    <div>
      <section class="panel"><div class="panel-head"><h3>Estado de solicitudes</h3></div>
        ${states.map(s => { const c = all.filter(r => r.status === s).length; return `<div class="bar-row" style="--c:${STATUS_COLOR[s]}"><div class="progress-meta"><span>${s}</span><strong>${c}</strong></div><div class="progress-line"><span style="width:${pct(c, all.length)}%"></span></div></div>`; }).join('')}
      </section>
      <section class="panel"><div class="panel-head"><h3>Decisiones recientes</h3></div>
        ${decisions.map(d => `<div class="list-row"><div class="grow"><strong>${d.r.id}</strong><p>${esc(d.r.title)}</p></div><div style="text-align:right">${badge(d.action)}<div class="meta" style="margin-top:5px">${fmtDate(d.date)}</div></div></div>`).join('') || emptyState('file', 'Sin decisiones', 'Aún no has registrado decisiones.')}
      </section>
    </div></div>`;
}

function dashComprador() {
  const toOrd = toOrderReqs();
  const open = openOrders();
  return `${heading(`Hola, ${esc(firstName(me.name))}`, 'Convierte las solicitudes aprobadas en órdenes de compra y controla las recepciones.', btn('Ver por ordenar', 'data-page="to-order"', 'btn-primary', 'cart'))}
  <div class="stats-grid">
    ${stat('Por ordenar', toOrd.length, 'Aprobadas sin orden de compra', 'cart', 'amber')}
    ${stat('Órdenes abiertas', open.length, `${db.orders.filter(o => orderStatus(o) === 'Recepción parcial').length} con recepción parcial`, 'package', 'blue')}
    ${stat('Valor por recibir', money(sum(db.orders, o => o.total - o.received)), 'Saldo pendiente de entrega', 'money', 'green')}
    ${stat('Proveedores activos', db.suppliers.filter(s => s.status === 'Activo').length, 'En el directorio', 'truck', 'violet')}
  </div>
  <div class="dashboard-grid">
    <section class="panel"><div class="panel-head"><h3>Aprobadas listas para orden</h3><a data-page="to-order">Ver todas →</a></div>
      <div class="table-wrap"><table><thead><tr><th>Solicitud</th><th>Solicitante</th><th>Valor</th><th></th></tr></thead><tbody>
      ${toOrd.slice(0, 5).map(r => `<tr><td><strong>${r.id}</strong><small>${esc(r.title)}</small></td><td>${esc(r.owner)}<small>${esc(r.area)}</small></td><td class="num">${money(r.amount)}</td><td>${ctxButton(r)}</td></tr>`).join('') || `<tr><td colspan="4">${emptyState('cart', 'Nada por ordenar', 'Las solicitudes aprobadas por el jefe aparecerán aquí.')}</td></tr>`}
      </tbody></table></div></section>
    <div>
      <section class="panel"><div class="panel-head"><h3>Recepciones en curso</h3><a data-page="receipts">Ver detalle →</a></div>
        ${open.slice(0, 3).map(o => `<div class="list-row"><div class="grow"><strong>${o.id} · ${esc(supplierName(o.supplierId))}</strong>${progress(o.received, o.total)}<div class="progress-meta"><span>Recibido: ${pct(o.received, o.total)}%</span><strong>${pct(o.total - o.received, o.total)}% pendiente</strong></div></div></div>`).join('') || emptyState('package', 'Sin recepciones pendientes', 'Todas las órdenes fueron recibidas.')}
      </section>
      <section class="panel"><div class="panel-head"><h3>Accesos rápidos</h3></div><div class="quick-grid">
        <button class="quick-action" data-page="suppliers"><span class="quick-icon">${icon('truck')}</span><b>Proveedores</b><small>Consultar directorio</small></button>
        <button class="quick-action" data-page="orders"><span class="quick-icon">${icon('package')}</span><b>Órdenes</b><small>Revisar seguimiento</small></button>
        <button class="quick-action" data-page="receipts"><span class="quick-icon">${icon('download')}</span><b>Recepciones</b><small>Registrar entregas</small></button>
        <button class="quick-action" data-page="reports"><span class="quick-icon">${icon('chart')}</span><b>Reportes</b><small>Indicadores y CSV</small></button>
      </div></section>
    </div></div>`;
}

/* ---------- Nueva solicitud (Solicitante) ---------- */
function newRequestPage() {
  itemCount = 1;
  return `${heading('Nueva solicitud de compra', 'Registra los artículos o servicios que necesita tu área.')}
  <form id="requestForm" class="form-layout"><div>
    <section class="form-card"><h3>Información general</h3><p>Datos básicos para identificar y gestionar la solicitud.</p>
      <div class="form-grid">
        <div class="field full"><label for="reqTitle">Asunto de la solicitud *</label><input id="reqTitle" required maxlength="90" placeholder="Ej. Empaques para línea de yogures"></div>
        <div class="field"><label for="reqArea">Área solicitante *</label><select id="reqArea" required><option value="">Seleccionar área</option>${AREAS.map(a => `<option ${a === me.area ? 'selected' : ''}>${a}</option>`).join('')}</select></div>
        <div class="field"><label for="reqDate">Fecha requerida *</label><input id="reqDate" type="date" required min="${todayISO()}" value="${addDays(10)}"></div>
        <div class="field full"><label for="reqJust">Justificación de la compra *</label><textarea id="reqJust" required placeholder="Explica la necesidad, el uso y la importancia de esta compra..."></textarea></div>
      </div></section>
    <section class="form-card"><div class="panel-head"><div><h3>Artículos o servicios</h3><p style="margin:4px 0 0;font-size:13px;color:var(--muted)">Agrega los elementos que componen la solicitud.</p></div>${btn('Agregar ítem', 'id="addItem"', 'btn-outline btn-sm', 'plus')}</div>
      <div id="itemsContainer">${itemRow()}</div>
      <div class="summary-box"><div><span>Total estimado</span><strong id="estimatedTotal">$ 0</strong></div></div></section>
    <div class="form-buttons">${btn('Cancelar', 'data-page="requests"', 'btn-outline')}<button class="btn btn-primary" type="submit">Enviar a aprobación ${icon('arrow')}</button></div>
  </div>
  <aside><section class="form-card"><h3>Flujo de aprobación</h3><p>Después de enviar la solicitud seguirá estas etapas.</p>
    <div class="timeline step-list">
      <div class="timeline-item" style="--c:#2b78b8"><strong>1. Registro de solicitud</strong><p>El solicitante completa la información.</p></div>
      <div class="timeline-item" style="--c:#c4891c"><strong>2. Revisión del jefe</strong><p>Aprueba, rechaza o devuelve con observación.</p></div>
      <div class="timeline-item" style="--c:#1d7f5b"><strong>3. Gestión de compras</strong><p>El comprador selecciona proveedor y genera la orden.</p></div>
    </div></section>
    <div class="info-note">Los campos marcados con * son obligatorios. Una orden de compra solo podrá generarse cuando la solicitud esté aprobada.</div>
  </aside></form>`;
}
function itemRow() {
  return `<div class="item-row"><div class="field"><label>Descripción del artículo/servicio *</label><input class="item-desc" placeholder="Ej. Rollos de empaque" required></div><div class="field"><label>Cantidad *</label><input class="item-qty" type="number" min="1" value="1" required></div><div class="field"><label>Valor unitario *</label><input class="item-price" type="number" min="1" placeholder="0" required></div><button type="button" class="remove-item" title="Quitar ítem" aria-label="Quitar ítem">${icon('x')}</button></div>`;
}

/* ---------- Solicitudes (todos los roles, con alcance distinto) ---------- */
function requestsPage() {
  const list = myRequests();
  const isMine = me.role === 'solicitante';
  const title = isMine ? 'Mis solicitudes' : 'Solicitudes';
  const desc = isMine ? 'Consulta y realiza seguimiento a tus solicitudes de compra.' : 'Consulta el estado de todas las solicitudes de compra.';
  return `${heading(title, desc, isMine ? btn('Nueva solicitud', 'data-page="new-request"', 'btn-primary', 'plus') : '')}
  <div class="table-card" data-tcard><div class="table-toolbar">
    <div class="search-box">${icon('search')}<input class="tbl-search" placeholder="Buscar por código o descripción..."></div>
    <select class="filter-select tbl-status"><option value="">Todos los estados</option>${['Pendiente', 'Aprobada', 'Con orden', 'Devuelta', 'Rechazada'].map(s => `<option>${s}</option>`).join('')}</select></div>
    <div class="table-wrap"><table><thead><tr><th>Código / Descripción</th>${isMine ? '' : '<th>Solicitante</th>'}<th>Área</th><th>Fecha</th><th>Valor estimado</th><th>Estado</th><th>Acción</th></tr></thead><tbody>
    ${list.map(r => `<tr data-status="${r.status}"><td><strong>${r.id}</strong><small>${esc(r.title)}</small></td>${isMine ? '' : `<td>${esc(r.owner)}</td>`}<td>${esc(r.area)}</td><td>${fmtDate(r.created)}</td><td class="num">${money(r.amount)}</td><td>${badge(r.status)}</td><td><div class="row-actions"><button class="link-btn" data-action="request-detail" data-id="${r.id}">Detalle</button>${ctxButton(r)}</div></td></tr>`).join('') || `<tr><td colspan="7">${emptyState('file', 'No hay solicitudes', 'Cuando registres solicitudes aparecerán aquí.')}</td></tr>`}
    </tbody></table></div></div>`;
}

/* ---------- Aprobaciones (Jefe) ---------- */
function approvalsPage() {
  const pend = pendingReqs();
  const decided = db.requests.map(r => ({ r, d: lastDecision(r) })).filter(x => x.d).sort((a, b) => b.d.date.localeCompare(a.d.date));
  return `${heading('Bandeja de aprobaciones', 'Revisa las solicitudes enviadas por las diferentes áreas y registra tu decisión.')}
  <div class="table-card"><div class="table-toolbar"><div><strong style="font-size:14px;color:var(--ink)">Solicitudes por revisar</strong><div class="hint">La decisión queda registrada con usuario, fecha y observación obligatoria.</div></div><span class="status pending">${pend.length} pendientes</span></div>
    <div class="table-wrap"><table><thead><tr><th>Solicitud</th><th>Solicitante / Área</th><th>Fecha requerida</th><th>Valor estimado</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
    ${pend.map(r => `<tr><td><strong>${r.id}</strong><small>${esc(r.title)}</small></td><td>${esc(r.owner)}<small>${esc(r.area)}</small></td><td>${fmtDate(r.required)}</td><td class="num">${money(r.amount)}</td><td>${badge(r.status)}</td><td><div class="row-actions"><button class="link-btn" data-action="request-detail" data-id="${r.id}">Detalle</button>${ctxButton(r)}</div></td></tr>`).join('') || `<tr><td colspan="6">${emptyState('approve', 'No hay solicitudes pendientes', 'Cuando recibas nuevas solicitudes aparecerán aquí.')}</td></tr>`}
    </tbody></table></div></div>
  <div class="table-card"><div class="table-toolbar"><div><strong style="font-size:14px;color:var(--ink)">Historial de decisiones</strong><div class="hint">Última decisión registrada por solicitud.</div></div></div>
    <div class="table-wrap"><table><thead><tr><th>Solicitud</th><th>Decisión</th><th>Fecha</th><th>Observación</th><th></th></tr></thead><tbody>
    ${decided.map(({ r, d }) => `<tr><td><strong>${r.id}</strong><small>${esc(r.title)}</small></td><td>${badge(d.action)}</td><td>${fmtDate(d.date)}</td><td style="max-width:320px">${esc(d.note)}</td><td><button class="link-btn" data-action="request-detail" data-id="${r.id}">Detalle</button></td></tr>`).join('')}
    </tbody></table></div></div>`;
}

/* ---------- Por ordenar (Comprador) ---------- */
function toOrderPage() {
  const list = toOrderReqs();
  return `${heading('Solicitudes por ordenar', 'Solicitudes aprobadas por el jefe que aún no tienen orden de compra.')}
  <div class="table-card"><div class="table-toolbar"><div><strong style="font-size:14px;color:var(--ink)">Listas para generar orden</strong><div class="hint">Selecciona el proveedor al generar la orden.</div></div><span class="status pending">${list.length} por ordenar</span></div>
    <div class="table-wrap"><table><thead><tr><th>Solicitud</th><th>Solicitante / Área</th><th>Aprobada</th><th>Requerida para</th><th>Valor</th><th>Acciones</th></tr></thead><tbody>
    ${list.map(r => `<tr><td><strong>${r.id}</strong><small>${esc(r.title)}</small></td><td>${esc(r.owner)}<small>${esc(r.area)}</small></td><td>${fmtDate(approvedDate(r))}</td><td>${fmtDate(r.required)}</td><td class="num">${money(r.amount)}</td><td><div class="row-actions"><button class="link-btn" data-action="request-detail" data-id="${r.id}">Detalle</button>${ctxButton(r)}</div></td></tr>`).join('') || `<tr><td colspan="6">${emptyState('cart', 'No hay solicitudes por ordenar', 'Cuando el jefe apruebe una solicitud aparecerá aquí.')}</td></tr>`}
    </tbody></table></div></div>`;
}

/* ---------- Proveedores (Comprador) ---------- */
function suppliersPage() {
  return `${heading('Proveedores', 'Directorio de proveedores y sus datos comerciales básicos.', btn('Registrar proveedor', 'data-action="add-supplier"', 'btn-primary', 'plus'))}
  <div class="table-card" data-tcard><div class="table-toolbar"><div class="search-box">${icon('search')}<input class="tbl-search" placeholder="Buscar proveedor o NIT..."></div><span class="hint">${db.suppliers.length} proveedores registrados</span></div>
    <div class="table-wrap"><table><thead><tr><th>Proveedor</th><th>NIT</th><th>Categoría</th><th>Contacto</th><th>Correo</th><th>Estado</th></tr></thead><tbody>
    ${db.suppliers.map(s => `<tr><td><strong>${esc(s.name)}</strong><small>${s.id}</small></td><td>${esc(s.nit)}</td><td>${esc(s.category)}</td><td>${esc(s.contact)}</td><td>${esc(s.email)}</td><td>${badge(s.status)}</td></tr>`).join('')}
    </tbody></table></div></div>`;
}

/* ---------- Órdenes de compra ---------- */
function ordersPage() {
  const list = myOrders();
  const isMine = me.role === 'solicitante';
  return `${heading(isMine ? 'Órdenes de mis solicitudes' : 'Órdenes de compra', isMine ? 'Sigue el avance de las órdenes generadas a partir de tus solicitudes.' : 'Consulta las órdenes generadas a partir de solicitudes aprobadas.')}
  <div class="table-card" data-tcard><div class="table-toolbar"><div class="search-box">${icon('search')}<input class="tbl-search" placeholder="Buscar orden o proveedor..."></div>
    <select class="filter-select tbl-status"><option value="">Todos los estados</option><option>Abierta</option><option>Recepción parcial</option><option>Recibida</option></select></div>
    <div class="table-wrap"><table><thead><tr><th>Orden</th><th>Solicitud origen</th><th>Proveedor</th><th>Fecha</th><th>Valor</th><th>Recepción</th><th>Estado</th><th></th></tr></thead><tbody>
    ${list.map(o => `<tr data-status="${orderStatus(o)}"><td><strong>${o.id}</strong></td><td>${o.requestId}</td><td>${esc(supplierName(o.supplierId))}</td><td>${fmtDate(o.date)}</td><td class="num">${money(o.total)}</td><td>${progress(o.received, o.total)}<small>${pct(o.received, o.total)}%</small></td><td>${badge(orderStatus(o))}</td><td><button class="link-btn" data-action="order-detail" data-id="${o.id}">Ver</button></td></tr>`).join('') || `<tr><td colspan="8">${emptyState('package', 'No hay órdenes', 'Las órdenes aparecerán cuando compras las genere.')}</td></tr>`}
    </tbody></table></div></div>`;
}

/* ---------- Recepciones (Comprador) ---------- */
function receiptsPage() {
  const all = db.orders.flatMap(o => o.receipts.map(r => ({ ...r, o }))).sort((a, b) => b.date.localeCompare(a.date));
  return `${heading('Recepciones', 'Registra entregas parciales o completas y consulta los saldos pendientes.')}
  <div class="table-card"><div class="table-toolbar"><strong style="font-size:14px;color:var(--ink)">Órdenes con seguimiento de recepción</strong><span class="hint">El valor recibido no puede superar el saldo de la orden.</span></div>
    <div class="table-wrap"><table><thead><tr><th>Orden</th><th>Proveedor</th><th>Valor ordenado</th><th>Valor recibido</th><th>Saldo</th><th>Progreso</th><th>Acción</th></tr></thead><tbody>
    ${db.orders.map(o => `<tr><td><strong>${o.id}</strong><small>${o.requestId}</small></td><td>${esc(supplierName(o.supplierId))}</td><td class="num">${money(o.total)}</td><td class="num">${money(o.received)}</td><td class="num">${money(o.total - o.received)}</td><td>${progress(o.received, o.total)}<small>${pct(o.received, o.total)}% recibido</small></td><td>${o.received < o.total ? btn('Registrar', `data-action="receive" data-id="${o.id}"`, 'btn-primary btn-sm') : '<span class="hint">Completa</span>'}</td></tr>`).join('') || `<tr><td colspan="7">${emptyState('download', 'No hay órdenes', 'Genera una orden para registrar recepciones.')}</td></tr>`}
    </tbody></table></div></div>
  <div class="table-card"><div class="table-toolbar"><strong style="font-size:14px;color:var(--ink)">Últimas recepciones registradas</strong></div>
    <div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Orden</th><th>Valor recibido</th><th>Registró</th><th>Observación</th></tr></thead><tbody>
    ${all.map(r => `<tr><td>${fmtDate(r.date)}</td><td><strong>${r.o.id}</strong></td><td class="num">${money(r.amount)}</td><td>${esc(r.by)}</td><td>${esc(r.note) || '—'}</td></tr>`).join('') || `<tr><td colspan="5">${emptyState('download', 'Sin recepciones', 'Aún no se han registrado entregas.')}</td></tr>`}
    </tbody></table></div></div>`;
}

/* ---------- Reportes (Jefe y Comprador) ---------- */
function donut(parts) {
  const total = sum(parts, p => p.value);
  let acc = 0;
  const stops = total ? parts.filter(p => p.value).map(p => { const a = acc / total * 100; acc += p.value; return `${p.color} ${a}% ${acc / total * 100}%`; }).join(',') : '#e8eeea 0 100%';
  return `<div class="donut" style="background:conic-gradient(${stops})"><div class="donut-hole"><strong>${total}</strong><span>solicitudes</span></div></div>`;
}
function reportsPage() {
  const all = db.requests;
  const states = ['Aprobada', 'Con orden', 'Pendiente', 'Devuelta', 'Rechazada'];
  const parts = states.map(s => ({ label: s, value: all.filter(r => r.status === s).length, color: STATUS_COLOR[s] }));
  const bySup = db.suppliers.map(s => ({ s, total: sum(db.orders.filter(o => o.supplierId === s.id), o => o.total) })).filter(x => x.total > 0).sort((a, b) => b.total - a.total);
  const maxSup = Math.max(1, ...bySup.map(x => x.total));
  const approved = all.filter(r => ['Aprobada', 'Con orden'].includes(r.status)).length;
  lastReport = null;
  return `${heading('Reportes', 'Indicadores de seguimiento para apoyar la gestión de compras.')}
  <div class="stats-grid">
    ${stat('Total de solicitudes', all.length, 'Registradas en el sistema', 'file', 'blue')}
    ${stat('Aprobadas', approved, `${pct(approved, all.length)}% del total`, 'approve', 'green')}
    ${stat('Valor ordenado', money(sum(db.orders, o => o.total)), `${db.orders.length} órdenes de compra`, 'package', 'amber')}
    ${stat('Valor recibido', money(sum(db.orders, o => o.received)), `${pct(sum(db.orders, o => o.received), sum(db.orders, o => o.total))}% de lo ordenado`, 'download', 'violet')}
  </div>
  <div class="dashboard-grid">
    <div>
      <section class="panel"><div class="panel-head"><h3>Estado de solicitudes</h3></div>
        <div class="donut-wrap">${donut(parts)}<div class="legend">${parts.map(p => `<div style="--c:${p.color}"><i></i>${p.label}<b>${p.value}</b></div>`).join('')}</div></div></section>
      <section class="panel"><div class="panel-head"><h3>Valor ordenado por proveedor</h3></div>
        ${bySup.map(x => `<div class="bar-row" style="--c:var(--green-600)"><div class="progress-meta"><span>${esc(x.s.name)}</span><strong>${money(x.total)}</strong></div><div class="progress-line"><span style="width:${x.total / maxSup * 100}%"></span></div></div>`).join('') || '<p class="hint">Aún no hay órdenes.</p>'}</section>
    </div>
    <section class="panel"><div class="panel-head"><h3>Filtros del reporte</h3></div>
      <div class="report-filters">
        <div class="field"><label>Fecha inicial</label><input type="date" id="repFrom" value="2026-11-01"></div>
        <div class="field"><label>Fecha final</label><input type="date" id="repTo" value="2026-11-30"></div>
        <div class="field"><label>Tipo de reporte</label><select id="repType"><option value="sol">Solicitudes y aprobaciones</option><option value="ord">Órdenes por proveedor</option><option value="rec">Recepciones</option></select></div>
        <div style="display:flex;gap:9px;flex-wrap:wrap">${btn('Generar vista previa', 'data-action="report"', 'btn-primary', 'chart')}${btn('Exportar CSV', 'data-action="export-csv"', 'btn-outline', 'download')}</div>
      </div></section>
  </div>
  <div class="table-card" id="reportPreview"></div>`;
}
const mc = n => ({ t: money(n), n });
function reportData(type, from, to) {
  const inRange = d => d >= from && d <= to;
  if (type === 'ord') {
    const rows = db.suppliers.map(s => { const os = db.orders.filter(o => o.supplierId === s.id && inRange(o.date)); return [s.name, os.length, mc(sum(os, o => o.total)), mc(sum(os, o => o.received)), mc(sum(os, o => o.total - o.received))]; }).filter(r => r[1] > 0);
    return { name: 'ordenes_por_proveedor', head: ['Proveedor', 'Órdenes', 'Valor ordenado', 'Valor recibido', 'Saldo'], rows };
  }
  if (type === 'rec') {
    const rows = db.orders.flatMap(o => o.receipts.filter(r => inRange(r.date)).map(r => [fmtDate(r.date), o.id, supplierName(o.supplierId), mc(r.amount), r.by, r.note || '—']));
    return { name: 'recepciones', head: ['Fecha', 'Orden', 'Proveedor', 'Valor recibido', 'Registró', 'Observación'], rows };
  }
  const rows = db.requests.filter(r => inRange(r.created)).map(r => [r.id, r.title, r.area, r.owner, fmtDate(r.created), mc(r.amount), r.status]);
  return { name: 'solicitudes_y_aprobaciones', head: ['Código', 'Asunto', 'Área', 'Solicitante', 'Fecha', 'Valor', 'Estado'], rows };
}
function renderReportPreview() {
  const from = $('#repFrom')?.value || '0000-01-01', to = $('#repTo')?.value || '9999-12-31', type = $('#repType')?.value || 'sol';
  lastReport = reportData(type, from, to);
  const cell = c => esc(c?.t ?? c);
  $('#reportPreview').innerHTML = `<div class="table-toolbar"><div><strong style="font-size:14px;color:var(--ink)">Vista previa del reporte</strong><div class="hint">${fmtDate(from)} — ${fmtDate(to)} · ${lastReport.rows.length} registros</div></div></div>
  <div class="table-wrap"><table><thead><tr>${lastReport.head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${lastReport.rows.map(r => `<tr>${r.map(c => `<td>${cell(c)}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${lastReport.head.length}">${emptyState('chart', 'Sin resultados', 'No hay registros en el rango seleccionado.')}</td></tr>`}</tbody></table></div>`;
}
function exportCSV() {
  if (!lastReport) renderReportPreview();
  const q = v => `"${String(v?.n ?? v?.t ?? v).replace(/"/g, '""')}"`;
  const csv = '\uFEFF' + [lastReport.head, ...lastReport.rows].map(r => r.map(q).join(';')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = `${lastReport.name}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  showToast('Reporte exportado como CSV.');
}

/* =========================================================
   MODALES
   ========================================================= */
function showModal({ title, sub = '', body, actions = '', wide = false }) {
  $('#modalRoot').innerHTML = `<div class="modal-backdrop"><div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="modal-head"><div><h3>${title}</h3>${sub ? `<small>${sub}</small>` : ''}</div><button class="modal-x" data-action="close-modal" aria-label="Cerrar">${icon('x')}</button></div>
    <div class="modal-body">${body}</div><div class="modal-actions">${actions}</div></div></div>`;
}
const closeModal = () => { $('#modalRoot').innerHTML = ''; };
const cancelBtn = () => btn('Cancelar', 'data-action="close-modal"', 'btn-outline');

function requestBlock(r) {
  return `<div class="detail-list">
    <div><small>Código</small><strong>${r.id}</strong></div><div><small>Estado</small>${badge(r.status)}</div>
    <div><small>Solicitante</small><strong>${esc(r.owner)}</strong></div><div><small>Área</small><strong>${esc(r.area)}</strong></div>
    <div><small>Fecha de registro</small><strong>${fmtDate(r.created)}</strong></div><div><small>Fecha requerida</small><strong>${fmtDate(r.required)}</strong></div>
    <div><small>Valor estimado</small><strong>${money(r.amount)}</strong></div>${r.orderId ? `<div><small>Orden de compra</small><strong>${r.orderId}</strong></div>` : ''}
    <div class="full"><small>Justificación</small><strong style="font-weight:500">${esc(r.justification)}</strong></div></div>
  <h4>Artículos o servicios</h4><div class="table-wrap"><table><thead><tr><th>Descripción</th><th>Cant.</th><th>V. unitario</th><th>Subtotal</th></tr></thead><tbody>
  ${r.items.map(i => `<tr><td>${esc(i.desc)}</td><td>${i.qty}</td><td class="num">${money(i.price)}</td><td class="num">${money(i.qty * i.price)}</td></tr>`).join('')}</tbody></table></div>`;
}

function requestDetail(id) {
  const r = byId(db.requests, id); if (!r) return;
  const orderBtn = r.orderId && allowedPages().includes('orders') ? btn('Ver orden', `data-action="order-detail" data-id="${r.orderId}"`, 'btn-secondary', 'package') : '';
  showModal({ title: 'Detalle de solicitud', sub: esc(r.title), wide: true,
    body: `${requestBlock(r)}<h4>Historial</h4>${timeline(r.history)}`,
    actions: `${btn('Cerrar', 'data-action="close-modal"', 'btn-outline')}${orderBtn}${ctxButton(r, false)}` });
}

function reviewModal(id) {
  const r = byId(db.requests, id);
  showModal({ title: `Revisar ${id}`, sub: 'Registra tu decisión con una observación.', wide: true,
    body: `${requestBlock(r)}<div class="field" style="margin-top:18px"><label for="approvalNote">Observación de la decisión *</label><textarea id="approvalNote" placeholder="Escribe el motivo de tu decisión..."></textarea></div>`,
    actions: `${cancelBtn()}${btn('Devolver', `data-action="decide" data-decision="Devuelta" data-id="${id}"`, 'btn-warn', 'undo')}${btn('Rechazar', `data-action="decide" data-decision="Rechazada" data-id="${id}"`, 'btn-danger', 'x')}${btn('Aprobar', `data-action="decide" data-decision="Aprobada" data-id="${id}"`, 'btn-primary', 'tick')}` });
}

function fixModal(id) {
  const r = byId(db.requests, id), d = lastDecision(r);
  showModal({ title: `Corregir ${id}`, sub: esc(r.title),
    body: `<p>El jefe devolvió esta solicitud con la siguiente observación:</p><div class="note-box" style="margin:0 0 16px">${esc(d?.note || 'Sin observación.')}</div>
    <div class="field"><label for="fixNote">Ajustes realizados *</label><textarea id="fixNote" placeholder="Describe los cambios o la información que agregas..."></textarea></div>`,
    actions: `${cancelBtn()}${btn('Reenviar a aprobación', `data-action="save-fix" data-id="${id}"`, 'btn-primary', 'arrow')}` });
}

function genOrderModal(id) {
  const r = byId(db.requests, id);
  showModal({ title: `Generar orden · ${id}`, sub: esc(r.title), wide: true,
    body: `<div class="detail-list"><div><small>Solicitante</small><strong>${esc(r.owner)} · ${esc(r.area)}</strong></div><div><small>Valor de la orden</small><strong>${money(r.amount)}</strong></div></div>
    <div class="form-grid"><div class="field full"><label for="ordSupplier">Proveedor *</label><select id="ordSupplier"><option value="">Seleccionar proveedor</option>${db.suppliers.filter(s => s.status === 'Activo').map(s => `<option value="${s.id}">${esc(s.name)} · ${esc(s.category)}</option>`).join('')}</select></div>
    <div class="field"><label for="ordDate">Entrega estimada *</label><input id="ordDate" type="date" min="${todayISO()}" value="${r.required >= todayISO() ? r.required : addDays(7)}"></div>
    <div class="field full"><label for="ordNote">Observaciones</label><textarea id="ordNote" placeholder="Condiciones de pago, lugar de entrega, etc."></textarea></div></div>`,
    actions: `${cancelBtn()}${btn('Generar orden de compra', `data-action="save-order" data-id="${id}"`, 'btn-primary', 'filecheck')}` });
}

function orderDetail(id) {
  const o = byId(db.orders, id); if (!o) return;
  const r = reqOf(o);
  showModal({ title: `Orden ${id}`, sub: esc(supplierName(o.supplierId)), wide: true,
    body: `<div class="detail-list"><div><small>Solicitud origen</small><strong>${o.requestId}</strong></div><div><small>Estado</small>${badge(orderStatus(o))}</div>
      <div><small>Fecha de la orden</small><strong>${fmtDate(o.date)}</strong></div><div><small>Entrega estimada</small><strong>${fmtDate(o.expected)}</strong></div>
      <div><small>Valor ordenado</small><strong>${money(o.total)}</strong></div><div><small>Valor recibido</small><strong>${money(o.received)}</strong></div>
      ${r ? `<div class="full"><small>Asunto</small><strong style="font-weight:500">${esc(r.title)}</strong></div>` : ''}${o.note ? `<div class="full"><small>Observaciones</small><strong style="font-weight:500">${esc(o.note)}</strong></div>` : ''}</div>
    <h4>Progreso de recepción</h4>${progress(o.received, o.total)}<div class="progress-meta"><span>${money(o.received)} recibido</span><strong>${money(o.total - o.received)} pendiente</strong></div>
    <h4>Recepciones</h4>${o.receipts.length ? `<div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Valor</th><th>Registró</th><th>Observación</th></tr></thead><tbody>${o.receipts.map(x => `<tr><td>${fmtDate(x.date)}</td><td class="num">${money(x.amount)}</td><td>${esc(x.by)}</td><td>${esc(x.note) || '—'}</td></tr>`).join('')}</tbody></table></div>` : '<p class="hint">Aún no se han registrado recepciones.</p>'}`,
    actions: `${btn('Cerrar', 'data-action="close-modal"', 'btn-outline')}${me.role === 'comprador' && o.received < o.total ? btn('Registrar recepción', `data-action="receive" data-id="${id}"`, 'btn-primary', 'download') : ''}` });
}

function receiveModal(id) {
  const o = byId(db.orders, id), bal = o.total - o.received;
  showModal({ title: 'Registrar recepción', sub: `Orden ${id} · ${esc(supplierName(o.supplierId))}`,
    body: `<div class="detail-list"><div><small>Valor ordenado</small><strong>${money(o.total)}</strong></div><div><small>Saldo pendiente</small><strong>${money(bal)}</strong></div></div>
    <div class="field"><label for="receiveAmount">Valor recibido en esta entrega *</label><input type="number" id="receiveAmount" min="1" max="${bal}" placeholder="Ingresa el valor recibido"><span class="hint"><button type="button" class="link-btn" data-action="fill-balance" data-max="${bal}">Recibir saldo completo</button></span></div>
    <div class="field" style="margin-top:14px"><label for="receiveNote">Observación</label><textarea id="receiveNote" placeholder="Ej. Entrega parcial de materiales..."></textarea></div>`,
    actions: `${cancelBtn()}${btn('Guardar recepción', `data-action="save-receipt" data-id="${id}"`, 'btn-primary', 'tick')}` });
}

function addSupplierModal() {
  showModal({ title: 'Registrar proveedor', sub: 'Datos comerciales básicos.',
    body: `<div class="form-grid"><div class="field full"><label for="spName">Razón social *</label><input id="spName" placeholder="Nombre legal del proveedor"></div>
    <div class="field"><label for="spNit">NIT *</label><input id="spNit" placeholder="900.000.000-0"></div>
    <div class="field"><label for="spCategory">Categoría *</label><select id="spCategory"><option>Empaques</option><option>Mantenimiento</option><option>Insumos</option><option>Transporte</option><option>Servicios</option></select></div>
    <div class="field"><label for="spContact">Contacto</label><input id="spContact" placeholder="Nombre del contacto"></div>
    <div class="field"><label for="spEmail">Correo</label><input id="spEmail" type="email" placeholder="correo@empresa.com"></div></div>`,
    actions: `${cancelBtn()}${btn('Guardar proveedor', 'data-action="save-supplier"', 'btn-primary', 'tick')}` });
}

const HELP = {
  solicitante: [['Crea una solicitud', 'En “Nueva solicitud” indica asunto, área, fecha requerida, justificación y los artículos con su valor.'], ['Espera la decisión', 'El jefe aprobador revisa tu solicitud. Verás el estado “Pendiente” hasta que decida.'], ['Corrige si te la devuelven', 'Si el jefe la devuelve, usa “Corregir y reenviar” e indica los ajustes realizados.'], ['Sigue tu orden', 'Cuando compras genere la orden, puedes ver su avance de recepción en “Órdenes de mis solicitudes”.']],
  jefe: [['Abre tu bandeja', 'En “Aprobaciones” verás las solicitudes pendientes, con solicitante, área y valor.'], ['Revisa el detalle', 'Consulta justificación y artículos antes de decidir.'], ['Decide con observación', 'Puedes aprobar, devolver o rechazar. La observación es obligatoria y queda en el historial.'], ['Consulta y analiza', 'En “Reportes” encuentras indicadores y puedes exportar la información a CSV.']],
  comprador: [['Revisa “Por ordenar”', 'Allí están las solicitudes ya aprobadas que aún no tienen orden de compra.'], ['Genera la orden', 'Elige el proveedor y la fecha estimada de entrega. La solicitud pasa a “Con orden”.'], ['Registra recepciones', 'Anota entregas parciales o completas. El valor recibido no puede superar el saldo.'], ['Gestiona proveedores', 'Mantén el directorio al día y consulta reportes de órdenes y recepciones.']]
};
function helpModal() {
  showModal({ title: `Guía rápida · ${ROLES[me.role].label}`, sub: ROLES[me.role].short,
    body: `<div class="help-steps">${HELP[me.role].map((s, i) => `<div class="help-step"><b>${i + 1}</b><div><strong>${s[0]}</strong><span>${s[1]}</span></div></div>`).join('')}</div>
    <div class="info-note" style="margin-top:16px">Para ver el proceso completo, cambia de sesión desde el menú de usuario (arriba a la derecha): Solicitante → Jefe aprobador → Comprador.</div>`,
    actions: btn('Entendido', 'data-action="close-modal"', 'btn-primary') });
}

/* =========================================================
   COMPONENTES FIJOS: barra lateral, barra superior, menús
   ========================================================= */
function notifications() {
  const out = [];
  if (me.role === 'solicitante') {
    myRequests().forEach(r => {
      if (r.status === 'Devuelta') out.push({ t: 'violet', i: 'undo', title: 'Solicitud devuelta', text: `${r.id} necesita ajustes.`, page: 'requests' });
      if (r.status === 'Aprobada') out.push({ t: 'green', i: 'approve', title: 'Solicitud aprobada', text: `${r.id} pasa a gestión de compras.`, page: 'requests' });
      if (r.status === 'Rechazada') out.push({ t: 'red', i: 'x', title: 'Solicitud rechazada', text: `${r.id} fue rechazada.`, page: 'requests' });
    });
  } else if (me.role === 'jefe') {
    pendingReqs().forEach(r => out.push({ t: 'amber', i: 'clock', title: 'Solicitud por aprobar', text: `${r.id} · ${r.title}`, page: 'approvals' }));
  } else {
    toOrderReqs().forEach(r => out.push({ t: 'amber', i: 'cart', title: 'Lista para orden de compra', text: `${r.id} · ${r.title}`, page: 'to-order' }));
    openOrders().forEach(o => out.push({ t: 'blue', i: 'package', title: 'Recepción pendiente', text: `${o.id} · saldo ${money(o.total - o.received)}`, page: 'receipts' }));
  }
  return out;
}

function renderChrome() {
  $('#sessionCard').innerHTML = `<span class="session-dot"></span><div><small>SESIÓN ACTIVA</small><strong>${ROLES[me.role].label}</strong></div>`;
  $('#sideAvatar').textContent = me.initials;
  $('#sideName').textContent = me.name;
  $('#roleLabel').textContent = `${ROLES[me.role].label} · ${me.area}`;
  $('#logoutBtn').innerHTML = icon('logout');
  $('#helpIcon').innerHTML = icon('help');
  $('#mobileMenu').innerHTML = icon('menu');
  const n = notifications();
  $('#notifBtn').innerHTML = `${icon('bell')}${n.length ? `<span class="dot">${n.length}</span>` : ''}`;
  $('#notifMenu').innerHTML = `<div class="dd-head">Notificaciones <small>${n.length ? `${n.length} pendientes` : 'Al día'}</small></div>` +
    (n.length ? n.slice(0, 6).map(x => `<button class="dd-item" data-page="${x.page}"><span class="dd-ico t-${x.t}">${icon(x.i)}</span><span><strong>${esc(x.title)}</strong><small>${esc(x.text)}</small></span></button>`).join('') : '<div class="dd-empty">No tienes tareas pendientes.</div>');
  $('#userChip').innerHTML = `<span class="avatar avatar-small">${me.initials}</span><span class="who"><strong>${esc(me.name)}</strong><small>${ROLES[me.role].label}</small></span>${icon('chevron')}`;
  $('#userMenu').innerHTML = `<div class="dd-user"><span class="avatar">${me.initials}</span><div><strong>${esc(me.name)}</strong><small>${esc(me.title)} · ${esc(me.email)}</small></div></div>
    <div class="dd-label">CAMBIAR DE SESIÓN</div>
    ${USERS.filter(u => u.id !== me.id).map(u => `<button class="dd-action dd-switch" data-action="switch-user" data-id="${u.id}"><span class="avatar" style="background:${ROLE_COLOR[u.role]}">${u.initials}</span><span><strong style="display:block;color:var(--ink)">${ROLES[u.role].label}</strong><small style="color:var(--muted)">${esc(u.name)}</small></span></button>`).join('')}
    <div class="dd-sep"></div>
    <button class="dd-action" data-action="reset-demo">${icon('reset')}Restablecer datos de demostración</button>
    <button class="dd-action" data-action="logout">${icon('logout')}Cerrar sesión</button>`;
}

function renderSidebar() {
  $('#sidebarNav').innerHTML = NAV[me.role].map(([sec, items]) => `<div class="nav-caption">${sec.toUpperCase()}</div>` + items.map(([p, label, ic]) => {
    const c = navCount(p);
    return `<button class="nav-item ${p === page ? 'active' : ''}" data-page="${p}">${icon(ic)}<span>${label}</span>${c ? `<b class="nav-count">${c}</b>` : ''}</button>`;
  }).join('')).join('');
}

function render() {
  if (!me) return;
  renderSidebar();
  renderChrome();
  $('#breadcrumbPage').textContent = page === 'new-request' ? 'Nueva solicitud' : pageLabel(page);
  $('#pageContent').innerHTML = PAGES[page]();
  if (page === 'reports') renderReportPreview();
}

function navigate(p) {
  page = allowedPages().includes(p) ? p : 'dashboard';
  closeMenus();
  $('#sidebar').classList.remove('open');
  $('#sidebarOverlay').classList.remove('show');
  render();
  window.scrollTo(0, 0);
}

function closeMenus() { $$('.dropdown').forEach(d => d.classList.remove('open')); }

let toastTimer;
function showToast(msg, type = '') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* =========================================================
   SESIONES
   ========================================================= */
function startSession(u) {
  me = u;
  try { sessionStorage.setItem(SESSION_KEY, u.id); } catch (e) { /* ignorar */ }
  document.body.dataset.role = u.role;
  $('#loginView').classList.add('hidden');
  $('#appView').classList.remove('hidden');
  const hoy = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  $('#todayLabel').textContent = hoy.charAt(0).toUpperCase() + hoy.slice(1);
  closeModal();
  navigate('dashboard');
}
function endSession() {
  me = null;
  try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignorar */ }
  delete document.body.dataset.role;
  closeModal(); closeMenus();
  $('#appView').classList.add('hidden');
  $('#loginView').classList.remove('hidden');
  renderLogin();
}

function renderLogin() {
  $('#profilePicker').innerHTML = USERS.map(u => `<button type="button" class="profile-card" data-action="pick-profile" data-id="${u.id}">
    <span class="profile-ico" style="background:${ROLE_COLOR[u.role]}">${icon(ROLES[u.role].icon)}</span>
    <span><strong>${ROLES[u.role].label}</strong><small>${esc(u.name)} · ${esc(u.email)}</small></span><span class="check">${icon('tick')}</span></button>`).join('');
  $('.pass-toggle').innerHTML = icon('eye');
  $('.btn-arrow').innerHTML = icon('arrow');
  $('#loginError').classList.remove('show');
  pickProfile(USERS[0].id);
}
function pickProfile(id) {
  const u = byId(USERS, id);
  $('#loginUser').value = u.email;
  $('#loginPassword').value = u.password;
  $$('.profile-card').forEach(c => c.classList.toggle('selected', c.dataset.id === id));
  $('#loginError').classList.remove('show');
}

/* =========================================================
   EVENTOS
   ========================================================= */
function applyTableFilters(card) {
  const q = ($('.tbl-search', card)?.value || '').toLowerCase();
  const st = $('.tbl-status', card)?.value || '';
  $$('tbody tr', card).forEach(r => { r.hidden = !r.textContent.toLowerCase().includes(q) || (!!st && r.dataset.status !== st); });
}

function decide(id, decision) {
  const note = $('#approvalNote')?.value.trim();
  if (!note) { showToast('Escribe una observación antes de continuar.', 'error'); return; }
  const r = byId(db.requests, id);
  r.status = decision;
  r.history.push(H(todayISO(), me.name, me.role, decision, note));
  saveDB(); closeModal(); render();
  showToast(`Solicitud ${id} ${decision === 'Aprobada' ? 'aprobada' : decision === 'Rechazada' ? 'rechazada' : 'devuelta al solicitante'}.`);
}

function saveFix(id) {
  const note = $('#fixNote')?.value.trim();
  if (!note) { showToast('Describe los ajustes realizados.', 'error'); return; }
  const r = byId(db.requests, id);
  r.status = 'Pendiente';
  r.history.push(H(todayISO(), me.name, me.role, 'Reenviada', note));
  saveDB(); closeModal(); render();
  showToast(`Solicitud ${id} reenviada a aprobación.`);
}

function saveOrder(id) {
  const supplierId = $('#ordSupplier')?.value, expected = $('#ordDate')?.value;
  if (!supplierId) { showToast('Selecciona un proveedor.', 'error'); return; }
  if (!expected) { showToast('Indica la fecha estimada de entrega.', 'error'); return; }
  const r = byId(db.requests, id);
  const ocId = `OC-2026-${pad(db.seq.ord++)}`;
  db.orders.unshift({ id: ocId, requestId: id, supplierId, date: todayISO(), expected, total: r.amount, received: 0, note: $('#ordNote').value.trim(), receipts: [] });
  r.status = 'Con orden'; r.orderId = ocId;
  r.history.push(H(todayISO(), me.name, me.role, 'Orden generada', `${ocId} · ${supplierName(supplierId)}`));
  saveDB(); closeModal(); render();
  showToast(`Orden ${ocId} generada para ${id}.`);
}

function saveReceipt(id) {
  const o = byId(db.orders, id), v = Number($('#receiveAmount')?.value);
  if (!v || v <= 0) { showToast('Ingresa un valor de recepción válido.', 'error'); return; }
  if (v > o.total - o.received) { showToast('Error: la recepción supera el saldo pendiente.', 'error'); return; }
  o.received += v;
  o.receipts.push({ date: todayISO(), amount: v, note: $('#receiveNote').value.trim(), by: me.name });
  saveDB(); closeModal(); render();
  showToast(orderStatus(o) === 'Recibida' ? `Orden ${id} recibida por completo.` : 'Recepción parcial registrada.');
}

function saveSupplier() {
  const name = $('#spName')?.value.trim(), nit = $('#spNit')?.value.trim();
  if (!name || !nit) { showToast('Completa la razón social y el NIT.', 'error'); return; }
  if (db.suppliers.some(s => s.nit === nit)) { showToast('Ya existe un proveedor con ese NIT.', 'error'); return; }
  db.suppliers.push({ id: 'PRV-' + String(db.suppliers.length + 1).padStart(3, '0'), name, nit, category: $('#spCategory').value, contact: $('#spContact').value.trim() || 'No informado', email: $('#spEmail').value.trim() || 'No informado', status: 'Activo' });
  saveDB(); closeModal(); render();
  showToast('Proveedor agregado al directorio.');
}

function resetDemo() {
  db = seedData(); saveDB();
  if (me) { closeModal(); navigate('dashboard'); }
  showToast('Datos de demostración restablecidos.');
}

document.addEventListener('click', e => {
  const t = e.target;
  if (!t.closest('.menu-wrap')) closeMenus();
  if (t.classList.contains('modal-backdrop')) { closeModal(); return; }
  if (t.id === 'sidebarOverlay') { $('#sidebar').classList.remove('open'); t.classList.remove('show'); return; }
  if (t.closest('#mobileMenu')) { $('#sidebar').classList.toggle('open'); $('#sidebarOverlay').classList.toggle('show'); return; }

  const addBtn = t.closest('#addItem');
  if (addBtn) { $('#itemsContainer').insertAdjacentHTML('beforeend', itemRow()); return; }
  const rm = t.closest('.remove-item');
  if (rm) { if ($$('.item-row').length > 1) { rm.closest('.item-row').remove(); updateTotal(); } else showToast('Debe existir al menos un ítem.', 'error'); return; }

  const pg = t.closest('[data-page]');
  if (pg) { closeModal(); navigate(pg.dataset.page); return; }

  const a = t.closest('[data-action]');
  if (!a) return;
  const act = a.dataset.action, id = a.dataset.id;
  switch (act) {
    case 'pick-profile': pickProfile(id); break;
    case 'toggle-pass': { const i = $('#loginPassword'); const show = i.type === 'password'; i.type = show ? 'text' : 'password'; a.innerHTML = icon(show ? 'eyeoff' : 'eye'); break; }
    case 'reset-demo': resetDemo(); break;
    case 'logout': endSession(); break;
    case 'help': helpModal(); break;
    case 'toggle-notif': { const m = $('#notifMenu'); const open = m.classList.contains('open'); closeMenus(); m.classList.toggle('open', !open); break; }
    case 'toggle-user': { const m = $('#userMenu'); const open = m.classList.contains('open'); closeMenus(); m.classList.toggle('open', !open); break; }
    case 'switch-user': { const u = byId(USERS, id); startSession(u); showToast(`Sesión cambiada: ${ROLES[u.role].label} · ${u.name}`); break; }
    case 'close-modal': closeModal(); break;
    case 'request-detail': requestDetail(id); break;
    case 'review': closeModal(); reviewModal(id); break;
    case 'fix': closeModal(); fixModal(id); break;
    case 'gen-order': closeModal(); genOrderModal(id); break;
    case 'order-detail': closeModal(); orderDetail(id); break;
    case 'receive': closeModal(); receiveModal(id); break;
    case 'add-supplier': addSupplierModal(); break;
    case 'decide': decide(id, a.dataset.decision); break;
    case 'save-fix': saveFix(id); break;
    case 'save-order': saveOrder(id); break;
    case 'save-receipt': saveReceipt(id); break;
    case 'save-supplier': saveSupplier(); break;
    case 'fill-balance': $('#receiveAmount').value = a.dataset.max; break;
    case 'report': renderReportPreview(); showToast('Vista previa del reporte generada.'); break;
    case 'export-csv': exportCSV(); break;
  }
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeMenus(); } });

$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = $('#loginUser').value.trim().toLowerCase(), pass = $('#loginPassword').value;
  const err = $('#loginError');
  if (!email || !pass) { err.textContent = 'Ingresa tu correo y contraseña.'; err.classList.add('show'); return; }
  const u = USERS.find(x => x.email === email && x.password === pass);
  if (!u) { err.textContent = 'Credenciales incorrectas. Usa uno de los perfiles de demostración.'; err.classList.add('show'); return; }
  startSession(u);
});

document.addEventListener('submit', e => {
  if (e.target.id !== 'requestForm') return;
  e.preventDefault();
  const rows = $$('.item-row', e.target);
  const items = rows.map(r => ({ desc: $('.item-desc', r).value.trim(), qty: Number($('.item-qty', r).value), price: Number($('.item-price', r).value) }));
  if (items.some(i => !i.desc || i.qty < 1 || i.price < 1)) { showToast('Revisa los datos de los artículos.', 'error'); return; }
  const id = `SOL-2026-${pad(db.seq.req++)}`;
  db.requests.unshift({
    id, title: $('#reqTitle').value.trim(), area: $('#reqArea').value, ownerId: me.id, owner: me.name,
    created: todayISO(), required: $('#reqDate').value, amount: sum(items, i => i.qty * i.price), status: 'Pendiente', orderId: null,
    justification: $('#reqJust').value.trim(), items, history: [H(todayISO(), me.name, me.role, 'Registrada', 'Enviada a aprobación.')]
  });
  saveDB();
  showToast(`Solicitud ${id} enviada a aprobación.`);
  navigate('requests');
});

function updateTotal() {
  const el = $('#estimatedTotal');
  if (el) el.textContent = money(sum($$('.item-row'), r => (Number($('.item-qty', r).value) || 0) * (Number($('.item-price', r).value) || 0)));
}
document.addEventListener('input', e => {
  if (e.target.matches('.item-qty,.item-price')) updateTotal();
  if (e.target.matches('.tbl-search')) applyTableFilters(e.target.closest('[data-tcard]'));
});
document.addEventListener('change', e => { if (e.target.matches('.tbl-status')) applyTableFilters(e.target.closest('[data-tcard]')); });

/* ---------- Inicio ---------- */
(function init() {
  renderLogin();
  try {
    const sid = sessionStorage.getItem(SESSION_KEY);
    const u = sid && byId(USERS, sid);
    if (u) startSession(u);
  } catch (e) { /* ignorar */ }
})();
