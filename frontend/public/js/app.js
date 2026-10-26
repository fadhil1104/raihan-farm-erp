/* =====================================================================
   Raihan Farm Shop ERP & POS - frontend logic
   Data is loaded from / saved to the Node + MongoDB backend (see js/api.js)
   ===================================================================== */

// ---------- helpers ----------
const pad2 = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const getTodayDate = () => fmtDate(new Date());
const getTomorrowDate = () => { const d = new Date(); d.setDate(d.getDate() + 1); return fmtDate(d); };
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (id) => document.getElementById(id);
const inventoryUnit = (item) => item.unitType || 'kg';
const inventoryStock = (item) => inventoryUnit(item) === 'kg' ? Number(item.stockKg || 0) : Number(item.stockQuantity || 0);
const inventoryPrice = (item) => inventoryUnit(item) === 'kg' ? Number(item.pricePerKg || 0) : Number(item.pricePerUnit || 0);
const inventoryMinStock = (item) => inventoryUnit(item) === 'kg' ? Number(item.minStockKg || 0) : Number(item.minStockQuantity || 0);
const inventoryUnitLabel = (item) => inventoryUnit(item) === 'kg' ? 'kg'
  : inventoryUnit(item) === 'packet' ? `${Number(item.packWeightGrams || 0)}g packet` : (item.unitLabel || 'unit');
const inventoryPriceLabel = (item) => inventoryUnit(item) === 'kg' ? 'per kg' : `per ${inventoryUnitLabel(item)}`;
const inventoryStockText = (item, digits = 0) => `${inventoryStock(item).toFixed(digits)} ${inventoryUnitLabel(item)}${inventoryUnit(item) === 'packet' || inventoryUnit(item) === 'unit' ? (inventoryStock(item) === 1 ? '' : 's') : ''}`;
const setInventoryValues = (item, price, stock) => {
  if (inventoryUnit(item) === 'kg') { item.pricePerKg = price; item.stockKg = +stock.toFixed(2); }
  else { item.pricePerUnit = price; item.stockQuantity = Math.round(stock); }
};
const phoneKey = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.startsWith('94') && digits.length === 11 ? `0${digits.slice(2)}` : digits;
};

function showToast(message, type = 'success') {
  const container = $('toast-container');
  const toast = document.createElement('div');
  const colorClass = type === 'error' ? 'bg-red-950 border-red-500 text-red-200'
    : type === 'info' ? 'bg-slate-900 border-yellow-400 text-yellow-300'
    : 'bg-slate-900 border-emerald-500 text-emerald-300';
  const iconClass = type === 'error' ? 'fa-circle-exclamation text-red-400'
    : type === 'info' ? 'fa-wheat-awn text-yellow-400'
    : 'fa-circle-check text-emerald-400';
  toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-xs font-bold transition-all duration-300 ${colorClass}`;
  toast.innerHTML = `<i class="fa-solid ${iconClass} text-base"></i><span>${esc(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3200);
}

// ---------- application state ----------
let state = null;                       // loaded from the API after login
let currentUser = null;                 // { username, role, label }
let selectedPosCategoryId = null;
let posCart = [];
let archiveGranularity = 'DATE';        // DATE | WEEKLY | MONTHLY | YEARLY | LIFETIME
let selectedArchiveDate = getTodayDate();
let deferredPwaPrompt = null;
let qrRoster = [];

window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPwaPrompt = e; });

const todaysPosSales = () => {
  const today = getTodayDate();
  return (state.posSales || []).filter((s) => s.date === today);
};

// ---------- server sync ----------
let saveTimer = null, savePending = false, saveInFlight = false, stateVersion = 0;

function setSyncStatus(text, ok = true) {
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const side = $('sidebar-cloud-status');
  if (side) {
    side.className = `${ok ? 'text-emerald-400' : 'text-red-400'} font-bold flex items-center gap-1`;
    side.innerHTML = `<i class="fa-solid fa-database"></i> ${esc(text)} • ${now}`;
  }
  const lbl = $('cloud-last-sync-label');
  if (lbl) lbl.innerText = `${now} (${text})`;
  const badge = $('modal-cloud-badge');
  if (badge) {
    badge.innerText = ok ? 'MONGODB CONNECTED' : 'SERVER OFFLINE';
    badge.className = `px-2.5 py-0.5 rounded-full text-[10px] font-black ${ok ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`;
  }
}

function queueSave() {
  savePending = true;
  stateVersion++;
  setSyncStatus('Saving…');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, 400);
}

function ensureStateCollections() {
  if (state && !Array.isArray(state.customers)) state.customers = [];
}

async function flushSave() {
  if (!state || !currentUser) return;
  if (saveInFlight) { saveTimer = setTimeout(flushSave, 300); return; }
  saveInFlight = true;
  const versionAtStart = stateVersion;
  try {
    await Api.putState(state);
    if (versionAtStart === stateVersion) savePending = false; else queueSave();
    setSyncStatus('Saved to MongoDB');
  } catch (err) {
    setSyncStatus('Save failed - will retry', false);
    if (!err.offline && err.status !== 401) showToast(err.message, 'error');
    saveTimer = setTimeout(flushSave, 5000);
  } finally {
    saveInFlight = false;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function flushNow() {
  clearTimeout(saveTimer);
  for (let i = 0; i < 20 && (savePending || saveInFlight); i++) {
    if (!saveInFlight) await flushSave(); else await sleep(200);
  }
}

async function pullFromServer(notify = false) {
  if (!currentUser || savePending || saveInFlight) return;
  try {
    state = await Api.getState();
    ensureStateCollections();
    renderAll();
    setSyncStatus('Synced from MongoDB');
    if (notify) showToast('Latest data pulled from the database!', 'success');
  } catch (err) {
    setSyncStatus('Server offline', false);
    if (notify) showToast(err.message, 'error');
  }
}

// Every action ends with saveState(): update vault mirror, re-render, push to server
function saveState() {
  ensureStateCollections();
  syncTodayIntoDailyVault();
  renderAll();
  queueSave();
}

// Pull remote changes (other devices / phones) every 20s while the user is idle
setInterval(() => {
  const el = document.activeElement;
  const typing = el && ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);
  if (currentUser && !typing && posCart.length === 0) pullFromServer(false);
}, 20000);

// ---------- Windows app / server settings ----------
function openWindowsCloudModal() { $('cloud-endpoint-input').value = Api.base(); $('windows-cloud-modal').classList.remove('hidden'); }
function closeWindowsCloudModal() { $('windows-cloud-modal').classList.add('hidden'); }

function saveCloudEndpointAndSync() {
  Api.setBase($('cloud-endpoint-input').value);
  showToast('Server address saved. Reconnecting…', 'success');
  setTimeout(() => location.reload(), 600);
}

function downloadBlob(content, mime, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
}

function downloadWindowsBatLauncher() {
  const currentUrl = window.location.href.split('?')[0];
  const bat = ['@echo off', 'title Raihan Farm Shop - ERP & POS Windows Desktop Launcher',
    'echo Starting Raihan Farm Shop ERP & POS in Native Windows Desktop Mode...',
    'start "" msedge --app="' + currentUrl + '" --start-maximized', 'exit'].join('\r\n');
  downloadBlob(bat, 'application/x-bat', 'Raihan_Farm_Shop_ERP_Windows.bat');
  showToast('Downloaded Raihan_Farm_Shop_ERP_Windows.bat! Double-click it on Windows to launch as a desktop app.', 'success');
}

function triggerWindowsPwaInstall() {
  if (deferredPwaPrompt) deferredPwaPrompt.prompt();
  else showToast("Tip: In Chrome or Edge on Windows, click the 'Install App' icon in the address bar or use the .BAT launcher!", 'info');
}

function downloadElectronPackage() {
  const cfg = {
    name: 'raihan-farm-shop-erp', productName: 'Raihan Farm Shop ERP & POS', version: '3.0.0',
    description: 'Windows Desktop POS, Slaughter Yield & Attendance ERP for Raihan Farm Shop',
    main: 'main.js',
    scripts: { start: 'electron .', buildWin: 'electron-packager . RaihanFarmShopERP --platform=win32 --arch=x64 --out=dist --overwrite' },
    Instructions: "1. Put the frontend folder next to this file and create main.js that opens index.html (or your server URL). 2. Run 'npm install electron --save-dev' then 'npm start'."
  };
  downloadBlob(JSON.stringify(cfg, null, 2), 'text/json', 'package.json');
  showToast('Downloaded Electron Windows .EXE package configuration!', 'success');
}

// ---------- permanent daily vault mirror ----------
function syncTodayIntoDailyVault() {
  if (!state) return;
  const today = getTodayDate();
  const todaysSales = todaysPosSales();
  const todaysBatches = state.slaughterBatches.filter((b) => String(b.date).startsWith(today));
  if (!state.dailyVault) state.dailyVault = {};
  if (todaysSales.length === 0 && todaysBatches.length === 0 && !state.dailyVault[today]) return;
  state.dailyVault[today] = {
    date: today,
    posSales: JSON.parse(JSON.stringify(todaysSales)),
    slaughterBatches: JSON.parse(JSON.stringify(todaysBatches)),
    inventorySnapshot: state.inventory.filter((item) => inventoryUnit(item) === 'kg').map((item) => {
      const slaughterInKg = todaysBatches.filter((b) => b.categoryId === item.id).reduce((s, b) => s + Number(b.actualKg || 0), 0);
      let soldKg = 0;
      todaysSales.forEach((sale) => { if (sale.itemsBreakdown && sale.itemsBreakdown[item.id]) soldKg += Number(sale.itemsBreakdown[item.id]); });
      const closingKg = Number(item.stockKg || 0);
      const openingKg = Math.max(0, +(closingKg - slaughterInKg + soldKg).toFixed(2));
      return { id: item.id, name: item.name, openingKg, slaughterInKg: +slaughterInKg.toFixed(2), soldKg: +soldKg.toFixed(2), closingKg: +closingKg.toFixed(2), pricePerKg: item.pricePerKg };
    })
  };
}

// ---------- backup / restore ----------
function exportLifetimeBackup() {
  if (!state) return;
  syncTodayIntoDailyVault();
  downloadBlob(JSON.stringify(state, null, 2), 'text/json', `raihan_farm_shop_lifetime_vault_${getTodayDate()}.json`);
  showToast('Lifetime Vault Backup (.json) downloaded!', 'success');
}

function importLifetimeBackup(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!(imported && imported.inventory && imported.yearlyHistory)) return showToast('Invalid backup file format.', 'error');
      if (!confirm('Restore this backup? Records not in the file will be removed from the database.')) return;
      await Api.putState(imported, true);   // replace=true
      savePending = false;
      await pullFromServer();
      showToast('Lifetime Vault Backup restored successfully!', 'success');
    } catch (err) { showToast('Could not restore backup: ' + err.message, 'error'); }
    event.target.value = '';
  };
  reader.readAsText(file);
}

// ---------- authentication ----------
function openLoginModal() {
  $('login-error').classList.add('hidden');
  $('login-close-btn').classList.toggle('hidden', !currentUser);
  $('login-modal').classList.remove('hidden');
}
function closeLoginModal() { if (currentUser) $('login-modal').classList.add('hidden'); }

async function handleLogin() {
  const u = $('login-username').value.trim();
  const p = $('login-password').value;
  try {
    const res = await Api.login(u, p);
    Api.setToken(res.token);
    currentUser = res.user;
    updateRoleSidebar();
    switchTab(currentUser.role === 'admin' ? 'dashboard' : 'pos');
    $('login-modal').classList.add('hidden');
    $('login-password').value = '';
    savePending = false;
    state = await Api.getState();
    ensureStateCollections();
    syncTodayIntoDailyVault();
    applyRolePermissions();
    switchTab(currentUser.role === 'admin' ? 'dashboard' : 'pos');
    setSyncStatus('Connected to MongoDB');
    showToast(currentUser.role === 'admin' ? 'Welcome Admin! Full dashboard, reports & approvals unlocked.' : 'Logged in as Staff: POS Terminal & 1-Time Inventory Edit enabled.', currentUser.role === 'admin' ? 'success' : 'info');
  } catch (err) {
    const box = $('login-error');
    box.innerText = err.offline ? err.message : 'Invalid credentials.';
    box.classList.remove('hidden');
  }
}

function applyRolePermissions() {
  updateRoleSidebar();
  const isAdmin = currentUser && currentUser.role === 'admin';

  const invNotice = $('inv-role-notice');
  if (isAdmin) {
    invNotice.className = 'px-2.5 py-0.5 text-xs font-extrabold uppercase bg-yellow-400 text-slate-950 rounded-full';
    invNotice.innerText = 'Admin Mode: Unlimited Direct Edits';
  } else {
    invNotice.className = 'px-2.5 py-0.5 text-xs font-extrabold uppercase bg-sky-400 text-slate-950 rounded-full';
    invNotice.innerText = 'Staff Mode: 1 Direct Edit Per Item (2nd+ Requires Admin Approval)';
  }
  renderAll();
}

