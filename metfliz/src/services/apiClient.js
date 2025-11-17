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
    const message = data?.message ?? 'Erro ao comunicar com a API';
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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse(response);
};

