'use client';

import { useEffect, useState } from 'react';

interface NavLink {
  href: string;
  label: string;
  accent?: boolean;
}

interface MobileNavProps {
  links: NavLink[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="flex lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        className="flex flex-col justify-center gap-[5px] w-8 h-8 bg-transparent border-0 cursor-pointer text-text-2 hover:text-text transition-colors p-0"
      >
        <span
          className={`block h-px w-5 bg-current origin-center transition-transform duration-200 ${open ? 'translate-y-[6px] rotate-45' : ''}`}
        />
        <span
          className={`block h-px w-5 bg-current transition-opacity duration-200 ${open ? 'opacity-0' : ''}`}
        />
        <span
          className={`block h-px w-5 bg-current origin-center transition-transform duration-200 ${open ? '-translate-y-[6px] -rotate-45' : ''}`}
        />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 nav-backdrop"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Nav panel — slides down from below the sticky header */}
          <nav
            className="fixed inset-x-0 top-[var(--header-h)] z-50 bg-bg border-b border-border animate-fade-in"
            aria-label="Navegação mobile"
          >
            <ul className="list-none p-0 m-0 px-page py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block py-4 border-b border-border no-underline text-[0.9375rem] font-medium transition-colors ${
                      link.accent ? 'text-accent' : 'text-text-2 hover:text-text'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
