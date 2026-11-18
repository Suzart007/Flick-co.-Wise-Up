// Estado dos formulários. Números ficam como texto para podermos validar o que a pessoa digitou.

export interface FormAutoavaliacao {
  instituicaoId: string; // "" = não informar
  faixaEtaria: string;
  ocupacao: string;
  /** Horas por dia em cada rede, indexadas pelo id da rede. */
  usos: Record<number, string>;
  horasSono: string;
  nivelFoco: number; // 0 = ainda não escolhido
}

export interface FormRetorno {
  horasTotaisDepois: string;
  nivelFocoDepois: number;
  dicasAplicadasIds: number[];
}

export interface FormContato {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

/** Mensagens de erro por campo (a chave é o atributo "name" do campo). */
export type Erros = Record<string, string>;
