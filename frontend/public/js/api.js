/* Thin API client for the Raihan Farm ERP backend */
const Api = (() => {
  const TOKEN_KEY = 'raihan_erp_token';
  const BASE_KEY = 'raihan_erp_api_base';
  let onUnauthorized = () => {};

  const base = () => (localStorage.getItem(BASE_KEY) ?? window.RAIHAN_CONFIG.API_BASE ?? '').replace(/\/$/, '');
  const token = () => localStorage.getItem(TOKEN_KEY);

  async function request(path, { method = 'GET', body, auth = true, tokenOverride } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const authToken = tokenOverride || token();
    if (auth && authToken) headers.Authorization = 'Bearer ' + authToken;
    let res;
    try {
      res = await fetch(base() + '/api' + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    } catch (e) {
      throw Object.assign(new Error('Cannot reach the server at ' + (base() || location.origin)), { offline: true });
    }
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && auth && path !== '/auth/login') onUnauthorized();
    if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed (' + res.status + ')'), { status: res.status });
    return data;
  }

  return {
    request,
    base,
    setBase: (v) => localStorage.setItem(BASE_KEY, (v || '').trim()),
    hasToken: () => !!token(),
    setToken: (t) => localStorage.setItem(TOKEN_KEY, t),
    clearToken: () => localStorage.removeItem(TOKEN_KEY),
    onUnauthorized: (fn) => { onUnauthorized = fn; },
    login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password }, auth: false }),
    createStaff: (employee, phone, password) => request('/auth/staff', { method: 'POST', body: { employee, phone, password } }),
    createStaffAccount: (employeeId, phone, password) => request('/auth/staff', { method: 'POST', body: { employeeId, phone, password } }),
    archiveStaff: (employeeId) => request('/auth/staff/' + encodeURIComponent(employeeId), { method: 'DELETE' }),
    restoreStaff: (employeeId) => request('/auth/staff/' + encodeURIComponent(employeeId) + '/restore', { method: 'PATCH' }),
    updateStaffProfile: (profile, tokenOverride) => request('/auth/me', { method: 'PUT', body: profile, tokenOverride }),
    me: () => request('/auth/me'),
    getState: () => request('/state'),
    putState: (state, replace = false) => request('/state' + (replace ? '?replace=true' : ''), { method: 'PUT', body: state }),
    addInventoryStock: (itemId, quantity) => request('/state/inventory/' + encodeURIComponent(itemId) + '/stock', { method: 'POST', body: { quantity } }),
    roster: () => request('/attendance/roster', { auth: false }),
    qrClock: (empId, pin) => request('/attendance/qr-clock', { method: 'POST', body: { empId, pin }, auth: false }),
    kioskClock: (empId) => request('/attendance/clock', { method: 'POST', body: { empId } }),
    manualSignOut: (empId) => request('/attendance/manual-sign-out', { method: 'POST', body: { empId } })
  };
})();
