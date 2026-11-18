import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { Button, ButtonLink } from '../components/Button';
import { Card } from '../components/Card';
import { DicaCard } from '../components/DicaCard';
import { EmptyState } from '../components/EmptyState';
import { EstadoDaApi } from '../components/EstadoDaApi';
import { IconeCheck, IconeCopiar, IconeLixeira } from '../components/Icones';
import { NumeroAnimado } from '../components/NumeroAnimado';
import { Container, Rotulo, Secao, Titulo } from '../components/Secao';
import { useApi } from '../hooks/useApi';
import { useTitulo } from '../hooks/useTitulo';
import { apagarAutoavaliacao, buscarAutoavaliacao, listarRetornos } from '../services/autoavaliacoes';
import { comoApiError } from '../services/http';
import type { ApiError } from '../services/http';
import type { Autoavaliacao } from '../types/api';
import { limparUltimoResultado } from '../utils/armazenamento';
import { diasPorAno, formatarHoras, formatarNumero, somar } from '../utils/calculos';
import { descreverNivel, formatarData, montarTextoCompartilhar } from '../utils/textos';

const ID_VALIDO = /^[A-Za-z0-9_-]+$/;

export function Resultado() {
  const { id = '' } = useParams<{ id: string }>();
  useTitulo('Seu resultado');
  const idValido = ID_VALIDO.test(id);
  const estado = useApi((signal) => buscarAutoavaliacao(id, signal), [id]);

  if (!idValido) {
    return (
      <Container className="py-16 sm:py-24">
        <EmptyState
          titulo="Esse endereço de resultado não é válido"
          descricao="Confira o link ou faça uma nova autoavaliação."
          acao={<ButtonLink to="/autoavaliacao">Fazer autoavaliação</ButtonLink>}
        />
      </Container>
    );
  }

  return (
    <EstadoDaApi
      estado={estado}
      mensagemCarregando="Buscando o seu resultado..."
      tituloVazio="Resultado não encontrado"
    >
      {(resultado) => <ResultadoPronto id={id} resultado={resultado} />}
    </EstadoDaApi>
  );
}

