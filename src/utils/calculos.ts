// Cálculos do projeto. A única conta própria do WISE UP é "dias por ano".

/** Converte horas por dia em dias por ano: horas × 365 ÷ 24. */
export function diasPorAno(horasPorDia: number): number {
  if (!Number.isFinite(horasPorDia) || horasPorDia < 0) return 0;
  return (horasPorDia * 365) / 24;
}

/** Soma uma lista de números (ignora valores inválidos). */
export function somar(valores: number[]): number {
  return valores.reduce((total, v) => (Number.isFinite(v) ? total + v : total), 0);
}

/**
 * Lê um texto digitado como número. Aceita vírgula ou ponto ("2,5" ou "2.5").
 * Devolve NaN se o texto não for um número simples.
 */
export function paraNumero(texto: string): number {
  const limpo = texto.trim();
  if (!/^\d+([.,]\d+)?$/.test(limpo)) return Number.NaN;
  return Number(limpo.replace(',', '.'));
}

/** Como paraNumero, mas devolve 0 quando o texto é inválido (usado nos painéis ao vivo). */
export function paraNumeroOuZero(texto: string): number {
  const n = paraNumero(texto);
  return Number.isNaN(n) ? 0 : n;
}

/** Formata número no padrão brasileiro (ex.: 60,8). */
export function formatarNumero(valor: number, casas = 1): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: casas });
}

/** Ex.: 4.5 -> "4,5 h". */
export function formatarHoras(valor: number): string {
  return `${formatarNumero(valor)} h`;
}

/** Limita um valor entre mínimo e máximo. */
export function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.min(Math.max(valor, minimo), maximo);
}
