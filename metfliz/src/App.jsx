import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MoviesPage from './pages/MoviesPage';
import GenresPage from './pages/GenresPage';
import './App.css';

const App = () => (
  <div className="app-shell">
    <nav className="top-nav">
      <div className="brand">Metfliz</div>
      <div className="links">
        <NavLink to="/" end>
          Início
        </NavLink>
        <NavLink to="/movies">Filmes</NavLink>
        <NavLink to="/genres">Gêneros</NavLink>
      </div>
    </nav>
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/genres" element={<GenresPage />} />
      </Routes>
    </main>
    <footer className="app-footer">
      API + Front React • Arquitetura em camadas • {new Date().getFullYear()}
    </footer>
  </div>
);

export default App;
