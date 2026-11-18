import { IconeSeta } from './Icones';

interface LogoProps {
  /** "dark" = texto preto (fundo claro). "light" = texto branco (fundo escuro). */
  tom?: 'dark' | 'light';
  tamanho?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TAMANHOS = {
  sm: { marca: 'text-xl', selo: 'text-[0.55rem]', seta: 'size-3' },
  md: { marca: 'text-2xl', selo: 'text-[0.62rem]', seta: 'size-3.5' },
  lg: { marca: 'text-5xl sm:text-6xl', selo: 'text-xs sm:text-sm', seta: 'size-4' },
};

/** Marca da equipe recriada em texto: "flick co." com ponto laranja e "↑ WISE UP". */
export function Logo({ tom = 'dark', tamanho = 'md', className = '' }: LogoProps) {
  const t = TAMANHOS[tamanho];
  const cor = tom === 'dark' ? 'text-ink' : 'text-paper';
  const corSelo = tom === 'dark' ? 'text-gray-700' : 'text-orange-soft';
  return (
    <span role="img" aria-label="Flick Co. WISE UP" className={`inline-flex flex-col leading-none ${cor} ${className}`}>
      <span aria-hidden="true" className={`font-bold tracking-display ${t.marca}`}>
        flick co<span className="text-orange">.</span>
      </span>
      <span
        aria-hidden="true"
        className={`mt-1.5 inline-flex items-center gap-1.5 font-medium uppercase tracking-[0.32em] ${t.selo} ${corSelo}`}
      >
        <IconeSeta className={`${t.seta} text-orange`} />
        Wise Up
      </span>
    </span>
  );
}
