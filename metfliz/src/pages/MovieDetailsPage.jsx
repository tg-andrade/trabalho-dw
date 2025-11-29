import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { findMovie } from '../services/moviesService';
import { addFavorite, removeFavorite, listFavorites } from '../services/favoritesService';
import Notification from '../components/Notification';
import { isYouTubeUrl, convertToYouTubeEmbed } from '../utils/youtubeUtils';
import './MovieDetailsPage.css';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadMovie();
    loadFavorites();
  }, [id]);

  const loadMovie = async () => {
    setLoading(true);
    setError(null);
    try {
      const movieData = await findMovie(id);
      console.log('MovieDetailsPage - Filme carregado (completo):', JSON.stringify(movieData, null, 2));
      console.log('MovieDetailsPage - videoUrl:', movieData?.videoUrl);
      console.log('MovieDetailsPage - videoUrl type:', typeof movieData?.videoUrl);
      console.log('MovieDetailsPage - videoUrl length:', movieData?.videoUrl?.length);
      console.log('MovieDetailsPage - videoUrl truthy?', !!movieData?.videoUrl);
      console.log('MovieDetailsPage - videoUrl trimmed:', movieData?.videoUrl?.trim());
      setMovie(movieData);
    } catch (err) {
      setError(err.message || 'Erro ao carregar filme');
      console.error('Erro ao carregar filme:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favorites = await listFavorites();
      if (Array.isArray(favorites) && movie) {
        setIsFavorite(favorites.some((fav) => fav.id === movie.id));
      }
    } catch (err) {
      console.warn('Não foi possível verificar favoritos:', err);
    }
  };

  useEffect(() => {
    if (movie) {
      loadFavorites();
    }
  }, [movie]);

  const handleToggleFavorite = async () => {
    if (!movie) return;

    try {
      if (isFavorite) {
        await removeFavorite(movie.id);
        setIsFavorite(false);
        setNotification({ message: 'Removido da sua lista!', type: 'info' });
      } else {
        await addFavorite(movie.id);
        setIsFavorite(true);
        setNotification({ message: 'Adicionado à sua lista!', type: 'success' });
      }
    } catch (err) {
      console.error('Erro ao atualizar favorito:', err);
      setNotification({
        message: `Erro ao ${isFavorite ? 'remover' : 'adicionar'} favorito: ${err.message || 'Erro desconhecido'}`,
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <section className="page movie-details-page">
        <div className="movie-details-loading">
          <div className="loading-spinner"></div>
          <p>Carregando detalhes...</p>
        </div>
      </section>
    );
  }

  if (error || !movie) {
    return (
      <section className="page movie-details-page">
        <div className="movie-details-error">
          <h2>⚠️ Erro ao carregar filme</h2>
          <p className="danger-text">{error || 'Filme não encontrado'}</p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="primary" onClick={() => navigate(-1)}>
              ← Voltar
            </button>
            <button className="secondary" onClick={loadMovie}>
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page movie-details-page">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <button className="movie-details-back" onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      <div className="movie-details-hero">
        <div className="movie-details-hero__background">
          {movie.coverImage && (
            <img src={movie.coverImage} alt={movie.title} />
          )}
          <div className="movie-details-hero__overlay"></div>
        </div>

        <div className="movie-details-hero__content">
          <div className="movie-details-hero__poster">
            {movie.coverImage ? (
              <img src={movie.coverImage} alt={movie.title} />
            ) : (
              <div className="movie-details-hero__poster-fallback">
                <span>🎬</span>
                <p>Sem imagem</p>
              </div>
            )}
          </div>

          <div className="movie-details-hero__info">
            <h1 className="movie-details-title">{movie.title}</h1>
            <div className="movie-details-meta">
              <span className="movie-details-meta__item">
                <strong>Gênero:</strong> {movie.genre || 'Não especificado'}
              </span>
              <span className="movie-details-meta__item">
                <strong>Ano:</strong> {movie.year}
              </span>
              <span className="movie-details-meta__item">
                <strong>Tipo:</strong> {movie.type}
              </span>
            </div>
            <div className="movie-details-actions">
              <button
                className={`primary large ${isFavorite ? 'favorite-active' : ''}`}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? '❤️ Remover da Lista' : '🤍 Adicionar à Minha Lista'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="movie-details-content">
        <div className="movie-details-section">
          <h2>Assistir</h2>
          {(() => {
            const hasVideoUrl = movie.videoUrl && typeof movie.videoUrl === 'string' && movie.videoUrl.trim().length > 0;
            console.log('MovieDetailsPage - Verificando vídeo:', {
              hasVideoUrl,
              videoUrl: movie.videoUrl,
              videoUrlType: typeof movie.videoUrl,
              videoUrlLength: movie.videoUrl?.length,
              videoUrlTrimmed: movie.videoUrl?.trim()
            });
            
            if (!hasVideoUrl) {
              return (
                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Nenhum vídeo disponível para este título.
                  </p>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
                    Adicione uma URL de vídeo ou do YouTube para assistir.
                  </p>
                </div>
              );
            }

            const isYouTube = isYouTubeUrl(movie.videoUrl);
            const embedUrl = isYouTube ? convertToYouTubeEmbed(movie.videoUrl) : null;

            console.log('MovieDetailsPage - Renderizando vídeo:', {
              videoUrl: movie.videoUrl,
              isYouTube,
              embedUrl,
              videoUrlLength: movie.videoUrl.length
            });

            return (
              <div className="movie-details-video">
                <div className={`movie-details-video__inner ${isYouTube ? 'youtube' : ''}`}>
                  {isYouTube && embedUrl ? (
                    <iframe
                      src={embedUrl}
                      className="movie-details-video__iframe"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      title={`Assistir ${movie.title}`}
                    ></iframe>
                  ) : (
                    <video
                      controls
                      poster={movie.coverImage || undefined}
                      className="movie-details-video__player"
                      preload="metadata"
                    >
                      <source src={movie.videoUrl} type="video/mp4" />
                      <source src={movie.videoUrl} type="video/webm" />
                      <source src={movie.videoUrl} type="video/ogg" />
                      Seu navegador não suporta a tag de vídeo.
                      <p style={{ padding: '2rem', color: '#fff' }}>
                        Seu navegador não suporta a reprodução de vídeo.
                        <br />
                        <a href={movie.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                          Clique aqui para abrir o vídeo
                        </a>
                      </p>
                    </video>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        <div className="movie-details-section">
          <h2>Sobre</h2>
          <p className="movie-details-description">
            {movie.description || 'Nenhuma descrição disponível para este título.'}
          </p>
        </div>

        <div className="movie-details-section">
          <h2>Informações</h2>
          <div className="movie-details-info-grid">
            <div className="movie-details-info-item">
              <strong>Título:</strong>
              <span>{movie.title}</span>
            </div>
            <div className="movie-details-info-item">
              <strong>Gênero:</strong>
              <span>{movie.genre || 'Não especificado'}</span>
            </div>
            <div className="movie-details-info-item">
              <strong>Ano de Lançamento:</strong>
              <span>{movie.year}</span>
            </div>
            <div className="movie-details-info-item">
              <strong>Tipo:</strong>
              <span>{movie.type}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieDetailsPage;

