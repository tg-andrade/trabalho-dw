/**
 * Utilitários para trabalhar com URLs do YouTube
 */

/**
 * Extrai o ID do vídeo de uma URL do YouTube
 * Suporta vários formatos:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 */
export const extractYouTubeId = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Remove espaços e quebras de linha
  url = url.trim();

  // Padrões de URL do YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Verifica se uma URL é do YouTube
 */
export const isYouTubeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const youtubeDomains = [
    'youtube.com',
    'youtu.be',
    'www.youtube.com',
    'm.youtube.com'
  ];

  try {
    const urlObj = new URL(url);
    return youtubeDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    // Se não for uma URL válida, verifica se contém domínios do YouTube
    return youtubeDomains.some(domain => url.includes(domain));
  }
};

/**
 * Converte uma URL do YouTube para formato embed
 */
export const convertToYouTubeEmbed = (url) => {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Determina o tipo de mídia baseado na URL
 * Retorna: 'youtube', 'video' ou null
 */
export const getMediaType = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  if (isYouTubeUrl(url)) {
    return 'youtube';
  }

  // Verifica se é uma URL direta de vídeo
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.ogv', '.mov', '.avi'];
  const lowerUrl = url.toLowerCase();
  
  if (videoExtensions.some(ext => lowerUrl.includes(ext))) {
    return 'video';
  }

  // Se não for YouTube nem extensão conhecida, assume que pode ser vídeo
  // (pode ser um link direto para arquivo de vídeo sem extensão)
  return 'video';
};

