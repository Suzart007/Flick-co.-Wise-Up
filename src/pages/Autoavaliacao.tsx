import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { CampoHoras } from '../components/CampoHoras';
import { EscalaFoco } from '../components/EscalaFoco';
import { EstadoDaApi } from '../components/EstadoDaApi';
import { Etapas } from '../components/Etapas';
import { Field, classeControle } from '../components/Field';
import { IconeCadeado, IconeSetaDireita, IconeSetaEsquerda } from '../components/Icones';
import { PainelPanorama } from '../components/PainelPanorama';
import { Container, Rotulo, Titulo } from '../components/Secao';
import { FAIXAS_ETARIAS, OCUPACOES, rotuloDe } from '../data/opcoes';
import { useApi } from '../hooks/useApi';
import { useTitulo } from '../hooks/useTitulo';
import { criarAutoavaliacao } from '../services/autoavaliacoes';
import { comoApiError } from '../services/http';
import type { ApiError } from '../services/http';
import { listarInstituicoes } from '../services/instituicoes';
import { listarRedesSociais } from '../services/redesSociais';
import type { NovaAutoavaliacao, RedeSocial } from '../types/api';
import type { Erros, FormAutoavaliacao } from '../types/formulario';
import { salvarUltimoResultado } from '../utils/armazenamento';
import { diasPorAno, formatarHoras, formatarNumero, paraNumero, paraNumeroOuZero, somar } from '../utils/calculos';
import { focarPrimeiroErro, validarPerfil, validarSonoFoco, validarUsos } from '../utils/validacao';

const ETAPAS = ['Perfil', 'Uso das redes', 'Sono e foco', 'Revisão'] as const;
const ULTIMA = ETAPAS.length - 1;

const FORM_INICIAL: FormAutoavaliacao = {
  instituicaoId: '',
  faixaEtaria: '',
  ocupacao: '',
  usos: {},
  horasSono: '7',
  nivelFoco: 0,
};

