const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

const defaultHeaders = {
  'Content-Type': 'application/json'
};

const handleResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Para 404 em GET de favoritos, retorna array vazio
    if (response.status === 404 && response.url.includes('/favorites') && !response.url.includes('/favorites/')) {
      console.warn(`Endpoint de favoritos não encontrado (404): ${response.url}. Retornando array vazio.`);
      return [];
    }
    
    // Para outros 404, lança erro normalmente
    if (response.status === 404) {
      const message = data?.message ?? data?.error ?? 'Recurso não encontrado';
      throw new Error(message);
    }
    
    const message = data?.message ?? data?.error ?? `Erro ao comunicar com a API (${response.status})`;
    throw new Error(message);
  }

  return data;
};

export const apiClient = async (endpoint, options = {}) => {
  const config = {
    headers: {
      ...defaultHeaders,
      ...(options.headers ?? {})
    },
    ...options
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return handleResponse(response);
  } catch (err) {
    // Erro de rede (backend não está rodando, CORS, etc)
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:4000');
    }
    throw err;
  }
};

