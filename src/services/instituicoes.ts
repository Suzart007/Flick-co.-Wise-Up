import type { Instituicao } from '../types/api';
import { extrairLista, requisitar } from './http';

export async function listarInstituicoes(signal?: AbortSignal): Promise<Instituicao[]> {
  const { dados } = await requisitar<unknown>('/instituicoes', { signal });
  return extrairLista<Instituicao>(dados);
}
