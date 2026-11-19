import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Atraso em milissegundos (para escalonar vários blocos). */
  atraso?: number;
}

/** Faz o bloco aparecer suavemente quando entra na tela (IntersectionObserver). */
export function Reveal({ children, className = '', atraso = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisivel(true);
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setVisivel(true);
          observador.disconnect(); // só anima na primeira vez
        }
      },
      { threshold: 0.12 },
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={atraso ? { transitionDelay: `${atraso}ms` } : undefined}
      className={`reveal ${visivel ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
