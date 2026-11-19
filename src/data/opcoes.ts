// Opções fixas dos formulários. O "valor" é o que vai para a API (ver docs/contrato-api.md).
export interface Opcao {
  valor: string;
  rotulo: string;
}

// Os valores são os mesmos do banco de dados do grupo (tb_participante).
export const FAIXAS_ETARIAS: Opcao[] = [
  { valor: '15-17', rotulo: '15 a 17 anos' },
  { valor: '18-24', rotulo: '18 a 24 anos' },
  { valor: '25-34', rotulo: '25 a 34 anos' },
  { valor: '35+', rotulo: '35 anos ou mais' },
];

export const OCUPACOES: Opcao[] = [
  { valor: 'ESTUDANTE_MEDIO', rotulo: 'Estudante do ensino médio' },
  { valor: 'ESTUDANTE_SUPERIOR', rotulo: 'Estudante do ensino superior' },
  { valor: 'ESTUDANTE_TRABALHADOR', rotulo: 'Estudante que também trabalha' },
];

/** Tipos de dica que a API devolve (tb_dica.ds_tipo), com o texto que aparece na tela. */
export const TIPOS_DE_DICA: Opcao[] = [
  { valor: 'BLOQUEIO', rotulo: 'Bloqueio' },
  { valor: 'NOTIFICACAO', rotulo: 'Notificações' },
  { valor: 'DESINSTALAR', rotulo: 'Desinstalar' },
  { valor: 'SONO', rotulo: 'Sono' },
  { valor: 'ROTINA', rotulo: 'Rotina' },
];

export function rotuloDe(opcoes: Opcao[], valor: string): string {
  return opcoes.find((o) => o.valor === valor)?.rotulo ?? valor;
}
