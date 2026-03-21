import VinylLogo from './VinylLogo.jsx';

export default function Header() {
  return (
    <header className="header">
      <VinylLogo size={52} className="header-logo" />

      <div className="header-info">
        <div className="header-title">Katz Digger</div>
        <div className="header-subtitle">ID Your Wax</div>
      </div>
    </header>
  );
}
