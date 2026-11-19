import { Accordion } from '../components/Accordion';
import { ButtonLink } from '../components/Button';
import { Container, Rotulo, Titulo } from '../components/Secao';
import { ITENS_FAQ } from '../data/faq';
import { useTitulo } from '../hooks/useTitulo';

export function Faq() {
  useTitulo('Perguntas frequentes');
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Rotulo>FAQ</Rotulo>
        <Titulo nivel={1} className="mt-4 !text-4xl sm:!text-6xl">
          Perguntas frequentes
        </Titulo>
        <p className="mt-6 text-lg text-gray-700">Respostas diretas sobre privacidade, dados e como o WISE UP funciona.</p>
        <div className="mt-12">
          <Accordion itens={ITENS_FAQ} />
        </div>
        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <p className="font-medium">Ficou com outra dúvida?</p>
          <ButtonLink to="/contato" variante="secundario">
            Fale com a equipe
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
