import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { Button, ButtonLink } from '../components/Button';
import { Card } from '../components/Card';
import { CampoHoras } from '../components/CampoHoras';
import { EscalaFoco } from '../components/EscalaFoco';
import { EstadoDaApi } from '../components/EstadoDaApi';
import { Container, Rotulo, Titulo } from '../components/Secao';
import { useApi } from '../hooks/useApi';
import { useTitulo } from '../hooks/useTitulo';
import { buscarAutoavaliacao, criarRetorno } from '../services/autoavaliacoes';
import { comoApiError } from '../services/http';
import type { ApiError } from '../services/http';
import type { Autoavaliacao } from '../types/api';
import type { Erros, FormRetorno } from '../types/formulario';
import { formatarHoras, formatarNumero, paraNumero, somar } from '../utils/calculos';
import { focarPrimeiroErro, validarRetorno } from '../utils/validacao';

/** P1: formulário de retorno que compara o antes e o depois. */
export function Reavaliacao() {
  const { id = '' } = useParams<{ id: string }>();
  useTitulo('Reavaliação');
  const estado = useApi((signal) => buscarAutoavaliacao(id, signal), [id]);

  return (
    <div className="py-12 sm:py-20">
      <Container className="max-w-3xl">
        <Rotulo>Reavaliação</Rotulo>
        <Titulo nivel={1} className="mt-4 !text-4xl sm:!text-6xl">
          Como foram essas semanas?
        </Titulo>
        <p className="mt-5 text-lg text-gray-700">
          Depois de cerca de 2 semanas testando as dicas, conte como está o seu uso. Sem cobrança: o objetivo é enxergar o
          que mudou.
        </p>
        <div className="mt-10">
          <EstadoDaApi estado={estado} mensagemCarregando="Buscando sua autoavaliação..." tituloVazio="Resultado não encontrado">
            {(antes) => <FormularioRetorno id={id} antes={antes} />}
          </EstadoDaApi>
        </div>
      </Container>
    </div>
  );
}

function FormularioRetorno({ id, antes }: { id: string; antes: Autoavaliacao }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormRetorno>({ horasTotaisDepois: '', nivelFocoDepois: 0, dicasAplicadasIds: [] });
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<ApiError | null>(null);
  const [concluido, setConcluido] = useState(false);

  const horasAntes = somar(antes.usos.map((u) => u.horasDia));

  function alternarDica(dicaId: number) {
    setForm((atual) => ({
      ...atual,
      dicasAplicadasIds: atual.dicasAplicadasIds.includes(dicaId)
        ? atual.dicasAplicadasIds.filter((d) => d !== dicaId)
        : [...atual.dicasAplicadasIds, dicaId],
    }));
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const encontrados = validarRetorno(form);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      focarPrimeiroErro(formRef.current, encontrados);
      return;
    }
    setEnviando(true);
    setErroEnvio(null);
    try {
      await criarRetorno(id, {
        horasTotaisDepois: paraNumero(form.horasTotaisDepois),
        nivelFocoDepois: form.nivelFocoDepois,
        dicasAplicadasIds: form.dicasAplicadasIds,
      });
      setConcluido(true);
      // O formulário some e dá lugar à confirmação: sobe a tela para a mensagem de sucesso ficar visível.
      window.scrollTo(0, 0);
    } catch (e) {
      setErroEnvio(comoApiError(e));
    } finally {
      setEnviando(false);
    }
  }

  if (concluido) {
    const depois = paraNumero(form.horasTotaisDepois);
    const diferenca = horasAntes - depois;
    return (
      <div className="grid gap-6">
        <Alert tipo="sucesso" titulo="Reavaliação registrada">
          Obrigado por voltar! Veja a comparação abaixo.
        </Alert>
        <Card tom="escuro">
          <p className="text-xs font-semibold uppercase tracking-label text-orange-soft">Antes e depois</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-5xl font-semibold tracking-display">{formatarHoras(horasAntes)}</p>
              <p className="mt-1 text-muted">por dia, na primeira avaliação</p>
            </div>
            <div>
              <p className="text-5xl font-semibold tracking-display">{formatarHoras(depois)}</p>
              <p className="mt-1 text-muted">por dia, agora</p>
            </div>
          </div>
          <p className="mt-6 text-lg">
            {diferenca > 0
              ? `Você reduziu ${formatarNumero(diferenca)} h por dia.`
              : diferenca < 0
                ? `O uso subiu ${formatarNumero(Math.abs(diferenca))} h por dia. Acontece: escolha uma dica e tente de novo.`
                : 'O tempo ficou igual. Vale testar outra dica.'}{' '}
            Dicas aplicadas: {form.dicasAplicadasIds.length}.
          </p>
        </Card>
        <div>
          <ButtonLink to={`/resultado/${id}`}>Voltar ao meu resultado</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={(e) => void enviar(e)} className="grid gap-8">
      <p className="rounded-2xl border border-gray-300 bg-gray-50 p-4 text-gray-700">
        Na primeira avaliação você informou <strong className="text-ink">{formatarHoras(horasAntes)}</strong> por dia nas
        redes.
      </p>

      <CampoHoras
        nome="horasTotaisDepois"
        rotulo="Total de horas por dia nas redes, hoje"
        legenda="Some todas as redes. Uma média das últimas semanas."
        valor={form.horasTotaisDepois}
        maximoSlider={16}
        onChange={(v) => {
          setForm((a) => ({ ...a, horasTotaisDepois: v }));
          if (erros.horasTotaisDepois) setErros((a) => ({ ...a, horasTotaisDepois: '' }));
        }}
        erro={erros.horasTotaisDepois}
      />

      <EscalaFoco
        nome="nivelFocoDepois"
        legenda="Como está o seu foco agora?"
        valor={form.nivelFocoDepois}
        onChange={(v) => {
          setForm((a) => ({ ...a, nivelFocoDepois: v }));
          if (erros.nivelFocoDepois) setErros((a) => ({ ...a, nivelFocoDepois: '' }));
        }}
        erro={erros.nivelFocoDepois}
      />

      <fieldset>
        <legend className="mb-3 text-base font-semibold">Quais dicas você aplicou? (opcional)</legend>
        {antes.dicas.length === 0 ? (
          <p className="text-gray-700">Não há dicas sugeridas neste resultado.</p>
        ) : (
          <ul className="grid gap-3">
            {antes.dicas.map((dica) => (
              <li key={dica.id}>
                <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-2xl border border-gray-300 bg-paper p-4 hover:border-ink">
                  <input
                    type="checkbox"
                    checked={form.dicasAplicadasIds.includes(dica.id)}
                    onChange={() => alternarDica(dica.id)}
                    className="mt-1 size-5 shrink-0 accent-ink"
                  />
                  <span>{dica.descricao}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      {erroEnvio && (
        <Alert
          tipo="erro"
          titulo="Não conseguimos registrar sua reavaliação"
          acao={
            <Button type="submit" carregando={enviando}>
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" tamanho="lg" carregando={enviando}>
          {enviando ? 'Enviando...' : 'Registrar reavaliação'}
        </Button>
        <Link to={`/resultado/${id}`} className="inline-flex min-h-11 items-center font-semibold underline decoration-orange decoration-2 underline-offset-4">
          Voltar ao resultado
        </Link>
      </div>
    </form>
  );
}
