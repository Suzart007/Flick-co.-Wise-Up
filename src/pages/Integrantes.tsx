import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { IconeSetaDireita } from '../components/Icones';
import { Reveal } from '../components/Reveal';
import { Container, Rotulo, Titulo } from '../components/Secao';
import { INTEGRANTES } from '../data/integrantes';
import { useTitulo } from '../hooks/useTitulo';

export function Integrantes() {
  useTitulo('Integrantes');
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <Rotulo>Equipe Flick Co.</Rotulo>
        <Titulo nivel={1} className="mt-4 !text-4xl sm:!text-6xl">
          Quem faz o WISE UP
        </Titulo>
        <p className="mt-6 max-w-2xl text-lg text-gray-700">
          Somos estudantes da FIAP e criamos o WISE UP para a Global Solution 2026/2. Conheça cada integrante.
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTEGRANTES.map((pessoa, indice) => (
            <li key={pessoa.id}>
              <Reveal atraso={indice * 60} className="h-full">
                <Card as="div" className="h-full">
                  {pessoa.foto ? (
                    <img
                      src={pessoa.foto}
                      alt={`Foto de ${pessoa.nome}`}
                      width={64}
                      height={64}
                      loading="lazy"
                      className="size-16 rounded-full object-cover ring-2 ring-orange ring-offset-2"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex size-16 items-center justify-center rounded-full bg-ink text-xl font-bold text-paper"
                    >
                      0{indice + 1}
                      <span className="ml-0.5 size-1.5 self-end rounded-full bg-orange" />
                    </span>
                  )}
                  <h2 className="mt-6 text-xl font-semibold tracking-tight">{pessoa.nome}</h2>
                  {pessoa.papel && <p className="mt-1 text-gray-600">{pessoa.papel}</p>}
                  <p className="mt-1 text-sm text-gray-600">RM: {pessoa.rm}</p>
                  <Link
                    to={`/integrantes/${pessoa.id}`}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-orange decoration-2 underline-offset-4"
                  >
                    Ver perfil
                    <IconeSetaDireita className="size-4" />
                  </Link>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
