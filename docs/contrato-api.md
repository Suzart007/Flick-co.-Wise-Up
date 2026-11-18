# Contrato da API (implementado em `Wise Up - Java`)

Este é o contrato entre o front-end do WISE UP e a API Java (Spring Boot, Domain Driven Design Using Java).
Ele foi escrito pelo front e **já está implementado** na pasta `Wise Up - Java` (testado com 38 testes automatizados e
com o fluxo completo do front). Se algo mudar no Java, ajuste **este arquivo e os tipos em `src/types/api.ts`**.

- **URL base:** variável `VITE_API_BASE_URL` (sem barra no final). Exemplo: `https://wise-up-api.onrender.com`.
- **Formato:** JSON (`Content-Type: application/json`), datas como `AAAA-MM-DD`.
- **CORS:** liberado para `http://localhost:5173`, `http://localhost:4173` e `https://*.vercel.app` (mais o que estiver em
  `CORS_ORIGENS`). O cabeçalho `Location` é exposto (`Access-Control-Expose-Headers: Location`).
- **Cold start:** o Render gratuito pode levar até ~1 min na primeira chamada. O front mostra aviso e espera até 60 s.

## Endpoints usados pelo front

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| GET | `/redes-sociais` | — | `200` `[{ id, nome, categoria }]` |
| GET | `/instituicoes` | — | `200` `[{ id, nome, tipo }]` |
| GET | `/dicas` | — | `200` `[{ id, descricao, tipo, nivelRiscoAlvo, fonte: { id, nome, titulo, dataPublicacao, url } }]` |
| POST | `/autoavaliacoes` | veja abaixo | `201` + `Location` + `{ id, nivelRisco, horasTotaisDia }` · `400` · `404` · `409` |
| GET | `/autoavaliacoes/{id}` | — | `200` (veja abaixo) · `404` |
| DELETE | `/autoavaliacoes/{id}` | — | `204` · `404` (usos e retornos saem junto) |
| POST | `/autoavaliacoes/{id}/retornos` | `{ horasTotaisDepois, nivelFocoDepois, dicasAplicadasIds }` | `201` + `Location` + `{ id, dataRetorno, horasTotaisDepois, nivelFocoDepois, dicasAplicadasIds }` · `400` · `404` · `409` |
| GET | `/autoavaliacoes/{id}/retornos` | — | `200` lista de retornos · `404` |

## Endpoints que existem na API mas o front não usa (CRUD completo da disciplina)

| Recurso | Rotas |
|---|---|
| Redes sociais | `POST/GET /redes-sociais`, `GET/PUT/DELETE /redes-sociais/{id}` (`409` se a rede já foi usada) |
| Instituições | `POST/GET /instituicoes`, `GET/PUT/DELETE /instituicoes/{id}` (`409` se há autoavaliações ligadas) |
| Fontes | `POST/GET /fontes`, `GET/PUT/DELETE /fontes/{id}` (`409` se a fonte ainda tem dicas) |
| Dicas de uma fonte (1:N) | `GET /fontes/{id}/dicas`, `POST /fontes/{id}/dicas` |
| Dicas | `POST/GET /dicas`, `GET/PUT/DELETE /dicas/{id}` (`409` se já foi marcada como aplicada) |
| Autoavaliações | `GET /autoavaliacoes` (resumo), `PUT /autoavaliacoes/{id}` |
| Retornos de uma autoavaliação (1:N) | `GET/PUT/DELETE /autoavaliacoes/{id}/retornos/{retornoId}` |
| Status | `GET /` → `{ "aplicacao": "...", "status": "no ar" }` |

### POST `/autoavaliacoes` (corpo)

```json
{
  "instituicaoId": 1,
  "faixaEtaria": "18_24",
  "ocupacao": "GRADUACAO",
  "horasSono": 7,
  "nivelFoco": 3,
  "usos": [{ "redeSocialId": 1, "horasDia": 2.5 }]
}
```

