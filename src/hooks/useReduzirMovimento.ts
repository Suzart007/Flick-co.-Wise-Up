import { useEffect, useState } from 'react';

/** true quando a pessoa pediu menos movimento no sistema (prefers-reduced-motion). */
export function useReduzirMovimento(): boolean {
  const consulta = '(prefers-reduced-motion: reduce)';
  const [reduzir, setReduzir] = useState(() => window.matchMedia(consulta).matches);

  useEffect(() => {
    const midia = window.matchMedia(consulta);
    const aoMudar = () => setReduzir(midia.matches);
    midia.addEventListener('change', aoMudar);
    return () => midia.removeEventListener('change', aoMudar);
  }, []);

  return reduzir;
}
