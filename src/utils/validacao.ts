// Validações feitas à mão (sem biblioteca de formulário). Cada função devolve
// um objeto { nomeDoCampo: "mensagem" }; objeto vazio = tudo certo.
import type { Erros, FormAutoavaliacao, FormContato, FormRetorno } from '../types/formulario';
import { paraNumero } from './calculos';

const HORAS_NO_DIA = 24;

export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/** Confere se um texto é um número de horas entre 0 e 24. */
export function validarHoras(texto: string, rotulo: string): string | undefined {
  if (texto.trim() === '') return `Informe as horas de ${rotulo}. Se não usa, digite 0.`;
  const n = paraNumero(texto);
  if (Number.isNaN(n)) return 'Use apenas números, por exemplo 2 ou 2,5.';
  if (n > HORAS_NO_DIA) return 'Informe um valor entre 0 e 24 horas.';
  return undefined;
}

export function validarContato(f: FormContato): Erros {
  const erros: Erros = {};
  if (f.nome.trim().length < 2) erros.nome = 'Escreva seu nome (mínimo de 2 letras).';
  if (f.email.trim() === '') erros.email = 'Informe seu e-mail para podermos responder.';
  else if (!emailValido(f.email)) erros.email = 'Esse e-mail parece incompleto. Exemplo: nome@dominio.com.br';
  if (f.assunto.trim().length < 3) erros.assunto = 'Conte o assunto em poucas palavras.';
  if (f.mensagem.trim().length < 10) erros.mensagem = 'Escreva uma mensagem com pelo menos 10 caracteres.';
  return erros;
}

export function validarPerfil(f: FormAutoavaliacao): Erros {
  const erros: Erros = {};
  if (f.faixaEtaria === '') erros.faixaEtaria = 'Escolha sua faixa etária.';
  if (f.ocupacao === '') erros.ocupacao = 'Escolha a opção que mais se parece com você.';
  return erros;
}

/** Valida as horas de cada rede e o total delas (máximo de 24 h por dia). */
export function validarUsos(usos: Record<number, string>, ids: number[], nomes: Record<number, string>): Erros {
  const erros: Erros = {};
  for (const id of ids) {
    const erro = validarHoras(usos[id] ?? '', nomes[id] ?? 'esta rede');
    if (erro) erros[`uso-${id}`] = erro;
  }
  if (Object.keys(erros).length > 0) return erros;

  // Só confere a soma depois que cada campo está certo.
  const valores = ids.map((id) => paraNumero(usos[id] ?? '0'));
  const total = valores.reduce((a, b) => a + b, 0);
  if (total > HORAS_NO_DIA) {
    const ultimo = ids.filter((_, i) => (valores[i] ?? 0) > 0).pop() ?? ids[0];
    if (ultimo !== undefined) erros[`uso-${ultimo}`] = 'Somando as redes, o total passa de 24 horas por dia. Reduza algum valor.';
  }
  return erros;
}

export function validarSonoFoco(f: FormAutoavaliacao, totalRedes: number): Erros {
  const erros: Erros = {};
  const erroSono = validarHoras(f.horasSono, 'sono');
  if (erroSono) erros.horasSono = erroSono;
  else if (totalRedes + paraNumero(f.horasSono) > HORAS_NO_DIA) {
    erros.horasSono = 'Redes + sono passam de 24 horas por dia. Revise os valores.';
  }
  if (f.nivelFoco < 1) erros.nivelFoco = 'Escolha uma opção de 1 a 5 para o seu foco.';
  return erros;
}

export function validarRetorno(f: FormRetorno): Erros {
  const erros: Erros = {};
  const erro = validarHoras(f.horasTotaisDepois, 'redes sociais');
  if (erro) erros.horasTotaisDepois = erro;
  if (f.nivelFocoDepois < 1) erros.nivelFocoDepois = 'Escolha uma opção de 1 a 5 para o seu foco.';
  return erros;
}

/** Foca o primeiro campo com erro, seguindo a ordem em que aparecem na tela. */
export function focarPrimeiroErro(formulario: HTMLFormElement | null, erros: Erros): void {
  if (!formulario) return;
  for (const elemento of Array.from(formulario.elements)) {
    if (!(elemento instanceof HTMLElement)) continue;
    const nome = elemento.getAttribute('name');
    if (nome && erros[nome]) {
      elemento.focus();
      return;
    }
  }
}
