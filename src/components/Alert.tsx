import type { ReactNode } from 'react';
import { IconeAlerta, IconeCheck, IconeInfo } from './Icones';

type Tipo = 'info' | 'sucesso' | 'erro' | 'aviso';

interface AlertProps {
  tipo?: Tipo;
  titulo?: string;
  children?: ReactNode;
  /** Botão ou link de ação (ex.: "Tentar novamente"). */
  acao?: ReactNode;
  className?: string;
}

const ESTILOS: Record<Tipo, string> = {
  info: 'border-gray-300 bg-gray-50 text-ink',
  sucesso: 'border-success bg-success-soft text-ink',
  erro: 'border-danger bg-danger-soft text-ink',
  aviso: 'border-ink bg-paper text-ink',
};

const COR_ICONE: Record<Tipo, string> = {
  info: 'text-gray-700',
  sucesso: 'text-success',
  erro: 'text-danger',
  aviso: 'text-ink',
};

/** Mensagem de status. Erros usam role="alert" (lido na hora); os demais, role="status". */
export function Alert({ tipo = 'info', titulo, children, acao, className = '' }: AlertProps) {
  const Icone = tipo === 'sucesso' ? IconeCheck : tipo === 'info' ? IconeInfo : IconeAlerta;
  return (
    <div
      role={tipo === 'erro' ? 'alert' : 'status'}
      className={`animate-fade-in flex gap-3 rounded-2xl border p-4 text-sm ${ESTILOS[tipo]} ${className}`}
    >
      <Icone className={`mt-0.5 size-5 shrink-0 ${COR_ICONE[tipo]}`} />
      <div className="min-w-0 flex-1">
        {titulo && <p className="font-semibold">{titulo}</p>}
        {children && <div className={titulo ? 'mt-1' : ''}>{children}</div>}
        {acao && <div className="mt-3">{acao}</div>}
      </div>
    </div>
  );
}
