export const getLocalToken = () => window.localStorage.getItem('id_token');

export const setLocalToken = (token) => {
  window.localStorage.setItem('id_token', token);
};

export const clearToken = () => window.localStorage.clear('id_token');
