interface LoadingProps {
  mensagem?: string;
  /** Quando true, avisa que a API gratuita pode levar alguns segundos. */
  demorando?: boolean;
}

export function Loading({ mensagem = 'Carregando...', demorando = false }: LoadingProps) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-4 py-16 text-center">
      <span aria-hidden="true" className="size-10 animate-spin rounded-full border-[3px] border-gray-300 border-t-orange" />
      <p className="font-medium">{mensagem}</p>
      {demorando && (
        <p className="max-w-sm text-sm text-gray-600">
          A API pode levar alguns segundos na primeira chamada. Já estamos quase lá.
        </p>
      )}
    </div>
  );
}
