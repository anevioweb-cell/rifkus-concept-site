import { useEffect, useRef } from 'react';
import { Outlet, ScrollRestoration, useLocation, useMatches } from 'react-router';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import { useLocale } from '../hooks/useLocale.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { ConceptBadge } from '../components/ConceptBadge.jsx';
import { Seo } from '../components/Seo.jsx';
import { SmoothScroll } from '../components/SmoothScroll.jsx';

/** Deepest route handle ({ routeId, noindex }). */
function useRouteHandle() {
  const matches = useMatches();
  return [...matches].reverse().find((match) => match.handle?.routeId)?.handle ?? null;
}

function Shell() {
  const { t } = useLocale();
  const { pathname } = useLocation();
  const handle = useRouteHandle();
  const mainRef = useRef(null);
  const lastPathname = useRef(pathname);
  // Home: on phones the concept badge sits low enough to clear the hero's names row.
  const isHome = handle?.routeId === 'home';

  // After client-side navigation, move focus to <main> so screen readers
  // start at the new content. Comparing paths (not a "first render" flag)
  // keeps StrictMode's double effect run from stealing focus on load.
  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      {handle && !handle.ownSeo && <Seo routeId={handle.routeId} noindex={handle.noindex} />}
      <a href="#main" className="skip-link">
        {t('a11y.skipToContent')}
      </a>
      <Navbar />
      <main ref={mainRef} id="main" tabIndex={-1} className="min-h-dvh">
        <Outlet />
      </main>
      <Footer />
      {/* On the phone Home, the badge sits between the names row and the progress bar. */}
      <ConceptBadge className={isHome ? 'max-tablet:bottom-1.5' : ''} />
      <ScrollRestoration />
      <SmoothScroll />
    </>
  );
}

/** Wraps every page: motion features (lazy) and the reduced-motion policy. */
export function RootLayout() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Shell />
      </MotionConfig>
    </LazyMotion>
  );
}