function updateRoleSidebar() {
  const isAdmin = currentUser && currentUser.role === 'admin';
  $('active-user-label').innerText = currentUser ? currentUser.label : 'Not signed in';
  $('active-user-label').className = isAdmin ? 'text-xs font-extrabold text-yellow-400 mt-0.5' : 'text-xs font-extrabold text-sky-400 mt-0.5';
  $('role-badge-icon').className = `w-7 h-7 rounded-lg ${isAdmin ? 'bg-yellow-400' : 'bg-sky-400'} text-slate-950 flex items-center justify-center font-black text-xs`;
  $('role-badge-icon').innerHTML = isAdmin ? '<i class="fa-solid fa-user-shield"></i>' : '<i class="fa-solid fa-cash-register"></i>';
  document.querySelectorAll('.admin-only-nav').forEach((el) => el.classList.toggle('hidden', !isAdmin));
  let number = 0;
  document.querySelectorAll('#nav-dashboard, #nav-slaughter, #nav-inventory, #nav-pos, #nav-attendance, #nav-payroll, #nav-deliveries, #nav-coa')
    .forEach((nav) => {
      if (nav.classList.contains('hidden')) return;
      const title = nav.querySelector('.nav-title');
      if (title) title.innerText = `${++number}. ${title.innerText.replace(/^\d+\.\s*/, '')}`;
    });
}

function switchTab(tabId) {
  const adminOnlyTabs = ['dashboard', 'slaughter', 'attendance', 'payroll', 'deliveries', 'coa'];
  if (currentUser && currentUser.role !== 'admin' && adminOnlyTabs.includes(tabId)) {
    showToast('Access Restricted: Staff can only access POS & Dressed Inventory.', 'error');
    tabId = 'pos';
  }
  ['dashboard', 'slaughter', 'inventory', 'pos', 'attendance', 'payroll', 'deliveries', 'coa'].forEach((t) => {
    const tabEl = $('tab-' + t);
    const navEl = $('nav-' + t);
    if (tabEl) tabEl.classList.add('hidden');
    if (navEl) {
      navEl.classList.remove('active-nav');
      navEl.classList.add('text-slate-300');
    }
  });
  const targetTab = $('tab-' + tabId);
  const targetNav = $('nav-' + tabId);
  if (targetTab) targetTab.classList.remove('hidden');
  if (targetNav) {
    targetNav.classList.add('active-nav');
    targetNav.classList.remove('text-slate-300');
  }
}

// ---------- MODULE 2: farm slaughter (30% waste) ----------
function onLiveWeightInput() {
  const liveKg = Number($('sl-live-kg').value) || 0;
  $('sl-actual-kg').value = +(liveKg * 0.70).toFixed(2);
  calculateSlaughterPreview();
}

function calculateSlaughterPreview() {
  const count = Math.max(1, Number($('sl-count').value) || 1);
  const liveKg = Math.max(0, Number($('sl-live-kg').value) || 0);
  const actualKg = Math.max(0, Number($('sl-actual-kg').value) || 0);
  const actualWasteKg = Math.max(0, liveKg - actualKg);
  const actualWastePct = liveKg > 0 ? (actualWasteKg / liveKg) * 100 : 0;
  $('prev-avg-live').innerText = liveKg > 0 ? `${(liveKg / count).toFixed(2)} kg` : '—';
  $('prev-expected-kg').innerText = `${(liveKg * 0.70).toFixed(2)} kg`;
  $('prev-std-waste').innerText = `(Std 30% Waste: ${(liveKg * 0.30).toFixed(2)} kg)`;
  $('prev-actual-waste').innerText = `${actualWasteKg.toFixed(2)} kg (${actualWastePct.toFixed(1)}%)`;
  $('prev-net-stock').innerText = `+${actualKg.toFixed(2)} kg`;
}

function recordSlaughterBatch() {
  const categoryId = $('sl-category').value;
  const count = Number($('sl-count').value) || 0;
  const liveKg = Number($('sl-live-kg').value) || 0;
  const actualKg = Number($('sl-actual-kg').value) || 0;
  if (!Number.isInteger(count) || count <= 0 || liveKg <= 0 || actualKg <= 0 || actualKg > liveKg) return showToast('Please enter a whole animal count and valid weights; dressed weight cannot exceed live weight.', 'error');

  const invItem = state.inventory.find((i) => i.id === categoryId);
  if (!invItem || inventoryUnit(invItem) !== 'kg') return showToast('Select a kg-based meat inventory item before recording a slaughter batch.', 'error');
  const wasteKg = +(liveKg - actualKg).toFixed(2);
  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  state.slaughterBatches.unshift({
    id: 'BATCH-' + Date.now().toString().slice(-7),
    date: `${getTodayDate()} ${nowTime}`,
    source: invItem.source, categoryId, categoryName: invItem.name,
    count, liveKg, expectedKg: +(liveKg * 0.70).toFixed(2), actualKg, wasteKg,
    wastePct: +((wasteKg / liveKg) * 100).toFixed(1)
  });
  invItem.stockKg = +(invItem.stockKg + actualKg).toFixed(2);

  saveState();
  showToast(`Slaughter batch saved! +${actualKg.toFixed(1)} kg added to Shop Inventory.`, 'success');
}

function dateTimeLocalValue(value) {
  const date = new Date(String(value || '').replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return `${fmtDate(date)}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function openSlaughterEdit(id) {
  if (!currentUser || currentUser.role !== 'admin') return showToast('Only an admin can edit farm and slaughter records.', 'error');
  const batch = state.slaughterBatches.find((entry) => entry.id === id);
  if (!batch) return showToast('Slaughter batch not found.', 'error');
  $('edit-batch-id').value = batch.id;
  $('edit-batch-date').value = dateTimeLocalValue(batch.date);
  $('edit-batch-source').value = batch.source || '';
  $('edit-batch-category').innerHTML = state.inventory.filter((item) => inventoryUnit(item) === 'kg')
    .map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`).join('');
  $('edit-batch-category').value = batch.categoryId;
  $('edit-batch-count').value = batch.count;
  $('edit-batch-live').value = batch.liveKg;
  $('edit-batch-actual').value = batch.actualKg;
  $('slaughter-edit-modal').classList.remove('hidden');
}

function closeSlaughterEdit() { $('slaughter-edit-modal').classList.add('hidden'); }

function adjustVaultSnapshot(vault, batch, deltaKg) {
  if (!vault || !Array.isArray(vault.inventorySnapshot) || !deltaKg) return;
  let row = vault.inventorySnapshot.find((entry) => entry.id === batch.categoryId);
  if (!row && deltaKg > 0) {
    const item = state.inventory.find((entry) => entry.id === batch.categoryId);
    row = { id: batch.categoryId, name: batch.categoryName, openingKg: 0, slaughterInKg: 0, soldKg: 0, closingKg: 0, pricePerKg: item ? item.pricePerKg : 0 };
    vault.inventorySnapshot.push(row);
  }
  if (row) {
    row.slaughterInKg = Math.max(0, Number(row.slaughterInKg || 0) + deltaKg);
    row.closingKg = Math.max(0, Number(row.closingKg || 0) + deltaKg);
  }
}

function updateBatchVault(oldBatch, newBatch) {
  if (!state.dailyVault) state.dailyVault = {};
  const oldDay = String(oldBatch.date).slice(0, 10), newDay = String(newBatch.date).slice(0, 10);
  const oldVault = state.dailyVault && state.dailyVault[oldDay];
  const newVault = state.dailyVault && state.dailyVault[newDay];
  if (oldVault) {
    oldVault.slaughterBatches = oldVault.slaughterBatches.filter((entry) => entry.id !== oldBatch.id);
    adjustVaultSnapshot(oldVault, oldBatch, -Number(oldBatch.actualKg || 0));
  }
  if (newVault) {
    newVault.slaughterBatches = newVault.slaughterBatches.filter((entry) => entry.id !== newBatch.id);
    newVault.slaughterBatches.push({ ...newBatch });
    adjustVaultSnapshot(newVault, newBatch, Number(newBatch.actualKg || 0));
  }
}

function saveSlaughterEdit() {
  if (!currentUser || currentUser.role !== 'admin') return showToast('Only an admin can edit farm and slaughter records.', 'error');
  const batch = state.slaughterBatches.find((entry) => entry.id === $('edit-batch-id').value);
  if (!batch) return showToast('Slaughter batch not found.', 'error');
  const category = state.inventory.find((item) => item.id === $('edit-batch-category').value);
  const count = Number($('edit-batch-count').value), liveKg = Number($('edit-batch-live').value);
  const actualKg = Number($('edit-batch-actual').value), dateValue = $('edit-batch-date').value;
  const source = $('edit-batch-source').value.trim();
  if (!category || inventoryUnit(category) !== 'kg' || !source || !dateValue || !Number.isInteger(count) ||
      count <= 0 || !Number.isFinite(liveKg) || liveKg <= 0 || !Number.isFinite(actualKg) || actualKg <= 0 || actualKg > liveKg) {
    return showToast('Enter a source, date, whole animal count, and valid weights; dressed weight cannot exceed live weight.', 'error');
  }
  const oldBatch = { ...batch };
  const oldItem = state.inventory.find((item) => item.id === oldBatch.categoryId);
  if (oldItem && oldItem.id !== category.id && Number(oldItem.stockKg || 0) < Number(oldBatch.actualKg || 0)) {
    return showToast(`Cannot move this batch: ${oldItem.name} has less current stock than the original batch weight.`, 'error');
  }
  if (oldItem && oldItem.id === category.id) {
    oldItem.stockKg = Math.max(0, +(Number(oldItem.stockKg || 0) + actualKg - Number(oldBatch.actualKg || 0)).toFixed(2));
  } else {
    if (oldItem) oldItem.stockKg = +(Number(oldItem.stockKg || 0) - Number(oldBatch.actualKg || 0)).toFixed(2);
    category.stockKg = +(Number(category.stockKg || 0) + actualKg).toFixed(2);
  }

  const date = new Date(dateValue);
  const wasteKg = +(liveKg - actualKg).toFixed(2);
  Object.assign(batch, {
    date: `${fmtDate(date)} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`,
    source, categoryId: category.id, categoryName: category.name,
    count, liveKg, expectedKg: +(liveKg * 0.70).toFixed(2), actualKg, wasteKg,
    wastePct: +((wasteKg / liveKg) * 100).toFixed(1)
  });
  updateBatchVault(oldBatch, batch);
  closeSlaughterEdit();
  saveState();
  showToast(`Slaughter batch ${batch.id} updated.`, 'success');
}

