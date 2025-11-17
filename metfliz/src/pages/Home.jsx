import { Link } from 'react-router-dom';

const Home = () => (
  <section className="page">
    <header>
      <h1>Metfliz</h1>
      <p>Catálogo simplificado para organizar filmes e séries.</p>
    </header>

    <div className="grid two-columns">
      <article className="card">
        <h3>Biblioteca de Filmes e Séries</h3>
        <p>Cadastre, edite, exclua e filtre obras por gênero.</p>
        <Link to="/movies" className="primary">
          Acessar filmes
        </Link>
      </article>

      <article className="card">
        <h3>Gestão de Gêneros</h3>
        <p>Mantenha os gêneros sincronizados com a API em tempo real.</p>
        <Link to="/genres" className="primary">
          Acessar gêneros
        </Link>
      </article>
    </div>
  </section>
);

export default Home;