function ResultadoPronto({ id, resultado }: { id: string; resultado: Autoavaliacao }) {
  const horasTotais = somar(resultado.usos.map((u) => u.horasDia));
  const dias = diasPorAno(horasTotais);
  const nivel = descreverNivel(resultado.nivelRisco);
  const maiorUso = Math.max(...resultado.usos.map((u) => u.horasDia), 1);
  const retornos = useApi((signal) => listarRetornos(id, signal), [id]);

  return (
    <>
      <section data-tone="ink" className="bg-ink py-14 text-paper sm:py-20" aria-labelledby="titulo-resultado">
        <Container>
          <Rotulo>Seu panorama · {formatarData(resultado.dataAvaliacao)}</Rotulo>
          <Titulo nivel={1} id="titulo-resultado" className="mt-4 max-w-3xl">
            {nivel.rotulo}
          </Titulo>
          <p className="mt-5 max-w-2xl text-lg text-muted">{nivel.texto}</p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-line p-6 sm:p-8">
              <p className="text-6xl font-semibold leading-none tracking-display sm:text-7xl">
                <NumeroAnimado valor={horasTotais} />
              </p>
              <p className="mt-3 text-muted">horas por dia nas redes sociais</p>
            </div>
            <div className="rounded-3xl border border-line p-6 sm:p-8">
              <p className="text-6xl font-semibold leading-none tracking-display sm:text-7xl">
                <NumeroAnimado valor={dias} />
              </p>
              <p className="mt-3 text-muted">dias por ano no celular (horas por dia × 365 ÷ 24)</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted">
            Sono informado: {formatarHoras(resultado.horasSono)} por noite · Foco: {resultado.nivelFoco} de 5. É uma
            autoavaliação: estimativa baseada no que você informou.
          </p>
        </Container>
      </section>

      <Secao rotuloId="titulo-usos">
        <Rotulo>Por rede social</Rotulo>
        <Titulo id="titulo-usos" className="mt-4">
          Onde o tempo vai.
        </Titulo>
        {resultado.usos.length === 0 ? (
          <p className="mt-6 text-gray-700">Você informou 0 hora em todas as redes. Que bom!</p>
        ) : (
          <ul className="mt-10 grid max-w-3xl gap-5">
            {resultado.usos.map((uso) => (
              <li key={uso.redeSocial.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold">{uso.redeSocial.nome}</span>
                  <span className="tabular-nums text-gray-700">{formatarHoras(uso.horasDia)} por dia</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200" aria-hidden="true">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${(uso.horasDia / maiorUso) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Secao>

      <Secao tom="suave" rotuloId="titulo-dicas">
        <Rotulo>Para você testar</Rotulo>
        <Titulo id="titulo-dicas" className="mt-4 max-w-3xl">
          Dicas sugeridas, com fonte.
        </Titulo>
        {resultado.dicas.length === 0 ? (
          <p className="mt-6 text-gray-700">Ainda não há dicas sugeridas para este resultado.</p>
        ) : (
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resultado.dicas.map((dica) => (
              <li key={dica.id}>
                <DicaCard dica={dica} aplicada={dica.aplicada} />
              </li>
            ))}
          </ul>
        )}
      </Secao>

      {/* Reavaliações anteriores: se a chamada falhar ou não houver nada, a seção não aparece. */}
      {retornos.dados && retornos.dados.length > 0 && (
        <Secao rotuloId="titulo-retornos">
          <Rotulo>Reavaliações</Rotulo>
          <Titulo id="titulo-retornos" className="mt-4">
            Antes e depois.
          </Titulo>
          <ul className="mt-10 grid max-w-3xl gap-4">
            {retornos.dados.map((r) => {
              const diferenca = horasTotais - r.horasTotaisDepois;
              return (
                <li key={r.id}>
                  <Card>
                    <p className="text-lg">
                      Antes: <strong>{formatarHoras(horasTotais)}</strong> por dia · Depois:{' '}
                      <strong>{formatarHoras(r.horasTotaisDepois)}</strong> por dia
                    </p>
                    <p className="mt-2 text-gray-700">
                      {diferenca > 0
                        ? `Você reduziu ${formatarNumero(diferenca)} h por dia.`
                        : diferenca < 0
                          ? `O uso subiu ${formatarNumero(Math.abs(diferenca))} h por dia. Acontece: escolha uma dica para recomeçar.`
                          : 'O tempo ficou igual. Vale testar outra dica.'}{' '}
                      Foco depois: {r.nivelFocoDepois} de 5 · Dicas aplicadas: {r.dicasAplicadasIds.length}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Secao>
      )}

      <Secao tom="escuro" rotuloId="titulo-proximos">
        <Rotulo>Próximos passos</Rotulo>
        <Titulo id="titulo-proximos" className="mt-4 max-w-3xl">
          Teste uma dica e reavalie em 2 semanas.
        </Titulo>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <AcoesDoResultado id={id} horasTotais={horasTotais} dias={dias} />
        </div>
      </Secao>
    </>
  );
}

function AcoesDoResultado({ id, horasTotais, dias }: { id: string; horasTotais: number; dias: number }) {
  const navegar = useNavigate();
  const [copiado, setCopiado] = useState(false);
  const [erroCopia, setErroCopia] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [apagando, setApagando] = useState(false);
  const [erroApagar, setErroApagar] = useState<ApiError | null>(null);

  async function copiar() {
    const texto = montarTextoCompartilhar(horasTotais, dias, `${window.location.origin}/autoavaliacao`);
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setErroCopia(false);
      window.setTimeout(() => setCopiado(false), 3000);
    } catch {
      setErroCopia(true);
    }
  }

  async function apagar() {
    setApagando(true);
    setErroApagar(null);
    try {
      await apagarAutoavaliacao(id);
      limparUltimoResultado();
      navegar('/autoavaliacao', { state: { apagado: true } });
    } catch (e) {
      setErroApagar(comoApiError(e));
      setApagando(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-start gap-4">
        <ButtonLink to={`/reavaliacao/${id}`} variante="destaque" tamanho="lg">
          Fazer minha reavaliação
        </ButtonLink>
        <Button variante="claro" onClick={() => void copiar()}>
          {copiado ? <IconeCheck className="size-4" /> : <IconeCopiar className="size-4" />}
          {copiado ? 'Texto copiado' : 'Copiar texto para compartilhar'}
        </Button>
        {copiado && (
          <p role="status" className="text-sm text-muted">
            Copiamos um texto sem nome e sem identificação.
          </p>
        )}
        {erroCopia && (
          <Alert tipo="aviso">Não conseguimos copiar automaticamente. Selecione e copie o texto manualmente.</Alert>
        )}
        <Link to="/dicas" className="min-h-11 py-2 text-sm font-semibold underline decoration-orange decoration-2 underline-offset-4">
          Ver todas as dicas
        </Link>
      </div>

      <div className="rounded-3xl border border-line p-6">
        <h3 className="text-lg font-semibold">Apagar meu resultado</h3>
        <p className="mt-2 text-sm text-muted">
          Você pode apagar este resultado da API a qualquer momento. Essa ação não tem volta.
        </p>
        {!confirmando ? (
          <Button variante="claro" className="mt-4" onClick={() => setConfirmando(true)}>
            <IconeLixeira className="size-4" />
            Apagar meu resultado
          </Button>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variante="destaque" carregando={apagando} onClick={() => void apagar()}>
              Sim, apagar agora
            </Button>
            <Button variante="claro" disabled={apagando} onClick={() => setConfirmando(false)}>
              Cancelar
            </Button>
          </div>
        )}
        {erroApagar && (
          <Alert tipo="erro" className="mt-4" titulo="Não foi possível apagar">
            {erroApagar.message}
          </Alert>
        )}
      </div>
    </>
  );
}
