import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, m } from 'motion/react';
import { legalNav, primaryNav } from '../config/navigation.js';
import { duration } from '../config/motion.js';
import { useLocale } from '../hooks/useLocale.js';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { useScrollLock } from '../hooks/useScrollLock.js';
import { Clock } from './Clock.jsx';
import { Wordmark } from './Wordmark.jsx';
import { ArrowIcon, CloseIcon, MenuIcon } from './icons/index.jsx';

const navLinkClass = ({ isActive }) =>
  [
    'inline-flex min-h-11 min-w-11 items-center justify-center text-ui font-semibold uppercase underline-offset-4 transition-colors duration-(--duration-link) ease-link hover:underline',
    isActive ? 'underline' : '',
  ].join(' ');

/**
 * Fixed top bar measured on the reference.
 * - Tablet and desktop (≥ 810 px): 60 px, transparent over a black top
 *   scrim; wordmark at the start, 4 uppercase links centered (underlined
 *   when active or hovered), the Algiers clock at the end.
 * - Phone: 66 px solid ink bar; wordmark, centered clock, menu button. The
 *   menu is a full-screen overlay (fade 250 ms) that traps focus, closes on
 *   Escape / navigation and returns focus to the button. Big
 *   start-aligned rows (56 px) and a Close button at the bottom (thumb
 *   reach), with safe-area padding.
 * On a first load of Home the bar drops in (CSS, part of the hero sequence).
 */
export function Navbar() {
  const { t } = useLocale();
  const { pathname } = useLocation();
  const [firstPath] = useState(pathname);
  const [openedAt, setOpenedAt] = useState(null);
  const isTablet = useMediaQuery('(min-width: 50.625rem)');
  const open = openedAt === pathname && !isTablet;
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);
  const menuId = useId();

  const close = useCallback(({ restoreFocus = true } = {}) => {
    setOpenedAt(null);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useFocusTrap(menuRef, open, close);
  useScrollLock(open);

  useEffect(() => {
    if (open) panelRef.current?.querySelector('a')?.focus();
  }, [open]);

  const intro = firstPath === '/' ? 'animate-hero-nav' : '';

  return (
    <header ref={menuRef} className="fixed inset-x-0 top-0 z-40">
      {/* The intro drop-in animates the bar only: a transform on <header>
          would become the containing block of the fixed menu panel. */}
      <div className={`relative flex h-nav items-center justify-between bg-ink px-gutter tablet:bg-transparent ${intro}`}>
        {/* Top scrim (reference: black 40 % to 52 %, then transparent). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 hidden bg-linear-to-b from-black/40 via-black/40 via-52% to-transparent tablet:block"
        />
        <Link to="/" aria-label={t('a11y.home')} className="inline-flex min-h-11 items-center">
          <Wordmark className="text-title" />
        </Link>

        <nav aria-label={t('a11y.mainNav')} className="absolute start-1/2 hidden -translate-x-1/2 tablet:block">
          <ul className="flex items-center gap-3.5">
            {primaryNav.map((item) => (
              <li key={item.key}>
                <NavLink to={item.path} end={item.path === '/'} className={navLinkClass}>
                  {t(`nav.${item.key}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Phone: centered in the gap between wordmark and menu button (reference). */}
        <Clock className="flex-1 px-2 text-center tablet:flex-none tablet:px-0 tablet:text-end" />

        <button
          ref={toggleRef}
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-ui tablet:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
          onClick={() => (open ? close() : setOpenedAt(pathname))}
        >
          {open ? <CloseIcon className="size-7" /> : <MenuIcon className="size-7" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id={menuId}
            key="menu"
            ref={panelRef}
            data-lenis-prevent
            className="fixed inset-x-0 top-nav bottom-0 flex flex-col justify-between gap-8 overflow-y-auto overscroll-contain bg-ink px-gutter pt-6 pb-[calc(1.5rem+var(--safe-bottom))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.menu, ease: 'easeOut' }}
          >
            <nav aria-label={t('a11y.mainNav')}>
              <ul className="flex flex-col">
                {primaryNav.map((item) => (
                  <li key={item.key} className="border-b border-white/12">
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `group flex min-h-14 items-center justify-between gap-4 text-title font-medium underline-offset-4 hover:underline ${isActive ? 'text-brand' : ''}`
                      }
                    >
                      {t(`nav.${item.key}`)}
                      <ArrowIcon className="size-5 shrink-0" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col gap-6">
              <ul className="flex flex-wrap gap-x-5">
                {legalNav.map((item) => (
                  <li key={item.key}>
                    <NavLink to={item.path} className="inline-flex min-h-tap items-center text-ui font-semibold text-ash uppercase hover:underline">
                      {t(`nav.${item.key}`)}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => close()}
                className="inline-flex min-h-tap w-full items-center justify-center gap-2 rounded-ui border border-white/60 text-small"
              >
                <CloseIcon className="size-5" />
                {t('a11y.closeMenu')}
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
