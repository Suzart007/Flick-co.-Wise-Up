import type { ReactNode } from 'react';

interface EmptyStateProps {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}

/** Tela de "nada por aqui" (lista vazia, resultado não encontrado). */
export function EmptyState({ titulo, descricao, acao }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <span aria-hidden="true" className="flex size-14 items-center justify-center rounded-full bg-ink">
        <span className="size-3 rounded-full bg-orange" />
      </span>
      <h2 className="text-2xl font-semibold tracking-display">{titulo}</h2>
      {descricao && <p className="text-gray-600">{descricao}</p>}
      {acao && <div className="mt-2">{acao}</div>}
    </div>
  );
}
