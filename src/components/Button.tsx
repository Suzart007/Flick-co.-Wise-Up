import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variante = 'primario' | 'secundario' | 'destaque' | 'fantasma' | 'claro';
type Tamanho = 'md' | 'lg';

interface EstiloProps {
  variante?: Variante;
  tamanho?: Tamanho;
  larguraTotal?: boolean;
}

const VARIANTES: Record<Variante, string> = {
  primario: 'bg-ink text-paper border-ink hover:bg-gray-800',
  secundario: 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper',
  destaque: 'bg-orange text-ink border-orange hover:bg-orange-soft hover:border-orange-soft',
  fantasma: 'bg-transparent text-ink border-transparent hover:bg-gray-100',
  claro: 'bg-paper text-ink border-paper hover:bg-gray-200 hover:border-gray-200',
};

const TAMANHOS: Record<Tamanho, string> = {
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-12 px-7 text-base',
};

function classes({ variante = 'primario', tamanho = 'md', larguraTotal = false }: EstiloProps): string {
  return [
    'inline-flex items-center justify-center gap-2 rounded-full border font-semibold',
    'transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60',
    VARIANTES[variante],
    TAMANHOS[tamanho],
    larguraTotal ? 'w-full' : '',
  ].join(' ');
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, EstiloProps {
  /** Mostra o indicador e desabilita o botão (ex.: enquanto envia). */
  carregando?: boolean;
}

export function Button({
  variante,
  tamanho,
  larguraTotal,
  carregando = false,
  disabled,
  className = '',
  type = 'button',
  children,
  ...resto
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      className={`${classes({ variante, tamanho, larguraTotal })} ${className}`}
      {...resto}
    >
      {carregando && (
        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends EstiloProps {
  to: string;
  children: ReactNode;
  className?: string;
}

/** Link de navegação (react-router) com a aparência de botão. */
export function ButtonLink({ to, variante, tamanho, larguraTotal, className = '', children }: ButtonLinkProps) {
  return (
    <Link to={to} className={`${classes({ variante, tamanho, larguraTotal })} ${className}`}>
      {children}
    </Link>
  );
}
