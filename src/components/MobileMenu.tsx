import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LINK_AUTOAVALIACAO, LINKS_MENU } from '../data/navegacao';
import { ButtonLink } from './Button';
import { IconeFechar, IconeMenu } from './Icones';

/** Menu hambúrguer: aria-expanded, fecha com Esc e ao trocar de rota. */
export function MobileMenu() {
  const [aberto, setAberto] = useState(false);
  const { pathname } = useLocation();
  const botaoRef = useRef<HTMLButtonElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);

  // Fecha ao trocar de rota.
  useEffect(() => setAberto(false), [pathname]);

  // Esc fecha e devolve o foco ao botão; também trava a rolagem do fundo.
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false);
        botaoRef.current?.focus();
      }
    };
    document.addEventListener('keydown', aoTeclar);
    document.body.style.overflow = 'hidden';
    painelRef.current?.querySelector<HTMLElement>('a')?.focus();
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
    };
  }, [aberto]);

  return (
    <div className="lg:hidden">
      <button
        ref={botaoRef}
        type="button"
        aria-expanded={aberto}
        aria-controls="menu-mobile"
        aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setAberto((v) => !v)}
        className="flex size-11 items-center justify-center rounded-full border border-ink"
      >
        {aberto ? <IconeFechar /> : <IconeMenu />}
      </button>

      <div
        id="menu-mobile"
        ref={painelRef}
        hidden={!aberto}
        data-tone="ink"
        className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-ink px-6 py-8 text-paper"
      >
        {/* Clicar em qualquer link fecha o menu, inclusive o da página atual (a rota não muda nesse caso). */}
        <nav
          aria-label="Menu principal"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('a')) setAberto(false);
          }}
        >
          <ul className="flex flex-col">
            {LINKS_MENU.map((link) => (
              <li key={link.para} className="border-b border-line">
                <NavLink
                  to={link.para}
                  end={link.para === '/'}
                  className={({ isActive }) =>
                    `flex min-h-14 items-center justify-between text-2xl font-semibold tracking-display ${
                      isActive ? 'text-orange-soft' : ''
                    }`
                  }
                >
                  {link.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
          <ButtonLink to={LINK_AUTOAVALIACAO.para} variante="destaque" tamanho="lg" larguraTotal className="mt-8">
            {LINK_AUTOAVALIACAO.rotulo}
          </ButtonLink>
        </nav>
      </div>
    </div>
  );
}
