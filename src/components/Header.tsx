import { Link, NavLink } from 'react-router-dom';
import { LINK_AUTOAVALIACAO, LINKS_MENU } from '../data/navegacao';
import { ButtonLink } from './Button';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-300 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Menu principal" className="hidden items-center gap-1 lg:flex">
          {LINKS_MENU.map((link) => (
            <NavLink
              key={link.para}
              to={link.para}
              end={link.para === '/'}
              className={({ isActive }) =>
                `relative rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 ${
                  isActive
                    ? 'text-ink after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:rounded-full after:bg-orange'
                    : 'text-gray-700'
                }`
              }
            >
              {link.rotulo}
            </NavLink>
          ))}
          <ButtonLink to={LINK_AUTOAVALIACAO.para} className="ml-2">
            {LINK_AUTOAVALIACAO.rotulo}
          </ButtonLink>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
