// Opções fixas dos formulários. O "valor" é o que vai para a API (ver docs/contrato-api.md).
export interface Opcao {
  valor: string;
  rotulo: string;
}

export const FAIXAS_ETARIAS: Opcao[] = [
  { valor: 'ATE_17', rotulo: 'Até 17 anos' },
  { valor: '18_24', rotulo: '18 a 24 anos' },
  { valor: '25_34', rotulo: '25 a 34 anos' },
  { valor: '35_MAIS', rotulo: '35 anos ou mais' },
];

export const OCUPACOES: Opcao[] = [
  { valor: 'ENSINO_MEDIO', rotulo: 'Estudante do ensino médio' },
  { valor: 'TECNICO', rotulo: 'Estudante de curso técnico' },
  { valor: 'GRADUACAO', rotulo: 'Estudante de graduação' },
  { valor: 'POS_GRADUACAO', rotulo: 'Estudante de pós-graduação' },
  { valor: 'OUTRO', rotulo: 'Outra' },
];

export function rotuloDe(opcoes: Opcao[], valor: string): string {
  return opcoes.find((o) => o.valor === valor)?.rotulo ?? valor;
}
