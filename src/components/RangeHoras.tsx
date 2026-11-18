import type { CSSProperties } from 'react';
import { limitar, paraNumero } from '../utils/calculos';

interface RangeHorasProps {
  /** Valor em texto (igual ao do campo numérico). */
  valor: string;
  onChange: (novo: string) => void;
  rotulo: string;
  maximo?: number;
  passo?: number;
  tom?: 'claro' | 'escuro';
  name?: string;
}

/** Controle deslizante de horas, com a trilha preenchida até o valor atual. */
export function RangeHoras({ valor, onChange, rotulo, maximo = 12, passo = 0.5, tom = 'claro', name }: RangeHorasProps) {
  const numero = paraNumero(valor);
  const atual = limitar(Number.isNaN(numero) ? 0 : numero, 0, maximo);
  const estilo = { '--pct': `${(atual / maximo) * 100}%` } as CSSProperties;

  return (
    <input
      type="range"
      name={name}
      className="range-horas"
      data-tone={tom === 'escuro' ? 'dark' : undefined}
      min={0}
      max={maximo}
      step={passo}
      value={atual}
      onChange={(e) => onChange(e.target.value)}
      aria-label={`${rotulo} (controle deslizante)`}
      aria-valuetext={`${atual} horas por dia`}
      style={estilo}
    />
  );
}
