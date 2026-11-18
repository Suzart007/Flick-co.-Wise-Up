import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

/** Estrutura comum: pular para o conteúdo, cabeçalho, <main> e rodapé. */
export function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const primeiraVez = useRef(true);

  // A cada troca de rota: volta ao topo e leva o foco ao conteúdo (leitores de tela).
  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false;
      return;
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-semibold focus:text-paper"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
