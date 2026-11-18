import type { ReactNode } from 'react';
import type { EstadoApi } from '../hooks/useApi';
import { Alert } from './Alert';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { Loading } from './Loading';

interface EstadoDaApiProps<T> {
  estado: EstadoApi<T>;
  /** Decide se a resposta é "vazia" (ex.: lista sem itens). */
  vazio?: (dados: T) => boolean;
  mensagemCarregando?: string;
  tituloVazio?: string;
  descricaoVazio?: string;
  children: (dados: T) => ReactNode;
}

/**
 * Trata os 3 estados de qualquer tela que chama a API:
 * carregando, erro (com "Tentar novamente") e ausência de dados.
 */
export function EstadoDaApi<T>({
  estado,
  vazio,
  mensagemCarregando,
  tituloVazio = 'Nada por aqui ainda',
  descricaoVazio,
  children,
}: EstadoDaApiProps<T>) {
  if (estado.carregando) return <Loading mensagem={mensagemCarregando} demorando={estado.demorando} />;

  if (estado.erro) {
    return (
      <div className="mx-auto max-w-xl py-10">
        <Alert
          tipo="erro"
          titulo="Não deu para carregar agora"
          acao={
            <Button variante="primario" onClick={estado.recarregar}>
              Tentar novamente
            </Button>
          }
        >
          {estado.erro.message}
        </Alert>
      </div>
    );
  }

  if (estado.dados === null || (vazio && vazio(estado.dados))) {
    return <EmptyState titulo={tituloVazio} descricao={descricaoVazio} />;
  }
  return <>{children(estado.dados)}</>;
}
