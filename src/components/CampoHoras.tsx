import { useId } from 'react';
import { RangeHoras } from './RangeHoras';

interface CampoHorasProps {
  /** Atributo name (usado para focar o campo quando há erro). */
  nome: string;
  rotulo: string;
  legenda?: string;
  valor: string;
  onChange: (novo: string) => void;
  erro?: string;
  maximoSlider?: number;
}

/** Campo de horas por dia: número digitável + controle deslizante, sempre sincronizados. */
export function CampoHoras({ nome, rotulo, legenda, valor, onChange, erro, maximoSlider = 12 }: CampoHorasProps) {
  const id = useId();
  const idErro = `${id}-erro`;

  return (
    <div className="rounded-2xl border border-gray-300 bg-paper p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <label htmlFor={id} className="block text-base font-semibold">
            {rotulo}
          </label>
          {legenda && <p className="text-sm text-gray-600">{legenda}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <input
            id={id}
            name={nome}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={valor}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={erro ? true : undefined}
            aria-describedby={erro ? idErro : undefined}
            className={`h-11 w-20 rounded-xl border bg-paper px-2 text-center text-lg font-semibold tabular-nums ${
              erro ? 'border-danger' : 'border-gray-400 hover:border-ink'
            }`}
          />
          <span aria-hidden="true" className="text-sm font-medium text-gray-600">
            h/dia
          </span>
        </div>
      </div>
      <div className="mt-2">
        <RangeHoras valor={valor} onChange={onChange} rotulo={rotulo} maximo={maximoSlider} />
      </div>
      {erro && (
        <p id={idErro} className="mt-1 text-sm font-medium text-danger">
          {erro}
        </p>
      )}
    </div>
  );
}
