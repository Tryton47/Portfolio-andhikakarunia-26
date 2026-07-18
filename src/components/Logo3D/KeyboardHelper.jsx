'use client';

export default function KeyboardHelper() {
  return (
    <div className="text-center text-xs text-slate-500 mt-3 font-mono tracking-wide select-none">
      <span className="opacity-60">Tekan&nbsp;</span>
      {['D', 'F', 'C', 'V'].map((k) => (
        <kbd
          key={k}
          className="inline-block px-2 py-0.5 mx-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/60"
        >
          {k}
        </kbd>
      ))}
      <span className="opacity-60">&nbsp;ganti kategori&nbsp;·&nbsp;</span>
      <kbd className="inline-block px-2 py-0.5 mx-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/60">
        Space
      </kbd>
      <span className="opacity-60">&nbsp;autoplay&nbsp;·&nbsp;</span>
      <kbd className="inline-block px-2 py-0.5 mx-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/60">
        Drag
      </kbd>
      <span className="opacity-60">&nbsp;putar logo</span>
    </div>
  );
}
