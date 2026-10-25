import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import legacyHtml from '../legacy.html?raw';
import '../css/styles.css';

window.RAIHAN_API_BASE = import.meta.env.VITE_API_BASE || '';

function LegacyApp() {
  const [markup, setMarkup] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const parsed = new DOMParser().parseFromString(legacyHtml, 'text/html');
    document.body.className = parsed.body.className;
    setMarkup(parsed.body.innerHTML);
  }, []);

  useEffect(() => {
    if (markup === null) return undefined;
    let active = true;

    async function startLegacyApp() {
      try {
        for (const src of ['/js/config.js', '/js/api.js', '/js/app.js']) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Unable to load ${src}`));
            document.body.appendChild(script);
          });
        }
        if (active) {
          if (typeof window.bootstrap !== 'function') throw new Error('ERP startup function is unavailable.');
          await window.bootstrap();
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      }
    }

    startLegacyApp();
    return () => { active = false; };
  }, [markup]);

  if (error) {
    return <main role="alert" className="m-8 rounded-xl border border-red-500 bg-slate-900 p-6 text-red-200">
      <h1 className="text-lg font-bold">Unable to start Raihan Farm ERP</h1>
      <p className="mt-2">{error}</p>
    </main>;
  }

  if (markup === null) return <main className="p-6 text-slate-200">Loading Raihan Farm ERP…</main>;
  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}

createRoot(document.getElementById('root')).render(<LegacyApp />);
