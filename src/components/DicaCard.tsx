import type { Dica } from '../types/api';
import { formatarData, urlSegura } from '../utils/textos';
import { IconeCheck, IconeExterno } from './Icones';

interface DicaCardProps {
  dica: Dica;
  /** Mostra o selo "Aplicada" (usado no resultado). */
  aplicada?: boolean;
}

/** Cartão de dica prática com a fonte sempre visível (nome, título, data e link). */
export function DicaCard({ dica, aplicada = false }: DicaCardProps) {
  const link = dica.fonte ? urlSegura(dica.fonte.url) : null;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-gray-300 bg-paper p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-ink px-3 py-1 text-xs font-semibold uppercase tracking-label">
          {dica.tipo}
        </span>
        {aplicada && (
          <span className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-label text-paper">
            <IconeCheck className="size-3.5 text-orange-soft" />
            Aplicada
          </span>
        )}
      </div>

      <p className="mt-4 text-lg font-medium leading-snug">{dica.descricao}</p>

      <div className="mt-auto border-t border-gray-300 pt-4 text-sm text-gray-700">
        <p className="text-xs font-semibold uppercase tracking-label text-gray-600">Fonte</p>
        {dica.fonte ? (
          <>
            <p className="mt-1">
              <span className="font-semibold text-ink">{dica.fonte.nome}</span> · {dica.fonte.titulo} ·{' '}
              {dica.fonte.dataPublicacao ? formatarData(dica.fonte.dataPublicacao) : 'data a confirmar'}
            </p>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-8 items-center gap-1.5 font-semibold text-ink underline decoration-orange decoration-2 underline-offset-4"
              >
                Abrir fonte
                <IconeExterno className="size-4" />
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            )}
          </>
        ) : (
          <p className="mt-1">[CONFIRMAR FONTE E DATA]</p>
        )}
      </div>
    </article>
  );
}
