// localStorage pode falhar (aba anônima, bloqueio). Por isso tudo fica em try/catch.
const CHAVE = 'wiseup:ultimoResultado';

export function salvarUltimoResultado(id: number | string): void {
  try {
    window.localStorage.setItem(CHAVE, String(id));
  } catch {
    /* sem armazenamento: o app continua funcionando */
  }
}

export function lerUltimoResultado(): string | null {
  try {
    return window.localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

export function limparUltimoResultado(): void {
  try {
    window.localStorage.removeItem(CHAVE);
  } catch {
    /* ignora */
  }
}
