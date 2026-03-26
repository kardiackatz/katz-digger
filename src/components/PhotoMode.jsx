import { useRef } from 'react';

const LOADING = new Set(['analyzing', 'searching', 'identifying']);

export default function PhotoMode({ phase, capturedImage, statusMessage, onCapture, onReset }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      onCapture(dataUrl.split(',')[1], file.type, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      capture="environment"
      onChange={handleFileChange}
      style={{ display: 'none' }}
      aria-label="Capture record photo"
    />
  );

  const isLoading = LOADING.has(phase);
  const isDone    = phase === 'results' || phase === 'error';

  if (isLoading) {
    return (
      <div className="photo-status">
        {fileInput}
        {capturedImage && (
          <img src={capturedImage} className="captured-preview" alt="Captured record" />
        )}
        <div className="loading-row">
          <div className="spinner" />
          <p className="status-text">{statusMessage}</p>
        </div>
      </div>
    );
  }

  // After extraction — just show the captured image, actions are rendered by App
  if (phase === 'extracted') {
    return (
      <div className="photo-status">
        {fileInput}
        {capturedImage && (
          <img src={capturedImage} className="captured-preview" alt="Captured record" />
        )}
      </div>
    );
  }

  if (isDone) {
    return (
      <div className="photo-status">
        {fileInput}
        {capturedImage && (
          <img src={capturedImage} className="captured-preview" alt="Captured record" />
        )}
        <button className="btn-secondary btn-sm" onClick={onReset}>← Try Another</button>
      </div>
    );
  }

  // Idle — camera prompt
  return (
    <>
      {fileInput}
      <div
        className="camera-prompt"
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <div className="camera-icon">📷</div>
        <p className="camera-label">Tap to snap the wax</p>
        <p className="camera-sub">Label side · dead wax · runout groove</p>
      </div>
    </>
  );
}
