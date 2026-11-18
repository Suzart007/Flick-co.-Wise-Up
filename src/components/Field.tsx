import { useId } from 'react';
import type { ReactNode } from 'react';

/** Atributos de acessibilidade que o Field entrega ao controle (input, select...). */
export interface AtributosCampo {
  id: string;
  'aria-invalid': boolean | undefined;
  'aria-describedby': string | undefined;
}

interface FieldProps {
  label: string;
  erro?: string;
  dica?: string;
  obrigatorio?: boolean;
  className?: string;
  children: (atributos: AtributosCampo) => ReactNode;
}

/** Classes padrão de input/select/textarea. Troca a borda quando há erro. */
export function classeControle(comErro: boolean): string {
  return [
    'block w-full rounded-2xl border bg-paper px-4 py-3 text-base text-ink placeholder:text-gray-500',
    'transition-colors min-h-12',
    comErro ? 'border-danger' : 'border-gray-400 hover:border-ink',
  ].join(' ');
}

/** Rótulo + controle + dica + mensagem de erro, ligados por aria-describedby. */
export function Field({ label, erro, dica, obrigatorio = false, className = '', children }: FieldProps) {
  const id = useId();
  const idDica = `${id}-dica`;
  const idErro = `${id}-erro`;
  const descricao = [dica ? idDica : '', erro ? idErro : ''].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {obrigatorio && <span className="sr-only"> (obrigatório)</span>}
        {!obrigatorio && <span className="ml-1 font-normal text-gray-600">(opcional)</span>}
      </label>
      {children({ id, 'aria-invalid': erro ? true : undefined, 'aria-describedby': descricao })}
      {dica && !erro && (
        <p id={idDica} className="mt-1.5 text-sm text-gray-600">
          {dica}
        </p>
      )}
      {erro && (
        <p id={idErro} className="mt-1.5 text-sm font-medium text-danger">
          {erro}
        </p>
      )}
    </div>
  );
}
