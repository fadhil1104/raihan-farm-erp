const TZ = process.env.TIMEZONE || 'Asia/Colombo';

// YYYY-MM-DD in the shop's time zone
const todayStr = (d = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

// e.g. 06:15 AM
const timeStr = (d = new Date()) =>
  new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: true }).format(d);

const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return todayStr(d); };

module.exports = { TZ, todayStr, timeStr, addDays };
