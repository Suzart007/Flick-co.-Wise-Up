import type { RedeSocial } from '../types/api';
import { extrairLista, requisitar } from './http';

export async function listarRedesSociais(signal?: AbortSignal): Promise<RedeSocial[]> {
  const { dados } = await requisitar<unknown>('/redes-sociais', { signal });
  return extrairLista<RedeSocial>(dados);
}
