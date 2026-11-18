import { useContagem } from '../hooks/useContagem';
import { formatarNumero } from '../utils/calculos';

interface NumeroAnimadoProps {
  valor: number;
  casas?: number;
  className?: string;
}

/**
 * Número com contagem animada. O texto animado fica escondido dos leitores de tela;
 * eles recebem só o valor final (evita falar cada número intermediário).
 */
export function NumeroAnimado({ valor, casas = 1, className = '' }: NumeroAnimadoProps) {
  const animado = useContagem(valor);
  return (
    <>
      <span aria-hidden="true" className={`tabular-nums ${className}`}>
        {formatarNumero(animado, casas)}
      </span>
      <span className="sr-only">{formatarNumero(valor, casas)}</span>
    </>
  );
}
