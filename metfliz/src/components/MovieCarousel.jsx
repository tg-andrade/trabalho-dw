import { useRef } from 'react';

const MovieCarousel = ({ title, movies, onToggleFavorite, favorites = [] }) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="carousel-section">
      <div className="carousel-section__header">
        <h2 className="carousel-section__title">{title}</h2>
        <div className="carousel-section__controls">
          <button
            className="carousel-button"
            onClick={() => scroll('left')}
            aria-label="Rolar para esquerda"
          >
            ‹
          </button>
          <button
            className="carousel-button"
            onClick={() => scroll('right')}
            aria-label="Rolar para direita"
          >
            ›
          </button>
        </div>
      </div>
      <div className="carousel-container" ref={carouselRef}>
        <div className="carousel-track">
          {movies.map((movie) => {
            const isFavorite = favorites.some((f) => f.id === movie.id);
            return (
              <div key={movie.id} className="carousel-item">
                <div className="carousel-item__poster">
                  {movie.coverImage ? (
                    <img src={movie.coverImage} alt={movie.title} />
                  ) : (
                    <div className="carousel-item__fallback">Sem imagem</div>
                  )}
                  <div className="carousel-item__overlay">
                    <div className="carousel-item__info">
                      <h3>{movie.title}</h3>
                      <p className="carousel-item__meta">
                        {movie.year} • {movie.type}
                      </p>
                      {movie.description && (
                        <p className="carousel-item__description">{movie.description}</p>
                      )}
                      {onToggleFavorite && (
                        <button
                          className={`carousel-item__favorite ${isFavorite ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(movie.id);
                          }}
                        >
                          {isFavorite ? '❤️' : '🤍'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;

