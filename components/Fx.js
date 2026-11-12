'use client';
import { useEffect, useRef, useState } from 'react';

// Muncul halus saat di-scroll
export function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv ${on ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

// Angka naik dari 0
export function CountUp({ to, ms = 1400, suffix = '' }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let start, raf;
    const tick = (t) => {
      start = start ?? t;
      const k = Math.min((t - start) / ms, 1);
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return <>{v}{suffix}</>;
}

// Bar skor yang terisi animasi
export function Bar({ value }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 150); return () => clearTimeout(t); }, [value]);
  return <div className="bar"><i style={{ width: `${w}%` }} /></div>;
}
