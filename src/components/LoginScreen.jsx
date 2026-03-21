import { useState } from 'react';
import * as api from '../api.js';

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
      <div className="login-logo">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
          <circle cx="50" cy="50" r="48" fill="#1a1510" stroke="#d4a44a" strokeWidth="2"/>
          <circle cx="50" cy="50" r="38" fill="#0d0d0d" stroke="#333" strokeWidth="1"/>
          <circle cx="50" cy="50" r="16" fill="#d4a44a"/>
          <circle cx="50" cy="50" r="4" fill="#1a1510"/>
          <text x="50" y="44" textAnchor="middle" fill="#1a1510" fontSize="5.5" fontFamily="Courier New" fontWeight="700" letterSpacing="1.5">KATZ</text>
          <text x="50" y="51" textAnchor="middle" fill="#1a1510" fontSize="4" fontFamily="Courier New" fontWeight="700" letterSpacing="1">RECORDS</text>
          <text x="50" y="58" textAnchor="middle" fill="#1a1510" fontSize="4.5" fontFamily="Courier New" fontWeight="700" letterSpacing="1.5">DIGGER</text>
        </svg>
      </div>

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
