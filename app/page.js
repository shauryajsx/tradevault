'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import api from '../lib/api';

// ─── ICONS ───
const IC = {
  logo: <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><path d="M3 17l4-4 4 4 6-8 4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="3" cy="17" r="1.5" fill="currentColor"/><circle cx="7" cy="13" r="1.5" fill="currentColor"/><circle cx="11" cy="17" r="1.5" fill="currentColor"/><circle cx="17" cy="9" r="1.5" fill="currentColor"/><circle cx="21" cy="13" r="1.5" fill="currentColor"/></svg>,
  plus: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/></svg>,
  check: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  eye: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>,
  chart: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>,
  journal: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4 2a1 1 0 10-2 0v3a1 1 0 102 0v-3z"/></svg>,
  logout: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/></svg>,
  star: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>,
  arrow: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>,
  back: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/></svg>,
  close: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>,
  fire: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/></svg>,
  trash: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>,
  edit: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>,
  dollar: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/></svg>,
  calendar: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg>,
  trophy: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-1.17a3 3 0 01-1.415 1.42l.59 4.72A1 1 0 0113.014 17H6.986a1 1 0 01-.99-1.14l.59-4.45A3 3 0 015.17 10H4a2 2 0 110-4h1.17A3 3 0 015 5z" clipRule="evenodd"/></svg>,
  target: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><circle cx="10" cy="10" r="8"/></svg>,
  trendUp: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>,
  trendDown: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd"/></svg>,
  upload: <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>,
  lock: <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>,
  calc: <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 3a1 1 0 000 2h8a1 1 0 100-2H6zm0 4a1 1 0 011-1h1a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h1a1 1 0 110 2H7a1 1 0 01-1-1zm5-3a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm0 3a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd"/></svg>,
  chevL: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  chevR: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>,
};

const PAIRS = ["EUR/USD","GBP/USD","USD/JPY","AUD/USD","USD/CAD","NZD/USD","GBP/JPY","EUR/GBP","EUR/JPY","USD/CHF","XAU/USD","BTC/USD","ETH/USD","AAPL","TSLA","NVDA","AMZN","MSFT","META","GOOGL","SPY","QQQ"];
const fmtM = n => { if (!n && n !== 0) return "$0.00"; const s = n >= 0 ? "+" : "-"; return `${s}$${Math.abs(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`; };

