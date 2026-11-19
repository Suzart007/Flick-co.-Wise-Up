import { useEffect } from 'react';

/** Atualiza o título da aba (útil para leitores de tela e para o histórico). */
export function useTitulo(titulo: string): void {
  useEffect(() => {
    document.title = titulo === '' ? 'WISE UP | Flick Co.' : `${titulo} · WISE UP | Flick Co.`;
  }, [titulo]);
}
