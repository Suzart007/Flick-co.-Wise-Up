import { useCallback, useEffect, useRef, useState } from 'react';
import { comoApiError, ehCancelamento } from '../services/http';
import type { ApiError } from '../services/http';

export interface EstadoApi<T> {
  dados: T | null;
  erro: ApiError | null;
  carregando: boolean;
  /** true quando a chamada está demorando (API gratuita acordando). */
  demorando: boolean;
  recarregar: () => void;
}

const ATRASO_AVISO_MS = 3500;

/**
 * Executa uma busca (GET) e controla os estados de loading, erro e dados.
 * `deps` diz quando buscar de novo (ex.: quando o id da rota muda).
 */
export function useApi<T>(buscar: (signal: AbortSignal) => Promise<T>, deps: readonly unknown[] = []): EstadoApi<T> {
  const [dados, setDados] = useState<T | null>(null);
  const [erro, setErro] = useState<ApiError | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [demorando, setDemorando] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  // Guardamos a função mais recente sem precisar dela nas dependências.
  const buscarRef = useRef(buscar);
  buscarRef.current = buscar;

  useEffect(() => {
    const controlador = new AbortController();
    setCarregando(true);
    setErro(null);
    setDemorando(false);
    const aviso = window.setTimeout(() => setDemorando(true), ATRASO_AVISO_MS);

    buscarRef
      .current(controlador.signal)
      .then((resultado) => {
        setDados(resultado);
        setCarregando(false);
      })
      .catch((e: unknown) => {
        if (ehCancelamento(e)) return; // a página mudou: não atualiza o estado
        setErro(comoApiError(e));
        setCarregando(false);
      })
      .finally(() => window.clearTimeout(aviso));

    return () => {
      window.clearTimeout(aviso);
      controlador.abort();
    };
  }, [...deps, tentativa]);

  const recarregar = useCallback(() => setTentativa((n) => n + 1), []);
  return { dados, erro, carregando, demorando, recarregar };
}
