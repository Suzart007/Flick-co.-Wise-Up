interface EtapasProps {
  etapas: readonly string[];
  atual: number;
}

/** Indicador de etapas do formulário (1 de 4, 2 de 4...). */
export function Etapas({ etapas, atual }: EtapasProps) {
  return (
    <nav aria-label="Progresso do formulário">
      <p className="text-sm font-medium text-gray-700">
        Etapa {atual + 1} de {etapas.length}
      </p>
      <ol className="mt-3 flex gap-2">
        {etapas.map((nome, i) => (
          <li key={nome} className="flex-1" aria-current={i === atual ? 'step' : undefined}>
            <span className={`block h-1.5 rounded-full ${i <= atual ? 'bg-ink' : 'bg-gray-300'}`} />
            <span className={`mt-2 hidden text-xs sm:block ${i === atual ? 'font-semibold' : 'text-gray-600'}`}>
              {nome}
            </span>
            <span className="sr-only sm:hidden">{nome}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