// ---------- MODULE 3: inventory with 1-time staff edit lock ----------
function submitInventoryEdit(id) {
  const item = state.inventory.find((i) => i.id === id);
  if (!item) return;
  const newPrice = Number($(`inv-price-${id}`).value);
  const newStock = Number($(`inv-stock-${id}`).value);
  const wholesaleInput = $(`inv-wholesale-${id}`);
  const newWholesale = wholesaleInput ? Number(wholesaleInput.value || 0) : Number(item.wholesalePrice || 0);
  const nameInput = $(`inv-name-${id}`), sourceInput = $(`inv-source-${id}`);
  const newName = nameInput ? nameInput.value.trim() : item.name;
  const newSource = sourceInput ? sourceInput.value.trim() : item.source;
  const wholeQuantity = inventoryUnit(item) !== 'kg';
  if (!newName || !newSource || !Number.isFinite(newPrice) || newPrice <= 0 ||
      !Number.isFinite(newWholesale) || newWholesale < 0 || !Number.isFinite(newStock) || newStock < 0 ||
      (wholeQuantity && !Number.isInteger(newStock))) {
    return showToast('Enter valid item details, prices, and a non-negative stock quantity (whole quantity for packets/units).', 'error');
  }
  const detailsChanged = nameInput && (newName !== item.name || newSource !== item.source || newWholesale !== Number(item.wholesalePrice || 0));
  const valuesChanged = newPrice !== inventoryPrice(item) || newStock !== inventoryStock(item);
  if (!detailsChanged && !valuesChanged) return showToast('No changes detected.', 'info');

  if (currentUser.role === 'admin') {
    item.name = newName;
    item.source = newSource;
    item.wholesalePrice = newWholesale;
    setInventoryValues(item, newPrice, newStock);
    saveState();
    return showToast(`Admin updated ${item.name} immediately.`, 'success');
  }
  if (detailsChanged) return showToast('Only an admin can change item name, source, or wholesale price.', 'error');
  if ((item.staffEditCount || 0) < 1) {
    setInventoryValues(item, newPrice, newStock); item.staffEditCount = 1;
    saveState();
    showToast(`1st Staff Edit applied for ${item.name}. Item is now locked for further direct edits.`, 'info');
  } else {
    const reasonInput = $(`inv-reason-${id}`);
    const reason = reasonInput && reasonInput.value.trim() ? reasonInput.value.trim() : 'Staff requested additional stock/price adjustment';
    state.pendingInventoryApprovals.unshift({
      reqId: 'REQ-' + Date.now().toString().slice(-6), itemId: item.id, itemName: item.name,
      requestedBy: `${currentUser.username} (Staff)`,
      time: `${getTodayDate()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      oldPrice: inventoryPrice(item), newPrice, oldStock: inventoryStock(item),
      newStock: wholeQuantity ? Math.round(newStock) : +newStock.toFixed(2), reason, status: 'Pending'
    });
    saveState();
    showToast('1-Time Edit limit reached! Request sent to Admin Dashboard for approval.', 'info');
  }
}

function approveInventoryRequest(reqId) {
  if (currentUser.role !== 'admin') return;
  const req = state.pendingInventoryApprovals.find((r) => r.reqId === reqId);
  if (!req) return;
  const item = state.inventory.find((i) => i.id === req.itemId);
  if (item) setInventoryValues(item, Number(req.newPrice), Number(req.newStock));
  req.status = 'Approved';
  saveState();
  showToast(`Approved staff inventory update for ${req.itemName}!`, 'success');
}

function rejectInventoryRequest(reqId) {
  if (currentUser.role !== 'admin') return;
  const req = state.pendingInventoryApprovals.find((r) => r.reqId === reqId);
  if (!req) return;
  req.status = 'Rejected';
  saveState();
  showToast(`Rejected inventory request ${reqId}.`, 'error');
}

function inventoryUnitFormChanged() {
  const unit = $('new-inv-unit').value;
  const isKg = unit === 'kg';
  $('new-inv-pack-wrap').classList.toggle('hidden', unit !== 'packet');
  $('new-inv-price').placeholder = isKg ? 'Retail price per kg (Rs.)'
    : unit === 'packet' ? 'Retail price per packet (Rs.)' : 'Retail price per unit (Rs.)';
  $('new-inv-price').step = '0.01';
  $('new-inv-min-stock').placeholder = isKg ? 'Low-stock alert threshold (kg)' : 'Low-stock alert threshold (whole quantity)';
  $('new-inv-min-stock').step = isKg ? '0.1' : '1';
  $('new-inv-wholesale').placeholder = isKg ? 'Wholesale price per kg (Rs.)'
    : unit === 'packet' ? 'Wholesale price per packet (Rs.)' : 'Wholesale price per unit (Rs.)';
}

function addInventoryItem() {
  if (!currentUser || currentUser.role !== 'admin') return;
  const name = $('new-inv-name').value.trim();
  const source = $('new-inv-source').value.trim();
  const unitType = $('new-inv-unit').value;
  const price = Number($('new-inv-price').value);
  const wholesalePrice = Number($('new-inv-wholesale').value || 0);
  const minStock = Number($('new-inv-min-stock').value || 0);
  const packWeightGrams = Number($('new-inv-pack-grams').value || 0);
  const wholeQuantity = unitType !== 'kg';
  if (!name || !source || !Number.isFinite(price) || price <= 0 || !Number.isFinite(wholesalePrice) || wholesalePrice < 0 ||
      !Number.isFinite(minStock) || minStock < 0 || (wholeQuantity && !Number.isInteger(minStock)) ||
      (unitType === 'packet' && (!Number.isInteger(packWeightGrams) || packWeightGrams <= 0))) {
    return showToast('Enter a name, supplier/source, valid retail and wholesale prices, and valid unit-specific stock settings.', 'error');
  }

  const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item'}-${Date.now()}`;
  const item = {
    id, name, source, unitType, wholesalePrice, staffEditCount: 0,
    ...(unitType === 'kg'
      ? { stockKg: 0, pricePerKg: price, minStockKg: minStock }
      : { stockQuantity: 0, pricePerUnit: price, minStockQuantity: minStock }),
    ...(unitType === 'packet' ? { packWeightGrams } : {})
  };
  state.inventory.push(item);
  $('new-inv-name').value = '';
  $('new-inv-source').value = '';
  $('new-inv-wholesale').value = '';
  $('new-inv-price').value = '';
  $('new-inv-min-stock').value = '';
  $('new-inv-pack-grams').value = '';
  saveState();
  showToast(`${name} added with zero ${inventoryUnitLabel(item)} stock.`, 'success');
}

function resetAllStaffEditLocks() {
  if (currentUser.role !== 'admin') return;
  state.inventory.forEach((i) => { i.staffEditCount = 0; });
  saveState();
  showToast('All 1-time staff inventory edit locks have been reset!', 'success');
}

// ---------- financials, receivables & archive ----------
function markReceivableCollected(invId) {
  if (currentUser.role !== 'admin') return;
  const rec = state.receivablesList.find((r) => r.id === invId);
  if (!rec || rec.status === 'Collected') return;
  rec.status = 'Collected';
  const m = state.yearlyHistory[state.yearlyHistory.length - 1];
  if (m) { m.receivables = Math.max(0, m.receivables - rec.amount); m.posCashSales += rec.amount; }
  saveState();
  showToast(`Receivable ${invId} (Rs. ${rec.amount.toLocaleString()}) marked as Collected!`, 'success');
}

function openAnnualReportModal() { renderAnnualAnalytics(); $('annual-report-modal').classList.remove('hidden'); }
function closeAnnualReportModal() { $('annual-report-modal').classList.add('hidden'); }

function setArchiveGranularity(mode) {
  archiveGranularity = mode;
  ['DATE', 'WEEKLY', 'MONTHLY', 'YEARLY', 'LIFETIME'].forEach((m) => {
    const btn = $('gran-' + m);
    if (!btn) return;
    btn.className = m === mode
      ? 'px-3 py-2 rounded-xl text-xs font-extrabold transition bg-yellow-400 text-slate-950 shadow-md shadow-yellow-400/20'
      : 'px-3 py-2 rounded-xl text-xs font-bold transition bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800';
  });
  if (state) renderAnnualAnalytics();
}

function onCalendarDateChange(dateStr) {
  if (!dateStr) return;
  selectedArchiveDate = dateStr;
  setArchiveGranularity('DATE');
  showToast(`Selected ${dateStr}. Only saved records are displayed.`, 'info');
}
function jumpToCalendarDate(dateStr) {
  selectedArchiveDate = dateStr;
  const picker = $('archive-calendar-picker');
  if (picker) picker.value = dateStr;
  setArchiveGranularity('DATE');
}
function stepCalendarDate(delta) {
  const d = new Date(selectedArchiveDate + 'T00:00:00');
  if (isNaN(d.getTime())) return;
  d.setDate(d.getDate() + delta);
  jumpToCalendarDate(fmtDate(d));
}

// Real data only: dates with no stored record show an empty day (no invented numbers)
function getDaySnapshot(dateStr) {
  if (state.dailyVault[dateStr]) return state.dailyVault[dateStr];
  const posSales = (state.posSales || []).filter((sale) => sale.date === dateStr);
  const slaughterBatches = (state.slaughterBatches || []).filter((batch) => String(batch.date).startsWith(dateStr));
  return {
    date: dateStr, posSales, slaughterBatches, inventorySnapshot: []
  };
}

function renderCalendarDayInspector() {
  const picker = $('archive-calendar-picker');
  if (picker && picker.value !== selectedArchiveDate) picker.value = selectedArchiveDate;
  const snap = getDaySnapshot(selectedArchiveDate);
  const isToday = selectedArchiveDate === getTodayDate();
  const hasDailyRecord = Boolean(snap.inventorySnapshot.length || snap.posSales.length || snap.slaughterBatches.length);
  $('cal-selected-date-heading').innerText = `${selectedArchiveDate} ${hasDailyRecord ? (isToday ? '(Today — Live Shop Record)' : '(Permanent Archive Record)') : '(No saved records)'}`;
  const dayPosTotal = snap.posSales.reduce((s, p) => s + Number(p.totalRs || 0), 0);
  const daySoldKg = snap.inventorySnapshot.length
    ? snap.inventorySnapshot.reduce((s, i) => s + Number(i.soldKg || 0), 0)
    : snap.posSales.reduce((s, sale) => s + Number(sale.totalKg || 0), 0);
  const daySlaughterKg = snap.inventorySnapshot.length
    ? snap.inventorySnapshot.reduce((s, i) => s + Number(i.slaughterInKg || 0), 0)
    : snap.slaughterBatches.reduce((s, batch) => s + Number(batch.actualKg || 0), 0);
  $('cal-day-pos-badge').innerText = snap.posSales.length ? `Day POS Sales: Rs. ${dayPosTotal.toLocaleString()}` : 'No sales recorded';
  $('cal-day-kg-badge').innerText = snap.posSales.length ? `Dressed Sold: ${daySoldKg.toFixed(2)} kg` : 'No sales recorded';
  $('cal-day-slaughter-badge').innerText = snap.slaughterBatches.length ? `Farm Slaughter In: +${daySlaughterKg.toFixed(2)} kg` : 'No slaughter recorded';
  $('cal-day-tx-count').innerText = hasDailyRecord
    ? `${snap.posSales.length} POS Bills • ${snap.slaughterBatches.length} Slaughter Batches`
    : 'No records for this date';

  $('cal-day-inventory-tbody').innerHTML = snap.inventorySnapshot.length === 0
    ? '<tr><td colspan="6" class="py-5 text-center text-slate-400">No inventory snapshot recorded for this date.</td></tr>'
    : snap.inventorySnapshot.map((row) => `
    <tr class="hover:bg-slate-800/40 transition">
      <td class="py-2 px-2 font-bold text-white">${esc(row.name)}</td>
      <td class="py-2 px-2 text-right text-slate-400">${Number(row.openingKg).toFixed(2)} kg</td>
      <td class="py-2 px-2 text-right font-semibold text-sky-400">+${Number(row.slaughterInKg).toFixed(2)} kg</td>
      <td class="py-2 px-2 text-right font-semibold text-amber-400">-${Number(row.soldKg).toFixed(2)} kg</td>
      <td class="py-2 px-2 text-right font-black text-emerald-400">${Number(row.closingKg).toFixed(2)} kg</td>
      <td class="py-2 px-2 text-right text-yellow-400 font-bold">Rs. ${Number(row.pricePerKg).toLocaleString()}</td>
    </tr>`).join('');

  const salesHtml = snap.posSales.map((p) => `
    <div class="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs">
      <div>
        <div class="flex items-center gap-2">
          <span class="font-black text-yellow-400">${esc(p.id)}</span><span class="font-bold text-white">${esc(p.customer)}</span>
          <span class="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">${esc(p.payment)}</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-0.5">${esc(p.itemsSummary)}</p>
      </div>
      <div class="text-right shrink-0"><span class="font-black text-emerald-400 block">Rs. ${Number(p.totalRs).toLocaleString()}</span><span class="text-[10px] text-slate-500">${esc(p.time)}</span></div>
    </div>`).join('');

  const batchHtml = snap.slaughterBatches.map((b) => `
    <div class="p-2.5 rounded-xl bg-slate-950/60 border border-sky-500/30 flex items-center justify-between text-xs">
      <div><span class="text-[10px] uppercase font-extrabold text-sky-400 block">Farm Slaughter Batch (${esc(b.id)})</span><span class="font-bold text-white">${b.count} × ${esc(b.categoryName)} (Live: ${b.liveKg}kg)</span></div>
      <div class="text-right"><span class="font-black text-sky-400">+${b.actualKg} kg Dressed</span><span class="text-[10px] text-slate-400 block">${b.wastePct}% Waste</span></div>
    </div>`).join('');

  $('cal-day-sales-list').innerHTML = (salesHtml + batchHtml) || `<div class="text-center py-6 text-xs text-slate-500">No transactions recorded on ${esc(selectedArchiveDate)}.</div>`;
}

function renderAnnualAnalytics() {
  renderCalendarDayInspector();
  const filterEl = $('annual-month-filter');
  if (!filterEl) return;
  const currentVal = filterEl.value || 'ALL';
  const yearOf = (m) => m.year || (String(m.month || '').match(/\d{4}/) || [''])[0];

  let sourceRows = [], colHeader = 'Period', headingText = 'Permanent Historical Sales & Financial Ledger';
  if (archiveGranularity === 'WEEKLY') {
    colHeader = 'Week & Date Range'; headingText = 'Weekly Sales, Dressed Volume & Receivables Breakdown';
    sourceRows = state.weeklyHistory.map((w) => ({ ...w, label: w.week, year: w.year || '' }));
  } else if (archiveGranularity === 'YEARLY') {
    colHeader = 'Calendar Year'; headingText = 'Multi-Year Annual Summary (Stored Permanently)';
    const groups = {};
    state.yearlyHistory.forEach((m) => {
      const yr = yearOf(m);
      if (!groups[yr]) groups[yr] = { label: `Year ${yr}`, year: yr, kgSold: 0, posCashSales: 0, subBulkSales: 0, receivables: 0, expenses: 0 };
      ['kgSold', 'posCashSales', 'subBulkSales', 'receivables', 'expenses'].forEach((k) => { groups[yr][k] += Number(m[k] || 0); });
    });
    sourceRows = Object.values(groups);
  } else {
    colHeader = 'Month & Year';
    headingText = archiveGranularity === 'LIFETIME' ? 'Complete All-Time Multi-Year Ledger' : 'Monthly Sales, Dressed Volume & Receivables Ledger';
    sourceRows = state.yearlyHistory.map((m) => ({ ...m, label: m.month, year: yearOf(m) }));
  }

  $('period-col-header').innerText = colHeader;
  $('period-table-heading').innerHTML = `<i class="fa-solid fa-chart-column text-yellow-400"></i> ${headingText}`;

  const years = [...new Set(sourceRows.map((r) => r.year))];
  filterEl.innerHTML = sourceRows.length
    ? `<option value="ALL">All Stored Records (${sourceRows.length} Periods)</option>` +
      years.map((y) => `<option value="YEAR-${y}">Filter Year: ${y}</option>`).join('') +
      sourceRows.map((r) => `<option value="${esc(r.label)}">${esc(r.label)}</option>`).join('')
    : '<option value="ALL">No historical periods</option>';
  filterEl.value = [...filterEl.options].some((o) => o.value === currentVal) ? currentVal : 'ALL';

  const f = filterEl.value;
  const rows = f === 'ALL' ? sourceRows : f.startsWith('YEAR-') ? sourceRows.filter((r) => r.year === f.replace('YEAR-', '')) : sourceRows.filter((r) => r.label === f);

  let sumGross = 0, sumCollected = 0, sumKg = 0;
  $('annual-monthly-tbody').innerHTML = rows.length === 0
    ? '<tr><td colspan="8" class="py-6 text-center text-sm text-slate-400">No historical sales or inventory records.</td></tr>'
    : rows.map((m) => {
    const totalSales = m.posCashSales + m.subBulkSales + m.receivables;
    sumGross += totalSales; sumCollected += m.posCashSales + m.subBulkSales; sumKg += m.kgSold;
    const net = totalSales - m.expenses;
    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-2.5 px-3 font-bold text-white">${esc(m.label)}</td>
        <td class="py-2.5 px-3 text-right font-semibold text-sky-400">${m.kgSold.toLocaleString()} kg</td>
        <td class="py-2.5 px-3 text-right text-slate-300">Rs. ${m.posCashSales.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-right text-slate-300">Rs. ${m.subBulkSales.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-right font-black text-yellow-400">Rs. ${totalSales.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-right font-bold text-red-400">Rs. ${m.receivables.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-right text-slate-400">Rs. ${m.expenses.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-right font-extrabold ${net >= 0 ? 'text-emerald-400">+' : 'text-red-400">-'} Rs. ${Math.abs(net).toLocaleString()}</td>
      </tr>`;
  }).join('');

  const pending = state.receivablesList.filter((r) => r.status === 'Pending');
  const pendingTotal = pending.reduce((s, r) => s + Number(r.amount || 0), 0);
  $('yr-kpi-sales').innerText = rows.length ? `Rs. ${sumGross.toLocaleString()}` : '—';
  $('yr-kpi-collected').innerText = rows.length ? `Rs. ${sumCollected.toLocaleString()}` : '—';
  $('yr-kpi-receivables').innerText = state.receivablesList.length ? `Rs. ${pendingTotal.toLocaleString()}` : '—';
  $('yr-kpi-rec-count').innerText = state.receivablesList.length ? `${pending.length} pending hotel/customer accounts` : 'No receivables recorded';
  $('yr-kpi-kg').innerText = rows.length ? `${sumKg.toLocaleString()} kg` : '—';
  const snapshotCount = Object.keys(state.dailyVault || {}).length;
  const periodCount = state.yearlyHistory.length + state.weeklyHistory.length;
  $('vault-record-counter').innerText = periodCount || snapshotCount
    ? `${state.yearlyHistory.length} Months • ${state.weeklyHistory.length} Weeks • ${snapshotCount} Daily Snapshots`
    : 'No archived records yet';

  $('receivables-tbody').innerHTML = state.receivablesList.length === 0
    ? '<tr><td colspan="7" class="py-6 text-center text-sm text-slate-400">No receivables recorded.</td></tr>'
    : state.receivablesList.map((r) => `
    <tr class="hover:bg-slate-800/40 transition">
      <td class="py-2.5 px-3"><span class="font-bold text-yellow-400">${esc(r.id)}</span><span class="text-xs text-slate-400 block">${esc(r.date)}</span></td>
      <td class="py-2.5 px-3 font-bold text-white">${esc(r.customer)}</td>
      <td class="py-2.5 px-3 text-xs text-slate-400">${esc(r.phone)}</td>
      <td class="py-2.5 px-3 text-xs text-slate-300">${esc(r.details)}</td>
      <td class="py-2.5 px-3 text-right font-black ${r.status === 'Pending' ? 'text-red-400' : 'text-emerald-400'}">Rs. ${r.amount.toLocaleString()}</td>
      <td class="py-2.5 px-3"><span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${r.status === 'Pending' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}">${esc(r.status)}</span></td>
      <td class="py-2.5 px-3 text-right">${r.status === 'Pending'
        ? `<button onclick="markReceivableCollected('${esc(r.id)}')" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3 py-1 rounded-lg text-xs transition">Mark Collected</button>`
        : `<span class="text-xs text-slate-500 font-semibold"><i class="fa-solid fa-check mr-1"></i>Settled</span>`}</td>
    </tr>`).join('');

  // printable statement
  $('ar-date').innerText = `${getTodayDate()} (Selected Calendar Date: ${selectedArchiveDate})`;
  $('ar-total-sales').innerText = rows.length ? `Rs. ${sumGross.toLocaleString()}` : '—';
  $('ar-total-collected').innerText = rows.length ? `Rs. ${sumCollected.toLocaleString()}` : '—';
  $('ar-total-receivables').innerText = state.receivablesList.length ? `Rs. ${pendingTotal.toLocaleString()}` : '—';
  $('ar-total-kg').innerText = rows.length ? `${sumKg.toLocaleString()} kg` : '—';
  $('ar-monthly-tbody').innerHTML = rows.length === 0
    ? '<tr><td colspan="7" class="py-4 text-center text-slate-500">No historical sales recorded.</td></tr>'
    : rows.map((m) => `
    <tr>
      <td class="py-1.5 px-2 border border-slate-300 font-bold">${esc(m.label)}</td>
      <td class="py-1.5 px-2 border border-slate-300 text-right">${m.kgSold.toLocaleString()} kg</td>
      <td class="py-1.5 px-2 border border-slate-300 text-right">Rs. ${m.posCashSales.toLocaleString()}</td>
      <td class="py-1.5 px-2 border border-slate-300 text-right">Rs. ${m.subBulkSales.toLocaleString()}</td>
      <td class="py-1.5 px-2 border border-slate-300 text-right font-bold">Rs. ${(m.posCashSales + m.subBulkSales + m.receivables).toLocaleString()}</td>
      <td class="py-1.5 px-2 border border-slate-300 text-right text-red-700 font-semibold">Rs. ${m.receivables.toLocaleString()}</td>
      <td class="py-1.5 px-2 border border-slate-300 text-right">Rs. ${m.expenses.toLocaleString()}</td>
    </tr>`).join('');

  const snap = getDaySnapshot(selectedArchiveDate);
  $('ar-day-snapshot-print').classList.remove('hidden');
  $('ar-day-snapshot-body').innerHTML = `
    <p class="text-[11px] font-bold">Calendar Date Inspected: ${esc(selectedArchiveDate)}</p>
    <table class="w-full text-left border-collapse border border-slate-300 text-[10px]">
      <thead><tr class="bg-slate-200 text-slate-800 uppercase">
        <th class="py-1 px-2 border border-slate-300">Meat Cut</th><th class="py-1 px-2 border border-slate-300 text-right">Opening (kg)</th>
        <th class="py-1 px-2 border border-slate-300 text-right">Slaughter In (kg)</th><th class="py-1 px-2 border border-slate-300 text-right">POS Sold (kg)</th>
        <th class="py-1 px-2 border border-slate-300 text-right">Closing Stock (kg)</th></tr></thead>
      <tbody>${snap.inventorySnapshot.map((r) => `
        <tr><td class="py-1 px-2 border border-slate-300 font-bold">${esc(r.name)}</td>
        <td class="py-1 px-2 border border-slate-300 text-right">${Number(r.openingKg).toFixed(2)}</td>
        <td class="py-1 px-2 border border-slate-300 text-right">+${Number(r.slaughterInKg).toFixed(2)}</td>
        <td class="py-1 px-2 border border-slate-300 text-right">-${Number(r.soldKg).toFixed(2)}</td>
        <td class="py-1 px-2 border border-slate-300 text-right font-bold">${Number(r.closingKg).toFixed(2)}</td></tr>`).join('')}</tbody>
    </table>`;

  $('ar-receivables-tbody').innerHTML = state.receivablesList.map((r) => `
    <tr>
      <td class="py-1.5 px-2 border border-slate-300 font-mono">${esc(r.id)} (${esc(r.date)})</td>
      <td class="py-1.5 px-2 border border-slate-300 font-bold">${esc(r.customer)}</td>
      <td class="py-1.5 px-2 border border-slate-300">${esc(r.phone)}</td>
      <td class="py-1.5 px-2 border border-slate-300">${esc(r.details)}</td>
      <td class="py-1.5 px-2 border border-slate-300 text-right font-bold">Rs. ${r.amount.toLocaleString()}</td>
      <td class="py-1.5 px-2 border border-slate-300 font-semibold">${esc(r.status)}</td>
    </tr>`).join('');
}

// ---------- MODULE 4: POS ----------
function selectPosProduct(id) {
  const item = state.inventory.find((entry) => entry.id === id);
  if (!item) return;
  selectedPosCategoryId = id;
  const unit = inventoryUnit(item);
  const isKg = unit === 'kg';
  $('pos-selected-label').innerText = `Selected: ${item.name} (Rs. ${inventoryPrice(item)} ${inventoryPriceLabel(item)})`;
  $('pos-quantity-title').innerText = isKg ? '2. Enter Scale Weight (kg) & Add to Bill' : '2. Enter Whole Quantity & Add to Bill';
  $('pos-kg-presets').classList.toggle('hidden', !isKg);
  $('pos-kg-control').classList.toggle('hidden', !isKg);
  $('pos-unit-control').classList.toggle('hidden', isKg);
  $('pos-weight-input').value = '';
  $('pos-quantity-input').value = '';
  if (!isKg) {
    $('pos-unit-quantity-label').innerText = unit === 'packet'
      ? `Quantity (whole ${inventoryUnitLabel(item)}s)` : 'Quantity (whole units)';
  }
  renderPosProducts();
  updatePosLinePreview();
}
function setPosWeight(kg) { $('pos-weight-input').value = kg; updatePosLinePreview(); }
function updatePosLinePreview() {
  if (!state) return;
  const item = state.inventory.find((i) => i.id === selectedPosCategoryId);
  if (!item) {
    $('pos-selected-label').innerText = 'No inventory item selected';
    $('pos-line-preview').innerText = '—';
    $('pos-unit-line-preview').innerText = '—';
    return;
  }
  if (inventoryUnit(item) === 'kg') {
    $('pos-line-preview').innerText = `Rs. ${Math.round((Number($('pos-weight-input').value) || 0) * inventoryPrice(item)).toLocaleString()}`;
  } else {
    $('pos-unit-line-preview').innerText = `Rs. ${Math.round((Number($('pos-quantity-input').value) || 0) * inventoryPrice(item)).toLocaleString()}`;
  }
}

function addItemToPosCart() {
  const item = state.inventory.find((i) => i.id === selectedPosCategoryId);
  if (!item) return showToast('Select an inventory product first.', 'error');
  const unit = inventoryUnit(item);
  const quantity = unit === 'kg' ? Number($('pos-weight-input').value) : Number($('pos-quantity-input').value);
  const wholeQuantity = unit !== 'kg';
  if (!Number.isFinite(quantity) || quantity <= 0 || (wholeQuantity && !Number.isInteger(quantity))) {
    return showToast(wholeQuantity ? 'Enter a positive whole packet/unit quantity.' : 'Please enter a valid weight (kg).', 'error');
  }
  const inCart = posCart.filter((cartItem) => cartItem.id === item.id)
    .reduce((sum, cartItem) => sum + cartItem.quantity, 0);
  if (quantity + inCart > inventoryStock(item)) {
    return showToast(`Not enough stock! Available: ${inventoryStockText(item, unit === 'kg' ? 2 : 0)}`, 'error');
  }

  const existing = posCart.find((c) => c.id === item.id);
  if (existing) {
    existing.quantity = unit === 'kg' ? +(existing.quantity + quantity).toFixed(2) : existing.quantity + quantity;
    existing.lineTotal = Math.round(existing.quantity * existing.unitPrice);
  } else {
    posCart.push({
      id: item.id, name: item.name, unitType: unit,
      quantity: unit === 'kg' ? +quantity.toFixed(2) : quantity,
      packWeightGrams: Number(item.packWeightGrams || 0),
      unitPrice: inventoryPrice(item), lineTotal: Math.round(quantity * inventoryPrice(item))
    });
  }
  renderPosCart();
  showToast(`Added ${quantity} ${inventoryUnitLabel(item)}${quantity === 1 ? '' : 's'} of ${item.name} to bill`, 'info');
}
function removePosCartItem(idx) { posCart.splice(idx, 1); renderPosCart(); }
function clearPosCart() { posCart = []; $('pos-discount').value = 0; renderPosCart(); }

function renderPosCart() {
  const listEl = $('pos-cart-list');
  listEl.innerHTML = posCart.length === 0
    ? `<div class="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">No items in bill yet. Search and select an item to add.</div>`
    : posCart.map((c, idx) => `
      <div class="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs">
        <div><p class="font-bold text-white">${esc(c.name)}</p><p class="text-slate-400">${c.quantity.toLocaleString()} ${esc(inventoryUnitLabel(c))}${c.quantity === 1 ? '' : 's'} × Rs. ${c.unitPrice.toLocaleString()} ${esc(inventoryPriceLabel(c))}</p></div>
        <div class="flex items-center gap-3">
          <span class="font-extrabold text-yellow-400 text-sm">Rs. ${c.lineTotal.toLocaleString()}</span>
          <button onclick="removePosCartItem(${idx})" class="text-slate-500 hover:text-red-400"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>`).join('');
  const subtotal = posCart.reduce((s, c) => s + c.lineTotal, 0);
  const totalKg = posCart.filter((c) => c.unitType === 'kg').reduce((s, c) => s + c.quantity, 0);
  const discount = Number($('pos-discount').value) || 0;
  $('pos-subtotal').innerText = `Rs. ${subtotal.toLocaleString()}`;
  $('pos-total-weight').innerText = `${totalKg.toFixed(2)} kg total dressed weight`;
  $('pos-grand-total').innerText = `Rs. ${Math.max(0, subtotal - discount).toLocaleString()}`;
}

function lookupPosCustomer() {
  const phone = $('pos-cust-phone').value.trim();
  const customer = phoneKey(phone).length >= 7
    ? state.customers.find((entry) => phoneKey(entry.phone) === phoneKey(phone))
    : null;
  const nameInput = $('pos-cust-name');
  const status = $('pos-customer-status');
  if (customer) {
    nameInput.value = customer.name;
    nameInput.readOnly = true;
    status.className = 'min-h-4 text-[11px] text-emerald-400 mb-2';
    status.innerText = `Loyalty customer • ${Number(customer.visitCount || 0)} previous visits • Rs. ${Number(customer.totalSpent || 0).toLocaleString()} spent`;
  } else {
    if (nameInput.readOnly) nameInput.value = '';
    nameInput.readOnly = false;
    status.className = 'min-h-4 text-[11px] text-slate-400 mb-2';
    status.innerText = phone ? 'New customer: enter their name to continue.' : 'Customer phone and name are required before printing the bill.';
  }
}

function completePosSale() {
  if (posCart.length === 0) return showToast('Please add at least one item to the bill.', 'error');
  const customerPhone = $('pos-cust-phone').value.trim();
  const customerPhoneKey = phoneKey(customerPhone);
  if (customerPhoneKey.length < 7 || customerPhoneKey.length > 15) return showToast('Enter a valid customer phone number before printing the bill.', 'error');
  let customerRecord = state.customers.find((entry) => phoneKey(entry.phone) === customerPhoneKey);
  const customer = customerRecord ? customerRecord.name : $('pos-cust-name').value.trim();
  if (!customer) return showToast('Enter the new customer name before printing the bill.', 'error');
  const payment = $('pos-pay-method').value;
  const discount = Math.max(0, Number($('pos-discount').value) || 0);
  const subtotal = posCart.reduce((s, c) => s + c.lineTotal, 0);
  const grandTotal = Math.max(0, subtotal - discount);
  const totalKg = posCart.filter((c) => c.unitType === 'kg').reduce((s, c) => s + c.quantity, 0);
  const receiptId = 'POS-' + Date.now().toString().slice(-7);
  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const itemsBreakdown = {};
  const itemsDetails = [];
  posCart.forEach((ci) => {
    const inv = state.inventory.find((i) => i.id === ci.id);
    if (inv && ci.unitType === 'kg') {
      inv.stockKg = Math.max(0, +(inv.stockKg - ci.quantity).toFixed(2));
      itemsBreakdown[ci.id] = (itemsBreakdown[ci.id] || 0) + ci.quantity;
    } else if (inv) inv.stockQuantity = Math.max(0, Number(inv.stockQuantity || 0) - ci.quantity);
    itemsDetails.push({
      id: ci.id, name: ci.name, unitType: ci.unitType, quantity: ci.quantity,
      unitLabel: inventoryUnitLabel(ci), unitPrice: ci.unitPrice,
      weightKg: ci.unitType === 'kg' ? ci.quantity : 0,
      packWeightGrams: ci.packWeightGrams, lineTotal: ci.lineTotal
    });
  });
  const itemsSummary = posCart.map((c) => `${c.name} (${c.quantity} ${inventoryUnitLabel(c)}${c.quantity === 1 ? '' : 's'})`).join(', ');

  if (!customerRecord) {
    customerRecord = { id: customerPhoneKey, name: customer, phone: customerPhone, visitCount: 0, totalSpent: 0, lastVisit: '' };
    state.customers.unshift(customerRecord);
  }
  customerRecord.visitCount = Number(customerRecord.visitCount || 0) + 1;
  customerRecord.totalSpent = Number(customerRecord.totalSpent || 0) + grandTotal;
  customerRecord.lastVisit = getTodayDate();
  state.posSales.unshift({
    id: receiptId, date: getTodayDate(), time: nowTime, customer, customerPhone,
    itemsSummary, itemsBreakdown, itemsDetails, totalKg: +totalKg.toFixed(2), payment, totalRs: grandTotal
  });

  [state.yearlyHistory[state.yearlyHistory.length - 1], state.weeklyHistory[state.weeklyHistory.length - 1]].forEach((p) => {
    if (!p) return;
    p.kgSold = +(Number(p.kgSold || 0) + totalKg).toFixed(2);
    if (payment === 'CREDIT') p.receivables = Number(p.receivables || 0) + grandTotal;
    else p.posCashSales = Number(p.posCashSales || 0) + grandTotal;
  });

  if (payment === 'CREDIT') {
    state.receivablesList.unshift({ id: receiptId, date: getTodayDate(), customer, phone: customerPhone, details: itemsSummary, amount: grandTotal, status: 'Pending' });
  }

  $('rc-id').innerText = `#${receiptId}`;
  $('rc-customer').innerText = customer;
  $('rc-phone').innerText = customerPhone;
  $('rc-date').innerText = `${getTodayDate()} ${nowTime}`;
  $('rc-payment').innerText = payment;
  $('rc-items').innerHTML = posCart.map((c) => `
    <div class="grid grid-cols-12"><span class="col-span-6 truncate">${esc(c.name)}</span><span class="col-span-2 text-right">${c.quantity.toLocaleString()} ${esc(inventoryUnitLabel(c))}</span><span class="col-span-4 text-right">Rs.${c.lineTotal.toLocaleString()}</span></div>`).join('');
  $('rc-subtotal').innerText = `Rs. ${subtotal.toLocaleString()}`;
  $('rc-discount').innerText = `- Rs. ${discount.toLocaleString()}`;
  $('rc-total').innerText = `Rs. ${grandTotal.toLocaleString()}`;

  posCart = [];
  $('pos-cust-phone').value = '';
  $('pos-cust-name').value = '';
  $('pos-cust-name').readOnly = false;
  $('pos-customer-status').innerText = '';
  $('pos-discount').value = 0;
  saveState();
  $('receipt-modal').classList.remove('hidden');
  showToast(`Sale ${receiptId} completed! Inventory updated & receipt ready.`, 'success');
}
function closeReceiptModal() { $('receipt-modal').classList.add('hidden'); }

// ---------- MODULE 5 & 6: attendance, wall QR, payroll ----------
function openWallQrModal() {
  const checkInUrl = `${window.location.href.split('?')[0].split('#')[0]}?qr=wall-checkin`;
  const qrImg = $('wall-qr-image');
  qrImg.style.display = 'block';
  $('wall-qr-fallback').classList.add('hidden');
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(checkInUrl)}`;
  $('wall-qr-modal').classList.remove('hidden');
}
function closeWallQrModal() { $('wall-qr-modal').classList.add('hidden'); }

async function openMobileQrPortal() {
  closeWallQrModal();
  try {
    qrRoster = await Api.roster();
  } catch (err) {
    return showToast(err.message, 'error');
  }
  $('mob-qr-emp-select').innerHTML = qrRoster.map((e) =>
    `<option value="${e.id}">${esc(e.name)} — ${esc(e.role)} (${e.clockedIn ? 'Currently Signed In' : 'Signed Out'})</option>`).join('');
  $('mob-qr-live-time').innerText = `${getTodayDate()} • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  $('mob-qr-pin-input').value = '';
  updateMobileQrEmpStatus();
  $('mobile-qr-modal').classList.remove('hidden');
}

function closeMobileQrPortal() {
  $('mobile-qr-modal').classList.add('hidden');
  if (!currentUser) openLoginModal();
}

function updateMobileQrEmpStatus() {
  const emp = qrRoster.find((e) => e.id === Number($('mob-qr-emp-select').value));
  if (!emp) return;
  const statusEl = $('mob-qr-cur-status'), btnEl = $('mob-qr-submit-btn');
  const base = 'w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2';
  if (emp.clockedIn) {
    statusEl.className = 'text-emerald-400 font-black';
    statusEl.innerText = `ON SHIFT (Signed in at ${emp.lastClockIn})`;
    btnEl.className = `${base} bg-amber-500 hover:bg-amber-400 text-slate-950`;
    btnEl.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Scan Complete — Tap to Sign Out';
  } else {
    statusEl.className = 'text-slate-400 font-bold';
    statusEl.innerText = 'Currently Signed Out';
    btnEl.className = `${base} bg-emerald-500 hover:bg-emerald-400 text-slate-950`;
    btnEl.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Scan Complete — Tap to Sign In';
  }
}

async function submitMobileQrClock() {
  const empId = Number($('mob-qr-emp-select').value);
  const pin = $('mob-qr-pin-input').value.trim();
  if (!/^\d{4}$/.test(pin)) return showToast('Enter your 4-digit PIN.', 'error');
  try {
    const res = await Api.qrClock(empId, pin);
    showToast(res.message, res.action === 'IN' ? 'success' : 'info');
    $('mobile-qr-modal').classList.add('hidden');
    if (currentUser) { await flushNow(); await pullFromServer(); } else openLoginModal();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openStaffProfileModal() {
  $('staff-profile-modal').classList.remove('hidden');
  $('staff-profile-current-phone').value = '';
  $('staff-profile-current-password').value = '';
  $('staff-profile-name').value = '';
  $('staff-profile-phone').value = '';
  $('staff-profile-new-password').value = '';
  $('staff-profile-confirm-password').value = '';
}

function closeStaffProfileModal() {
  $('staff-profile-modal').classList.add('hidden');
}

async function saveStaffProfile() {
  const currentPhone = $('staff-profile-current-phone').value.trim();
  const currentPassword = $('staff-profile-current-password').value;
  const name = $('staff-profile-name').value.trim();
  const phone = $('staff-profile-phone').value.trim();
  const newPassword = $('staff-profile-new-password').value;
  const confirmPassword = $('staff-profile-confirm-password').value;
  if (!currentPhone || !currentPassword || !name || !phone) {
    return showToast('Enter your current sign-in details, name, and phone number.', 'error');
  }
  if (newPassword !== confirmPassword) return showToast('New passwords do not match.', 'error');
  if (newPassword && newPassword.length < 8) return showToast('New password must be at least 8 characters.', 'error');

  const button = $('staff-profile-save');
  button.disabled = true;
  button.innerText = 'Saving…';
  try {
    const login = await Api.login(currentPhone, currentPassword);
    await Api.updateStaffProfile({ name, phone, currentPassword, newPassword }, login.token);
    closeStaffProfileModal();
    showToast('Your staff details were updated.', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    button.disabled = false;
    button.innerText = 'Save my details';
  }
}

async function toggleClock(empId) {
  try {
    const res = await Api.kioskClock(empId);
    showToast(res.message, res.action === 'IN' ? 'success' : 'info');
    await flushNow();
    await pullFromServer();
  } catch (err) { showToast(err.message, 'error'); }
}

function toggleManualLogForm() { $('manual-log-form').classList.toggle('hidden'); }

function saveManualAttendance() {
  const hours = Number($('man-hours').value);
  const signIn = $('man-in').value.trim();
  const signOut = $('man-out').value.trim();
  if (!$('man-emp').value || !signIn || !signOut || !Number.isFinite(hours) || hours <= 0) {
    return showToast('Select an employee and enter sign-in, sign-out, and valid hours.', 'error');
  }
  state.attendanceLogs.unshift({
    id: Date.now(), empId: Number($('man-emp').value), date: $('man-date').value || getTodayDate(),
    signIn, signOut,
    hours, ot: Math.max(0, hours - 8)
  });
  $('manual-log-form').classList.add('hidden');
  saveState();
  showToast('Manual shift & overtime logged!', 'success');
}

function openAddEmployeeModal() { $('add-emp-modal').classList.toggle('hidden'); }

async function archiveStaff(employeeId) {
  const employee = state.employees.find((entry) => entry.id === employeeId);
  if (!employee || !confirm(`Archive ${employee.name}? Their account will be disabled, but their attendance and payroll history will be kept.`)) return;
  try {
    const result = await Api.archiveStaff(employeeId);
    employee.archivedAt = result.employee.archivedAt;
    renderAll();
    showToast(`${employee.name} archived. Their reports remain available.`, 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function restoreStaff(employeeId) {
  const employee = state.employees.find((entry) => entry.id === employeeId);
  if (!employee) return;
  try {
    await Api.restoreStaff(employeeId);
    delete employee.archivedAt;
    renderAll();
    showToast(`${employee.name} restored and can sign in again.`, 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function createExistingStaffAccount() {
  const employeeId = Number($('existing-staff-account-employee').value);
  const phone = $('existing-staff-account-phone').value.trim();
  const password = $('existing-staff-account-password').value;
  if (!employeeId || !phone || !password) return showToast('Select a staff member and enter their phone number and password.', 'error');
  if (password.length < 8) return showToast('Staff password must be at least 8 characters.', 'error');
  try {
    await Api.createStaffAccount(employeeId, phone, password);
    const employee = state.employees.find((entry) => entry.id === employeeId);
    if (employee) employee.phone = phone;
    $('existing-staff-account-phone').value = '';
    $('existing-staff-account-password').value = '';
    saveState();
    showToast('Staff login created. They can now sign in with their phone and password.', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function saveNewEmployee() {
  const name = $('new-emp-name').value.trim();
  const phone = $('new-emp-phone').value.trim();
  const password = $('new-emp-password').value;
  if (!name || !phone || !password) return showToast('Enter the employee name, phone number, and password.', 'error');
  if (password.length < 8) return showToast('Staff password must be at least 8 characters.', 'error');
  const pin = String(Math.floor(1000 + Math.random() * 9000));
  const employee = {
    id: Date.now(), name, role: $('new-emp-role').value, pin,
    phone,
    baseSalary: Number($('new-emp-base').value) || 48000, otRate: Number($('new-emp-otrate').value) || 350,
    allowance: Number($('new-emp-allowance').value) || 6000, advance: 0, clockedIn: false, lastClockIn: null
  };
  try {
    await Api.createStaff(employee, phone, password);
    state.employees.push(employee);
    ['new-emp-name', 'new-emp-phone', 'new-emp-password', 'new-emp-base', 'new-emp-otrate', 'new-emp-allowance']
      .forEach((id) => { $(id).value = ''; });
    $('add-emp-modal').classList.add('hidden');
    saveState();
    showToast(`${name} added. Staff can sign in with their phone and password; QR attendance PIN: ${pin}.`, 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function updatePayrollField(empId, field, value) {
  const emp = state.employees.find((e) => e.id === empId);
  if (!emp) return;
  emp[field] = Number(value) || 0;
  saveState();
  showToast(`Updated ${emp.name}'s ${field}`, 'info');
}

// Payroll uses the current calendar month's attendance only
const monthLogs = (empId) => {
  const prefix = getTodayDate().slice(0, 7);
  return state.attendanceLogs.filter((l) => l.empId === empId && String(l.date).startsWith(prefix));
};
const payrollOf = (emp) => {
  const logs = monthLogs(emp.id);
  const totalOt = logs.reduce((s, l) => s + Number(l.ot || 0), 0);
  const otPay = Math.round(totalOt * emp.otRate);
  return { logs, totalOt, otPay, netPay: emp.baseSalary + otPay + emp.allowance - emp.advance };
};

function openPayslipModal(empId) {
  const emp = state.employees.find((e) => e.id === empId);
  if (!emp) return;
  const p = payrollOf(emp);
  $('ps-month').innerText = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  $('ps-name').innerText = emp.name;
  $('ps-role').innerText = emp.role;
  $('ps-shifts').innerText = `${p.logs.length} Shifts`;
  $('ps-ot-hours').innerText = `${p.totalOt.toFixed(1)} hrs`;
  $('ps-base').innerText = `Rs. ${emp.baseSalary.toLocaleString()}`;
  $('ps-ot-rate').innerText = `(${p.totalOt.toFixed(1)} hrs × Rs. ${emp.otRate})`;
  $('ps-ot-pay').innerText = `+ Rs. ${p.otPay.toLocaleString()}`;
  $('ps-allowance').innerText = `+ Rs. ${emp.allowance.toLocaleString()}`;
  $('ps-advance').innerText = `- Rs. ${emp.advance.toLocaleString()}`;
  $('ps-net').innerText = `Rs. ${p.netPay.toLocaleString()}`;
  $('ps-date').innerText = `Date: ${getTodayDate()}`;
  $('payslip-modal').classList.remove('hidden');
}
function closePayslipModal() { $('payslip-modal').classList.add('hidden'); }

function printSection(elementId) {
  ['receipt-print-area', 'payslip-print-area', 'annual-print-area', 'wall-qr-print-area'].forEach((id) => $(id).classList.remove('printable-active'));
  $(elementId).classList.add('printable-active');
  window.print();
}

// ---------- MODULE 7: deliveries & subscriptions ----------
function addDelivery() {
  const customer = $('del-customer').value.trim();
  const items = $('del-items').value.trim();
  if (!customer || !items) return showToast('Please enter customer and meat order details.', 'error');
  const riders = state.employees.filter((e) => /rider/i.test(e.role));
  state.deliveries.unshift({
    id: Date.now(), customer, phone: $('del-phone').value.trim(), area: $('del-area').value.trim(),
    items, date: getTomorrowDate(), slot: $('del-slot').value, rider: (riders[0] || state.employees[0] || { name: '-' }).name, status: 'Scheduled for Tomorrow'
  });
  ['del-customer', 'del-phone', 'del-area', 'del-items'].forEach((id) => { $(id).value = ''; });
  saveState();
  showToast(`Scheduled next-day delivery for ${customer}`, 'success');
}

function updateDeliveryStatus(id, status) {
  const d = state.deliveries.find((x) => x.id === id);
  if (d) { d.status = status; saveState(); showToast(`Delivery status updated to "${status}"`, 'info'); }
}
function updateDeliveryRider(id, rider) {
  const d = state.deliveries.find((x) => x.id === id);
  if (d) { d.rider = rider; saveState(); showToast(`Assigned ${rider} to delivery.`, 'info'); }
}

function sendWhatsAppUpdate(id) {
  const d = state.deliveries.find((x) => x.id === id);
  if (!d) return;
  const phone = (d.phone || '').replace(/\D/g, '').replace(/^0/, '94');
  const msg = `Assalamu Alaikum ${d.customer}, your Raihan Farm Shop fresh meat order (${d.items}) for ${d.date} [${d.slot}] is currently "${d.status}". Rider: ${d.rider}. Thank you!`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  showToast(`WhatsApp alert opened for ${d.customer}`, 'success');
}

function addSubscription() {
  const customer = $('sub-customer').value.trim();
  const pack = $('sub-pack').value.trim();
  const price = Number($('sub-price').value);
  if (!customer || !pack || $('sub-price').value === '' || !Number.isFinite(price) || price < 0) {
    return showToast('Enter subscriber name, pack details, and a valid monthly price.', 'error');
  }
  state.subscriptions.push({
    id: Date.now(), customer, phone: $('sub-phone').value.trim(), area: $('sub-area').value.trim(),
    pack, day: $('sub-day').value, price, status: 'Active'
  });
  ['sub-customer', 'sub-phone', 'sub-area', 'sub-pack', 'sub-price'].forEach((id) => { $(id).value = ''; });
  saveState();
  showToast(`Weekly subscription registered for ${customer}!`, 'success');
}

function pushSubToTomorrow(subId) {
  const sub = state.subscriptions.find((s) => s.id === subId);
  if (!sub) return;
  const riders = state.employees.filter((e) => /rider/i.test(e.role));
  state.deliveries.unshift({
    id: Date.now(), customer: `${sub.customer} (Weekly Sub)`, phone: sub.phone, area: sub.area, items: sub.pack,
    date: getTomorrowDate(), slot: 'Morning (07:00 AM - 10:00 AM)', rider: (riders[0] || state.employees[0] || { name: '-' }).name, status: 'Scheduled for Tomorrow'
  });
  saveState();
  showToast(`${sub.customer}'s weekly box added to tomorrow's dispatch!`, 'success');
}

function ensureCoaState() {
  if (!state) return;
  if (!Array.isArray(state.coa)) {
    state.coa = [
      { code: '1010', name: 'Cash Register', type: 'Asset' },
      { code: '1020', name: 'Bank Account', type: 'Asset' },
      { code: '1030', name: 'Dressed Inventory Stock', type: 'Asset' },
      { code: '5010', name: 'Farm Purchases', type: 'Expense' },
      { code: '5040', name: 'Staff Salaries & Overtime', type: 'Expense' }
    ];
  }
  if (!Array.isArray(state.coaLedger)) state.coaLedger = [];
}

function renderCOA() {
  if (!state) return;
  ensureCoaState();

  const summaryList = $('coa-summary-list');
  const ledgerBody = $('coa-ledger-tbody');
  if (!summaryList || !ledgerBody) return;

  summaryList.innerHTML = state.coa.map((acct) => {
    const total = state.coaLedger
      .filter((entry) => String(entry.accountCode || entry.code || '') === String(acct.code))
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    return `
      <div class="flex justify-between items-center bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2.5">
        <div>
          <p class="font-black text-white">${esc(acct.code)}</p>
          <p class="text-[11px] text-slate-400">${esc(acct.name)}</p>
        </div>
        <span class="text-xs font-extrabold ${acct.type === 'Expense' ? 'text-amber-400' : 'text-emerald-400'}">Rs. ${total.toLocaleString()}</span>
      </div>`;
  }).join('') || '<p class="text-xs text-slate-500">No accounts configured yet.</p>';

  ledgerBody.innerHTML = state.coaLedger.length === 0
    ? '<tr><td colspan="4" class="py-5 text-center text-slate-500">No expense vouchers recorded yet.</td></tr>'
    : state.coaLedger.map((entry) => {
      const account = state.coa.find((acct) => String(acct.code) === String(entry.accountCode || entry.code));
      const name = account ? `${account.code} • ${account.name}` : `${entry.accountCode || entry.code || '—'}`;
      return `
        <tr>
          <td class="py-2.5 px-3 text-slate-300">${esc(entry.date || getTodayDate())}</td>
          <td class="py-2.5 px-3 font-bold text-white">${esc(name)}</td>
          <td class="py-2.5 px-3 text-slate-300">${esc(entry.description || 'Expense voucher')}</td>
          <td class="py-2.5 px-3 text-right font-black text-amber-400">Rs. ${Number(entry.amount || 0).toLocaleString()}</td>
        </tr>`;
    }).join('');
}

function openExpenseModal() {
  ensureCoaState();
  const select = $('expense-account');
  if (!select) return;
  select.innerHTML = state.coa.map((acct) => `<option value="${esc(acct.code)}">${esc(acct.code)} • ${esc(acct.name)}</option>`).join('');
  const dateInput = $('expense-date');
  if (dateInput && !dateInput.value) dateInput.value = getTodayDate();
  $('expense-voucher-modal').classList.remove('hidden');
}

function saveExpenseVoucher() {
  if (!state) return;
  ensureCoaState();
  const accountCode = $('expense-account').value;
  const amount = Number($('expense-amount').value || 0);
  const description = $('expense-description').value.trim();
  const date = $('expense-date').value || getTodayDate();

  if (!accountCode || !Number.isFinite(amount) || amount <= 0 || !description) {
    showToast('Select an account, add a valid amount and description before saving.', 'error');
    return;
  }

  if (!state.coaLedger) state.coaLedger = [];
  state.coaLedger.unshift({
    accountCode,
    description,
    amount,
    date,
    createdAt: new Date().toISOString()
  });

  $('expense-voucher-modal').classList.add('hidden');
  $('expense-description').value = '';
  $('expense-amount').value = '';
  saveState();
  showToast('Expense voucher added to the chart of accounts.', 'success');
}

// ---------- RENDERING ----------
function renderPosProducts() {
  const query = ($('pos-product-search')?.value || '').trim().toLocaleLowerCase();
  const items = state.inventory.filter((item) => !query || item.name.toLocaleLowerCase().startsWith(query))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  $('pos-product-grid').innerHTML = state.inventory.length === 0
    ? '<div class="col-span-full rounded-xl border border-dashed border-slate-700 p-5 text-center text-sm text-slate-400">No inventory items yet. Add stock before creating a sale.</div>'
    : items.length === 0
      ? '<div class="col-span-full rounded-xl border border-dashed border-slate-700 p-5 text-center text-sm text-slate-400">No products start with that search text.</div>'
      : items.map((item) => {
    const sel = item.id === selectedPosCategoryId, low = inventoryStock(item) <= inventoryMinStock(item);
    return `
      <button type="button" onclick="selectPosProduct('${esc(item.id)}')" class="text-left cursor-pointer p-4 rounded-xl border transition flex flex-col justify-between ${sel ? 'bg-yellow-400/15 border-yellow-400 shadow-lg shadow-yellow-400/10' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'}">
        <div class="flex justify-between items-start gap-2">
          <div><span class="text-[10px] uppercase font-bold text-yellow-400">${esc(item.source)}</span><h4 class="font-extrabold text-sm text-white mt-0.5">${esc(item.name)}</h4></div>
          <span class="px-2 py-0.5 rounded text-[11px] font-bold ${low ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}">${inventoryStockText(item, inventoryUnit(item) === 'kg' ? 1 : 0)} left</span>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-800/80 flex justify-between items-center"><span class="text-xs text-slate-400">Retail Rate:</span><span class="text-sm font-black text-yellow-400">Rs. ${inventoryPrice(item).toLocaleString()} ${inventoryPriceLabel(item)}</span></div>
      </button>`;
  }).join('');
}

function renderInventoryCards() {
  if (!state) return;
  const isAdmin = currentUser && currentUser.role === 'admin';
  const query = ($('inventory-search')?.value || '').trim().toLocaleLowerCase();
  const items = state.inventory.filter((item) => !query || item.name.toLocaleLowerCase().startsWith(query))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  $('inventory-cards-container').innerHTML = state.inventory.length === 0
    ? '<div class="md:col-span-2 rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">No inventory items have been added yet.</div>'
    : items.length === 0
      ? '<div class="md:col-span-2 rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">No inventory items start with that search text.</div>'
      : items.map((item) => {
    const locked = !isAdmin && (item.staffEditCount || 0) >= 1;
    const unit = inventoryUnit(item), priceLabel = inventoryPriceLabel(item);
    const stockStep = unit === 'kg' ? '0.1' : '1';
    const stockLabel = unit === 'kg' ? 'Stock Weight Audit (kg)' : `Stock Quantity Audit (${inventoryUnitLabel(item)}${unit === 'packet' || unit === 'unit' ? 's' : ''})`;
    return `
      <div class="card p-5 flex flex-col justify-between space-y-4 border ${locked ? 'border-amber-500/40' : 'border-slate-800'}">
        <div class="flex justify-between items-start gap-2">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-bold uppercase text-yellow-400">${esc(item.source)}</span>
              <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">${esc(inventoryUnitLabel(item))}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isAdmin ? 'bg-yellow-400/20 text-yellow-300' : locked ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}">${isAdmin ? 'Admin: Unlimited Edits' : locked ? 'Locked (1/1 Staff Edit Used)' : 'Staff: 1 Direct Edit Available'}</span>
            </div>
            <h3 class="text-lg font-black text-white mt-1">${esc(item.name)}</h3>
          </div>
          <div class="text-right"><span class="text-xs text-slate-400 block">Available Stock</span><span class="text-2xl font-black text-emerald-400">${inventoryStockText(item, unit === 'kg' ? 2 : 0)}</span></div>
        </div>
        ${isAdmin ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
          <div><label class="block text-xs text-slate-400 mb-1">Item Name</label><input type="text" id="inv-name-${esc(item.id)}" value="${esc(item.name)}" class="w-full px-3 py-2 rounded-lg text-sm font-bold"></div>
          <div><label class="block text-xs text-slate-400 mb-1">Farm / Supplier Source</label><input type="text" id="inv-source-${esc(item.id)}" value="${esc(item.source)}" class="w-full px-3 py-2 rounded-lg text-sm font-bold"></div>
          <div class="sm:col-span-2"><label class="block text-xs text-slate-400 mb-1">Wholesale Price ${esc(priceLabel)} (Rs.)</label><input type="number" min="0" step="0.01" id="inv-wholesale-${esc(item.id)}" value="${Number(item.wholesalePrice || 0)}" class="w-full px-3 py-2 rounded-lg text-sm font-bold"></div>
        </div>` : ''}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
          <div><label class="block text-xs text-slate-400 mb-1">Retail Price ${esc(priceLabel)} (Rs.)</label><input type="number" min="0" step="0.01" id="inv-price-${esc(item.id)}" value="${inventoryPrice(item)}" class="w-full px-3 py-2 rounded-lg text-sm font-bold"></div>
          <div><label class="block text-xs text-slate-400 mb-1">${esc(stockLabel)}</label><input type="number" min="0" step="${stockStep}" id="inv-stock-${esc(item.id)}" value="${inventoryStock(item)}" class="w-full px-3 py-2 rounded-lg text-sm font-bold"></div>
        </div>
        ${locked ? `
        <div class="space-y-2 bg-slate-900/90 p-3 rounded-xl border border-amber-500/30">
          <label class="block text-[11px] text-amber-300 font-bold"><i class="fa-solid fa-lock mr-1"></i> You already edited this item once. Enter reason to request Admin Approval:</label>
          <input type="text" id="inv-reason-${esc(item.id)}" placeholder="Reason for additional adjustment" class="w-full px-3 py-2 rounded-lg text-xs">
        </div>` : ''}
        <div class="flex justify-end">
          <button onclick="submitInventoryEdit('${esc(item.id)}')" class="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${locked ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-yellow-400 hover:bg-yellow-300 text-slate-950'}">
            <i class="fa-solid ${locked ? 'fa-paper-plane' : 'fa-floppy-disk'} mr-1"></i> ${isAdmin ? 'Save Inventory Update' : locked ? 'Request Admin Approval' : 'Apply 1-Time Staff Edit'}
          </button>
        </div>
      </div>`;
  }).join('');
}

function renderSlaughterProducts() {
  const select = $('sl-category');
  const selectedValue = select.value;
  const meatItems = state.inventory.filter((item) => inventoryUnit(item) === 'kg');
  select.innerHTML = meatItems.length
    ? meatItems.map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`).join('')
    : '<option value="">Add kg-based meat inventory first</option>';
  if (meatItems.some((item) => item.id === selectedValue)) select.value = selectedValue;
}

function renderAll() {
  if (!state) return;
  const isAdmin = currentUser && currentUser.role === 'admin';
  const activeEmployees = state.employees.filter((employee) => !employee.archivedAt);
  const archivedEmployees = state.employees.filter((employee) => employee.archivedAt);
  const manDate = $('man-date');
  if (manDate && !manDate.value) manDate.value = getTodayDate();

  // KPIs
  const todays = todaysPosSales();
  const meatInventory = state.inventory.filter((item) => inventoryUnit(item) === 'kg');
  $('kpi-stock').innerText = meatInventory.length
    ? `${meatInventory.reduce((s, i) => s + Number(i.stockKg || 0), 0).toFixed(1)} kg`
    : '—';
  $('kpi-pos-sales').innerText = todays.length
    ? `Rs. ${todays.reduce((s, p) => s + Number(p.totalRs || 0), 0).toLocaleString()}`
    : '—';
  $('kpi-pos-count').innerText = todays.length ? `${todays.length} counter bills today` : 'No sales recorded today';
  const avgWaste = state.slaughterBatches.length
    ? state.slaughterBatches.reduce((s, b) => s + Number(b.wastePct || 0), 0) / state.slaughterBatches.length
    : null;
  $('kpi-waste-pct').innerText = avgWaste === null ? '—' : `${avgWaste.toFixed(1)}%`;
  $('kpi-waste-sub').innerText = state.slaughterBatches.length
    ? `${state.slaughterBatches.length} farm batches processed`
    : 'No slaughter batches recorded';
  $('kpi-staff').innerText = activeEmployees.length
    ? `${activeEmployees.filter((e) => e.clockedIn).length} / ${activeEmployees.length}`
    : '—';
  let totalPayroll = 0, totalShopOt = 0;
  activeEmployees.forEach((emp) => { const p = payrollOf(emp); totalShopOt += p.totalOt; totalPayroll += p.netPay; });
  $('kpi-payroll-mini').innerText = activeEmployees.length ? `Month Payroll: Rs. ${totalPayroll.toLocaleString()}` : 'No payroll records';
  $('dash-ot-summary').innerText = state.attendanceLogs.length ? `Total OT: ${totalShopOt.toFixed(1)} hrs` : '';
  $('kpi-deliveries').innerText = state.deliveries.length ? `${state.deliveries.length} Orders` : '—';
  $('kpi-subs-mini').innerText = state.subscriptions.length ? `${state.subscriptions.length} weekly box subscribers` : 'No subscriptions recorded';

  // Dashboard strips
  $('dash-inventory-grid').innerHTML = state.inventory.length === 0
    ? '<div class="col-span-full rounded-xl border border-dashed border-slate-700 p-5 text-center text-sm text-slate-400">No stock has been recorded yet.</div>'
    : state.inventory.map((item) => {
    const low = inventoryStock(item) <= inventoryMinStock(item);
    return `
      <div class="p-3.5 rounded-xl bg-slate-900/90 border ${low ? 'border-red-500/50' : 'border-slate-800'} flex flex-col justify-between">
        <div class="flex justify-between items-start"><span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-yellow-400/15 text-yellow-400">${esc(item.source)}</span><span class="text-xs font-bold ${low ? 'text-red-400' : 'text-emerald-400'}">${low ? 'Low Stock' : 'In Chiller'}</span></div>
        <h4 class="font-bold text-sm text-white mt-2">${esc(item.name)}</h4>
        <div class="mt-2 pt-2 border-t border-slate-800 flex justify-between items-baseline"><span class="text-xl font-black text-yellow-400">${inventoryStockText(item, inventoryUnit(item) === 'kg' ? 1 : 0)}</span></div>
      </div>`;
  }).join('');

  $('dash-slaughter-list').innerHTML = state.slaughterBatches.length === 0
    ? '<div class="rounded-xl border border-dashed border-slate-700 p-4 text-center text-xs text-slate-400">No slaughter batches recorded yet.</div>'
    : state.slaughterBatches.slice(0, 3).map((b) => `
    <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
      <div><p class="font-bold text-white">${b.count} × ${esc(b.categoryName)}</p><p class="text-slate-400">Live: ${b.liveKg}kg &rarr; <strong class="text-emerald-400">Dressed: ${b.actualKg}kg</strong></p></div>
      <span class="px-2 py-1 rounded-lg font-bold ${b.wastePct <= 31 ? 'bg-yellow-400/15 text-yellow-400' : 'bg-red-500/20 text-red-400'}">${b.wastePct}% Waste</span>
    </div>`).join('');

  $('dash-attendance-list').innerHTML = activeEmployees.length === 0
    ? '<div class="rounded-xl border border-dashed border-slate-700 p-4 text-center text-xs text-slate-400">No staff records yet.</div>'
    : activeEmployees.slice(0, 4).map((e) => `
    <div class="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
      <div><p class="font-bold text-white">${esc(e.name)}</p><p class="text-slate-400 text-[11px]">${esc(e.role)}</p></div>
      <span class="px-2.5 py-1 rounded-full font-bold ${e.clockedIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}">${e.clockedIn ? 'In (' + esc(e.lastClockIn) + ')' : 'Signed Out'}</span>
    </div>`).join('');

  $('dash-delivery-list').innerHTML = state.deliveries.length === 0
    ? '<div class="rounded-xl border border-dashed border-slate-700 p-4 text-center text-xs text-slate-400">No delivery records yet.</div>'
    : state.deliveries.slice(0, 3).map((d) => `
    <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs flex justify-between items-center gap-2">
      <div><p class="font-bold text-yellow-400">${esc(d.items)}</p><p class="text-slate-400">${esc(d.customer)} • ${esc(d.area)}</p></div>
      <span class="px-2 py-1 rounded bg-slate-800 text-slate-300 font-semibold shrink-0">${esc(d.status)}</span>
    </div>`).join('');

  // Slaughter table
  $('slaughter-tbody').innerHTML = state.slaughterBatches.length === 0
    ? '<tr><td colspan="9" class="py-6 text-center text-sm text-slate-400">No slaughter records yet.</td></tr>'
    : state.slaughterBatches.map((b) => {
    const optimal = b.wastePct <= 31;
    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-3 px-3"><div class="font-bold text-yellow-400">${esc(b.id)}</div><div class="text-xs text-slate-400">${esc(b.date)}</div></td>
        <td class="py-3 px-3"><div class="font-bold text-white">${esc(b.categoryName)}</div><div class="text-xs text-slate-400">${esc(b.source)}</div></td>
        <td class="py-3 px-3 font-bold">${b.count} Head</td>
        <td class="py-3 px-3 font-semibold">${Number(b.liveKg).toFixed(1)} kg</td>
        <td class="py-3 px-3 text-slate-400">${Number(b.expectedKg).toFixed(1)} kg</td>
        <td class="py-3 px-3 font-black text-emerald-400">+${Number(b.actualKg).toFixed(1)} kg</td>
        <td class="py-3 px-3"><span class="font-bold text-red-400">${Number(b.wasteKg).toFixed(1)} kg</span><span class="text-xs text-slate-400 block">(${Number(b.wastePct).toFixed(1)}% waste)</span></td>
        <td class="py-3 px-3"><span class="px-2.5 py-1 rounded-full text-xs font-bold ${optimal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">${optimal ? 'Optimal Yield (~30%)' : 'High Waste Alert'}</span></td>
        ${isAdmin ? `<td class="py-3 px-3"><button onclick="openSlaughterEdit('${esc(b.id)}')" class="bg-slate-800 hover:bg-yellow-400 hover:text-slate-950 text-yellow-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition"><i class="fa-solid fa-pen-to-square mr-1"></i>Edit</button></td>` : ''}
      </tr>`;
  }).join('');

  // Approval queue
  const pendingList = state.pendingInventoryApprovals.filter((r) => r.status === 'Pending');
  const badge = $('nav-approval-badge');
  if (pendingList.length > 0 && isAdmin) { badge.classList.remove('hidden'); badge.innerText = pendingList.length; } else badge.classList.add('hidden');
  const lowStockCount = state.inventory.filter((item) => inventoryStock(item) <= inventoryMinStock(item)).length;
  const lowStockBadge = $('nav-low-stock-badge');
  if (lowStockCount > 0 && isAdmin) {
    lowStockBadge.classList.remove('hidden');
    lowStockBadge.innerText = lowStockCount;
    lowStockBadge.setAttribute('aria-label', `${lowStockCount} low-stock alerts`);
  } else {
    lowStockBadge.classList.add('hidden');
    lowStockBadge.removeAttribute('aria-label');
  }

  $('admin-approval-list').innerHTML = state.pendingInventoryApprovals.length === 0
    ? `<div class="text-xs text-slate-400 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">No staff inventory edit requests pending approval.</div>`
    : state.pendingInventoryApprovals.map((req) => {
      const item = state.inventory.find((entry) => entry.id === req.itemId);
      const unitLabel = item ? inventoryUnitLabel(item) : 'kg';
      const priceLabel = item ? inventoryPriceLabel(item) : 'per kg';
      return `
      <div class="p-3.5 rounded-xl bg-slate-900/90 border ${req.status === 'Pending' ? 'border-yellow-400/50' : 'border-slate-800'} flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="font-black text-yellow-400">${esc(req.reqId)}</span><span class="font-bold text-white text-sm">${esc(req.itemName)}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${req.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' : req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}">${esc(req.status)}</span>
          </div>
          <p class="text-slate-300">Price: <span class="line-through text-slate-500">Rs.${req.oldPrice}</span> &rarr; <strong class="text-yellow-400">Rs.${req.newPrice} ${esc(priceLabel)}</strong> | Stock: <span class="line-through text-slate-500">${req.oldStock} ${esc(unitLabel)}</span> &rarr; <strong class="text-emerald-400">${req.newStock} ${esc(unitLabel)}</strong></p>
          <p class="text-[11px] text-slate-400">By: ${esc(req.requestedBy)} at ${esc(req.time)} • Reason: <em>"${esc(req.reason)}"</em></p>
        </div>
        ${req.status === 'Pending' ? `
        <div class="flex items-center gap-2 shrink-0">
          <button onclick="approveInventoryRequest('${esc(req.reqId)}')" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1"><i class="fa-solid fa-check"></i> Approve Change</button>
          <button onclick="rejectInventoryRequest('${esc(req.reqId)}')" class="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 font-bold px-3 py-2 rounded-xl text-xs transition">Reject</button>
        </div>` : ''}
      </div>`;
    }).join('');

  renderAnnualAnalytics();
  renderCOA();

  renderInventoryCards();

  // POS
  if (!state.inventory.some((item) => item.id === selectedPosCategoryId)) selectedPosCategoryId = null;
  renderPosProducts();
  renderSlaughterProducts();
  updatePosLinePreview();
  renderPosCart();
  $('pos-history-tbody').innerHTML = todays.length === 0
    ? '<tr><td colspan="6" class="py-6 text-center text-sm text-slate-400">No sales recorded today.</td></tr>'
    : todays.map((p) => `
    <tr class="hover:bg-slate-800/40 transition">
      <td class="py-3 px-3"><span class="font-bold text-yellow-400">${esc(p.id)}</span><span class="text-xs text-slate-400 block">${esc(p.time)}</span></td>
      <td class="py-3 px-3 font-semibold text-white">${esc(p.customer)}${p.customerPhone ? `<span class="text-xs text-slate-400 block">${esc(p.customerPhone)}</span>` : ''}</td>
      <td class="py-3 px-3 text-slate-300 text-xs">${esc(p.itemsSummary)}</td>
      <td class="py-3 px-3 font-bold text-emerald-400">${Number(p.totalKg) > 0 ? `-${Number(p.totalKg).toFixed(2)} kg` : '—'}</td>
      <td class="py-3 px-3"><span class="px-2 py-0.5 rounded bg-slate-800 text-xs font-bold">${esc(p.payment)}</span></td>
      <td class="py-3 px-3 text-right font-black text-white">Rs. ${Number(p.totalRs).toLocaleString()}</td>
    </tr>`).join('');

  // Attendance kiosk
  $('kiosk-cards').innerHTML = activeEmployees.length ? activeEmployees.map((e) => {
    const shifts = monthLogs(e.id).length;
    return `
      <div class="card p-4 flex flex-col justify-between border ${e.clockedIn ? 'border-yellow-400/50' : 'border-slate-800'}">
        <div>
          <div class="flex justify-between items-start gap-1">
            <h4 class="font-extrabold text-sm text-white">${esc(e.name)}</h4>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${e.clockedIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}">${e.clockedIn ? 'ON SHIFT' : 'OFF'}</span>
          </div>
          <div class="flex items-center justify-between mt-0.5">
            <p class="text-xs text-slate-400">${esc(e.role)}</p>
            ${isAdmin && e.pin ? `<span class="text-[10px] font-mono bg-slate-900 px-1.5 py-0.5 rounded text-yellow-400 border border-slate-800">PIN: ${esc(e.pin)}</span>` : ''}
          </div>
          <p class="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">Shifts this month: <strong class="text-white">${shifts}</strong> • ${e.clockedIn ? 'In: ' + esc(e.lastClockIn) : 'Signed Out'}</p>
        </div>
        <button onclick="toggleClock(${e.id})" class="mt-3 w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition ${e.clockedIn ? 'bg-slate-800 hover:bg-red-600 text-yellow-400 hover:text-white border border-yellow-400/30' : 'bg-yellow-400 hover:bg-yellow-300 text-slate-950'}">
          <i class="fa-solid ${e.clockedIn ? 'fa-right-from-bracket' : 'fa-right-to-bracket'} mr-1"></i> ${e.clockedIn ? 'Sign Out' : 'Sign In'}
        </button>
      </div>`;
  }).join('') : '<div class="col-span-full rounded-xl border border-dashed border-slate-700 p-5 text-center text-sm text-slate-400">No active staff. Add a staff member from Month-End Payroll.</div>';

  const filterEl = $('filter-emp-logs');
  const curFilter = filterEl.value || 'ALL';
  filterEl.innerHTML = `<option value="ALL">All Staff History (${state.employees.length})</option>` + state.employees.map((e) => `<option value="${e.id}">${esc(e.name)} — ${esc(e.role)}${e.archivedAt ? ' (Archived)' : ''}</option>`).join('');
  filterEl.value = [...filterEl.options].some((o) => o.value === curFilter) ? curFilter : 'ALL';
  $('man-emp').innerHTML = activeEmployees.map((e) => `<option value="${e.id}">${esc(e.name)}</option>`).join('');
  $('existing-staff-account-employee').innerHTML = activeEmployees.map((e) => `<option value="${e.id}">${esc(e.name)} — ${esc(e.role)}</option>`).join('');
  renderAttendanceLogs();

  // Payroll
  $('payroll-tbody').innerHTML = activeEmployees.map((emp) => {
    const p = payrollOf(emp);
    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-3 px-3"><div class="font-bold text-white">${esc(emp.name)}</div><div class="text-xs text-slate-400">${esc(emp.role)}</div></td>
        <td class="py-3 px-3 font-semibold">${p.logs.length}</td>
        <td class="py-3 px-3">Rs. ${emp.baseSalary.toLocaleString()}</td>
        <td class="py-3 px-3 font-bold text-yellow-400">${p.totalOt.toFixed(1)} hrs</td>
        <td class="py-3 px-3 font-semibold text-emerald-400">+ Rs. ${p.otPay.toLocaleString()}</td>
        <td class="py-3 px-3"><input type="number" value="${emp.allowance}" onchange="updatePayrollField(${emp.id}, 'allowance', this.value)" class="w-24 px-2 py-1 rounded text-xs font-bold"></td>
        <td class="py-3 px-3"><input type="number" value="${emp.advance}" onchange="updatePayrollField(${emp.id}, 'advance', this.value)" class="w-24 px-2 py-1 rounded text-xs font-bold text-red-400"></td>
        <td class="py-3 px-3 text-right font-black text-base text-yellow-400">Rs. ${p.netPay.toLocaleString()}</td>
        <td class="py-3 px-3 text-center"><button onclick="openPayslipModal(${emp.id})" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-extrabold transition"><i class="fa-solid fa-print mr-1"></i> Payslip</button></td>
        <td class="py-3 px-3 text-center"><button onclick="archiveStaff(${emp.id})" class="bg-red-500/15 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition"><i class="fa-solid fa-box-archive mr-1"></i> Archive</button></td>
      </tr>`;
  }).join('');

  $('archived-staff-reports').classList.toggle('hidden', archivedEmployees.length === 0);
  $('archived-staff-tbody').innerHTML = archivedEmployees.map((emp) => {
    const logs = state.attendanceLogs.filter((log) => log.empId === emp.id);
    const hours = logs.reduce((total, log) => total + Number(log.hours || 0), 0);
    const overtime = logs.reduce((total, log) => total + Number(log.ot || 0), 0);
    const payroll = payrollOf(emp);
    return `<tr>
      <td class="py-3 px-3"><div class="font-bold text-white">${esc(emp.name)}</div><div class="text-xs text-slate-400">${esc(emp.role)}</div></td>
      <td class="py-3 px-3 text-slate-300">${esc(String(emp.archivedAt).slice(0, 10))}</td>
      <td class="py-3 px-3">${logs.length}</td>
      <td class="py-3 px-3">${hours.toFixed(1)} hrs</td>
      <td class="py-3 px-3 text-yellow-400">${overtime.toFixed(1)} hrs</td>
      <td class="py-3 px-3">This month: Rs. ${payroll.netPay.toLocaleString()}</td>
      <td class="py-3 px-3 text-center"><button onclick="restoreStaff(${emp.id})" class="bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition"><i class="fa-solid fa-rotate-left mr-1"></i> Restore</button></td>
    </tr>`;
  }).join('');

  // Deliveries & subscriptions
  const riders = activeEmployees.map((e) => e.name);
  const statuses = ['Scheduled for Tomorrow', 'Cutting & Packing', 'Out for Delivery', 'Delivered'];
  $('deliveries-tbody').innerHTML = state.deliveries.map((d) => `
    <tr class="hover:bg-slate-800/40 transition">
      <td class="py-3 px-3"><div class="font-bold text-yellow-400">${esc(d.date)}</div><div class="text-xs text-slate-400">${esc(d.slot)}</div></td>
      <td class="py-3 px-3"><div class="font-bold text-white">${esc(d.customer)}</div><div class="text-xs text-slate-400">${esc(d.phone)}</div></td>
      <td class="py-3 px-3 text-slate-300">${esc(d.area)}</td>
      <td class="py-3 px-3 font-semibold text-white">${esc(d.items)}</td>
      <td class="py-3 px-3"><select onchange="updateDeliveryRider(${d.id}, this.value)" class="px-2 py-1 rounded text-xs font-semibold">${riders.map((r) => `<option value="${esc(r)}" ${d.rider === r ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select></td>
      <td class="py-3 px-3"><select onchange="updateDeliveryStatus(${d.id}, this.value)" class="px-2 py-1 rounded text-xs font-bold">${statuses.map((s) => `<option value="${s}" ${d.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></td>
      <td class="py-3 px-3 text-right"><button onclick="sendWhatsAppUpdate(${d.id})" class="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition"><i class="fa-brands fa-whatsapp mr-1"></i> WhatsApp</button></td>
    </tr>`).join('');

  $('subs-tbody').innerHTML = state.subscriptions.map((s) => `
    <tr class="hover:bg-slate-800/40 transition">
      <td class="py-3 px-3"><div class="font-bold text-white">${esc(s.customer)}</div><div class="text-xs text-slate-400">${esc(s.phone)}</div></td>
      <td class="py-3 px-3 text-slate-300">${esc(s.area)}</td>
      <td class="py-3 px-3 font-semibold text-yellow-400">${esc(s.pack)}</td>
      <td class="py-3 px-3">${esc(s.day)}</td>
      <td class="py-3 px-3 font-bold text-white">Rs. ${Number(s.price).toLocaleString()}</td>
      <td class="py-3 px-3 text-right"><button onclick="pushSubToTomorrow(${s.id})" class="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-extrabold transition"><i class="fa-solid fa-paper-plane mr-1"></i> Push to Tomorrow</button></td>
    </tr>`).join('');
}

function renderAttendanceLogs() {
  if (!state) return;
  const filterVal = $('filter-emp-logs').value;
  const banner = $('filtered-emp-banner');
  const logs = filterVal === 'ALL' ? state.attendanceLogs : state.attendanceLogs.filter((l) => String(l.empId) === String(filterVal));
  if (filterVal !== 'ALL') {
    const emp = state.employees.find((e) => String(e.id) === String(filterVal));
    if (emp) {
      banner.classList.remove('hidden');
      banner.innerHTML = `
        <div><span class="text-xs uppercase text-yellow-400 font-bold">Individual Employee Attendance Summary</span>
        <h4 class="text-base font-black text-white">${esc(emp.name)} <span class="text-xs font-normal text-slate-400">(${esc(emp.role)}${emp.archivedAt ? ', Archived' : ''})</span></h4></div>
        <div class="flex gap-6 text-xs">
          <div><span class="text-slate-400 block">Shifts Logged</span><strong class="text-sm text-white">${logs.length} Shifts</strong></div>
          <div><span class="text-slate-400 block">Total Hours</span><strong class="text-sm text-emerald-400">${logs.reduce((s, l) => s + Number(l.hours || 0), 0).toFixed(1)} hrs</strong></div>
          <div><span class="text-slate-400 block">Overtime Accrued</span><strong class="text-sm text-yellow-400">+${logs.reduce((s, l) => s + Number(l.ot || 0), 0).toFixed(1)} hrs</strong></div>
        </div>`;
    }
  } else banner.classList.add('hidden');

  $('attendance-log-tbody').innerHTML = logs.map((l) => {
    const emp = state.employees.find((e) => e.id === l.empId) || { name: 'Staff', role: '-' };
    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="py-3 px-4 text-slate-300 font-medium">${esc(l.date)}</td>
        <td class="py-3 px-4 font-bold text-white">${esc(emp.name)}${emp.archivedAt ? ' <span class="text-[10px] text-amber-300">(Archived)</span>' : ''}</td>
        <td class="py-3 px-4 text-xs text-slate-400">${esc(emp.role)}</td>
        <td class="py-3 px-4 text-emerald-400 font-semibold">${esc(l.signIn)}</td>
        <td class="py-3 px-4 ${l.signOut === 'Active Shift' ? 'text-yellow-400 font-bold' : 'text-slate-300'}">${esc(l.signOut)}</td>
        <td class="py-3 px-4 font-medium">${Number(l.hours).toFixed(1)} hrs</td>
        <td class="py-3 px-4 text-yellow-400 font-bold">+${Number(l.ot).toFixed(1)} hrs</td>
      </tr>`;
  }).join('');
}

// ---------- clock & startup ----------
function updateClock() {
  const t = new Date().toLocaleTimeString();
  if ($('live-clock')) $('live-clock').innerText = t;
  if ($('live-clock-mobile')) $('live-clock-mobile').innerText = t;
}
setInterval(updateClock, 1000);

async function bootstrap() {
  updateClock();
  inventoryUnitFormChanged();
  Api.onUnauthorized(() => {
    currentUser = null; state = null; Api.clearToken();
    showToast('Session expired. Please sign in again.', 'error');
    openLoginModal();
  });
  $('archive-calendar-picker').value = selectedArchiveDate;
  calculateSlaughterPreview();

  const scannedWall = window.location.search.includes('qr=wall-checkin');

  if (Api.hasToken()) {
    try {
      currentUser = await Api.me();
      const full = { admin: 'Admin (Full Access)', staff: 'Staff (POS & Inventory)' };
      currentUser.label = currentUser.label || full[currentUser.role];
      state = await Api.getState();
      ensureStateCollections();
      syncTodayIntoDailyVault();
      applyRolePermissions();
      switchTab(currentUser.role === 'admin' ? 'dashboard' : 'pos');
      setSyncStatus('Connected to MongoDB');
    } catch (err) {
      currentUser = null; state = null;
      if (err.offline) setSyncStatus('Server offline', false);
      if (!err.offline) Api.clearToken();
    }
  }

  if (!currentUser) {
    // Staff who scan the wall QR only need the PIN check-in portal (no login)
    if (scannedWall) openMobileQrPortal(); else openLoginModal();
  } else if (scannedWall) {
    openMobileQrPortal();
  }
}

window.bootstrap = bootstrap;
window.onload = bootstrap;
