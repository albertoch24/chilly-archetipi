import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Ogni cambio di pagina riparte dall'alto: sul telefono altrimenti si atterra a metà della pagina nuova. */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
