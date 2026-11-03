import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Automatically scrolls the page when route or hash changes in a SPA.
 * Handles both smooth hash anchor navigation and top scrolling for new pages.
 */
export const ScrollToAnchor = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      // Slight delay to allow dynamic React component render / data fetching
      const timeout = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);

      return () => clearTimeout(timeout);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
};
export default ScrollToAnchor;
