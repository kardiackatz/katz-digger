import { useState } from 'react';
import * as api from '../api.js';
import VinylLogo from './VinylLogo.jsx';

export default function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const { token } = await api.login(password);
      onLogin(token);
    } catch {
      setError('WRONG PASSWORD');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <VinylLogo size={160} />

      <h1 className="login-title">KATZ DIGGER</h1>
      <p className="login-subtitle">ID YOUR WAX</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="search-input login-input"
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <button
          className="btn-primary login-btn"
          type="submit"
          disabled={loading || !password.trim()}
        >
          {loading ? <span className="spinner" /> : 'ENTER'}
        </button>
      </form>

      {error && <p className="login-error">{error}</p>}
    </div>
  );
}
