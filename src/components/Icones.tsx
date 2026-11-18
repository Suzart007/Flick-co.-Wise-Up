// Ícones simples em SVG (sem biblioteca). Herdam a cor do texto (currentColor).
import type { ReactNode } from 'react';

interface IconeProps {
  className?: string;
}

function Base({ className = 'size-5', children }: IconeProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export const IconeSeta = (p: IconeProps) => (
  <Base {...p}><path d="M12 20V5M5.5 11.5 12 5l6.5 6.5" /></Base>
);
export const IconeSetaDireita = (p: IconeProps) => (
  <Base {...p}><path d="M4 12h16M13.5 5.5 20 12l-6.5 6.5" /></Base>
);
export const IconeSetaEsquerda = (p: IconeProps) => (
  <Base {...p}><path d="M20 12H4M10.5 5.5 4 12l6.5 6.5" /></Base>
);
export const IconeMenu = (p: IconeProps) => (
  <Base {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Base>
);
export const IconeFechar = (p: IconeProps) => (
  <Base {...p}><path d="M6 6l12 12M18 6 6 18" /></Base>
);
export const IconeMais = (p: IconeProps) => (
  <Base {...p}><path d="M12 5v14M5 12h14" /></Base>
);
export const IconeCheck = (p: IconeProps) => (
  <Base {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Base>
);
export const IconeAlerta = (p: IconeProps) => (
  <Base {...p}><path d="M12 8v5M12 16.5v.01" /><path d="M10.3 3.9 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></Base>
);
export const IconeInfo = (p: IconeProps) => (
  <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" /></Base>
);
export const IconeExterno = (p: IconeProps) => (
  <Base {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></Base>
);
export const IconeCopiar = (p: IconeProps) => (
  <Base {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a1 1 0 0 1 1-1h10" /></Base>
);
export const IconeLixeira = (p: IconeProps) => (
  <Base {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" /></Base>
);
export const IconeCadeado = (p: IconeProps) => (
  <Base {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Base>
);
