import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MoviesPage from './pages/MoviesPage';
import GenresPage from './pages/GenresPage';
import CatalogPage from './pages/CatalogPage';
import SearchPage from './pages/SearchPage';
import MyListPage from './pages/MyListPage';
import './App.css';

const App = () => (
  <div className="app-shell">
    <nav className="top-nav">
      <div className="brand">Metfliz</div>
      <div className="links">
        <NavLink to="/" end>
          Início
        </NavLink>
        <NavLink to="/catalog">Catálogo</NavLink>
        <NavLink to="/movies">Filmes</NavLink>
        <NavLink to="/genres">Gêneros</NavLink>
        <NavLink to="/search">Busca</NavLink>
        <NavLink to="/my-list">Minha Lista</NavLink>
      </div>
    </nav>
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<div className="page-wrapper"><CatalogPage /></div>} />
        <Route path="/movies" element={<div className="page-wrapper"><MoviesPage /></div>} />
        <Route path="/genres" element={<div className="page-wrapper"><GenresPage /></div>} />
        <Route path="/search" element={<div className="page-wrapper"><SearchPage /></div>} />
        <Route path="/my-list" element={<div className="page-wrapper"><MyListPage /></div>} />
      </Routes>
    </main>
    <footer className="app-footer">
      API + Front React • Arquitetura em camadas • {new Date().getFullYear()}
    </footer>
  </div>
);

export default App;
