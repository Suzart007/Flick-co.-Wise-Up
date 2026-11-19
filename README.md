# WISE UP · Flick Co.

Front-end do projeto **WISE UP**, da equipe **Flick Co.**, para a disciplina **Front-End Design Engineering**
(Global Solution 2026/2 · FIAP · tema CitizenTech).

## Objetivo

O uso excessivo de redes sociais está associado a piora de foco, sono e produtividade, e muita gente não percebe ou não dá a importância necessária ao
problema. O WISE UP **conscientiza primeiro** (autoavaliação anônima, panorama com "X horas por dia equivalem a Y dias
por ano" e dicas com fonte) e **orienta ações práticas depois**, com reavaliação após 2 semanas.

- **Público e território:** jovens estudantes, saúde preventiva e educação digital.
- **ODS:** 3 (Saúde e bem-estar) e 4 (Educação de qualidade).
- **Acesso:** por link ou QR Code, no navegador do celular, sem instalação e sem custo.
- **Cuidados:** é uma autoavaliação que mostra um panorama de uso. Os números são estimativas baseadas no que a
  pessoa informa e não substituem avaliação profissional. Dizemos que o uso está "associado a" efeitos, sem afirmar
  relação direta.

## Tecnologias

React 19 · Vite · TypeScript (modo estrito, sem `any`) · Tailwind CSS v4 (plugin oficial `@tailwindcss/vite`) ·
react-router-dom · Fetch API (sem Axios) · Inter (via `@fontsource-variable/inter`, sem CDN).

## Estrutura de pastas

```
src/
  assets/       logo da Flick Co. e fotos dos integrantes
  components/   Button, Card, Field, Alert, Loading, EmptyState, Accordion, Logo, MobileMenu, Header, Footer...
  pages/        Home, Integrantes, IntegranteDetalhe, Sobre, Faq, Contato, Autoavaliacao, Resultado, Reavaliacao, Dicas
  services/     http.ts (fetch + erros) e um arquivo por recurso da API
  types/        tipos das respostas da API e dos formulários
  data/         integrantes, FAQ, navegação e opções dos formulários
  hooks/        useApi, useTitulo, useContagem...
  utils/        calculos.ts e validacao.ts (lógica sem React)
public/         favicon
scripts/        zip.mjs (gera o zip da entrega)
docs/           contrato da API Java (endpoints, corpos e respostas)
```

## Páginas e rotas

| Rota | Página |
|---|---|
| `/` | Home (mini-calculadora, 4 passos, problema, ODS 3 e 4, instituições) |
| `/integrantes` e `/integrantes/:id` | Integrantes e detalhe (rota com parâmetro) |
| `/sobre` · `/faq` · `/contato` | Institucionais |
| `/autoavaliacao` | Formulário em 4 etapas com panorama ao vivo |
| `/resultado/:id` | Resultado vindo da API, dicas com fonte e compartilhar |
| `/dicas` | Dicas da API com filtro por tipo |
| `/reavaliacao/:id` | Reavaliação com comparação antes e depois |

## Como executar

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
cp .env.example .env     # no Windows: copy .env.example .env  (e ajuste a URL da API)
npm run dev              # abre em http://localhost:5173
npm run build            # build de produção (tsc + vite)
npm run preview          # serve o build em http://localhost:4173
```

> **Windows:** evite pastas com `&` no caminho. O `cmd.exe` corta o caminho no `&` e o `npm run dev`/`npm run build`
> falham com "Cannot find module ...\typescript\bin\tsc".

### Variáveis de ambiente

| Variável | Para quê |
|---|---|
| `VITE_API_BASE_URL` | URL base da API Java, sem barra no final. Valor publicado: [PREENCHER URL da API no Render]. **Na Vercel:** Project Settings → Environment Variables (marque Production e Preview). |

Sem essa variável o app abre normalmente, mas as telas que usam a API mostram a mensagem "A URL da API ainda não foi
configurada". Depois de alterar o `.env`, reinicie o `npm run dev`.

### API Java local (recomendado para testar)

A API de verdade está na pasta `Wise Up - Java` (Spring Boot). Para testar sem Oracle, rode lá o perfil `local`
(banco em memória) e use `VITE_API_BASE_URL=http://localhost:8080`. Veja o README dessa pasta. O contrato está em
[docs/contrato-api.md](docs/contrato-api.md).

### Gerar o zip da entrega

```bash
npm run zip    # cria wise-up-front.zip sem node_modules, dist, .git e .env; falha se passar de 50 MB
```

## Deploy na Vercel

O arquivo `vercel.json` reescreve todas as rotas para `/index.html` (SPA), então acessar `/sobre` ou `/resultado/1`
direto funciona. Configure `VITE_API_BASE_URL` nas variáveis de ambiente do projeto e refaça o deploy.

1. Na Vercel: **Add New → Project** e importe o repositório do GitHub (Framework Preset: **Vite**; Build Command
   `npm run build`; Output Directory `dist`).
2. Em **Settings → Environment Variables**, crie `VITE_API_BASE_URL` com a URL da API no Render (sem barra no final).
3. Faça o deploy (ou **Redeploy**, se a variável foi criada depois: o Vite lê a variável na hora do build).
4. Na API (Render), confira se `CORS_ORIGENS` aceita o domínio da Vercel (por padrão já aceita `https://*.vercel.app`).
5. Teste no link publicado: abra `/dicas` (GET), faça uma autoavaliação (POST) e acesse `/faq` direto pela barra de
   endereço (rewrite).

## Integrantes

| Nome | RM | GitHub | LinkedIn |
|---|---|---|---|
| Kaio Marcus Macedo Chiappinelli | 573365 | [KaioChiappinelli](https://github.com/KaioChiappinelli) | [perfil](https://www.linkedin.com/in/kaio-chiappinelli-183106322) |
| Matheus Vecchi | 569749 | [ogvecchi](https://github.com/ogvecchi) | [perfil](https://www.linkedin.com/in/matheusvecchi-) |
| Guilherme Souza Suzart | 569884 | [Suzart007](https://github.com/Suzart007) | [perfil](https://www.linkedin.com/in/guilherme-suzart-ba83193b3) |
| Henry Vitor Medeiros Bascope | 573576 | [HenryBascope](https://github.com/HenryBascope) | [perfil](https://www.linkedin.com/in/henrybascope/) |

## Links

- **GitHub:** [github.com/Suzart007/Flick-co.-Wise-Up](https://github.com/Suzart007/Flick-co.-Wise-Up)
- **Vercel (site publicado):** [PREENCHER URL da Vercel]
- **API (Render):** [PREENCHER URL da API]

## Contato

[we.flickcompany@gmail.com](mailto:we.flickcompany@gmail.com)

## Documentação extra

- [Contrato da API](docs/contrato-api.md)
