import { createContext, useContext } from 'react';
import { useGenres } from '../hooks/useGenres';

const GenreContext = createContext(null);

export const GenreProvider = ({ children }) => {
  const genreState = useGenres();
  return <GenreContext.Provider value={genreState}>{children}</GenreContext.Provider>;
};

export const useGenreContext = () => {
  const context = useContext(GenreContext);
  if (!context) {
    throw new Error('useGenreContext deve ser utilizado dentro de GenreProvider');
  }
  return context;
};

