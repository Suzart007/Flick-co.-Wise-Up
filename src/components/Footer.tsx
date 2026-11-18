import { Link } from 'react-router-dom';
import logoImg from '../assets/logo-flick-co.png';
import { LINKS_MENU } from '../data/navegacao';
import { Container } from './Secao';

export function Footer() {
  return (
    <footer data-tone="ink" className="bg-ink py-14 text-paper">
      <Container>
        <div className="grid gap-10 md:grid-cols-[auto_1fr_1fr] md:gap-14">
          {/* A imagem tem fundo cinza: recortamos no círculo da logo. */}
          <div className="size-28 shrink-0 overflow-hidden rounded-full bg-ink">
            <img
              src={logoImg}
              alt="Logotipo da Flick Co. com o projeto WISE UP"
              width={112}
              height={112}
              className="size-full scale-[1.43] object-cover"
            />
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-label text-gray-300">Navegação</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              {LINKS_MENU.map((l) => (
                <li key={l.para}>
                  <Link to={l.para} className="inline-block py-1 text-gray-300 transition-colors hover:text-paper">
                    {l.rotulo}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/autoavaliacao" className="inline-block py-1 text-gray-300 transition-colors hover:text-paper">
                  Autoavaliação
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-label text-gray-300">Projeto</h2>
            <p className="mt-4 text-gray-300">
              WISE UP é um projeto da equipe Flick Co. para a Global Solution 2026/2 da FIAP (CitizenTech), alinhado aos
              ODS 3 e 4.
            </p>
          </div>
        </div>

        <p className="mt-12 border-t border-line pt-6 text-sm text-gray-300">
          O WISE UP é uma autoavaliação: traz estimativas com base no que você informa e não substitui avaliação
          profissional.
        </p>
        <p className="mt-2 text-xs uppercase tracking-label text-gray-400">
          Global Solution 2026/2 · FIAP · CitizenTech
        </p>
      </Container>
    </footer>
  );
}
