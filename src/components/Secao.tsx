import type { ReactNode } from 'react';

type Tom = 'claro' | 'suave' | 'escuro';

const FUNDOS: Record<Tom, string> = {
  claro: 'bg-paper text-ink',
  suave: 'bg-mist text-ink',
  escuro: 'bg-ink text-paper',
};

/** Limita a largura do conteúdo e define as margens laterais. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

interface SecaoProps {
  tom?: Tom;
  id?: string;
  className?: string;
  /** Id do título da seção (para aria-labelledby). */
  rotuloId?: string;
  children: ReactNode;
}

/** Faixa de página com fundo claro, suave (mist) ou escuro. */
export function Secao({ tom = 'claro', id, className = '', rotuloId, children }: SecaoProps) {
  return (
    <section
      id={id}
      aria-labelledby={rotuloId}
      data-tone={tom === 'escuro' ? 'ink' : undefined}
      className={`py-16 sm:py-24 ${FUNDOS[tom]} ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Rótulo pequeno em caixa alta com tracking largo (no espírito do "↑ WISE UP"). */
export function Rotulo({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-label text-muted ${className}`}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-orange" />
      {children}
    </p>
  );
}

interface TituloProps {
  id?: string;
  children: ReactNode;
  nivel?: 1 | 2;
  className?: string;
}

/** Títulos grandes com tracking apertado. */
export function Titulo({ id, children, nivel = 2, className = '' }: TituloProps) {
  if (nivel === 1) {
    return (
      <h1 id={id} className={`text-4xl font-semibold leading-[1.05] tracking-display sm:text-5xl lg:text-7xl ${className}`}>
        {children}
      </h1>
    );
  }
  return (
    <h2 id={id} className={`text-3xl font-semibold leading-[1.1] tracking-display sm:text-4xl lg:text-5xl ${className}`}>
      {children}
    </h2>
  );
}
