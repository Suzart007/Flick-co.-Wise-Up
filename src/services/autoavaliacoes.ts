import type { Autoavaliacao, AutoavaliacaoCriada, NovaAutoavaliacao, NovoRetorno, Retorno } from '../types/api';
import { ApiError, extrairLista, requisitar } from './http';

const ROTA = '/autoavaliacoes';

/** POST: cria a autoavaliação. A API responde 201 com o corpo e o cabeçalho Location. */
export async function criarAutoavaliacao(corpo: NovaAutoavaliacao): Promise<AutoavaliacaoCriada> {
  const { dados, location } = await requisitar<AutoavaliacaoCriada | undefined>(ROTA, { metodo: 'POST', corpo });
  if (dados && dados.id !== undefined && dados.id !== null) return dados;

  // Plano B: o id também vem no fim do Location (ex.: /autoavaliacoes/12).
  const idDoLocation = location?.split('/').filter(Boolean).pop();
  if (idDoLocation) {
    return { id: Number(idDoLocation), nivelRisco: dados?.nivelRisco ?? '', horasTotaisDia: dados?.horasTotaisDia ?? 0 };
  }
  throw new ApiError('http', 'A API criou o registro, mas não informou o identificador. Fale com a equipe.');
}

export async function buscarAutoavaliacao(id: string, signal?: AbortSignal): Promise<Autoavaliacao> {
  const { dados } = await requisitar<Autoavaliacao>(`${ROTA}/${encodeURIComponent(id)}`, { signal });
  return dados;
}

/** DELETE: apaga o resultado (resposta 204, sem corpo). */
export async function apagarAutoavaliacao(id: string): Promise<void> {
  await requisitar<void>(`${ROTA}/${encodeURIComponent(id)}`, { metodo: 'DELETE' });
}

/** POST: registra a reavaliação feita depois de algumas semanas. */
export async function criarRetorno(id: string, corpo: NovoRetorno): Promise<Retorno | undefined> {
  const { dados } = await requisitar<Retorno | undefined>(`${ROTA}/${encodeURIComponent(id)}/retornos`, {
    metodo: 'POST',
    corpo,
  });
  return dados;
}

export async function listarRetornos(id: string, signal?: AbortSignal): Promise<Retorno[]> {
  const { dados } = await requisitar<unknown>(`${ROTA}/${encodeURIComponent(id)}/retornos`, { signal });
  return extrairLista<Retorno>(dados);
}
