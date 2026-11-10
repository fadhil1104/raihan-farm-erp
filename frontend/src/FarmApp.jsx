import React, { useEffect, useMemo, useState } from 'react';

const FARM_TOKEN_KEY = 'raihan_farm_token';
const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const number = (value, digits = 2) => Number(value || 0).toLocaleString(undefined, {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
});
const eventLabels = {
  BATCH_STARTED: 'Batch started / animals received',
  FEED_PURCHASE: 'Feed purchased',
  FEED_USE: 'Feed used',
  TRANSPORT: 'Transport',
  MORTALITY: 'Mortality',
  DELIVERY: 'Live delivery to Raihan Chicken Shop',
  WEIGHT_CHECK: 'Weight check'
};

async function request(path, { method = 'GET', body, token } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error(`Cannot reach the server at ${API_BASE || window.location.origin}.`);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data.error || `Request failed (${response.status}).`), { status: response.status });
  return data;
}

function Field({ label, children, className = '' }) {
  return <label className={`block text-sm font-semibold text-slate-300 ${className}`}>
    <span className="mb-1.5 block">{label}</span>
    {children}
  </label>;
}

function TextInput({ type = 'text', ...props }) {
  return <input type={type} {...props} className={`w-full rounded-xl px-3 py-2.5 text-sm ${props.className || ''}`} />;
}

function SelectInput(props) {
  return <select {...props} className={`w-full rounded-xl px-3 py-2.5 text-sm ${props.className || ''}`} />;
}

