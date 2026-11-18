import { diasPorAno } from '../utils/calculos';
import { Alert } from './Alert';
import { NumeroAnimado } from './NumeroAnimado';

interface PainelPanoramaProps {
  horasRedes: number;
  horasSono: number;
}

/** Painel que atualiza em tempo real enquanto a pessoa mexe nos controles. */
export function PainelPanorama({ horasRedes, horasSono }: PainelPanoramaProps) {
  const dias = diasPorAno(horasRedes);
  const estourou = horasRedes + horasSono > 24;
  // Barra do dia de 24 h (visual): redes em laranja, sono em branco.
  const pctRedes = Math.min((horasRedes / 24) * 100, 100);
  const pctSono = Math.min((horasSono / 24) * 100, 100 - pctRedes);

  return (
    <aside
      data-tone="ink"
      aria-label="Seu panorama ao vivo"
      className="rounded-3xl bg-ink p-6 text-paper sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-label text-orange-soft">Seu panorama ao vivo</p>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-6">
        <div>
          <p className="text-5xl font-semibold leading-none tracking-display sm:text-6xl">
            <NumeroAnimado valor={horasRedes} />
          </p>
          <p className="mt-2 text-sm text-muted">horas por dia nas redes</p>
        </div>
        <div>
          <p className="text-5xl font-semibold leading-none tracking-display sm:text-6xl">
            <NumeroAnimado valor={dias} />
          </p>
          <p className="mt-2 text-sm text-muted">dias por ano no celular</p>
        </div>
      </div>

      <div className="mt-6" aria-hidden="true">
        <div className="flex h-2 overflow-hidden rounded-full bg-gray-700">
          <div className="bg-orange transition-all duration-500" style={{ width: `${pctRedes}%` }} />
          <div className="bg-paper transition-all duration-500" style={{ width: `${pctSono}%` }} />
        </div>
        <p className="mt-2 flex justify-between text-xs text-muted">
          <span>Redes</span>
          <span>Sono</span>
          <span>24 h</span>
        </p>
      </div>

      {estourou && (
        <Alert tipo="aviso" className="mt-5" titulo="Passou de 24 horas">
          Redes e sono somados passam de um dia. Revise os valores.
        </Alert>
      )}
      <p className="mt-5 text-xs text-muted">Autoavaliação: estimativa baseada no que você informa.</p>
    </aside>
  );
}
