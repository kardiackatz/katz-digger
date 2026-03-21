let _token = null;
export const setToken = (token) => { _token = token; };

const call = async (url, opts = {}) => {
  const headers = { ...opts.headers };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;
  const res = await fetch(url, { ...opts, headers });
  if (res.status === 401) throw new Error('Session expired — please log in again.');
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { msg = (await res.json()).error || msg; } catch { /* ignore */ }
    throw new Error(msg);
  }
  return res.json();
};

export const login = (password) =>
  call('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

export const analyzeImage = (image, mediaType) =>
  call('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image, mediaType }),
  });

export const searchDiscogs = ({ artist, title, catno, barcode } = {}) => {
  const params = new URLSearchParams();
  if (artist)  params.set('artist', artist);
  if (title)   params.set('title', title);
  if (catno)   params.set('catno', catno);
  if (barcode) params.set('barcode', barcode);
  return call(`/api/search?${params}`);
};

export const fetchRelease = (id) => call(`/api/release?id=${id}`);

export const identifyPressing = (extracted, releases) =>
  call('/api/identify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ extracted, releases }),
  });

export const addToCollection = (releaseId) =>
  call('/api/collect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ releaseId }),
  });
