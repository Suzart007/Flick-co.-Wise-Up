// Dados dos integrantes. Substitua cada [PREENCHER ...] pelos dados reais do grupo.
export interface Integrante {
  id: string;
  nome: string;
  rm: string;
  papel: string;
  /** Usuário ou link do GitHub. */
  github: string;
  bio: string;
}

export const INTEGRANTES: Integrante[] = [
  { id: '1', nome: 'Kaio Marcus Macedo Chiappinelli', rm: '573365', papel: '[PREENCHER papel]', github: '[PREENCHER GitHub]', bio: '[PREENCHER mini-bio]' },
  { id: '2', nome: 'Matheus Vecchi', rm: '569749', papel: '[PREENCHER papel]', github: '[PREENCHER GitHub]', bio: '[PREENCHER mini-bio]' },
  { id: '3', nome: 'Guilherme Souza Suzart', rm: '569884', papel: '[PREENCHER papel]', github: 'Suzart007', bio: '[PREENCHER mini-bio]' },
  { id: '4', nome: 'Rafael Rodrigues Trindade', rm: '564303', papel: '[PREENCHER papel]', github: '[PREENCHER GitHub]', bio: '[PREENCHER mini-bio]' },
  { id: '5', nome: 'Henry Vitor Medeiros Bascope', rm: '573576', papel: '[PREENCHER papel]', github: '[PREENCHER GitHub]', bio: '[PREENCHER mini-bio]' },
];

export function buscarIntegrante(id: string | undefined): Integrante | undefined {
  return INTEGRANTES.find((i) => i.id === id);
}

/** Monta o link do GitHub (aceita "usuario" ou a URL completa). Devolve null se ainda for [PREENCHER]. */
export function linkGithub(github: string): string | null {
  if (github.startsWith('[')) return null;
  if (github.startsWith('http')) return github;
  return `https://github.com/${github.replace(/^@/, '')}`;
}
