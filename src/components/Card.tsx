import type { ReactNode } from 'react';

type Tom = 'claro' | 'escuro' | 'suave';

interface CardProps {
  tom?: Tom;
  as?: 'div' | 'article' | 'li' | 'section';
  className?: string;
  children: ReactNode;
}

const TONS: Record<Tom, string> = {
  claro: 'bg-paper border-gray-300 text-ink',
  suave: 'bg-gray-50 border-gray-200 text-ink',
  escuro: 'bg-ink border-ink text-paper',
};

/** Cartão com borda fina de 1px e cantos arredondados, sem sombra pesada. */
export function Card({ tom = 'claro', as: Tag = 'div', className = '', children }: CardProps) {
  const dataTone = tom === 'escuro' ? 'ink' : undefined;
  return (
    <Tag data-tone={dataTone} className={`rounded-3xl border p-6 sm:p-8 ${TONS[tom]} ${className}`}>
      {children}
    </Tag>
  );
}
