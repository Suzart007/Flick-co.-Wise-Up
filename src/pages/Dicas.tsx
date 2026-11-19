import { useState } from 'react';
import { DicaCard } from '../components/DicaCard';
import { EstadoDaApi } from '../components/EstadoDaApi';
import { Container, Rotulo, Titulo } from '../components/Secao';
import { TIPOS_DE_DICA, rotuloDe } from '../data/opcoes';
import { useApi } from '../hooks/useApi';
import { useTitulo } from '../hooks/useTitulo';
import { listarDicas } from '../services/dicas';

const TODAS = 'todas';

export function Dicas() {
  useTitulo('Dicas');
  const estado = useApi(listarDicas, []);
  const [tipo, setTipo] = useState(TODAS);

  return (
    <div className="py-16 sm:py-24">
      <Container>
        <Rotulo>Dicas práticas</Rotulo>
        <Titulo nivel={1} className="mt-4 !text-4xl sm:!text-6xl">
          Pequenos ajustes, com fonte.
        </Titulo>
        <p className="mt-6 max-w-2xl text-lg text-gray-700">
          Escolha uma dica para testar por duas semanas. Cada uma mostra de onde veio a informação, para você conferir.
        </p>

        <div className="mt-10">
          <EstadoDaApi
            estado={estado}
            mensagemCarregando="Buscando as dicas..."
            vazio={(dicas) => dicas.length === 0}
            tituloVazio="Ainda não há dicas cadastradas"
            descricaoVazio="Volte em breve: a equipe está reunindo fontes confiáveis."
          >
            {(dicas) => {
              const tipos = Array.from(new Set(dicas.map((d) => d.tipo)));
              const visiveis = tipo === TODAS ? dicas : dicas.filter((d) => d.tipo === tipo);
              return (
                <>
                  <div role="group" aria-label="Filtrar por tipo de dica" className="flex flex-wrap gap-2">
                    {[TODAS, ...tipos].map((t) => (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={tipo === t}
                        onClick={() => setTipo(t)}
                        className={`min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors ${
                          tipo === t ? 'border-ink bg-ink text-paper' : 'border-gray-400 hover:border-ink'
                        }`}
                      >
                        {t === TODAS ? 'Todas' : rotuloDe(TIPOS_DE_DICA, t)}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-gray-600" aria-live="polite">
                    {visiveis.length} {visiveis.length === 1 ? 'dica' : 'dicas'}
                  </p>
                  <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {visiveis.map((dica) => (
                      <li key={dica.id}>
                        <DicaCard dica={dica} />
                      </li>
                    ))}
                  </ul>
                </>
              );
            }}
          </EstadoDaApi>
        </div>
      </Container>
    </div>
  );
}
