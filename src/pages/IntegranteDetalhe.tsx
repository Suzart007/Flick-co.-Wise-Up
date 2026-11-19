import { Link, useParams } from 'react-router-dom';
import { ButtonLink } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { IconeExterno, IconeSetaEsquerda } from '../components/Icones';
import { Container, Rotulo } from '../components/Secao';
import { buscarIntegrante, linkGithub } from '../data/integrantes';
import { useTitulo } from '../hooks/useTitulo';

/** Rota com parâmetro: /integrantes/:id */
export function IntegranteDetalhe() {
  const { id } = useParams<{ id: string }>();
  const pessoa = buscarIntegrante(id);
  useTitulo(pessoa ? 'Integrante' : 'Integrante não encontrado');

  if (!pessoa) {
    return (
      <Container className="py-16 sm:py-24">
        <EmptyState
          titulo="Não encontramos esse integrante"
          descricao="O endereço pode estar incorreto. Veja a lista completa da equipe."
          acao={<ButtonLink to="/integrantes">Ver integrantes</ButtonLink>}
        />
      </Container>
    );
  }

  const github = linkGithub(pessoa.github);

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Link to="/integrantes" className="inline-flex min-h-11 items-center gap-2 font-medium text-gray-700 hover:text-ink">
          <IconeSetaEsquerda className="size-4" />
          Todos os integrantes
        </Link>

        <Card className="mt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {pessoa.foto ? (
              <img
                src={pessoa.foto}
                alt={`Foto de ${pessoa.nome}`}
                width={96}
                height={96}
                className="size-24 shrink-0 rounded-full object-cover ring-2 ring-orange ring-offset-2"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-24 shrink-0 items-center justify-center rounded-full bg-ink text-3xl font-bold text-paper"
              >
                0{pessoa.id}
                <span className="ml-1 size-2 self-end rounded-full bg-orange" />
              </span>
            )}
            <div>
              <Rotulo>Integrante</Rotulo>
              <h1 className="mt-2 text-3xl font-semibold tracking-display sm:text-4xl">{pessoa.nome}</h1>
              {pessoa.papel && <p className="mt-1 text-gray-600">{pessoa.papel}</p>}
            </div>
          </div>

          <dl className="mt-8 grid gap-6 border-t border-gray-300 pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-label text-gray-600">RM</dt>
              <dd className="mt-1 text-lg font-medium">{pessoa.rm}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-label text-gray-600">GitHub</dt>
              <dd className="mt-1 text-lg font-medium">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 break-all underline decoration-orange decoration-2 underline-offset-4"
                >
                  {pessoa.github}
                  <IconeExterno className="size-4 shrink-0" />
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-label text-gray-600">LinkedIn</dt>
              <dd className="mt-1 text-lg font-medium">
                <a
                  href={pessoa.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 underline decoration-orange decoration-2 underline-offset-4"
                >
                  Ver perfil
                  <IconeExterno className="size-4 shrink-0" />
                  <span className="sr-only">de {pessoa.nome} no LinkedIn (abre em nova aba)</span>
                </a>
              </dd>
            </div>
          </dl>
          {pessoa.bio && <p className="mt-6 text-gray-700">{pessoa.bio}</p>}
        </Card>
      </Container>
    </div>
  );
}
