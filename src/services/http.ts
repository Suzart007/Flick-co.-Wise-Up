// Camada HTTP única do app. Usa somente a Fetch API nativa do navegador (nenhuma biblioteca de requisição).
const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');

// O backend gratuito (Render) pode levar ~1 min para "acordar".
const TEMPO_LIMITE_PADRAO_MS = 60_000;

export type TipoErro = 'config' | 'rede' | 'tempo' | 'http' | 'cancelado';

export class ApiError extends Error {
  readonly tipo: TipoErro;
  readonly status: number | null;
  /** Erros por campo, quando a API envia (status 400). */
  readonly campos: Record<string, string>;

  constructor(tipo: TipoErro, mensagem: string, status: number | null = null, campos: Record<string, string> = {}) {
    super(mensagem);
    this.name = 'ApiError';
    this.tipo = tipo;
    this.status = status;
    this.campos = campos;
  }
}

export function ehCancelamento(erro: unknown): boolean {
  return erro instanceof ApiError && erro.tipo === 'cancelado';
}

/** Garante que o que foi capturado no catch vire um ApiError. */
export function comoApiError(erro: unknown): ApiError {
  if (erro instanceof ApiError) return erro;
  return new ApiError('rede', 'Algo inesperado aconteceu. Tente novamente.');
}

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function primeiroTexto(obj: Record<string, unknown>, chaves: string[]): string | undefined {
  for (const chave of chaves) {
    const v = obj[chave];
    if (typeof v === 'string' && v.trim() !== '') return v;
  }
  return undefined;
}

/**
 * Lê o corpo de erro da API aceitando vários formatos comuns:
 *  - { message | mensagem | detail | error | title }
 *  - { errors | erros | fieldErrors | violations: [{ campo|field, mensagem|message }] }
 *  - { errors: { campo: "mensagem" } }
 */
function lerCorpoDeErro(corpo: unknown): { mensagem?: string; campos: Record<string, string> } {
  const campos: Record<string, string> = {};
  if (!ehObjeto(corpo)) return { campos };

  const mensagem = primeiroTexto(corpo, ['mensagem', 'message', 'detail', 'detalhe', 'title', 'error']);

  for (const chave of ['errors', 'erros', 'fieldErrors', 'violations', 'campos']) {
    const lista = corpo[chave];
    if (Array.isArray(lista)) {
      for (const item of lista) {
        if (!ehObjeto(item)) continue;
        const campo = primeiroTexto(item, ['campo', 'field', 'name', 'property']);
        const texto = primeiroTexto(item, ['mensagem', 'message', 'defaultMessage', 'reason']);
        if (campo && texto) campos[campo] = texto;
      }
    } else if (ehObjeto(lista)) {
      for (const [campo, valor] of Object.entries(lista)) {
        if (typeof valor === 'string') campos[campo] = valor;
        else if (Array.isArray(valor) && typeof valor[0] === 'string') campos[campo] = valor[0];
      }
    }
  }
  return { mensagem, campos };
}

function mensagemPadrao(status: number, doServidor?: string): string {
  switch (status) {
    case 400:
      return doServidor ?? 'Alguns dados precisam de ajuste. Confira os campos e tente de novo.';
    case 404:
      return 'Não encontramos o que você procurou. Ele pode ter sido apagado ou o endereço está incorreto.';
    case 409:
      return doServidor ?? 'Essa ação entra em conflito com uma regra do sistema. Revise as informações.';
    default:
      if (status >= 500) return 'A API teve um problema agora. Aguarde um instante e tente novamente.';
      return doServidor ?? `A API respondeu com um erro (${status}). Tente novamente.`;
  }
}

export interface OpcoesRequisicao {
  metodo?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  corpo?: unknown;
  signal?: AbortSignal;
  tempoLimiteMs?: number;
}

export interface RespostaHttp<T> {
  dados: T;
  status: number;
  location: string | null;
}

export async function requisitar<T>(caminho: string, opcoes: OpcoesRequisicao = {}): Promise<RespostaHttp<T>> {
  if (BASE_URL === '') {
    throw new ApiError(
      'config',
      'A URL da API ainda não foi configurada. Defina VITE_API_BASE_URL (veja o README) e reinicie o app.',
    );
  }

  const controlador = new AbortController();
  let estourouTempo = false;
  const relogio = window.setTimeout(() => {
    estourouTempo = true;
    controlador.abort();
  }, opcoes.tempoLimiteMs ?? TEMPO_LIMITE_PADRAO_MS);

  // Se quem chamou cancelar (ex.: trocou de página), cancelamos o fetch também.
  const aoCancelar = () => controlador.abort();
  if (opcoes.signal?.aborted) controlador.abort();
  else opcoes.signal?.addEventListener('abort', aoCancelar, { once: true });

  try {
    let resposta: Response;
    try {
      resposta = await fetch(`${BASE_URL}${caminho}`, {
        method: opcoes.metodo ?? 'GET',
        headers: {
          Accept: 'application/json',
          ...(opcoes.corpo !== undefined ? { 'Content-Type': 'application/json' } : {}),
        },
        body: opcoes.corpo !== undefined ? JSON.stringify(opcoes.corpo) : undefined,
        signal: controlador.signal,
      });
    } catch {
      if (estourouTempo) {
        throw new ApiError('tempo', 'A API demorou demais para responder. Ela pode estar acordando: tente novamente.');
      }
      if (opcoes.signal?.aborted) throw new ApiError('cancelado', 'Requisição cancelada.');
      throw new ApiError('rede', 'Não conseguimos falar com a API. Verifique sua conexão e tente novamente.');
    }

    const texto = await resposta.text();
    let corpo: unknown = undefined;
    if (texto !== '') {
      try {
        corpo = JSON.parse(texto);
      } catch {
        corpo = undefined;
      }
    }

    if (!resposta.ok) {
      const { mensagem, campos } = lerCorpoDeErro(corpo);
      throw new ApiError('http', mensagemPadrao(resposta.status, mensagem), resposta.status, campos);
    }

    return { dados: corpo as T, status: resposta.status, location: resposta.headers.get('Location') };
  } finally {
    window.clearTimeout(relogio);
    opcoes.signal?.removeEventListener('abort', aoCancelar);
  }
}

/** Algumas APIs devolvem lista pura; outras, página { content: [] }. Aceitamos as duas. */
export function extrairLista<T>(dados: unknown): T[] {
  if (Array.isArray(dados)) return dados as T[];
  if (ehObjeto(dados) && Array.isArray(dados.content)) return dados.content as T[];
  return [];
}
