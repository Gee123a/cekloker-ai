'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [['/', 'Beranda'], ['/scanner', 'AI Scanner'], ['/radar', 'Radar Blacklist'], ['/lapor', 'Lapor Kasus']];

export default function Nav() {
  const path = usePathname();
  const active = (h) => path === h || (h === '/scanner' && path === '/hasil');
  return (
    <header className="nav">
      <div className="w">
        <Link href="/" className="logo">
          <span className="lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" />
            </svg>
          </span>
          CekLoker.ai
        </Link>
        <nav className="nl">
          {LINKS.map(([h, t]) => (<Link key={h} href={h} className={active(h) ? 'on' : ''}>{t}</Link>))}
          <Link href="/scanner" className="btn">Scan Loker</Link>
        </nav>
      </div>
    </header>
  );
}
