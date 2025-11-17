# Catálogo de Filmes e Séries – Metfliz

Projeto completo solicitado nos slides: API REST em Node/Express seguindo o padrão Routes → Controller → Service + front-end React (Vite) consumindo todos os endpoints com filtro de filmes no back-end.

## Arquitetura

- **Backend (`backend/`)** – Express 5, arrays em memória simulando banco e camadas bem definidas:
  - `src/routes` → organiza rotas REST (`movies.routes.js`, `genres.routes.js`).
  - `src/controllers` → orquestra requisição/resposta.
  - `src/services` → contém regras de negócio, CRUD completo e filtro por gênero.
  - `src/middleware` → tratadores de erro/404.
  - `src/config` → configuração central (`appConfig.js`).
- **Frontend (`metfliz/`)** – React + Vite com estrutura pedida (api, components, pages, services, hooks, context, assets):
  - Consome GET/POST/PUT/DELETE de filmes e gêneros.
  - Formulário completo para criar filmes.
  - Filtro `<select>` que chama `GET /api/movies?genre=GENERO`.
  - Páginas: `Home`, `MoviesPage`, `GenresPage`.

## Como executar

### 1. Backend (API REST)

```bash
cd backend
npm install
npm run dev
```

A API sobe em `http://localhost:4000`. Os dados residem em arrays dentro dos services (mock local).

### 2. Frontend (React)

```bash
cd metfliz
npm install
# opcional: export VITE_API_BASE_URL=http://localhost:4000/api
npm run dev
```

O Vite abrirá em `http://localhost:5173`, consumindo automaticamente `http://localhost:4000/api`.

## Endpoints e códigos HTTP

| Método | Endpoint                | Descrição                          | Códigos |
|--------|-------------------------|------------------------------------|---------|
| GET    | `/api/genres`           | Lista gêneros                      | 200     |
| POST   | `/api/genres`           | Cria gênero                        | 201,400 |
| PUT    | `/api/genres/:id`       | Atualiza gênero                    | 200,400,404 |
| DELETE | `/api/genres/:id`       | Remove gênero                      | 204,404 |
| GET    | `/api/movies`           | Lista filmes, aceita `genre`       | 200,400 |
| GET    | `/api/movies/:id`       | Detalha um filme                   | 200,404 |
| POST   | `/api/movies`           | Cria filme/série                   | 201,400 |
| PUT    | `/api/movies/:id`       | Atualiza filme/série               | 200,400,404 |
| DELETE | `/api/movies/:id`       | Remove filme/série                 | 204,404 |

Filtro obrigatório: `GET /api/movies?genre=Ação` é processado **no service**.

## Testes rápidos das rotas

Arquivo `backend/api.http` contém exemplos para executar todos os métodos via REST Client/Thunder/Insomnia/Postman.

Exemplo usando `curl`:

```bash
curl http://localhost:4000/api/movies?genre=Ficção%20Científica
curl -X POST http://localhost:4000/api/movies \
  -H "Content-Type: application/json" \
  -d '{ "title": "Matrix", "genre": "Ficção Científica", "year": 1999, "type": "Filme" }'
curl -X PUT http://localhost:4000/api/genres/2 -H "Content-Type: application/json" -d '{ "name": "Drama Histórico" }'
curl -X DELETE http://localhost:4000/api/movies/1
```

## Divisão detalhada da equipe (Slide 12)

- **Integrante 1 – Front-end + Setup**
  - Configuração completa do Vite/React.
  - Integração com API via `api/` + `services/`.
  - Implementação da `MoviesPage`, `Home`, componentes `MovieForm`, `MovieList`, `GenreFilter`.
- **Integrante 2 – Back-end: Rotas e Models**
  - Criação das rotas em `routes/*.routes.js`.
  - Exposição dos recursos `/api/genres` e `/api/movies`.
  - Implementação dos métodos GET/DELETE com respostas REST.
- **Integrante 3 – Back-end: Lógica de Negócio**
  - Implementação dos services (`movies.service.js`, `genres.service.js`) com arrays e regras.
  - Criação/edição/filtro e códigos HTTP corretos.
  - Garantia da semântica REST + middleware de erro.

## Demonstração rápida do front

- `Home`: visão geral e acesso rápido às páginas.
- `MoviesPage`: lista filmes, aplica filtro por gênero (consulta o endpoint com query string), formulário completo de cadastro, edição inline e exclusão.
- `GenresPage`: CRUD completo de gêneros, reutilizando os mesmos endpoints consumidos pelo filtro.

## Próximos passos sugeridos

- Adicionar persistência real (SQLite/PostgreSQL) mantendo serviços isolados.
- Escrever testes automatizados (Vitest/Jest para o front e supertest para o back).
- Containerizar (Docker) para subir API + front simultaneamente.