export function Autoavaliacao() {
  useTitulo('Autoavaliação');
  const navegar = useNavigate();
  // Vem do botão "Apagar meu resultado" (página de resultado).
  const apagado = (useLocation().state as { apagado?: boolean } | null)?.apagado === true;
  const redes = useApi(listarRedesSociais, []);
  const instituicoes = useApi(listarInstituicoes, []); // opcional: se falhar, o campo some

  const [etapa, setEtapa] = useState(0);
  const [form, setForm] = useState<FormAutoavaliacao>(FORM_INICIAL);
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<ApiError | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const tituloEtapaRef = useRef<HTMLHeadingElement>(null);
  const primeiraRenderizacao = useRef(true);

  const listaRedes: RedeSocial[] = redes.dados ?? [];
  const ids = listaRedes.map((r) => r.id);
  const nomes: Record<number, string> = Object.fromEntries(listaRedes.map((r) => [r.id, r.nome]));

  const horasDaRede = (id: number) => paraNumeroOuZero(form.usos[id] ?? '0');
  const totalRedes = somar(ids.map(horasDaRede));
  const horasSono = paraNumeroOuZero(form.horasSono);

  // Ao trocar de etapa, leva o foco ao título dela (acessibilidade).
  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      return;
    }
    tituloEtapaRef.current?.focus();
  }, [etapa]);

  function alterar<K extends keyof FormAutoavaliacao>(campo: K, valor: FormAutoavaliacao[K]) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: '' }));
  }

  function alterarUso(id: number, valor: string) {
    setForm((atual) => ({ ...atual, usos: { ...atual.usos, [id]: valor } }));
    setErros((atual) => (atual[`uso-${id}`] ? { ...atual, [`uso-${id}`]: '' } : atual));
  }

  /** Valida só os campos de uma etapa. */
  function validarEtapa(numero: number): Erros {
    // Redes ainda sem valor digitado valem 0.
    const usos = Object.fromEntries(ids.map((id) => [id, form.usos[id] ?? '0']));
    if (numero === 0) return validarPerfil(form);
    if (numero === 1) return validarUsos(usos, ids, nomes);
    if (numero === 2) return validarSonoFoco(form, totalRedes);
    return {};
  }

  function mostrarErros(encontrados: Erros) {
    setErros(encontrados);
    focarPrimeiroErro(formRef.current, encontrados);
  }

  function avancar() {
    const encontrados = validarEtapa(etapa);
    if (Object.keys(encontrados).length > 0) return mostrarErros(encontrados);
    setErros({});
    setEtapa((e) => e + 1);
  }

  function voltar() {
    setErros({});
    setErroEnvio(null);
    setEtapa((e) => Math.max(e - 1, 0));
  }

  async function enviar() {
    // Confere tudo de novo; se algo estiver errado, volta para a etapa certa.
    for (let n = 0; n <= 2; n++) {
      const encontrados = validarEtapa(n);
      if (Object.keys(encontrados).length > 0) {
        setEtapa(n);
        setErros(encontrados);
        // Espera a etapa aparecer na tela para focar o campo.
        window.setTimeout(() => focarPrimeiroErro(formRef.current, encontrados), 0);
        return;
      }
    }

    const corpo: NovaAutoavaliacao = {
      instituicaoId: form.instituicaoId !== '' ? Number(form.instituicaoId) : undefined,
      faixaEtaria: form.faixaEtaria,
      ocupacao: form.ocupacao,
      horasSono: paraNumero(form.horasSono),
      nivelFoco: form.nivelFoco,
      usos: listaRedes
        .filter((r) => horasDaRede(r.id) > 0)
        .map((r) => ({ redeSocialId: r.id, horasDia: horasDaRede(r.id) })),
    };

    setEnviando(true);
    setErroEnvio(null);
    try {
      const criada = await criarAutoavaliacao(corpo);
      salvarUltimoResultado(criada.id);
      navegar(`/resultado/${criada.id}`);
    } catch (e) {
      setErroEnvio(comoApiError(e));
      setEnviando(false);
    }
  }

  // Enter dentro de um campo: avança a etapa; na última, envia.
  function aoEnviarFormulario(evento: FormEvent) {
    evento.preventDefault();
    if (etapa < ULTIMA) avancar();
    else void enviar();
  }

  return (
    <div className="py-12 sm:py-20">
      <Container>
        <Rotulo>Autoavaliação anônima</Rotulo>
        <Titulo nivel={1} className="mt-4 !text-4xl sm:!text-6xl">
          Vamos montar seu panorama.
        </Titulo>
        <p className="mt-5 flex max-w-2xl items-start gap-2 text-lg text-gray-700">
          <IconeCadeado className="mt-1 size-5 shrink-0" />
          <span>Anônimo: sem nome, sem CPF. Leva cerca de 2 minutos.</span>
        </p>

        {apagado && (
          <Alert tipo="sucesso" titulo="Resultado apagado" className="mt-6 max-w-2xl">
            Seu resultado foi removido. Quando quiser, você pode fazer uma nova autoavaliação.
          </Alert>
        )}

        <div className="mt-10">
          <EstadoDaApi
            estado={redes}
            mensagemCarregando="Carregando as redes sociais..."
            vazio={(lista) => lista.length === 0}
            tituloVazio="Nenhuma rede social disponível"
            descricaoVazio="A lista de redes ainda não foi cadastrada na API. Tente de novo mais tarde."
          >
            {() => (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-12">
                <div className="min-w-0 lg:order-first">
                  <Etapas etapas={ETAPAS} atual={etapa} />

                  <form ref={formRef} noValidate onSubmit={aoEnviarFormulario} className="mt-8">
                    <h2
                      ref={tituloEtapaRef}
                      tabIndex={-1}
                      className="text-2xl font-semibold tracking-display outline-none sm:text-3xl"
                    >
                      {etapa === 0 && 'Sobre você'}
                      {etapa === 1 && 'Quanto tempo você passa em cada rede?'}
                      {etapa === 2 && 'Sono e foco'}
                      {etapa === 3 && 'Revise e envie'}
                    </h2>

                    {etapa === 0 && (
                      <div className="mt-6 grid gap-6">
                        {instituicoes.dados && instituicoes.dados.length > 0 && (
                          <Field label="Sua instituição de ensino" dica="Ajuda a instituição a ver o panorama geral, sem identificar ninguém.">
                            {(a) => (
                              <select
                                {...a}
                                name="instituicaoId"
                                value={form.instituicaoId}
                                onChange={(e) => alterar('instituicaoId', e.target.value)}
                                className={classeControle(false)}
                              >
                                <option value="">Prefiro não informar</option>
                                {instituicoes.dados?.map((i) => (
                                  <option key={i.id} value={i.id}>
                                    {i.nome}
                                  </option>
                                ))}
                              </select>
                            )}
                          </Field>
                        )}
                        <Field label="Faixa etária" obrigatorio erro={erros.faixaEtaria}>
                          {(a) => (
                            <select
                              {...a}
                              name="faixaEtaria"
                              value={form.faixaEtaria}
                              onChange={(e) => alterar('faixaEtaria', e.target.value)}
                              className={classeControle(Boolean(erros.faixaEtaria))}
                            >
                              <option value="">Selecione</option>
                              {FAIXAS_ETARIAS.map((o) => (
                                <option key={o.valor} value={o.valor}>
                                  {o.rotulo}
                                </option>
                              ))}
                            </select>
                          )}
                        </Field>
                        <Field label="O que mais combina com você?" obrigatorio erro={erros.ocupacao}>
                          {(a) => (
                            <select
                              {...a}
                              name="ocupacao"
                              value={form.ocupacao}
                              onChange={(e) => alterar('ocupacao', e.target.value)}
                              className={classeControle(Boolean(erros.ocupacao))}
                            >
                              <option value="">Selecione</option>
                              {OCUPACOES.map((o) => (
                                <option key={o.valor} value={o.valor}>
                                  {o.rotulo}
                                </option>
                              ))}
                            </select>
                          )}
                        </Field>
                      </div>
                    )}

                    {etapa === 1 && (
                      <div className="mt-6 grid gap-4">
                        <p className="text-gray-700">
                          Uma média do seu dia a dia. Se não usa uma rede, deixe em 0. Não precisa ser exato.
                        </p>
                        {listaRedes.map((rede) => (
                          <CampoHoras
                            key={rede.id}
                            nome={`uso-${rede.id}`}
                            rotulo={rede.nome}
                            legenda={rede.categoria}
                            valor={form.usos[rede.id] ?? '0'}
                            onChange={(v) => alterarUso(rede.id, v)}
                            erro={erros[`uso-${rede.id}`]}
                          />
                        ))}
                      </div>
                    )}

                    {etapa === 2 && (
                      <div className="mt-6 grid gap-8">
                        <CampoHoras
                          nome="horasSono"
                          rotulo="Horas de sono por noite"
                          legenda="Em média, nos dias de semana."
                          valor={form.horasSono}
                          onChange={(v) => alterar('horasSono', v)}
                          erro={erros.horasSono}
                        />
                        <EscalaFoco
                          nome="nivelFoco"
                          legenda="Como está o seu foco nos estudos ou no trabalho?"
                          valor={form.nivelFoco}
                          onChange={(v) => alterar('nivelFoco', v)}
                          erro={erros.nivelFoco}
                        />
                      </div>
                    )}

                    {etapa === 3 && (
                      <Revisao
                        form={form}
                        redes={listaRedes}
                        horasDaRede={horasDaRede}
                        totalRedes={totalRedes}
                        nomeInstituicao={instituicoes.dados?.find((i) => String(i.id) === form.instituicaoId)?.nome}
                        irPara={(n) => setEtapa(n)}
                      />
                    )}

                    {erroEnvio && (
                      <Alert
                        tipo="erro"
                        titulo="Não conseguimos enviar sua autoavaliação"
                        className="mt-6"
                        acao={
                          <Button onClick={() => void enviar()} carregando={enviando}>
                            Tentar novamente
                          </Button>
                        }
                      >
                        {erroEnvio.message}
                        {Object.keys(erroEnvio.campos).length > 0 && (
                          <ul className="mt-2 list-disc pl-5">
                            {Object.entries(erroEnvio.campos).map(([campo, msg]) => (
                              <li key={campo}>
                                {campo}: {msg}
                              </li>
                            ))}
                          </ul>
                        )}
                      </Alert>
                    )}
                    {enviando && (
                      <p className="mt-4 text-sm text-gray-700" role="status">
                        Enviando... a API pode levar alguns segundos na primeira chamada.
                      </p>
                    )}

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                      {etapa > 0 ? (
                        <Button variante="secundario" onClick={voltar} disabled={enviando}>
                          <IconeSetaEsquerda className="size-4" />
                          Voltar
                        </Button>
                      ) : (
                        <span />
                      )}
                      {etapa < ULTIMA ? (
                        <Button type="submit" tamanho="lg">
                          Continuar
                          <IconeSetaDireita className="size-4" />
                        </Button>
                      ) : (
                        <Button type="submit" tamanho="lg" variante="destaque" carregando={enviando}>
                          {enviando ? 'Enviando...' : 'Ver meu panorama'}
                        </Button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="order-first lg:order-last lg:sticky lg:top-24">
                  <PainelPanorama horasRedes={totalRedes} horasSono={horasSono} />
                </div>
              </div>
            )}
          </EstadoDaApi>
        </div>
      </Container>
    </div>
  );
}

interface RevisaoProps {
  form: FormAutoavaliacao;
  redes: RedeSocial[];
  horasDaRede: (id: number) => number;
  totalRedes: number;
  nomeInstituicao?: string;
  irPara: (etapa: number) => void;
}

/** Última etapa: resumo do que a pessoa respondeu, com atalhos para editar. */
function Revisao({ form, redes, horasDaRede, totalRedes, nomeInstituicao, irPara }: RevisaoProps) {
  const comUso = redes.filter((r) => horasDaRede(r.id) > 0);
  const botaoEditar = (etapa: number, rotulo: string) => (
    <button
      type="button"
      onClick={() => irPara(etapa)}
      className="min-h-11 text-sm font-semibold underline decoration-orange decoration-2 underline-offset-4"
    >
      {rotulo}
    </button>
  );

  return (
    <div className="mt-6 grid gap-4">
      <p className="text-gray-700">Confira suas respostas. Você pode voltar e ajustar o que quiser.</p>
      <dl className="divide-y divide-gray-300 rounded-3xl border border-gray-300 bg-paper px-5">
        <div className="flex items-start justify-between gap-4 py-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-label text-gray-600">Perfil</dt>
            <dd className="mt-1">
              {rotuloDe(FAIXAS_ETARIAS, form.faixaEtaria)} · {rotuloDe(OCUPACOES, form.ocupacao)}
              {nomeInstituicao && <span className="block text-gray-700">{nomeInstituicao}</span>}
            </dd>
          </div>
          {botaoEditar(0, 'Editar')}
        </div>
        <div className="flex items-start justify-between gap-4 py-4">
          <div className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-label text-gray-600">Redes sociais</dt>
            <dd className="mt-1">
              {comUso.length === 0 ? (
                'Nenhuma rede com uso informado.'
              ) : (
                <ul>
                  {comUso.map((r) => (
                    <li key={r.id}>
                      {r.nome}: <strong>{formatarHoras(horasDaRede(r.id))}</strong> por dia
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-gray-700">
                Total: <strong>{formatarHoras(totalRedes)}</strong> por dia, cerca de{' '}
                <strong>{formatarNumero(diasPorAno(totalRedes))} dias</strong> por ano.
              </p>
            </dd>
          </div>
          {botaoEditar(1, 'Editar')}
        </div>
        <div className="flex items-start justify-between gap-4 py-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-label text-gray-600">Sono e foco</dt>
            <dd className="mt-1">
              Sono: <strong>{formatarHoras(paraNumeroOuZero(form.horasSono))}</strong> por noite · Foco:{' '}
              <strong>{form.nivelFoco} de 5</strong>
            </dd>
          </div>
          {botaoEditar(2, 'Editar')}
        </div>
      </dl>
      <p className="text-sm text-gray-600">
        Seus dados são anônimos. O resultado é uma estimativa e não substitui avaliação profissional.
      </p>
    </div>
  );
}
