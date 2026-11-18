import { LEGENDA_FOCO } from '../utils/textos';

interface EscalaFocoProps {
  nome: string;
  legenda: string;
  valor: number; // 0 = nada escolhido
  onChange: (novo: number) => void;
  erro?: string;
}

/** Escala de 1 a 5 feita com radios nativos (setas do teclado funcionam). */
export function EscalaFoco({ nome, legenda, valor, onChange, erro }: EscalaFocoProps) {
  return (
    <fieldset aria-describedby={erro ? `${nome}-erro` : undefined}>
      <legend className="mb-3 text-base font-semibold">{legenda}</legend>
      <div className="flex gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="relative cursor-pointer">
            <input
              type="radio"
              name={nome}
              value={n}
              checked={valor === n}
              onChange={() => onChange(n)}
              aria-invalid={erro ? true : undefined}
              className="peer absolute inset-0 size-full cursor-pointer opacity-0"
            />
            <span
              className="flex size-12 items-center justify-center rounded-full border border-gray-400 bg-paper text-lg font-semibold
                transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper
                peer-hover:border-ink peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-orange sm:size-14"
            >
              {n}
            </span>
          </label>
        ))}
      </div>
      <p className="mt-3 min-h-6 text-sm text-gray-700" aria-live="polite">
        {valor > 0 ? LEGENDA_FOCO[valor] : '1 = com muita dificuldade · 5 = sem dificuldade'}
      </p>
      {erro && (
        <p id={`${nome}-erro`} className="mt-1 text-sm font-medium text-danger">
          {erro}
        </p>
      )}
    </fieldset>
  );
}
