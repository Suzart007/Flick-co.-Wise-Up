// Dados dos integrantes da equipe Flick Co.
import fotoGuilherme from '../assets/integrantes/guilherme.jpg';
import fotoHenry from '../assets/integrantes/henry.jpg';
import fotoKaio from '../assets/integrantes/kaio.jpg';

export interface Integrante {
  id: string;
  nome: string;
  rm: string;
  /** Usuário ou link do GitHub. */
  github: string;
  /** Link completo do perfil no LinkedIn. */
  linkedin: string;
  /** Foto em src/assets/integrantes. Sem foto, a página mostra o número do integrante. */
  foto?: string;
  /** Opcionais: só aparecem na página quando preenchidos. */
  papel?: string;
  bio?: string;
}

export const INTEGRANTES: Integrante[] = [
  {
    id: '1',
    nome: 'Kaio Marcus Macedo Chiappinelli',
    rm: '573365',
    github: 'KaioChiappinelli',
    linkedin: 'https://www.linkedin.com/in/kaio-chiappinelli-183106322',
    foto: fotoKaio,
  },
  {
    id: '2',
    nome: 'Matheus Vecchi',
    rm: '569749',
    github: 'ogvecchi',
    linkedin: 'https://www.linkedin.com/in/matheusvecchi-',
  },
  {
    id: '3',
    nome: 'Guilherme Souza Suzart',
    rm: '569884',
    github: 'Suzart007',
    linkedin: 'https://www.linkedin.com/in/guilherme-suzart-ba83193b3',
    foto: fotoGuilherme,
  },
  {
    id: '4',
    nome: 'Henry Vitor Medeiros Bascope',
    rm: '573576',
    github: 'HenryBascope',
    linkedin: 'https://www.linkedin.com/in/henrybascope/',
    foto: fotoHenry,
  },
];

export function buscarIntegrante(id: string | undefined): Integrante | undefined {
  return INTEGRANTES.find((i) => i.id === id);
}

/** Monta o link do GitHub (aceita "usuario" ou a URL completa). */
export function linkGithub(github: string): string {
  if (github.startsWith('http')) return github;
  return `https://github.com/${github.replace(/^@/, '')}`;
}