// ─── TOASTS ───
function Toasts({ items }) {
  return (
    <div className="fixed top-[60px] right-5 z-[2000] flex flex-col gap-2">
      {items.map(t => (
        <div key={t.id} className={`toast-anim px-5 py-3 rounded-xl text-sm font-medium border min-w-[220px] ${t.type === 's' ? 'bg-[var(--gb)] text-[var(--g)] border-[rgba(16,185,129,.2)]' : 'bg-[var(--rb)] text-[var(--r)] border-[rgba(239,68,68,.2)]'}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── CONFIRM DIALOG ───
function Confirm({ title, msg, onYes, onNo }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1100] p-5" onClick={onNo}>
      <div className="bg-[var(--bg2)] border border-[var(--bd)] rounded-2xl p-7 max-w-[400px] w-full text-center" onClick={e => e.stopPropagation()}>
        <div className="text-base font-bold mb-2">{title}</div>
        <div className="text-sm text-[var(--t2)] mb-5 leading-relaxed">{msg}</div>
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--bg3)] border border-[var(--bd)] text-sm font-semibold cursor-pointer" onClick={onNo}>Cancel</button>
          <button className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--rb)] border border-[rgba(239,68,68,.2)] text-[var(--r)] text-sm font-semibold cursor-pointer" onClick={onYes}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL WRAPPER ───
function Modal({ children, onClose, maxW = 620 }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-5" onClick={onClose}>
      <div className="bg-[var(--bg2)] border border-[var(--bd)] rounded-2xl w-full overflow-y-auto max-h-[90vh]" style={{ maxWidth: maxW }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalHead({ title, onClose }) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--bd)] sticky top-0 bg-[var(--bg2)] z-10 rounded-t-2xl">
      <div className="text-lg font-bold flex items-center gap-2">{title}</div>
      <button className="text-[var(--t2)] hover:text-[var(--t1)] cursor-pointer bg-transparent border-none" onClick={onClose}>{IC.close}</button>
    </div>
  );
}

function ModalFoot({ children }) {
  return <div className="px-6 py-4 border-t border-[var(--bd)] flex gap-3 sticky bottom-0 bg-[var(--bg2)] rounded-b-2xl">{children}</div>;
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex border-b-2 border-[var(--bd)] mb-5">
      {tabs.map(t => (
        <button key={t.id} className={`flex-1 text-center py-3 text-sm font-semibold cursor-pointer border-none bg-transparent border-b-2 -mb-[2px] transition-all ${active === t.id ? 'text-[var(--ac)] border-[var(--ac)]' : 'text-[var(--t2)] border-transparent'}`} onClick={() => onChange(t.id)}>{t.label}</button>
      ))}
    </div>
  );
}

// ─── STRATEGY FORM MODAL ───
function StratFormModal({ onClose, onSave, user, existing }) {
  const init = existing || { title: '', description: '', market: 'Equities', timeframe: '5min', checklist: [''], tags: '', isPublic: true };
  const [f, sF] = useState({ ...init, tags: Array.isArray(init.tags) ? init.tags.join(', ') : init.tags || '', checklist: [...(init.checklist || [''])] });
  const [busy, setBusy] = useState(false);

  const go = async () => {
    if (!f.title.trim()) return;
    const cl = f.checklist.filter(c => c.trim());
    if (!cl.length) return;
    setBusy(true);
    const data = { title: f.title, description: f.description, market: f.market, timeframe: f.timeframe, checklist: cl, tags: f.tags.split(',').map(t => t.trim()).filter(Boolean), isPublic: f.isPublic, author: existing?.author || user.username, authorId: existing?.authorId || user.id, winRate: existing?.winRate || 0, rating: existing?.rating || 0, uses: existing?.uses || 0 };
    if (existing?._id) data._id = existing._id;
    onSave(data);
  };

  const uc = (i, v) => { const c = [...f.checklist]; c[i] = v; sF({ ...f, checklist: c }); };

  return (
    <Modal onClose={onClose}>
      <ModalHead title={existing ? 'Edit Strategy' : 'New Strategy'} onClose={onClose} />
      <div className="px-6 py-5">
        <div className="mb-4"><label className="block text-xs font-semibold text-[var(--t2)] mb-1">Strategy Name <span className="text-[var(--r)]">*</span></label><input className="input" placeholder="e.g. VWAP Bounce Scalp" value={f.title} onChange={e => sF({ ...f, title: e.target.value })} /></div>
        <div className="mb-4"><label className="block text-xs font-semibold text-[var(--t2)] mb-1">Description</label><textarea className="input min-h-[80px] resize-y" placeholder="Describe the strategy..." value={f.description} onChange={e => sF({ ...f, description: e.target.value })} /></div>
        <div className="flex gap-3 mb-4">
          <div className="flex-1"><label className="block text-xs font-semibold text-[var(--t2)] mb-1">Market</label><select className="input" value={f.market} onChange={e => sF({ ...f, market: e.target.value })}><option>Equities</option><option>Forex</option><option>Crypto</option><option>Options</option><option>Futures</option></select></div>
          <div className="flex-1"><label className="block text-xs font-semibold text-[var(--t2)] mb-1">Timeframe</label><select className="input" value={f.timeframe} onChange={e => sF({ ...f, timeframe: e.target.value })}><option>1min</option><option>5min</option><option>15min</option><option>1H</option><option>4H</option><option>Daily</option><option>Weekly</option></select></div>
        </div>
        <div className="mb-4"><label className="block text-xs font-semibold text-[var(--t2)] mb-1">Tags (comma-separated)</label><input className="input" placeholder="Momentum, Gap, Scalp" value={f.tags} onChange={e => sF({ ...f, tags: e.target.value })} /></div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[var(--t2)] mb-1">Pre-Trade Checklist <span className="text-[var(--r)]">*</span></label>
          {f.checklist.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className="input flex-1" placeholder={`Item ${i + 1}`} value={item} onChange={e => uc(i, e.target.value)} />
              {f.checklist.length > 1 && <button className="text-[var(--t2)] hover:text-[var(--r)] bg-transparent border-none cursor-pointer px-2" onClick={() => sF({ ...f, checklist: f.checklist.filter((_, j) => j !== i) })}>{IC.trash}</button>}
            </div>
          ))}
          <button className="text-xs text-[var(--t2)] hover:text-[var(--t1)] bg-transparent border-none cursor-pointer flex items-center gap-1 mt-1" onClick={() => sF({ ...f, checklist: [...f.checklist, ''] })}>{IC.plus} Add Item</button>
        </div>
      </div>
      <ModalFoot>
        <button className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--bg3)] border border-[var(--bd)] text-sm font-semibold cursor-pointer" onClick={onClose}>Cancel</button>
        <button className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--ac)] text-white text-sm font-semibold cursor-pointer hover:bg-[var(--ach)] flex items-center justify-center gap-1.5 disabled:opacity-50" onClick={go} disabled={busy}>{existing ? <>{IC.check} Save Changes</> : <>{IC.plus} Add Strategy</>}</button>
      </ModalFoot>
    </Modal>
  );
}

// ─── SAVE / UPDATE TRADE MODAL ───
function SaveTradeModal({ onClose, onSave, strategy, conf, editing, existing }) {
  const init = existing || { symbol: '', direction: 'LONG', accountBalance: '10000', riskPct: '2', stopLoss: '', takeProfit: '', entryPrice: '', notes: '', outcome: 'Before', beforeChart: null, afterChart: null };
  const [f, sF] = useState({ ...init, accountBalance: String(init.accountBalance || 10000), riskPct: String(init.riskPct || 2), stopLoss: String(init.stopLoss || ''), takeProfit: String(init.takeProfit || ''), entryPrice: String(init.entryPrice || '') });
  const [tab, sT] = useState('trade');
  const [busy, setBusy] = useState(false);

  const lot = useMemo(() => {
    const b = parseFloat(f.accountBalance) || 0, r = parseFloat(f.riskPct) || 0, e = parseFloat(f.entryPrice) || 0, s = parseFloat(f.stopLoss) || 0;
    if (!b || !r || !e || !s || e === s) return null;
    const ra = b * (r / 100), d = Math.abs(e - s);
    return { riskAmt: ra.toFixed(2), lotSize: (ra / d / 100000).toFixed(2) };
  }, [f.accountBalance, f.riskPct, f.entryPrice, f.stopLoss]);

  const hc = (w, e) => { const fi = e.target.files?.[0]; if (!fi) return; const r = new FileReader(); r.onload = ev => sF(p => ({ ...p, [w]: ev.target.result })); r.readAsDataURL(fi); };

  const go = async () => {
    if (!f.symbol || !f.entryPrice || !f.stopLoss) return;
    setBusy(true);
    const e = parseFloat(f.entryPrice), sl = parseFloat(f.stopLoss), tp = f.takeProfit ? parseFloat(f.takeProfit) : null;
    let pnl = 0; const ls = lot ? parseFloat(lot.lotSize) : 0.01;
    if (f.outcome === 'Win' && tp) pnl = Math.abs(tp - e) * ls * 100000;
    if (f.outcome === 'Loss') pnl = -(Math.abs(e - sl) * ls * 100000);
    pnl = Math.round(pnl * 100) / 100;
    const data = { strategyId: strategy._id, symbol: f.symbol, direction: f.direction, entryPrice: e, stopLoss: sl, takeProfit: tp, entryDate: existing?.entryDate || new Date().toISOString().split('T')[0], lotSize: ls, accountBalance: parseFloat(f.accountBalance) || 10000, riskPct: parseFloat(f.riskPct) || 2, notes: f.notes, pnl, outcome: f.outcome, confluenceScore: conf, beforeChart: f.beforeChart, afterChart: f.afterChart };
    if (existing?._id) data._id = existing._id;
    onSave(data);
  };

  const lk = !!editing;

  return (
    <Modal onClose={onClose} maxW={580}>
      <ModalHead title={editing ? 'Update Trade' : 'Save Trade'} onClose={onClose} />
      <Tabs tabs={[{ id: 'trade', label: editing ? 'Update Trade' : 'Save Trade' }, { id: 'conf', label: 'Confluence Summary' }]} active={tab} onChange={sT} />
      <div className="px-6 pb-2">
        {tab === 'conf' ? (
          <div>
            <div className="bg-[var(--acb)] border border-[rgba(217,119,87,.2)] rounded-lg px-4 py-3 text-sm font-semibold text-[var(--ac)] mb-5">Confluence Score: {conf}%</div>
            {strategy.checklist.map((it, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3.5 rounded-lg mb-1 text-sm">
                <div className="w-[22px] h-[22px] rounded-md bg-[var(--g)] border-2 border-[var(--g)] flex items-center justify-center text-white">{IC.check}</div>
                <span className="text-[var(--t1)]">{it}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="bg-[var(--acb)] border border-[rgba(217,119,87,.2)] rounded-lg px-4 py-3 text-sm font-semibold text-[var(--ac)] mb-5">Confluence Score: {conf}%</div>
            <div className="flex gap-3 mb-4">
              <div className="flex-1"><label className="flex items-center gap-1 text-xs font-semibold text-[var(--t2)] mb-1">{lk && IC.lock} Currency Pair <span className="text-[var(--r)]">*</span></label>{lk ? <input className="input opacity-70" value={f.symbol} readOnly /> : <select className="input" value={f.symbol} onChange={e => sF({ ...f, symbol: e.target.value })}><option value="">Select pair</option>{PAIRS.map(p => <option key={p}>{p}</option>)}</select>}</div>
              <div className="flex-1"><label className="flex items-center gap-1 text-xs font-semibold text-[var(--t2)] mb-1">{lk && IC.lock} Direction <span className="text-[var(--r)]">*</span></label>
                <div className="flex rounded-lg overflow-hidden border border-[var(--bd)]">
                  <button className={`flex-1 py-2.5 text-center text-sm font-bold font-mono border-none cursor-pointer ${f.direction === 'LONG' ? 'bg-[var(--gb2)] text-[var(--g)]' : 'bg-[var(--bg1)] text-[var(--t2)]'}`} onClick={() => !lk && sF({ ...f, direction: 'LONG' })} disabled={lk}>LONG</button>
                  <button className={`flex-1 py-2.5 text-center text-sm font-bold font-mono border-none cursor-pointer ${f.direction === 'SHORT' ? 'bg-[var(--rb2)] text-[var(--r)]' : 'bg-[var(--bg1)] text-[var(--t2)]'}`} onClick={() => !lk && sF({ ...f, direction: 'SHORT' })} disabled={lk}>SHORT</button>
                </div>
              </div>
            </div>
            <div className="text-sm font-bold mb-3 flex items-center gap-2">{IC.dollar} Account Balance <span className="text-[var(--ac)] text-xs font-normal">*Required</span></div>
            <div className="mb-4"><label className="flex items-center gap-1 text-xs font-semibold text-[var(--t2)] mb-1">{IC.dollar} Account Balance (USD) <span className="text-[var(--r)]">*</span></label><input type="number" className="input" placeholder="10,000" value={f.accountBalance} onChange={e => sF({ ...f, accountBalance: e.target.value })} /></div>
            <div className="text-sm font-bold mb-3 flex items-center gap-2">{IC.logo} Trade Parameters</div>
            <div className="flex gap-3 mb-4">
              <div className="flex-1"><label className="flex items-center gap-1 text-xs font-semibold text-[var(--t2)] mb-1"><span className="text-[var(--ac)]">$</span> Stop Loss <span className="text-[var(--r)]">*</span></label><input type="number" step="any" className="input input-sl" value={f.stopLoss} onChange={e => sF({ ...f, stopLoss: e.target.value })} /></div>
              <div className="flex-1"><label className="flex items-center gap-1 text-xs font-semibold text-[var(--t2)] mb-1"><span className="text-[var(--ac)]">$</span> Take Profit <span className="text-[var(--r)]">*</span></label><input type="number" step="any" className="input input-tp" value={f.takeProfit} onChange={e => sF({ ...f, takeProfit: e.target.value })} /></div>
            </div>
            <div className="flex gap-3 mb-4">
              <div className="flex-1"><label className="text-xs font-semibold text-[var(--t2)] mb-1 block">Entry Price <span className="text-[var(--r)]">*</span></label><input type="number" step="any" className="input" value={f.entryPrice} onChange={e => sF({ ...f, entryPrice: e.target.value })} /></div>
              <div className="flex-1"><label className="flex items-center gap-1 text-xs font-semibold text-[var(--t2)] mb-1"><span className="text-[var(--ac)]">%</span> Risk % <span className="text-[var(--r)]">*</span></label><input type="number" step="any" className="input" value={f.riskPct} onChange={e => sF({ ...f, riskPct: e.target.value })} /></div>
            </div>
            <div className="bg-[var(--tlb)] border border-[rgba(20,184,166,.2)] rounded-xl p-4 flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[rgba(20,184,166,.15)] flex items-center justify-center text-[var(--tl)]">{IC.calc}</div>
              <div><div className="text-sm font-bold text-[var(--tl)]">Calculated Lot Size</div><div className="text-sm text-[var(--t2)] mt-0.5 font-mono">{lot ? `${lot.lotSize} lots (Risk: $${lot.riskAmt})` : 'Enter SL to calculate'}</div></div>
            </div>
            <div className="mb-4"><label className="text-xs font-semibold text-[var(--t2)] mb-1 block">Notes <span className="text-[var(--r)]">*</span></label><textarea className="input min-h-[80px] resize-y" placeholder="Trade notes..." value={f.notes} onChange={e => sF({ ...f, notes: e.target.value })} /></div>
            {editing && (
              <>
                <div className="text-sm font-bold mb-3">Trade Outcome</div>
                <div className="flex gap-2 mb-4">
                  {['Win', 'Loss', 'Break-Even'].map(o => (
                    <button key={o} className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-lg cursor-pointer border transition-all ${f.outcome === o ? (o === 'Win' ? 'bg-[var(--gb2)] text-[var(--g)] border-[var(--g)]' : o === 'Loss' ? 'bg-[var(--rb2)] text-[var(--r)] border-[var(--r)]' : 'bg-[var(--amb)] text-[var(--am)] border-[var(--am)]') : 'bg-[var(--bg1)] text-[var(--t2)] border-[var(--bd)]'}`} onClick={() => sF({ ...f, outcome: o })}>{o}</button>
                  ))}
                </div>
              </>
            )}
            <div className="text-sm font-bold mb-3">Chart Image{editing ? 's' : ' (Before Trade)'} <span className="text-[var(--r)]">*</span></div>
            {!editing ? (
              <div className="border-2 border-dashed border-[var(--bdl)] rounded-xl p-6 text-center cursor-pointer relative mb-4 hover:border-[var(--ac)] transition-all">
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => hc('beforeChart', e)} />
                {f.beforeChart ? <img src={f.beforeChart} alt="Before" className="w-full max-h-[200px] object-contain rounded-lg border border-[var(--bd)]" /> : <><div className="flex justify-center text-[var(--t3)] mb-2">{IC.upload}</div><div className="text-sm text-[var(--t2)]">Upload before-trade chart</div><div className="text-xs text-[var(--t3)] mt-1">PNG, JPG up to 10MB</div></>}
              </div>
            ) : (
              <div className="flex gap-3 mb-4">
                <div className="flex-1"><div className="text-xs text-[var(--t2)] mb-1.5">Before (Read-only)</div>{f.beforeChart ? <img src={f.beforeChart} alt="B" className="w-full max-h-[200px] object-contain rounded-lg border border-[var(--bd)]" /> : <div className="border-2 border-dashed border-[var(--bdl)] rounded-xl p-4 text-center text-xs text-[var(--t2)]">No image</div>}</div>
                <div className="flex-1"><div className="text-xs text-[var(--t2)] mb-1.5">After <span className="text-[var(--r)]">*</span></div><div className="border-2 border-dashed border-[var(--bdl)] rounded-xl p-4 text-center cursor-pointer relative hover:border-[var(--ac)] transition-all"><input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => hc('afterChart', e)} />{f.afterChart ? <img src={f.afterChart} alt="A" className="w-full max-h-[200px] object-contain rounded-lg border border-[var(--bd)]" /> : <><div className="flex justify-center text-[var(--t3)]">{IC.upload}</div><div className="text-sm text-[var(--t2)]">Upload after chart *</div></>}</div></div>
              </div>
            )}
          </div>
        )}
      </div>
      <ModalFoot>
        <button className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--bg3)] border border-[var(--bd)] text-sm font-semibold cursor-pointer" onClick={onClose}>Cancel</button>
        <button className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--ac)] text-white text-sm font-semibold cursor-pointer hover:bg-[var(--ach)] flex items-center justify-center gap-1.5 disabled:opacity-50" onClick={go} disabled={busy}>{editing ? <>{IC.edit} Save Changes</> : <>{IC.journal} Save Trade</>}</button>
      </ModalFoot>
    </Modal>
  );
}

