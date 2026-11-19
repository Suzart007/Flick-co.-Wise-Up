import { Card } from '../components/Card';
import { IconeCadeado, IconeExterno } from '../components/Icones';
import { Reveal } from '../components/Reveal';
import { Container, Rotulo, Secao, Titulo } from '../components/Secao';
import { ButtonLink } from '../components/Button';
import { useTitulo } from '../hooks/useTitulo';

// Artigos científicos revisados que sustentam o parágrafo "O problema" (link pelo DOI ou PubMed).
const FONTES_PROBLEMA = [
  { nome: 'Ra et al. (2018): atenção', url: 'https://doi.org/10.1001/jama.2018.8931' },
  { nome: 'Alonzo et al. (2021): sono', url: 'https://pubmed.ncbi.nlm.nih.gov/33385767/' },
  { nome: 'Marker et al. (2018): desempenho escolar', url: 'https://doi.org/10.1007/s10648-017-9430-6' },
  { nome: 'Keles et al. (2020): ansiedade e humor', url: 'https://doi.org/10.1080/02673843.2019.1590851' },
];

const CUIDADOS = [
  'É uma autoavaliação: mostra um panorama de uso, sem rótulos clínicos.',
  'Os números são estimativas baseadas no que você informa.',
  'Dizemos que o uso está "associado a" efeitos: a ciência ainda estuda essas relações.',
  'Não substitui a avaliação de um profissional de saúde.',
];

export function Sobre() {
  useTitulo('Sobre o projeto');
  return (
    <>
      <section className="bg-mist py-16 sm:py-24" aria-labelledby="titulo-sobre">
        <Container className="max-w-4xl">
          <Rotulo>Sobre o projeto</Rotulo>
          <Titulo nivel={1} id="titulo-sobre" className="mt-4">
            Consciência primeiro. Ação depois.
          </Titulo>
          <p className="mt-6 max-w-2xl text-lg text-gray-700">
            O WISE UP é um projeto da equipe Flick Co. para a Global Solution 2026/2 da FIAP, com o tema CitizenTech:
            usar tecnologia para o bem das pessoas e do território onde vivem.
          </p>
        </Container>
      </section>

      <Secao rotuloId="titulo-problema-sobre">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <Rotulo>O problema</Rotulo>
            <Titulo id="titulo-problema-sobre" className="mt-4">
              O uso excessivo passa despercebido.
            </Titulo>
          </Reveal>
          <Reveal atraso={80}>
            <div className="space-y-5 text-lg text-gray-700">
              <p>
                O uso excessivo de redes sociais está associado a piora de foco, de sono e de produtividade, e também a
                mais ansiedade e pior humor.
              </p>
              <div className="text-sm text-gray-600">
                <p className="text-xs font-semibold uppercase tracking-label">Fontes</p>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                  {FONTES_PROBLEMA.map((fonte) => (
                    <li key={fonte.url}>
                      <a
                        href={fonte.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-8 items-center gap-1 underline decoration-orange decoration-2 underline-offset-4 hover:text-ink"
                      >
                        {fonte.nome}
                        <IconeExterno className="size-3.5 shrink-0" />
                        <span className="sr-only">(abre em nova aba)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                Muita gente não percebe quanto tempo passa nas redes. Bloqueadores de aplicativos ajudam, mas só quem já
                percebeu o problema chega até eles.
              </p>
            </div>
          </Reveal>
        </div>
      </Secao>

      <Secao tom="suave" rotuloId="titulo-abordagem">
        <Rotulo>Nossa abordagem</Rotulo>
        <Titulo id="titulo-abordagem" className="mt-4 max-w-3xl">
          Conscientizar com dados e fontes. Depois, orientar ações práticas.
        </Titulo>
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { t: 'Para quem', d: 'Jovens estudantes, na área de saúde preventiva e educação digital. Entram pela instituição de ensino.' },
            { t: 'Como acessar', d: 'Por link ou QR Code, no navegador do celular. Sem instalação e sem custo.' },
            { t: 'Como medimos impacto', d: 'Pelas horas reduzidas e pelas dicas aplicadas, comparando a primeira avaliação com a reavaliação após 2 semanas.' },
          ].map((item) => (
            <li key={item.t}>
              <Card className="h-full">
                <h3 className="text-xl font-semibold tracking-tight">{item.t}</h3>
                <p className="mt-3 text-gray-700">{item.d}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Secao>

      <Secao tom="escuro" rotuloId="titulo-cuidados">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Rotulo>Cuidados com o conteúdo</Rotulo>
            <Titulo id="titulo-cuidados" className="mt-4">
              O que o WISE UP é, e o que não é.
            </Titulo>
          </div>
          <ul className="space-y-4">
            {CUIDADOS.map((c) => (
              <li key={c} className="flex gap-3 border-b border-line pb-4 text-lg text-muted">
                <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-orange" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Secao>

      <Secao rotuloId="titulo-privacidade">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-ink text-paper">
            <IconeCadeado className="size-7" />
          </span>
          <Titulo id="titulo-privacidade" className="mt-6">
            Anônimo, sem nome, sem CPF.
          </Titulo>
          <p className="mt-4 text-lg text-gray-700">
            Você só informa horas de uso, de sono e como está o seu foco. Nada que identifique você é pedido.
          </p>
          <ButtonLink to="/autoavaliacao" tamanho="lg" className="mt-8">
            Fazer autoavaliação
          </ButtonLink>
        </div>
      </Secao>
    </>
  );
}
