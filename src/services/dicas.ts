import type { Dica } from '../types/api';
import { extrairLista, requisitar } from './http';

export async function listarDicas(signal?: AbortSignal): Promise<Dica[]> {
  const { dados } = await requisitar<unknown>('/dicas', { signal });
  return extrairLista<Dica>(dados);
}
