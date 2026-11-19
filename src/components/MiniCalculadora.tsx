import { useState } from 'react';
import { NumeroAnimado } from './NumeroAnimado';
import { RangeHoras } from './RangeHoras';
import { diasPorAno, formatarNumero, paraNumeroOuZero } from '../utils/calculos';

/** Mini-calculadora da Home: dentro de um círculo preto, eco da logo. */
export function MiniCalculadora() {
  const [horas, setHoras] = useState('3');
  const dias = diasPorAno(paraNumeroOuZero(horas));

  return (
    <div
      data-tone="ink"
      className="mx-auto flex aspect-square w-full max-w-[26rem] flex-col items-center justify-center rounded-full bg-ink px-[13%] text-center text-paper"
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-label text-orange-soft sm:text-xs">Mini-calculadora</p>
      <p className="mt-3 text-sm text-gray-300 sm:text-base">
        <span className="font-semibold text-paper">{formatarNumero(paraNumeroOuZero(horas))} h</span> por dia nas redes
        equivalem a
      </p>
      <p className="mt-1 text-6xl font-semibold leading-none tracking-display sm:text-7xl">
        <NumeroAnimado valor={dias} />
      </p>
      <p className="mt-1 text-base font-medium sm:text-lg">dias por ano no celular</p>
      <div className="mt-3 w-full sm:mt-5">
        <RangeHoras valor={horas} onChange={setHoras} rotulo="Horas por dia nas redes" tom="escuro" />
      </div>
      <p className="text-[0.65rem] text-gray-300 sm:text-xs">horas por dia × 365 ÷ 24 · estimativa</p>
    </div>
  );
}
