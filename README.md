# Solab API

API read-only que fornece os dados solarimétricos usados pelo Solab Sizer.

## Requisitos

- Node.js 22.12 ou superior
- PostgreSQL/Supabase com a tabela `sundata`

## Configuração local

```bash
npm ci
cp .env.example .env
```

Preencha o `.env` com as conexões do Supabase:

- `DATABASE_URL`: conexão pooled (porta 6543, usada pela API em execução).
- `DIRECT_URL`: conexão direta (porta 5432, usada pelas migrações do Prisma).
- `PORT`: porta local, padrão `3001`.
- `CORS_ORIGIN`: origens permitidas, separadas por vírgula. Sem essa variável, a API mantém o comportamento antigo e aceita qualquer origem.

Nunca versione o `.env`.

## Banco de dados

```bash
npm run db:status
npm run db:migrate
npm run db:seed
```

O seed lê por padrão `../Data/sundata-cloud-database.csv`. Para usar outro arquivo:

```bash
SEED_CSV="C:\caminho\sundata.csv" npm run db:seed
```

O seed não altera uma tabela que já tenha registros. `SEED_FORCE=1` remove os registros antes de recarregar e só deve ser usado depois de um backup:

```bash
SEED_FORCE=1 npm run db:seed
```

Para validar o CSV sem conectar ao banco:

```bash
SEED_DRY_RUN=1 npm run db:seed
```

Não use `prisma migrate reset` nem `db push --force-reset` em produção.

## Scripts

| Comando | Função |
| --- | --- |
| `npm run dev` | API com recarga automática |
| `npm run build` | Compila para `dist` |
| `npm start` | Executa o build |
| `npm run typecheck` | Verificação de tipos |
| `npm test` | Testes das rotas |
| `npm run db:migrate` | Aplica migrações pendentes |
| `npm run db:status` | Mostra o estado das migrações |
| `npm run db:seed` | Importa o CSV canônico |

## Endpoints

| Método | Rota | Resposta |
| --- | --- | --- |
| GET | `/health` | `{ "status": "ok" }` |
| GET | `/health/ready` | `200` se o banco responder, `503` caso contrário |
| GET | `/api/states` | Lista de estados |
| GET | `/api/states/:state/cities` | Lista de municípios do estado |
| GET | `/api/solar?state=ACRE&city=Rio%20Branco` | Dados solarimétricos do município |

As rotas antigas `/api/sundata`, `/api/sundata/:state` e `/api/sundata/:state/:city` continuam disponíveis temporariamente, com o cabeçalho `Deprecation: true`, para permitir a migração do frontend. Elas devem ser removidas depois que a nova versão estiver publicada.

Erros seguem o formato:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Estado é obrigatório."
  }
}
```

## Deploy no Render

Configuração esperada:

- Build: `npm ci --include=dev && npm run build`
- Start: `npm start`
- Health check: `/health`
- Variáveis: `DATABASE_URL`, `DIRECT_URL`, `CORS_ORIGIN`, `NODE_VERSION=22`
- Migração: executar `npm run db:migrate` no processo de release, depois de conferir o backup.

O arquivo `render.yaml` contém um blueprint de referência. Ajuste o nome do serviço e os valores no painel do Render.

## Testes

Os testes usam Vitest e Supertest, com o serviço de dados mockado; eles não precisam de banco:

```bash
npm test
```