function FarmApp() {
  const [token, setToken] = useState(() => localStorage.getItem(FARM_TOKEN_KEY) || '');
  const [login, setLogin] = useState({ username: 'farm', password: '' });
  const [loginError, setLoginError] = useState('');
  const [pageError, setPageError] = useState('');
  const [notice, setNotice] = useState('');
  const [data, setData] = useState({ animalTypes: [], batches: [] });
  const [loading, setLoading] = useState(Boolean(token));
  const [saving, setSaving] = useState(false);
  const [batchForm, setBatchForm] = useState({
    animalTypeId: '',
    newAnimalType: '',
    source: 'OWN_RAISED',
    supplier: '',
    purchaseAmountRs: '',
    startDate: today(),
    initialCount: '',
    initialLiveWeightKg: ''
  });
  const [eventForm, setEventForm] = useState({
    batchId: '',
    type: 'FEED_PURCHASE',
    date: today(),
    quantityKg: '',
    amountRs: '',
    supplier: '',
    count: '',
    weightKg: '',
    note: ''
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  const activeBatches = useMemo(() => data.batches.filter((batch) => batch.currentCount > 0), [data.batches]);
  const events = useMemo(() => data.batches
    .flatMap((batch) => (batch.events || []).map((event) => ({ ...event, batchId: batch.batchId, animalType: batch.animalType })))
    .sort((a, b) => `${b.date}-${b.createdAt}`.localeCompare(`${a.date}-${a.createdAt}`)), [data.batches]);
  const totals = useMemo(() => data.batches.reduce((result, batch) => ({
    animals: result.animals + Number(batch.currentCount || 0),
    liveWeight: result.liveWeight + Number(batch.currentLiveWeightKg || 0),
    feedBalance: result.feedBalance + Number(batch.feedBalanceKg || 0),
    delivered: result.delivered + Number(batch.deliveredCount || 0)
  }), { animals: 0, liveWeight: 0, feedBalance: 0, delivered: 0 }), [data.batches]);

  async function loadData(activeToken = token) {
    const result = await request('/farm', { token: activeToken });
    setData(result);
    setEventForm((previous) => ({
      ...previous,
      batchId: result.batches.some((batch) => batch.batchId === previous.batchId && batch.currentCount > 0)
        ? previous.batchId
        : result.batches.find((batch) => batch.currentCount > 0)?.batchId || ''
    }));
  }

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return undefined;
    }
    let active = true;
    setLoading(true);
    Promise.all([
      request('/auth/me', { token }),
      request('/farm', { token })
    ]).then(([user, farmData]) => {
      if (!active) return;
      if (user.role !== 'farm') throw new Error('This login is not a farm account.');
      setData(farmData);
      setPageError('');
    }).catch((error) => {
      if (!active) return;
      localStorage.removeItem(FARM_TOKEN_KEY);
      setToken('');
      setData({ animalTypes: [], batches: [] });
      setLoginError(error.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [token]);

  async function handleLogin(event) {
    event.preventDefault();
    setLoginError('');
    setSaving(true);
    try {
      const result = await request('/auth/login', { method: 'POST', body: login });
      if (result.user?.role !== 'farm') throw new Error('Use the farm account to sign in here.');
      localStorage.setItem(FARM_TOKEN_KEY, result.token);
      setLoading(true);
      setToken(result.token);
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateBatch(event) {
    event.preventDefault();
    setPageError('');
    setNotice('');
    setSaving(true);
    try {
      let animalTypeId = batchForm.animalTypeId;
      if (animalTypeId === '__new__') {
        const created = await request('/farm/animal-types', {
          method: 'POST',
          token,
          body: { name: batchForm.newAnimalType }
        });
        animalTypeId = created.animalType.id;
        setData((previous) => ({
          ...previous,
          animalTypes: [...previous.animalTypes, created.animalType].sort((a, b) => a.name.localeCompare(b.name))
        }));
        setBatchForm((previous) => ({ ...previous, animalTypeId, newAnimalType: '' }));
      }
      const { batch } = await request('/farm/batches', {
        method: 'POST',
        token,
        body: {
          animalTypeId,
          source: batchForm.source,
          supplier: batchForm.supplier,
          purchaseAmountRs: Number(batchForm.purchaseAmountRs || 0),
          startDate: batchForm.startDate,
          initialCount: Number(batchForm.initialCount),
          initialLiveWeightKg: Number(batchForm.initialLiveWeightKg)
        }
      });
      setData((previous) => ({ ...previous, batches: [batch, ...previous.batches] }));
      setBatchForm((previous) => ({
        ...previous,
        animalTypeId,
        newAnimalType: '',
        supplier: '',
        purchaseAmountRs: '',
        initialCount: '',
        initialLiveWeightKg: ''
      }));
      setNotice('Batch created.');
    } catch (error) {
      setPageError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateEvent(event) {
    event.preventDefault();
    setPageError('');
    setNotice('');
    setSaving(true);
    const body = { type: eventForm.type, date: eventForm.date, note: eventForm.note };
    if (eventForm.type === 'FEED_PURCHASE') {
      body.quantityKg = Number(eventForm.quantityKg);
      body.amountRs = Number(eventForm.amountRs);
      body.supplier = eventForm.supplier;
    } else if (eventForm.type === 'FEED_USE') {
      body.quantityKg = Number(eventForm.quantityKg);
    } else if (eventForm.type === 'TRANSPORT') {
      body.amountRs = Number(eventForm.amountRs || 0);
    } else if (eventForm.type === 'MORTALITY') {
      body.count = Number(eventForm.count);
      if (eventForm.weightKg !== '') body.weightKg = Number(eventForm.weightKg);
    } else if (eventForm.type === 'DELIVERY') {
      body.count = Number(eventForm.count);
      body.weightKg = Number(eventForm.weightKg);
      body.amountRs = Number(eventForm.amountRs || 0);
    } else if (eventForm.type === 'WEIGHT_CHECK') {
      body.weightKg = Number(eventForm.weightKg);
    }

    try {
      const { batch } = await request(`/farm/batches/${encodeURIComponent(eventForm.batchId)}/events`, { method: 'POST', token, body });
      setData((previous) => ({
        ...previous,
        batches: previous.batches.map((entry) => entry.batchId === batch.batchId ? batch : entry)
      }));
      setEventForm((previous) => ({
        ...previous,
        batchId: batch.currentCount > 0
          ? batch.batchId
          : data.batches.find((entry) => entry.batchId !== batch.batchId && entry.currentCount > 0)?.batchId || ''
      }));
      setEventForm((previous) => ({
        ...previous,
        quantityKg: '',
        amountRs: '',
        supplier: '',
        count: '',
        weightKg: '',
        note: ''
      }));
      setNotice('Batch event recorded.');
    } catch (error) {
      setPageError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(event) {
    event.preventDefault();
    setPageError('');
    setNotice('');
    setSaving(true);
    try {
      await request('/farm/password', { method: 'PUT', token, body: passwordForm });
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setNotice('Password changed successfully.');
    } catch (error) {
      setPageError(error.message);
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    localStorage.removeItem(FARM_TOKEN_KEY);
    setToken('');
    setData({ animalTypes: [], batches: [] });
    setPageError('');
    setNotice('');
    setLogin({ username: 'farm', password: '' });
  }

  async function handleRefresh() {
    setPageError('');
    setNotice('');
    try {
      await loadData();
      setNotice('Farm records refreshed.');
    } catch (error) {
      setPageError(error.message);
    }
  }

  if (!token) {
    return <main className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="card w-full max-w-md space-y-5 p-7">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Raihan Farm</p>
          <h1 className="mt-2 text-3xl font-black text-white">Farm operations</h1>
          <p className="mt-2 text-sm text-slate-400">Separate farm records for live-animal batches and feed.</p>
        </div>
        {loginError && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-950/50 p-3 text-sm text-red-200">{loginError}</p>}
        <Field label="Username">
          <TextInput autoComplete="username" required value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} />
        </Field>
        <Field label="Password">
          <TextInput type="password" autoComplete="current-password" required value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} />
        </Field>
        <button disabled={saving} className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-black text-slate-950 disabled:opacity-60">
          {saving ? 'Signing in…' : 'Sign in to farm dashboard'}
        </button>
      </form>
    </main>;
  }

  if (loading) return <main className="min-h-screen p-8 text-slate-300">Loading farm records…</main>;

  return <main className="min-h-screen px-4 py-5 sm:px-7 lg:px-10">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Raihan Farm · Live animals only</p>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">Farm operations dashboard</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-400">Manage own-raised and purchased batches. Deliveries record live animals for Raihan Chicken Shop without changing shop records.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="#batches" className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-bold text-slate-200 hover:border-emerald-400">Batches</a>
          <a href="#activity" className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-bold text-slate-200 hover:border-emerald-400">Activity</a>
          <button type="button" onClick={handleRefresh} className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-bold text-slate-200 hover:border-emerald-400">Refresh</button>
          <button type="button" onClick={logout} className="rounded-xl bg-slate-800 px-3 py-2 text-sm font-bold text-slate-200 hover:bg-red-900">Sign out</button>
        </div>
      </header>

      {pageError && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-950/50 p-3 text-sm text-red-200">{pageError}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-sm text-emerald-200">{notice}</p>}

      <section aria-label="Farm summary" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Live animals', `${totals.animals.toLocaleString()} head`, 'Across all active batches'],
          ['Current live weight', `${number(totals.liveWeight)} kg`, 'Recorded batch total'],
          ['Feed balance', `${number(totals.feedBalance)} kg`, 'Purchased less feed used'],
          ['Delivered to shop', `${totals.delivered.toLocaleString()} head`, 'Live animals only']
        ].map(([label, value, caption]) => <article key={label} className="card p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black text-emerald-300">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{caption}</p>
        </article>)}
      </section>

      <section id="batches" className="grid items-start gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 p-4">
            <div>
              <h2 className="text-lg font-black text-white">Farm batches</h2>
              <p className="text-xs text-slate-400">Every purchase, event, and delivery stays linked to its batch.</p>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">{data.batches.length} total</span>
          </div>
          <div className="divide-y divide-slate-800">
            {data.batches.length === 0 && <p className="p-6 text-sm text-slate-400">No batches yet. Create an own-raised or purchased batch.</p>}
            {data.batches.map((batch) => <article key={batch.batchId} className="space-y-3 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-black text-white">{batch.animalType}</h3>
                  <p className="mt-0.5 text-xs text-slate-400">{batch.source === 'PURCHASED' ? `Purchased from ${batch.supplier}` : 'Own-raised'} · Started {batch.startDate}</p>
                  {batch.source === 'PURCHASED' && <p className="mt-1 text-xs text-slate-400">Purchase amount: Rs. {number(batch.purchaseAmountRs, 0)}</p>}
                  <p className="font-mono text-[10px] text-slate-600">{batch.batchId}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${batch.currentCount ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  {batch.currentCount ? 'Active' : 'Completed'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ['Live now', `${Number(batch.currentCount).toLocaleString()} head`],
                  ['Live weight', `${number(batch.currentLiveWeightKg)} kg`],
                  ['Feed balance', `${number(batch.feedBalanceKg)} kg`],
                  ['Started with', `${Number(batch.initialCount).toLocaleString()} head · ${number(batch.initialLiveWeightKg)} kg`],
                  ['Feed purchased', `${number(batch.feedPurchasedKg)} kg`],
                  ['Delivered', `${Number(batch.deliveredCount).toLocaleString()} head · ${number(batch.deliveredWeightKg)} kg`]
                ].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-900 p-2.5">
                  <p className="text-[10px] uppercase text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-bold text-slate-200">{value}</p>
                </div>)}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                <span>Mortality: {batch.mortalityCount} head / {number(batch.mortalityWeightKg)} kg</span>
                <span>Feed used: {number(batch.feedUsedKg)} kg</span>
                <span>Measured weight gain/loss: +{number(batch.measuredGainKg)} / −{number(batch.measuredLossKg)} kg</span>
                <span>Transport: Rs. {number(batch.transportCostRs, 0)}</span>
              </div>
            </article>)}
          </div>
        </div>

        <div className="space-y-5">
          <form onSubmit={handleCreateBatch} className="card space-y-4 p-4">
            <div>
              <h2 className="text-lg font-black text-white">Create a batch</h2>
              <p className="text-xs text-slate-400">For chicks raised at the farm or animals bought from another farm.</p>
            </div>
            <Field label="Animal type">
              <SelectInput required value={batchForm.animalTypeId} onChange={(event) => setBatchForm({ ...batchForm, animalTypeId: event.target.value })}>
                <option value="">Choose animal type</option>
                {data.animalTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
                <option value="__new__">＋ Add a new animal type…</option>
              </SelectInput>
            </Field>
            {batchForm.animalTypeId === '__new__' && <Field label="New animal type">
              <TextInput required maxLength={40} value={batchForm.newAnimalType} onChange={(event) => setBatchForm({ ...batchForm, newAnimalType: event.target.value })} placeholder="e.g. Goat" />
            </Field>}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Batch source">
                <SelectInput value={batchForm.source} onChange={(event) => setBatchForm({ ...batchForm, source: event.target.value })}>
                  <option value="OWN_RAISED">Own-raised at Raihan Farm</option>
                  <option value="PURCHASED">Purchased from outside farm</option>
                </SelectInput>
              </Field>
              <Field label="Batch date">
                <TextInput type="date" required value={batchForm.startDate} onChange={(event) => setBatchForm({ ...batchForm, startDate: event.target.value })} />
              </Field>
            </div>
            {batchForm.source === 'PURCHASED' && <Field label="Outside farm / supplier">
              <TextInput required maxLength={100} value={batchForm.supplier} onChange={(event) => setBatchForm({ ...batchForm, supplier: event.target.value })} />
            </Field>}
            {batchForm.source === 'PURCHASED' && <Field label="Purchase amount (Rs.)">
              <TextInput type="number" min="0" step="0.01" required value={batchForm.purchaseAmountRs} onChange={(event) => setBatchForm({ ...batchForm, purchaseAmountRs: event.target.value })} />
            </Field>}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Animals received / placed">
                <TextInput type="number" min="1" step="1" required value={batchForm.initialCount} onChange={(event) => setBatchForm({ ...batchForm, initialCount: event.target.value })} />
              </Field>
              <Field label="Starting live weight (kg)">
                <TextInput type="number" min="0.01" step="0.01" required value={batchForm.initialLiveWeightKg} onChange={(event) => setBatchForm({ ...batchForm, initialLiveWeightKg: event.target.value })} />
              </Field>
            </div>
            <button disabled={saving} className="w-full rounded-xl bg-emerald-400 px-4 py-2.5 font-black text-slate-950 disabled:opacity-60">Create farm batch</button>
          </form>

          <form onSubmit={handleCreateEvent} className="card space-y-4 p-4">
            <div>
              <h2 className="text-lg font-black text-white">Record batch activity</h2>
              <p className="text-xs text-slate-400">All quantities and costs are recorded against the selected batch.</p>
            </div>
            <Field label="Active batch">
              <SelectInput required value={eventForm.batchId} onChange={(event) => setEventForm({ ...eventForm, batchId: event.target.value })}>
                <option value="">Choose a batch</option>
                {activeBatches.map((batch) => <option key={batch.batchId} value={batch.batchId}>{batch.animalType} · {batch.currentCount} head · {batch.startDate}</option>)}
              </SelectInput>
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Activity">
                <SelectInput value={eventForm.type} onChange={(event) => setEventForm({ ...eventForm, type: event.target.value })}>
                  {Object.entries(eventLabels).map(([type, label]) => <option key={type} value={type}>{label}</option>)}
                </SelectInput>
              </Field>
              <Field label="Activity date">
                <TextInput type="date" required value={eventForm.date} onChange={(event) => setEventForm({ ...eventForm, date: event.target.value })} />
              </Field>
            </div>
            {['FEED_PURCHASE', 'FEED_USE'].includes(eventForm.type) && <Field label="Feed quantity (kg)">
              <TextInput type="number" min="0.01" step="0.01" required value={eventForm.quantityKg} onChange={(event) => setEventForm({ ...eventForm, quantityKg: event.target.value })} />
            </Field>}
            {eventForm.type === 'FEED_PURCHASE' && <>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Purchase cost (Rs.)">
                  <TextInput type="number" min="0" step="0.01" required value={eventForm.amountRs} onChange={(event) => setEventForm({ ...eventForm, amountRs: event.target.value })} />
                </Field>
                <Field label="Feed supplier (optional)">
                  <TextInput maxLength={100} value={eventForm.supplier} onChange={(event) => setEventForm({ ...eventForm, supplier: event.target.value })} />
                </Field>
              </div>
            </>}
            {eventForm.type === 'TRANSPORT' && <Field label="Transport cost (Rs.)">
              <TextInput type="number" min="0" step="0.01" required value={eventForm.amountRs} onChange={(event) => setEventForm({ ...eventForm, amountRs: event.target.value })} />
            </Field>}
            {['MORTALITY', 'DELIVERY'].includes(eventForm.type) && <div className="grid gap-3 sm:grid-cols-2">
              <Field label={eventForm.type === 'MORTALITY' ? 'Animals lost' : 'Live animals delivered'}>
                <TextInput type="number" min="1" step="1" required value={eventForm.count} onChange={(event) => setEventForm({ ...eventForm, count: event.target.value })} />
              </Field>
              <Field label={eventForm.type === 'MORTALITY' ? 'Mortality weight (kg, optional)' : 'Delivered live weight (kg)'}>
                <TextInput type="number" min="0.01" step="0.01" required={eventForm.type === 'DELIVERY'} value={eventForm.weightKg} onChange={(event) => setEventForm({ ...eventForm, weightKg: event.target.value })} />
              </Field>
            </div>}
            {eventForm.type === 'DELIVERY' && <Field label="Delivery amount (Rs., optional)">
              <TextInput type="number" min="0" step="0.01" value={eventForm.amountRs} onChange={(event) => setEventForm({ ...eventForm, amountRs: event.target.value })} />
            </Field>}
            {eventForm.type === 'WEIGHT_CHECK' && <Field label="New total live weight for this batch (kg)">
              <TextInput type="number" min="0.01" step="0.01" required value={eventForm.weightKg} onChange={(event) => setEventForm({ ...eventForm, weightKg: event.target.value })} />
            </Field>}
            <Field label="Note (optional)">
              <TextInput maxLength={240} value={eventForm.note} onChange={(event) => setEventForm({ ...eventForm, note: event.target.value })} placeholder="Short details" />
            </Field>
            <button disabled={saving || !activeBatches.length} className="w-full rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-2.5 font-black text-emerald-200 disabled:opacity-50">Save activity</button>
          </form>
        </div>
      </section>

      <section id="activity" className="card overflow-hidden">
        <div className="border-b border-slate-800 p-4">
          <h2 className="text-lg font-black text-white">Batch activity history</h2>
          <p className="text-xs text-slate-400">Feed purchased and used, transport, mortality, live-animal deliveries, and measured weight changes.</p>
        </div>
        {events.length === 0 ? <p className="p-5 text-sm text-slate-400">No activity recorded yet.</p> : <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-900 text-xs uppercase text-slate-500">
              <tr><th className="p-3">Date</th><th className="p-3">Batch / animal</th><th className="p-3">Activity</th><th className="p-3">Quantity / weight</th><th className="p-3">Cost / amount</th><th className="p-3">Details</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {events.map((event) => {
                const quantity = event.quantityKg !== undefined ? `${number(event.quantityKg)} kg`
                  : event.count !== undefined ? `${event.count} head${event.weightKg !== undefined ? ` · ${number(event.weightKg)} kg` : ''}`
                    : event.weightKg !== undefined ? `${number(event.weightKg)} kg${event.changeKg !== undefined ? ` (${event.changeKg > 0 ? '+' : ''}${number(event.changeKg)} kg)` : ''}`
                      : '—';
                return <tr key={event.id} className="text-slate-300">
                  <td className="whitespace-nowrap p-3">{event.date}</td>
                  <td className="p-3"><span className="font-bold text-white">{event.animalType}</span><br /><span className="font-mono text-[10px] text-slate-600">{event.batchId}</span></td>
                    <td className="whitespace-nowrap p-3">{eventLabels[event.type] || event.type}</td>
                    <td className="whitespace-nowrap p-3">{event.type === 'BATCH_STARTED' ? `${event.count} head · ${number(event.weightKg)} kg` : quantity}</td>
                  <td className="whitespace-nowrap p-3">{event.amountRs !== undefined ? `Rs. ${number(event.amountRs, 0)}` : '—'}</td>
                  <td className="max-w-xs p-3 text-xs text-slate-400">{event.destination || event.supplier || event.note || '—'}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>}
      </section>

      <details className="card p-4">
        <summary className="cursor-pointer font-bold text-slate-200">Change farm password</summary>
        <form onSubmit={handleChangePassword} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="Current password">
            <TextInput type="password" required autoComplete="current-password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} />
          </Field>
          <Field label="New password (at least 8 characters)">
            <TextInput type="password" required minLength={8} autoComplete="new-password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} />
          </Field>
          <button disabled={saving} className="rounded-xl bg-slate-700 px-4 py-2.5 font-bold text-white disabled:opacity-60">Update password</button>
        </form>
      </details>
    </div>
  </main>;
}

export default FarmApp;
