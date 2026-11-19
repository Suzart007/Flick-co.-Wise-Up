import { ButtonLink } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { Container } from '../components/Secao';
import { useTitulo } from '../hooks/useTitulo';

export function NaoEncontrada() {
  useTitulo('Página não encontrada');
  return (
    <Container className="py-16 sm:py-24">
      <EmptyState
        titulo="Essa página não existe"
        descricao="O endereço pode estar incorreto ou a página mudou de lugar. Vamos voltar ao começo?"
        acao={<ButtonLink to="/">Ir para o início</ButtonLink>}
      />
    </Container>
  );
}
