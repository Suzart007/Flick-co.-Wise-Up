import type { ItemAcordeao } from '../components/Accordion';

// Perguntas frequentes. Texto sem linguagem clínica e sem promessas.
export const ITENS_FAQ: ItemAcordeao[] = [
  {
    id: 'avaliacao-profissional',
    titulo: 'Isso substitui uma avaliação profissional?',
    conteudo: (
      <p>
        Não. O WISE UP mostra um panorama de uso, uma estimativa baseada no que você informa. Ele não substitui a
        avaliação de um profissional de saúde. Se você sentir que precisa de apoio, converse com alguém de confiança ou
        procure um profissional.
      </p>
    ),
  },
  {
    id: 'anonimo',
    titulo: 'Meus dados são anônimos?',
    conteudo: (
      <p>
        Sim. A autoavaliação não pede nome, CPF, e-mail ou qualquer dado que identifique você. Guardamos apenas as
        respostas do formulário (horas por rede, sono e foco) para montar o seu resultado.
      </p>
    ),
  },
  {
    id: 'instalar',
    titulo: 'Preciso instalar algo?',
    conteudo: (
      <p>
        Não. O WISE UP funciona direto no navegador do celular ou do computador, por link ou QR Code, sem instalação e
        sem custo.
      </p>
    ),
  },
  {
    id: 'como-calcula',
    titulo: 'Como o panorama é calculado?',
    conteudo: (
      <p>
        Somamos as horas por dia que você informou nas redes e convertemos em dias por ano: horas por dia × 365 ÷ 24.
        É uma conta simples, para ajudar a enxergar o tamanho do tempo. O nível de atenção vem da nossa API, com base
        nas suas respostas.
      </p>
    ),
  },
  {
    id: 'dicas',
    titulo: 'De onde vêm as dicas?',
    conteudo: (
      <p>
        Cada dica mostra a fonte (nome, título, data e link) para você conferir por conta própria. Dizemos que o uso
        está &quot;associado a&quot; certos efeitos, porque a ciência ainda estuda essas relações.
      </p>
    ),
  },
  {
    id: 'reavaliar',
    titulo: 'Para que serve a reavaliação?',
    conteudo: (
      <p>
        Depois de 2 semanas testando as dicas, você responde de novo e compara antes e depois. O impacto é medido pelas
        horas reduzidas e pelas dicas que você aplicou.
      </p>
    ),
  },
  {
    id: 'instituicao',
    titulo: 'Minha escola ou faculdade pode usar?',
    conteudo: (
      <p>
        Pode. A instituição compartilha o link ou o QR Code com os estudantes. Pela página de contato você fala com a
        equipe para combinar como levar o WISE UP até a sua turma.
      </p>
    ),
  },
];
