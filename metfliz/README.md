# Metfliz – Front-end React

Aplicação React (Vite) que consome a API REST de catálogo:

- Estrutura exigida nos slides (`api`, `services`, `hooks`, `context`, `components`, `pages`).
- `MoviesPage`: lista filmes/séries, CRUD completo e filtro que chama `GET /api/movies?genre=GENERO`.
- `GenresPage`: gerenciamento dos gêneros 100% via API.
- `Home`: visão geral do produto e acesso às páginas.

## Executar

```bash
npm install
npm run dev
```

Configure `VITE_API_BASE_URL` se precisar apontar para outro host (por padrão `http://localhost:4000/api`).
