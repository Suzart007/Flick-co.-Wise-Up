import { Link } from 'react-router-dom';
import { ButtonLink } from '../components/Button';
import { Card } from '../components/Card';
import { IconeExterno } from '../components/Icones';
import { MiniCalculadora } from '../components/MiniCalculadora';
import { Reveal } from '../components/Reveal';
import { Container, Rotulo, Secao, Titulo } from '../components/Secao';
import { useTitulo } from '../hooks/useTitulo';
import { lerUltimoResultado } from '../utils/armazenamento';

const PASSOS = [
  { numero: '01', titulo: 'Responda', texto: 'Uma autoavaliação anônima: horas por rede social, horas de sono e nível de foco.' },
  { numero: '02', titulo: 'Descubra', texto: 'Veja seu panorama: quantas horas por dia e quantos dias por ano ficam no celular.' },
  { numero: '03', titulo: 'Aja', texto: 'Receba dicas práticas, cada uma com a fonte, para testar no seu dia a dia.' },
  { numero: '04', titulo: 'Reavalie', texto: 'Depois de 2 semanas, responda de novo e compare o antes e o depois.' },
];

// Cada associação aponta para um artigo científico revisado (link pelo DOI ou PubMed).
const ASSOCIACOES = [
  {
    titulo: 'Foco',
    texto: 'O uso excessivo de redes sociais está associado a mais dificuldade de manter a atenção.',
    fonte: { nome: 'Ra et al., JAMA (2018)', url: 'https://doi.org/10.1001/jama.2018.8931' },
  },
  {
    titulo: 'Sono',
    texto: 'O uso intenso de redes sociais está associado a um sono de pior qualidade.',
    fonte: { nome: 'Alonzo et al., Sleep Medicine Reviews (2021)', url: 'https://pubmed.ncbi.nlm.nih.gov/33385767/' },
  },
  {
    titulo: 'Humor',
    texto: 'O uso intenso está associado a piora de ansiedade e de humor em parte das pessoas.',
    fonte: {
      nome: 'Keles et al., International Journal of Adolescence and Youth (2020)',
      url: 'https://doi.org/10.1080/02673843.2019.1590851',
    },
  },
];

export function Home() {
  useTitulo('');
  const ultimo = lerUltimoResultado();

  return (
    <>
      {/* Hero */}
      <section className="bg-mist py-14 sm:py-20 lg:py-24" aria-labelledby="titulo-hero">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <Rotulo>Wise Up · Saúde digital para estudantes</Rotulo>
            <Titulo nivel={1} id="titulo-hero" className="mt-5">
              Quanto do seu ano cabe dentro das redes sociais?
            </Titulo>
            <p className="mt-6 max-w-xl text-lg text-gray-700">
              Responda uma autoavaliação anônima, veja o seu panorama de uso e receba dicas práticas com fonte. Sem
              instalar nada, sem custo e sem julgamento.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/autoavaliacao" tamanho="lg">
                Fazer autoavaliação
              </ButtonLink>
              <a
                href="#como-funciona"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink px-7 text-base font-semibold transition-colors hover:bg-ink hover:text-paper"
              >
                Como funciona
              </a>
            </div>
            {ultimo && (
              <p className="mt-6 text-sm text-gray-700">
                Já fez a sua?{' '}
                <Link to={`/resultado/${ultimo}`} className="font-semibold underline decoration-orange decoration-2 underline-offset-4">
                  Ver meu último resultado
                </Link>
              </p>
            )}
          </div>
          <Reveal>
            <MiniCalculadora />
          </Reveal>
        </Container>
      </section>

      {/* Quatro passos */}
      <Secao id="como-funciona" rotuloId="titulo-passos">
        <Rotulo>Como funciona</Rotulo>
        <Titulo id="titulo-passos" className="mt-4 max-w-2xl">
          Quatro passos, do panorama à mudança.
        </Titulo>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((passo, i) => (
            <li key={passo.numero}>
              <Reveal atraso={i * 80} className="h-full">
                <Card className="h-full">
                  <p className="flex items-baseline gap-1 text-4xl font-semibold tracking-display">
                    {passo.numero}
                    <span aria-hidden="true" className="size-2 rounded-full bg-orange" />
                  </p>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{passo.titulo}</h3>
                  <p className="mt-2 text-gray-700">{passo.texto}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ol>
      </Secao>

      {/* O problema */}
      <Secao tom="escuro" rotuloId="titulo-problema">
        <Rotulo>O problema</Rotulo>
        <Titulo id="titulo-problema" className="mt-4 max-w-3xl">
          Muita gente nem percebe. E um bloqueador de app só ajuda quem já percebeu.
        </Titulo>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          O WISE UP começa antes: com consciência. Primeiro os dados e as fontes, depois as ações práticas.
        </p>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {ASSOCIACOES.map((item, i) => (
            <li key={item.titulo}>
              <Reveal atraso={i * 80} className="h-full">
                <Card tom="escuro" className="h-full !border-line">
                  <h3 className="text-2xl font-semibold tracking-display">{item.titulo}</h3>
                  <p className="mt-3 text-muted">{item.texto}</p>
                  <a
                    href={item.fonte.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-8 items-center gap-1.5 text-sm text-orange-soft underline decoration-1 underline-offset-4 hover:text-paper"
                  >
                    Fonte: {item.fonte.nome}
                    <IconeExterno className="size-3.5 shrink-0" />
                    <span className="sr-only">(abre em nova aba)</span>
                  </a>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Secao>

      {/* ODS 3 e 4 */}
      <Secao tom="suave" rotuloId="titulo-ods">
        <Rotulo>Para quem e para quê</Rotulo>
        <Titulo id="titulo-ods" className="mt-4 max-w-3xl">
          Jovens estudantes, saúde preventiva e educação digital.
        </Titulo>
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {[
            { n: '3', titulo: 'ODS 3 · Saúde e bem-estar', texto: 'Prevenção: ajudar a perceber cedo como o uso das redes se relaciona com sono, foco e humor.' },
            { n: '4', titulo: 'ODS 4 · Educação de qualidade', texto: 'Educação digital: informação confiável e hábitos que ajudam a estudar e aprender melhor.' },
          ].map((ods) => (
            <li key={ods.n} className="flex items-start gap-5 rounded-3xl border border-gray-300 bg-paper p-6 sm:p-8">
              <span
                aria-hidden="true"
                className="flex size-16 shrink-0 items-center justify-center rounded-full bg-ink text-2xl font-bold text-paper"
              >
                {ods.n}
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{ods.titulo}</h3>
                <p className="mt-2 text-gray-700">{ods.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </Secao>

      {/* Instituições */}
      <Secao tom="escuro" rotuloId="titulo-instituicoes">
        <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Rotulo>Para instituições de ensino</Rotulo>
            <Titulo id="titulo-instituicoes" className="mt-4">
              Leve o WISE UP para a sua turma.
            </Titulo>
            <p className="mt-6 max-w-xl text-lg text-muted">
              O acesso é por link ou QR Code, direto no navegador do celular. Sem instalação e sem custo para os
              estudantes.
            </p>
          </div>
          <div className="md:justify-self-end">
            <ButtonLink to="/contato" variante="destaque" tamanho="lg">
              Falar com a equipe
            </ButtonLink>
          </div>
        </div>
      </Secao>
    </>
  );
}
