import { formatarNumero } from './calculos';

/** Texto do nível de atenção devolvido pela API (BAIXO, MODERADO, ALTO). */
export function descreverNivel(nivel: string): { rotulo: string; texto: string } {
  const chave = nivel.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  switch (chave) {
    case 'BAIXO':
      return {
        rotulo: 'Atenção baixa',
        texto: 'Pelo que você informou, seu uso parece equilibrado. Dá para manter e testar pequenos ajustes.',
      };
    case 'MODERADO':
      return {
        rotulo: 'Atenção moderada',
        texto: 'Vale observar como o tempo nas redes se encaixa com o seu sono e o seu foco.',
      };
    case 'ALTO':
      return {
        rotulo: 'Atenção alta',
        texto: 'O que você informou sugere que as redes ocupam bastante espaço. Pequenos ajustes costumam ser um bom começo.',
      };
    default:
      return { rotulo: `Atenção: ${nivel}`, texto: 'Veja as dicas abaixo e escolha uma para testar.' };
  }
}

export const LEGENDA_FOCO: Record<number, string> = {
  1: 'Quase nunca consigo me concentrar',
  2: 'Me concentro com dificuldade',
  3: 'Me concentro às vezes',
  4: 'Me concentro na maior parte do tempo',
  5: 'Me concentro sem dificuldade',
};

/** Data AAAA-MM-DD (ou ISO) no formato brasileiro. Se não der, devolve o texto original. */
export function formatarData(texto: string): string {
  const somenteData = /^\d{4}-\d{2}-\d{2}$/.test(texto);
  const data = new Date(somenteData ? `${texto}T00:00:00` : texto);
  if (Number.isNaN(data.getTime())) return texto;
  return data.toLocaleDateString('pt-BR');
}

/** Só aceita links http(s), para nunca montar um href perigoso vindo da API. */
export function urlSegura(url: string): string | null {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

/** Texto para compartilhar. Sem nome, sem id e sem nenhum dado identificável. */
export function montarTextoCompartilhar(horasPorDia: number, dias: number, endereco: string): string {
  return (
    `Fiz o panorama de uso de redes sociais no WISE UP: cerca de ${formatarNumero(horasPorDia)} h por dia, ` +
    `o que equivale a ${formatarNumero(dias)} dias por ano. É uma estimativa, sem identificação. ` +
    `Faça a sua autoavaliação anônima: ${endereco}`
  );
}