// ─── VIEW TRADE MODAL ───
function ViewTradeModal({ trade, onClose, strategy }) {
  const [tab, sT] = useState('details');
  return (
    <Modal onClose={onClose} maxW={660}>
      <ModalHead title={<><span className="text-xl">{trade.symbol}</span><span className={`ml-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${trade.direction === 'LONG' ? 'bg-[var(--gb)] text-[var(--g)]' : 'bg-[var(--rb)] text-[var(--r)]'}`}>{trade.direction}</span></>} onClose={onClose} />
      <Tabs tabs={[{ id: 'details', label: 'Trade Details' }, { id: 'conf', label: 'Confluence Summary' }]} active={tab} onChange={sT} />
      <div className="px-6 pb-6">
        {tab === 'conf' ? (
          <div>
            <div className="bg-[var(--acb)] border border-[rgba(217,119,87,.2)] rounded-lg px-4 py-3 text-sm font-semibold text-[var(--ac)] mb-5">Confluence Score: {trade.confluenceScore}%</div>
            {strategy?.checklist?.map((it, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3.5 rounded-lg mb-1 text-sm">
                <div className="w-[22px] h-[22px] rounded-md bg-[var(--g)] border-2 border-[var(--g)] flex items-center justify-center text-white">{IC.check}</div>
                <span className="text-[var(--t1)]">{it}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-4 gap-2.5 mb-5">
              {[
                { l: 'Confluence', v: `${trade.confluenceScore}%`, c: 'text-[var(--ac)]' },
                { l: 'Direction', v: trade.direction },
                { l: 'Outcome', v: trade.outcome, c: trade.outcome === 'Win' ? 'text-[var(--g)]' : trade.outcome === 'Loss' ? 'text-[var(--r)]' : 'text-[var(--am)]' },
                { l: 'Date', v: trade.entryDate, small: true },
              ].map((s, i) => (
                <div key={i} className="bg-[var(--bg3)] border border-[var(--bd)] rounded-lg p-3">
                  <div className="text-[11px] text-[var(--t3)] mb-1">{s.l}</div>
                  <div className={`font-bold font-mono ${s.small ? 'text-sm' : 'text-base'} ${s.c || ''}`}>{s.v}</div>
                </div>
              ))}
            </div>
            <div className="bg-[var(--bg2)] border border-[var(--bd)] rounded-2xl p-5 mb-4">
              <div className="text-sm font-bold mb-2">Notes</div>
              <div className="text-sm text-[var(--t2)] leading-relaxed">{trade.notes || 'No notes.'}</div>
            </div>
            {(trade.beforeChart || trade.afterChart) && (
              <div>
                <div className="text-sm font-bold mb-3">Chart Images</div>
                <div className="flex gap-3">
                  {trade.beforeChart && <div className="flex-1"><div className="text-[11px] text-[var(--t3)] mb-1">Before</div><img src={trade.beforeChart} alt="B" className="w-full rounded-lg border border-[var(--bd)]" /></div>}
                  {trade.afterChart && <div className="flex-1"><div className="text-[11px] text-[var(--t3)] mb-1">After</div><img src={trade.afterChart} alt="A" className="w-full rounded-lg border border-[var(--bd)]" /></div>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── AUTH PAGE ───
function AuthPage() {
  const [tab, setTab] = useState('in');
  const [f, sF] = useState({ u: '', e: '', p: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const go = async () => {
    setErr(''); setBusy(true);
    try {
      if (tab === 'up') {
        if (!f.u.trim() || !f.e.trim() || f.p.length < 4) { setBusy(false); return setErr('All fields required. Password min 4 chars.'); }
        const res = await api.signup(f.u.trim(), f.e.trim().toLowerCase(), f.p);
        if (res.error) { setBusy(false); return setErr(res.error); }
        // Auto sign in after signup
        const result = await signIn('credentials', { email: f.e.trim().toLowerCase(), password: f.p, redirect: false });
        if (result?.error) { setBusy(false); return setErr(result.error); }
      } else {
        if (!f.e.trim() || !f.p) { setBusy(false); return setErr('Email and password required.'); }
        const result = await signIn('credentials', { email: f.e.trim().toLowerCase(), password: f.p, redirect: false });
        if (result?.error) { setBusy(false); return setErr(result.error); }
      }
    } catch (e) { setBusy(false); setErr('Something went wrong.'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg0)] relative overflow-hidden">
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_40%,rgba(217,119,87,.06)_0%,transparent_50%),radial-gradient(circle_at_70%_60%,rgba(139,92,246,.04)_0%,transparent_50%)]" style={{ animation: 'drift 20s ease-in-out infinite alternate' }} />
      <div className="relative z-10 w-full max-w-[420px] p-9 bg-[var(--bg2)] border border-[var(--bd)] rounded-[20px] mx-5">
        <div className="flex items-center gap-2.5 text-[22px] font-bold text-[var(--ac)] mb-1.5">{IC.logo} TradeVault</div>
        <div className="text-[var(--t2)] text-sm mb-7">Your strategies. Your journal. Your edge.</div>
        <div className="flex mb-6 bg-[var(--bg1)] rounded-lg p-[3px]">
          <button className={`flex-1 py-2.5 text-center text-sm font-semibold border-none rounded-md cursor-pointer transition-all ${tab === 'in' ? 'bg-[var(--ac)] text-white' : 'bg-transparent text-[var(--t2)]'}`} onClick={() => { setTab('in'); setErr(''); }}>Sign In</button>
          <button className={`flex-1 py-2.5 text-center text-sm font-semibold border-none rounded-md cursor-pointer transition-all ${tab === 'up' ? 'bg-[var(--ac)] text-white' : 'bg-transparent text-[var(--t2)]'}`} onClick={() => { setTab('up'); setErr(''); }}>Sign Up</button>
        </div>
        {tab === 'up' && <div className="mb-4"><label className="block text-xs font-semibold text-[var(--t2)] mb-1">Username</label><input className="input" placeholder="Choose a username" value={f.u} onChange={e => sF({ ...f, u: e.target.value })} /></div>}
        <div className="mb-4"><label className="block text-xs font-semibold text-[var(--t2)] mb-1">Email</label><input type="email" className="input" placeholder="you@example.com" value={f.e} onChange={e => sF({ ...f, e: e.target.value })} /></div>
        <div className="mb-4"><label className="block text-xs font-semibold text-[var(--t2)] mb-1">Password</label><input type="password" className="input" placeholder="••••••••" value={f.p} onChange={e => sF({ ...f, p: e.target.value })} onKeyDown={e => e.key === 'Enter' && go()} /></div>
        {err && <div className="text-[var(--r)] text-sm mb-3">{err}</div>}
        <button className="w-full py-3 rounded-lg bg-[var(--ac)] text-white text-sm font-semibold cursor-pointer hover:bg-[var(--ach)] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 border-none" onClick={go} disabled={busy}>{busy ? 'Please wait...' : tab === 'in' ? 'Sign In' : 'Create Account'} {!busy && IC.arrow}</button>
      </div>
    </div>
  );
}

// ─── STRATEGIES PAGE ───
function StratsPage({ strats, onSelect, onAdd, onEdit, onDel, userId }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editS, setEditS] = useState(null);
  const [delS, setDelS] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const tagC = ['bg-[var(--acb)] text-[var(--ac)]', 'bg-[var(--gb)] text-[var(--g)]', 'bg-[var(--amb)] text-[var(--am)]', 'bg-[var(--pb)] text-[var(--p)]', 'bg-[var(--tlb)] text-[var(--tl)]'];

  const filtered = strats.filter(s => {
    if (filter === 'mine' && s.authorId !== userId) return false;
    if (filter === 'community' && s.authorId === userId) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div><div className="text-2xl font-bold">Strategy Repository</div><div className="text-[var(--t2)] text-sm mt-0.5">Browse community strategies or create your own</div></div>
        <button className="px-5 py-2.5 rounded-lg bg-[var(--ac)] text-white text-sm font-semibold cursor-pointer hover:bg-[var(--ach)] flex items-center gap-1.5 border-none" onClick={() => setShowAdd(true)}>{IC.plus} New Strategy</button>
      </div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {['all', 'mine', 'community'].map(f => <button key={f} className={`px-4 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${filter === f ? 'bg-[var(--ac)] border-[var(--ac)] text-white' : 'bg-transparent border-[var(--bd)] text-[var(--t2)] hover:border-[var(--t3)]'}`} onClick={() => setFilter(f)}>{f === 'all' ? 'All' : f === 'mine' ? 'My Strategies' : 'Community'}</button>)}
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="ml-auto px-3.5 py-1.5 bg-[var(--bg1)] border border-[var(--bd)] rounded-full text-[var(--t1)] text-xs outline-none w-[200px]" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--t2)]"><div className="text-base mb-3.5">No strategies found</div><button className="px-4 py-2 rounded-lg bg-[var(--ac)] text-white text-xs font-semibold cursor-pointer border-none" onClick={() => setShowAdd(true)}>{IC.plus} Create One</button></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filtered.map(s => (
            <div key={s._id} className="bg-[var(--bg2)] border border-[var(--bd)] rounded-2xl p-5 cursor-pointer transition-all hover:border-[var(--ac)] hover:-translate-y-0.5 hover:shadow-2xl relative" onClick={() => onSelect(s)}>
              {s.authorId === userId && (
                <div className="absolute top-4 right-4 flex gap-1.5 z-10" onClick={e => e.stopPropagation()}>
                  <button className="w-[30px] h-[30px] rounded-md flex items-center justify-center border border-[var(--bd)] bg-[var(--bg3)] text-[var(--t2)] cursor-pointer hover:text-[var(--t1)] hover:border-[var(--t3)]" onClick={() => setEditS(s)}>{IC.edit}</button>
                  <button className="w-[30px] h-[30px] rounded-md flex items-center justify-center border border-[var(--bd)] bg-[var(--bg3)] text-[var(--t2)] cursor-pointer hover:text-[var(--r)] hover:border-[var(--r)] hover:bg-[var(--rb)]" onClick={() => setDelS(s)}>{IC.trash}</button>
                </div>
              )}
              <div className="mb-2" style={{ paddingRight: s.authorId === userId ? 70 : 0 }}><div className="text-base font-bold">{s.title}</div><div className="text-xs text-[var(--t2)] mt-0.5">by {s.author} · {s.market}</div></div>
              <div className="text-sm text-[var(--t2)] leading-relaxed mb-3 line-clamp-2">{s.description}</div>
              <div className="flex gap-1.5 flex-wrap mb-3">{s.tags?.map((t, i) => <span key={t} className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${tagC[i % tagC.length]}`}>{t}</span>)}</div>
              <div className="flex gap-4 text-xs text-[var(--t3)]">
                <span className="flex items-center gap-1">{IC.check} {s.checklist?.length || 0} checks</span>
                <span className="flex items-center gap-1">{IC.star} <b className="font-mono">{s.rating || '—'}</b></span>
                <span className="flex items-center gap-1">{IC.fire} <b className="font-mono">{s.uses || 0}</b></span>
                {s.winRate > 0 && <span className="flex items-center gap-1">{IC.chart} <b className="font-mono text-[var(--g)]">{s.winRate}%</b></span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <StratFormModal user={{ id: userId, username: strats[0]?.author || 'User' }} onClose={() => setShowAdd(false)} onSave={s => { onAdd(s); setShowAdd(false); }} />}
      {editS && <StratFormModal user={{ id: userId }} existing={editS} onClose={() => setEditS(null)} onSave={s => { onEdit(s); setEditS(null); }} />}
      {delS && <Confirm title="Delete Strategy?" msg={`Delete "${delS.title}"? All trades using this strategy will also be removed.`} onNo={() => setDelS(null)} onYes={() => { onDel(delS._id); setDelS(null); }} />}
    </div>
  );
}

// ─── STRATEGY DETAIL (CHECKLIST) ───
function StratDetail({ strat, onBack, onAddTrade }) {
  const [ck, setCk] = useState(new Set());
  const [showSave, setShowSave] = useState(false);
  const allOk = strat.checklist?.length > 0 && ck.size === strat.checklist.length;
  const prog = strat.checklist?.length > 0 ? (ck.size / strat.checklist.length) * 100 : 0;
  const toggle = i => { const n = new Set(ck); n.has(i) ? n.delete(i) : n.add(i); setCk(n); };

  return (
    <div className="max-w-[800px]">
      <div className="inline-flex items-center gap-1.5 text-[var(--t2)] text-sm cursor-pointer mb-4 hover:text-[var(--ac)]" onClick={onBack}>{IC.back} Back to strategies</div>
      <div className="text-2xl font-bold mb-1">{strat.title}</div>
      <div className="text-sm text-[var(--t2)]">by {strat.author} · {strat.market} · {strat.timeframe}</div>
      <div className="flex gap-1.5 mt-2.5">{strat.tags?.map(t => <span key={t} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--acb)] text-[var(--ac)]">{t}</span>)}</div>
      {strat.description && <p className="text-sm text-[var(--t2)] leading-relaxed mt-2.5">{strat.description}</p>}

      <div className="bg-[var(--bg2)] border border-[var(--bd)] rounded-2xl p-5 mt-5">
        <div className="text-sm font-bold mb-3.5 flex items-center gap-2">{IC.check} Pre-Trade Checklist</div>
        {strat.checklist?.map((it, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 px-3.5 rounded-lg mb-1 cursor-pointer hover:bg-[var(--bg3)] transition-all text-sm" onClick={() => toggle(i)}>
            <div className={`w-[22px] h-[22px] rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${ck.has(i) ? 'bg-[var(--g)] border-[var(--g)] text-white' : 'border-[var(--bd)]'}`}>{ck.has(i) && IC.check}</div>
            <span className={`transition-all ${ck.has(i) ? 'text-[var(--t1)] line-through decoration-[var(--t3)]' : 'text-[var(--t2)]'}`}>{it}</span>
          </div>
        ))}
        <div className="flex items-center gap-3 mt-3.5">
          <div className="flex-1 h-1.5 bg-[var(--bg1)] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[var(--ac)] to-[var(--g)] rounded-full transition-all duration-400" style={{ width: `${prog}%` }} /></div>
          <span className="text-xs font-semibold text-[var(--t2)] font-mono">{ck.size}/{strat.checklist?.length || 0}</span>
        </div>
        {allOk && <button className="w-full mt-3.5 py-2.5 rounded-lg bg-[var(--gb)] text-[var(--g)] border border-[rgba(16,185,129,.2)] text-sm font-semibold cursor-pointer hover:bg-[var(--gb2)] flex items-center justify-center gap-1.5" onClick={() => setShowSave(true)}>{IC.plus} All Checks Passed — Log a Trade</button>}
        {!allOk && ck.size > 0 && <p className="text-xs text-[var(--am)] mt-2.5">Complete all items to log a trade.</p>}
      </div>

      {showSave && <SaveTradeModal strategy={strat} conf={Math.round(prog)} onClose={() => setShowSave(false)} onSave={t => { onAddTrade(t); setShowSave(false); setCk(new Set()); }} />}
    </div>
  );
}

// ─── HISTORY PAGE ───
function HistoryPage({ trades, strats, onDelete, onUpdate }) {
  const [filter, setFilter] = useState('All');
  const [viewT, setViewT] = useState(null);
  const [editT, setEditT] = useState(null);
  const [delT, setDelT] = useState(null);

  const filtered = trades.filter(t => {
    if (filter === 'Before') return t.outcome === 'Before';
    if (filter === 'Win') return t.outcome === 'Win';
    if (filter === 'Loss') return t.outcome === 'Loss';
    if (filter === 'Breakeven') return t.outcome === 'Break-Even';
    return true;
  });

  return (
    <div>
      <div className="mb-6"><div className="text-2xl font-bold">Trading History</div><div className="text-[var(--t2)] text-sm mt-0.5">View and manage your trading journal</div></div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {['All', 'Before', 'Win', 'Loss', 'Breakeven'].map(f => <button key={f} className={`px-4 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${filter === f ? 'bg-[var(--ac)] border-[var(--ac)] text-white' : 'bg-transparent border-[var(--bd)] text-[var(--t2)]'}`} onClick={() => setFilter(f)}>{f}</button>)}
      </div>

      {filtered.length === 0 ? <div className="text-center py-12 text-[var(--t2)]">No trades found</div> : (
        <div>{filtered.map(t => {
          const st = strats.find(s => s._id === t.strategyId);
          return (
            <div key={t._id} className="bg-[var(--bg2)] border border-[var(--bd)] rounded-2xl p-5 mb-3 hover:border-[var(--bdl)] transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.direction === 'LONG' ? 'bg-[var(--gb)] text-[var(--g)]' : 'bg-[var(--rb)] text-[var(--r)]'}`}>{t.direction === 'LONG' ? IC.trendUp : IC.trendDown}</div>
                <div><div className="text-base font-bold">{t.symbol}</div><div className="text-xs text-[var(--t2)]">{t.direction}</div></div>
                <div className="ml-auto"><span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${t.outcome === 'Win' ? 'bg-[var(--gb)] text-[var(--g)]' : t.outcome === 'Loss' ? 'bg-[var(--rb)] text-[var(--r)]' : t.outcome === 'Break-Even' ? 'bg-[var(--amb)] text-[var(--am)]' : 'bg-[var(--acb)] text-[var(--ac)]'}`}>{t.outcome === 'Break-Even' ? 'BREAKEVEN' : t.outcome.toUpperCase()}</span></div>
              </div>
              <div className="flex justify-between text-sm py-1 text-[var(--t2)]"><span>Confluence:</span><span className="text-[var(--ac)] font-mono font-medium">{t.confluenceScore}%</span></div>
              <div className="flex justify-between text-sm py-1 text-[var(--t2)]"><span>Date:</span><span className="text-[var(--t1)] font-mono font-medium">{t.entryDate}</span></div>
              {t.pnl !== 0 && <div className="flex justify-between text-sm py-1 text-[var(--t2)]"><span>P&L:</span><span className={`font-mono font-bold ${t.pnl >= 0 ? 'text-[var(--g)]' : 'text-[var(--r)]'}`}>{fmtM(t.pnl)}</span></div>}
              {t.notes && <div className="text-xs text-[var(--t2)] mt-2 pt-2 border-t border-[var(--bd)] leading-relaxed">{t.notes}</div>}
              <div className="flex gap-2 mt-3.5">
                <button className="flex-1 py-2.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center gap-1 bg-[var(--acb)] border border-[rgba(217,119,87,.2)] text-[var(--ac)] hover:bg-[rgba(217,119,87,.2)]" onClick={() => setViewT(t)}>{IC.eye} View</button>
                <button className="flex-1 py-2.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center gap-1 bg-[var(--bg3)] border border-[var(--bd)] text-[var(--t1)] hover:border-[var(--t3)]" onClick={() => setEditT(t)}>{IC.edit} Update Trade</button>
                <button className="py-2.5 px-3 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center bg-[var(--rb)] border border-[rgba(239,68,68,.15)] text-[var(--r)] hover:bg-[var(--rb2)]" onClick={() => setDelT(t)}>{IC.trash}</button>
              </div>
            </div>
          );
        })}</div>
      )}

      {viewT && <ViewTradeModal trade={viewT} strategy={strats.find(s => s._id === viewT.strategyId)} onClose={() => setViewT(null)} />}
      {editT && <SaveTradeModal editing strategy={strats.find(s => s._id === editT.strategyId) || strats[0]} existing={editT} conf={editT.confluenceScore} onClose={() => setEditT(null)} onSave={t => { onUpdate(t); setEditT(null); }} />}
      {delT && <Confirm title="Delete Trade?" msg={`Delete ${delT.symbol} trade from ${delT.entryDate}?`} onNo={() => setDelT(null)} onYes={() => { onDelete(delT._id); setDelT(null); }} />}
    </div>
  );
}

// ─── DASHBOARD PAGE ───
function DashPage({ trades }) {
  const [cM, setCM] = useState(new Date().getMonth());
  const [cY, setCY] = useState(new Date().getFullYear());

  const tp = trades.reduce((a, t) => a + t.pnl, 0);
  const ws = trades.filter(t => t.outcome === 'Win');
  const ls = trades.filter(t => t.outcome === 'Loss');
  const tpr = ws.reduce((a, t) => a + t.pnl, 0);
  const tls = Math.abs(ls.reduce((a, t) => a + t.pnl, 0));
  const resolved = trades.filter(t => t.outcome !== 'Before');
  const wr = resolved.length > 0 ? (ws.length / resolved.length * 100) : 0;
  const pf = tls > 0 ? tpr / tls : 0;
  const ac = trades.length > 0 ? Math.round(trades.reduce((a, t) => a + (t.confluenceScore || 0), 0) / trades.length) : 0;
  const lw = ws.length > 0 ? Math.max(...ws.map(t => t.pnl)) : 0;
  const ll = ls.length > 0 ? Math.min(...ls.map(t => t.pnl)) : 0;
  const bs = useMemo(() => { let mx = 0, c = 0; [...trades].sort((a, b) => (a.entryDate || '').localeCompare(b.entryDate || '')).forEach(t => { if (t.outcome === 'Win') { c++; mx = Math.max(mx, c); } else c = 0; }); return mx; }, [trades]);

  const cd = useMemo(() => { const m = {}; trades.forEach(t => { const d = t.entryDate; if (!d) return; if (!m[d]) m[d] = { pnl: 0, w: 0, l: 0 }; m[d].pnl += t.pnl; if (t.outcome === 'Win') m[d].w++; if (t.outcome === 'Loss') m[d].l++; }); return m; }, [trades]);

  const dim = new Date(cY, cM + 1, 0).getDate();
  const fd = new Date(cY, cM, 1).getDay();
  const mn = new Date(cY, cM).toLocaleString('default', { month: 'long' });
  const td = new Date();
  const isT = d => td.getDate() === d && td.getMonth() === cM && td.getFullYear() === cY;
  const cds = []; for (let i = 0; i < fd; i++) cds.push(null); for (let d = 1; d <= dim; d++) cds.push(d);

  const wks = useMemo(() => {
    const w = [[], [], [], [], []]; for (let d = 1; d <= dim; d++) { const wi = Math.floor((d + fd - 1) / 7); if (wi < 5) w[wi].push(d); }
    return w.filter(x => x.length > 0).map((x, i) => { let p = 0, dy = 0; x.forEach(d => { const k = `${cY}-${String(cM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`; if (cd[k]) { p += cd[k].pnl; dy++; } }); return { l: `Week ${i + 1}`, p, d: dy }; });
  }, [cd, cM, cY, dim, fd]);

  const lt = trades.filter(t => t.direction === 'LONG' && t.outcome !== 'Before');
  const st = trades.filter(t => t.direction === 'SHORT' && t.outcome !== 'Before');
  const lwr = lt.length > 0 ? (lt.filter(t => t.outcome === 'Win').length / lt.length * 100).toFixed(0) : 0;
  const swr = st.length > 0 ? (st.filter(t => t.outcome === 'Win').length / st.length * 100).toFixed(0) : 0;
  const pn = trades.filter(t => t.outcome === 'Before').length;

  const pm = () => { if (cM === 0) { setCM(11); setCY(y => y - 1); } else setCM(m => m - 1); };
  const nm = () => { if (cM === 11) { setCM(0); setCY(y => y + 1); } else setCM(m => m + 1); };
  const gt = () => { setCM(td.getMonth()); setCY(td.getFullYear()); };

  const StatCard = ({ label, value, color, icon, iconBg }) => (
    <div className="bg-[var(--bg2)] border border-[var(--bd)] rounded-2xl p-4 flex items-center gap-3">
      <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg, color }}>{icon}</div>
      <div><div className="text-[11px] text-[var(--t2)]">{label}</div><div className="text-lg font-bold font-mono mt-0.5" style={{ color }}>{value}</div></div>
    </div>
  );

  return (
    <div>
      <div className="mb-6"><div className="text-2xl font-bold">Trading Dashboard</div><div className="text-[var(--t2)] text-sm mt-0.5">Your trading performance at a glance</div></div>

      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-4">
        <div className="bg-[var(--bg2)] border border-[var(--bd)] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[var(--acb)] flex items-center justify-center text-[var(--ac)] z-10">{IC.dollar}</div>
          <div className="text-xs text-[var(--t2)] mb-1.5">Net Profit & Loss</div>
          <div className={`text-4xl font-bold font-mono ${tp >= 0 ? 'text-[var(--g)]' : 'text-[var(--r)]'}`}>${tp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-[var(--t2)] mt-1">+ {trades.length} trades completed</div>
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            {[{ l: 'Win Rate', v: `${wr.toFixed(0)}%` }, { l: 'Profit Factor', v: pf.toFixed(2) }, { l: 'Avg Confluence', v: `${ac}%` }].map(m => (
              <div key={m.l} className="bg-[var(--bg3)] rounded-lg p-3"><div className="text-[11px] text-[var(--t3)]">{m.l}</div><div className="text-base font-bold font-mono mt-0.5">{m.v}</div></div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex-1 rounded-2xl p-4 relative overflow-hidden bg-gradient-to-br from-[rgba(16,185,129,.12)] to-[rgba(16,185,129,.04)] border border-[rgba(16,185,129,.15)]">
            <div className="absolute top-3 right-3 text-[var(--t3)] opacity-50">{IC.trendUp}</div>
            <div className="text-[11px] text-[var(--t2)]">Total Profit</div>
            <div className="text-xl font-bold font-mono mt-1 text-[var(--g)]">${tpr.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="text-[11px] text-[var(--t3)] mt-0.5">{ws.length} winning trades</div>
          </div>
          <div className="flex-1 rounded-2xl p-4 relative overflow-hidden bg-gradient-to-br from-[rgba(239,68,68,.12)] to-[rgba(239,68,68,.04)] border border-[rgba(239,68,68,.15)]">
            <div className="absolute top-3 right-3 text-[var(--t3)] opacity-50">{IC.trendDown}</div>
            <div className="text-[11px] text-[var(--t2)]">Total Loss</div>
            <div className="text-xl font-bold font-mono mt-1 text-[var(--r)]">${tls.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="text-[11px] text-[var(--t3)] mt-0.5">{ls.length} losing trades</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Largest Win" value={`$${lw.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} color="var(--g)" icon={IC.trophy} iconBg="var(--pb)" />
        <StatCard label="Largest Loss" value={`$${Math.abs(ll).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} color="var(--r)" icon={IC.target} iconBg="var(--amb)" />
        <StatCard label="Best Streak" value={bs} color="var(--ac)" icon={IC.fire} iconBg="var(--acb)" />
        <StatCard label="Total Trades" value={trades.length} color="var(--tl)" icon={IC.chart} iconBg="var(--tlb)" />
      </div>

      {/* Calendar */}
      <div className="text-base font-bold mb-3.5 flex items-center gap-2">{IC.calendar} Trading Calendar</div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 mb-5">
        <div className="bg-[var(--bg2)] border border-[var(--bd)] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <button className="px-3 py-1 text-[11px] font-semibold rounded-md bg-[var(--ac)] text-white border-none cursor-pointer" onClick={gt}>TODAY</button>
            <div className="flex items-center gap-2 ml-auto">
              <button className="bg-transparent border-none text-[var(--t2)] cursor-pointer p-1 hover:text-[var(--t1)]" onClick={pm}>{IC.chevL}</button>
              <div className="text-base font-bold min-w-[140px] text-center">{mn} {cY}</div>
              <button className="bg-transparent border-none text-[var(--t2)] cursor-pointer p-1 hover:text-[var(--t1)]" onClick={nm}>{IC.chevR}</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-center text-[11px] font-semibold text-[var(--t3)] py-1.5">{d}</div>)}
            {cds.map((d, i) => {
              if (d === null) return <div key={`e${i}`} className="cal-day empty" />;
              const k = `${cY}-${String(cM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const dt = cd[k];
              let cls = 'cal-day';
              if (isT(d)) cls += ' today';
              if (dt) { if (dt.w > 0 && dt.l === 0) cls += ' has-win'; else if (dt.l > 0 && dt.w === 0) cls += ' has-loss'; else if (dt.w > 0 && dt.l > 0) cls += ' has-mix'; }
              return <div key={d} className={cls}><span>{d}</span>{dt && <span className="text-[9px] font-mono font-semibold mt-auto" style={{ color: dt.pnl >= 0 ? 'var(--g)' : 'var(--r)' }}>{dt.pnl >= 0 ? '+' : ''}{dt.pnl.toFixed(0)}</span>}</div>;
            })}
          </div>
        </div>
        <div className="bg-[var(--bg2)] border border-[var(--bd)] rounded-2xl p-5">
          <div className="text-base font-bold mb-3.5">Weekly Summary</div>
          {wks.map((w, i) => (
            <div key={i} className="bg-[var(--bg3)] rounded-xl p-3.5 mb-2">
              <div className="flex justify-between items-center"><span className="text-xs font-semibold text-[var(--t2)]">{w.l}</span><span className="text-[var(--ac)]">{IC.trendUp}</span></div>
              <div className="text-xl font-bold font-mono" style={{ color: w.p > 0 ? 'var(--g)' : w.p < 0 ? 'var(--r)' : 'var(--t1)' }}>${w.p.toLocaleString(undefined, { minimumFractionDigits: 0 })}</div>
              <div className="text-[11px] text-[var(--t3)]">{w.d} days</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <div className="bg-[var(--bg2)] border border-[var(--bd)] rounded-2xl p-5">
          <div className="text-base font-bold mb-4 flex items-center gap-2">{IC.chart} Performance Breakdown</div>
          <div className="flex justify-between items-center mb-3.5 text-sm"><span>Win Rate</span><span className="font-mono font-bold">{wr.toFixed(0)}%</span></div>
          <div className="flex gap-2.5 mb-4">
            <div className="flex-1 rounded-xl p-3.5 bg-[var(--gb)]"><div className="text-[11px] text-[var(--t2)]">Long Trades</div><div className="text-lg font-bold font-mono mt-0.5 text-[var(--g)]">{lwr}%</div><div className="text-[11px] text-[var(--t3)] mt-0.5">Win Rate</div></div>
            <div className="flex-1 rounded-xl p-3.5 bg-[var(--pb)]"><div className="text-[11px] text-[var(--t2)]">Short Trades</div><div className="text-lg font-bold font-mono mt-0.5 text-[var(--p)]">{swr}%</div><div className="text-[11px] text-[var(--t3)] mt-0.5">Win Rate</div></div>
          </div>
          <div className="flex justify-around pt-3 border-t border-[var(--bd)]">
            {[{ v: ws.length, l: 'Wins', c: 'var(--g)' }, { v: ls.length, l: 'Losses', c: 'var(--r)' }, { v: pn, l: 'Pending', c: 'var(--am)' }].map(p => (
              <div key={p.l} className="text-center"><div className="text-lg font-bold font-mono" style={{ color: p.c }}>{p.v}</div><div className="text-[11px] text-[var(--t3)] mt-0.5">{p.l}</div></div>
            ))}
          </div>
        </div>
        <div className="bg-[var(--bg2)] border border-[var(--bd)] rounded-2xl p-5">
          <div className="text-base font-bold mb-4 flex items-center gap-2">{IC.calendar} Recent Trades</div>
          {trades.length === 0 ? <div className="text-center py-8 text-[var(--t2)] text-sm">No trades yet</div> : (
            <div className="flex flex-col gap-2">
              {[...trades].sort((a, b) => (b.entryDate || '').localeCompare(a.entryDate || '')).slice(0, 6).map(t => (
                <div key={t._id} className="flex items-center justify-between p-2.5 px-3 bg-[var(--bg3)] rounded-lg">
                  <div><div className="font-semibold text-sm">{t.symbol}</div><div className="text-[11px] text-[var(--t3)] mt-0.5">{t.entryDate} · {t.direction}</div></div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${t.outcome === 'Win' ? 'bg-[var(--gb)] text-[var(--g)]' : t.outcome === 'Loss' ? 'bg-[var(--rb)] text-[var(--r)]' : 'bg-[var(--amb)] text-[var(--am)]'}`}>{t.outcome}</span>
                    <span className={`font-mono font-bold text-sm ${t.pnl >= 0 ? 'text-[var(--g)]' : 'text-[var(--r)]'}`}>{fmtM(t.pnl)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ───
export default function Home() {
  const { data: session, status } = useSession();
  const [page, setPage] = useState('checklist');
  const [strats, setStrats] = useState([]);
  const [trades, setTrades] = useState([]);
  const [sel, setSel] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = (msg, type = 's') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };

  // Load data when logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      (async () => {
        try {
          const [s, t] = await Promise.all([api.getStrategies(), api.getTrades(session.user.id)]);
          setStrats(Array.isArray(s) ? s : []);
          setTrades(Array.isArray(t) ? t : []);
        } catch (e) { console.error('Load error:', e); }
        setLoading(false);
      })();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, session]);

  // Strategy CRUD
  const addStrat = async (data) => {
    data.authorId = session.user.id;
    data.author = session.user.username;
    const res = await api.createStrategy(data);
    if (res._id) { setStrats(p => [res, ...p]); toast('Strategy created!'); }
  };
  const editStrat = async (data) => {
    const res = await api.updateStrategy(data);
    if (res._id) { setStrats(p => p.map(s => s._id === res._id ? res : s)); toast('Strategy updated!'); if (sel?._id === res._id) setSel(res); }
  };
  const delStrat = async (id) => {
    await api.deleteStrategy(id);
    setStrats(p => p.filter(s => s._id !== id));
    setTrades(p => p.filter(t => t.strategyId !== id));
    toast('Strategy deleted', 'e');
    if (sel?._id === id) setSel(null);
  };

  // Trade CRUD
  const addTrade = async (data) => {
    data.userId = session.user.id;
    const res = await api.createTrade(data);
    if (res._id) { setTrades(p => [res, ...p]); toast(`Trade logged: ${res.symbol}`); }
  };
  const updateTrade = async (data) => {
    const res = await api.updateTrade(data);
    if (res._id) { setTrades(p => p.map(t => t._id === res._id ? res : t)); toast('Trade updated!'); }
  };
  const delTrade = async (id) => {
    await api.deleteTrade(id);
    setTrades(p => p.filter(t => t._id !== id));
    toast('Trade deleted', 'e');
  };

  // Loading state
  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--bg0)] flex-col gap-3"><div className="spinner" /><div className="text-[var(--t2)] text-sm">Loading TradeVault...</div></div>;
  }

  // Not logged in
  if (!session) return <><AuthPage /><Toasts items={toasts} /></>;

  const user = session.user;
  const nav = [
    { id: 'checklist', label: 'Checklist', icon: IC.logo },
    { id: 'history', label: 'History', icon: IC.journal },
    { id: 'dashboard', label: 'Dashboard', icon: IC.chart },
  ];

  return (
    <div>
      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 h-[52px] bg-[var(--bg1)] border-b border-[var(--bd)] flex items-center px-6 z-[100] gap-2">
        <div className="flex items-center gap-2 text-base font-bold text-[var(--ac)] mr-7">{IC.logo} TradeVault</div>
        {nav.map(n => (
          <button key={n.id} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-1.5 border-none cursor-pointer transition-all ${page === n.id && !sel ? 'bg-[var(--ac)] text-white' : 'bg-transparent text-[var(--t2)] hover:text-[var(--t1)] hover:bg-[var(--bg2)]'}`} onClick={() => { setPage(n.id); setSel(null); }}>
            {n.icon} {n.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm font-semibold">{user.username}</span>
          <button className="px-3.5 py-1.5 text-xs font-semibold rounded-md border border-[var(--r)] bg-[var(--rb)] text-[var(--r)] cursor-pointer flex items-center gap-1 hover:bg-[var(--rb2)]" onClick={() => signOut()}>{IC.logout} Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-[52px] px-8 py-7 max-w-[1200px] mx-auto">
        {sel ? (
          <StratDetail strat={sel} onBack={() => setSel(null)} onAddTrade={addTrade} />
        ) : page === 'checklist' ? (
          <StratsPage strats={strats} onSelect={setSel} onAdd={addStrat} onEdit={editStrat} onDel={delStrat} userId={user.id} />
        ) : page === 'history' ? (
          <HistoryPage trades={trades} strats={strats} onDelete={delTrade} onUpdate={updateTrade} />
        ) : (
          <DashPage trades={trades} />
        )}
      </div>

      <Toasts items={toasts} />
    </div>
  );
}
