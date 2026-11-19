import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { IconeMais } from './Icones';

export interface ItemAcordeao {
  id: string;
  titulo: string;
  conteudo: ReactNode;
}

/** Acordeão acessível: botões com aria-expanded e painéis ligados por aria-controls. */
export function Accordion({ itens }: { itens: ItemAcordeao[] }) {
  const base = useId();
  const [aberto, setAberto] = useState<string | null>(null);

  return (
    <div className="divide-y divide-gray-300 border-y border-gray-300">
      {itens.map((item) => {
        const estaAberto = aberto === item.id;
        const idBotao = `${base}-botao-${item.id}`;
        const idPainel = `${base}-painel-${item.id}`;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={idBotao}
                aria-expanded={estaAberto}
                aria-controls={idPainel}
                onClick={() => setAberto(estaAberto ? null : item.id)}
                className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-lg font-semibold tracking-tight"
              >
                <span>{item.titulo}</span>
                <span
                  aria-hidden="true"
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-ink transition-transform duration-300 ${
                    estaAberto ? 'rotate-45 bg-ink text-paper' : ''
                  }`}
                >
                  <IconeMais className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={idPainel}
              role="region"
              aria-labelledby={idBotao}
              hidden={!estaAberto}
              className="animate-fade-in pb-6 pr-12 text-gray-700"
            >
              {item.conteudo}
            </div>
          </div>
        );
      })}
    </div>
  );
}
