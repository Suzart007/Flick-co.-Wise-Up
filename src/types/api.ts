// Tipos das respostas da API Java (contrato em docs/contrato-api.md).

export interface RedeSocial {
  id: number;
  nome: string;
  categoria: string;
}

export interface Instituicao {
  id: number;
  nome: string;
  /** ESCOLA, UNIVERSIDADE, EMPRESA ou ONG. */
  tipo: string;
  cidade?: string | null;
  dataParceria?: string | null;
}

export interface Fonte {
  id: number;
  nome: string;
  titulo: string;
  /** Data no formato AAAA-MM-DD (ou ISO completo). Pode vir nula se a fonte ainda não tem data confirmada. */
  dataPublicacao: string | null;
  url: string;
}

/** Nível de atenção calculado pela API. Valores fora da lista caem no texto padrão. */
export type NivelRisco = 'BAIXO' | 'MODERADO' | 'ALTO';

export interface Dica {
  id: number;
  descricao: string;
  tipo: string;
  nivelRiscoAlvo: string;
  fonte: Fonte | null;
}

export interface DicaDoResultado extends Dica {
  aplicada: boolean;
}

export interface UsoEnviado {
  redeSocialId: number;
  horasDia: number;
}

export interface NovaAutoavaliacao {
  instituicaoId?: number;
  faixaEtaria: string;
  ocupacao: string;
  horasSono: number;
  nivelFoco: number;
  usos: UsoEnviado[];
}

export interface AutoavaliacaoCriada {
  id: number;
  nivelRisco: string;
  horasTotaisDia: number;
}

export interface UsoDoResultado {
  redeSocial: { id: number; nome: string };
  horasDia: number;
}

export interface Autoavaliacao {
  id: number;
  dataAvaliacao: string;
  horasSono: number;
  nivelFoco: number;
  nivelRisco: string;
  usos: UsoDoResultado[];
  dicas: DicaDoResultado[];
}

export interface NovoRetorno {
  horasTotaisDepois: number;
  nivelFocoDepois: number;
  dicasAplicadasIds: number[];
}

export interface Retorno extends NovoRetorno {
  id: number;
  dataRetorno?: string;
}