- `instituicaoId` é opcional (omitido quando a pessoa prefere não informar).
- `faixaEtaria`: `ATE_17` | `18_24` | `25_34` | `35_MAIS`.
- `ocupacao`: `ENSINO_MEDIO` | `TECNICO` | `GRADUACAO` | `POS_GRADUACAO` | `OUTRO`.
- `horasSono`: número de 0 a 24. `horasDia` (em cada uso): maior que 0 e até 24. **Redes + sono não passam de 24**: se
  passar, a API responde `409`. A mesma rede não pode aparecer duas vezes (`409`). Rede ou instituição inexistente: `404`.
- `nivelFoco`: inteiro de 1 a 5. `usos` pode ser lista vazia.
- A API **calcula** `horasTotaisDia` e `nivelRisco`; o front não envia esses valores.

### GET `/autoavaliacoes/{id}` (resposta)

```json
{
  "id": 12,
  "dataAvaliacao": "2026-11-17",
  "instituicaoId": null,
  "faixaEtaria": "18_24",
  "ocupacao": "GRADUACAO",
  "horasSono": 7.0,
  "nivelFoco": 3,
  "nivelRisco": "MODERADO",
  "horasTotaisDia": 5.5,
  "usos": [{ "redeSocial": { "id": 1, "nome": "Instagram" }, "horasDia": 2.5 }],
  "dicas": [{ "id": 1, "descricao": "...", "tipo": "Sono", "nivelRiscoAlvo": "MODERADO",
              "fonte": { "id": 1, "nome": "...", "titulo": "...", "dataPublicacao": null, "url": "https://..." },
              "aplicada": false }]
}
```

- `nivelRisco`: `BAIXO` | `MODERADO` | `ALTO`. Na tela aparece como **"nível de atenção"** (nunca "risco" ou "diagnóstico").
- `dicas`: as dicas do nível da pessoa **e dos níveis abaixo** (quem está em ALTO recebe ALTO + MODERADO + BAIXO).
  `aplicada` fica `true` quando alguma reavaliação marcou aquela dica.
- `dataPublicacao` da fonte: `AAAA-MM-DD` ou `null` (fonte ainda sem data confirmada). `url` começa com `http://` ou `https://`.
- O front calcula `horasTotais` somando `usos[].horasDia` e `dias por ano = horas × 365 ÷ 24`.

### POST `/autoavaliacoes/{id}/retornos`

- `horasTotaisDepois`: 0 a 24. `nivelFocoDepois`: 1 a 5. `dicasAplicadasIds`: lista (pode ser vazia) de dicas que existam (`404` se alguma não existir).
- Com `RETORNO_DIAS_MINIMOS` maior que 0 no servidor (14 = duas semanas), a reavaliação antes do prazo responde `409`.
  Por padrão é `0` (sem espera), para poder demonstrar.

## Erros

Status usados: `400` (validação), `404` (não encontrado), `405` (método não permitido), `409` (regra de negócio violada),
`415` (corpo não é JSON) e `500` (mensagem genérica, sem stack trace nem SQL). **Todo erro** tem este formato:

```json
{
  "status": 400,
  "mensagem": "Dados inválidos. Confira os campos informados e tente de novo.",
  "erros": [{ "campo": "horasSono", "mensagem": "As horas de sono não podem passar de 24." }],
  "caminho": "/autoavaliacoes",
  "dataHora": "2026-11-17T21:30:00.123"
}
```

`erros` só aparece no `400` de validação. O front lê `mensagem` e `erros[].campo/mensagem`
(e ainda tolera outros formatos, como `message`/`errors`).

## Como o front usa cada rota

| Tela | Chamadas |
|---|---|
| `/autoavaliacao` | GET `/redes-sociais`, GET `/instituicoes`, POST `/autoavaliacoes` |
| `/resultado/:id` | GET `/autoavaliacoes/{id}`, GET `.../retornos`, DELETE `/autoavaliacoes/{id}` |
| `/dicas` | GET `/dicas` |
| `/reavaliacao/:id` | GET `/autoavaliacoes/{id}`, POST `.../retornos` |
