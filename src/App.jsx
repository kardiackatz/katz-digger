import { useState } from 'react';
import Header from './components/Header.jsx';
import TabToggle from './components/TabToggle.jsx';
import PhotoMode from './components/PhotoMode.jsx';
import ManualSearch from './components/ManualSearch.jsx';
import ExtractedDetails from './components/ExtractedDetails.jsx';
import VariantList from './components/VariantList.jsx';
import SuccessScreen from './components/SuccessScreen.jsx';
import LastLogged from './components/LastLogged.jsx';
import * as api from './api.js';

const STATUS = {
  analyzing:   'Reading the wax...',
  searching:   'Digging through the crates...',
  identifying: 'Matching pressings...',
  adding:      'Adding to your collection...',
};

const LOADING_PHASES = new Set(['analyzing', 'searching', 'identifying', 'adding']);

function loadLog() {
  try { return JSON.parse(localStorage.getItem('katz_digger_log') || '[]'); }
  catch { return []; }
}

function saveLog(entries) {
  try { localStorage.setItem('katz_digger_log', JSON.stringify(entries)); } catch { /* ignore */ }
}

export default function App() {
  const [mode, setMode]                         = useState('photo');
  const [phase, setPhase]                       = useState('idle');
  const [capturedImage, setCapturedImage]       = useState(null);
  const [extractedDetails, setExtractedDetails] = useState(null);
  const [fullReleaseDetails, setFullReleaseDetails] = useState({});
  const [rankedMatches, setRankedMatches]       = useState([]);
  const [manualResults, setManualResults]       = useState([]);
  const [collectedRelease, setCollectedRelease] = useState(null);
  const [error, setError]                       = useState(null);
  const [recentLogs, setRecentLogs]             = useState(loadLog);

  /* ── Persist a logged entry ── */
  const appendLog = (releaseInfo) => {
    const entry = { ...releaseInfo, loggedAt: Date.now() };
    const updated = [entry, ...recentLogs.filter((r) => r.releaseId !== entry.releaseId)].slice(0, 10);
    setRecentLogs(updated);
    saveLog(updated);
  };

  /* ── Photo flow ── */
  const runPhotoFlow = async (base64, mediaType) => {
    setError(null);
    try {
      setPhase('analyzing');
      const details = await api.analyzeImage(base64, mediaType);
      setExtractedDetails(details);

      setPhase('searching');
      const searchData = await api.searchDiscogs({
        artist:  details.artist,
        title:   details.title,
        catno:   details.catalog_number,
        barcode: details.barcode,
      });

      const top8 = (searchData.results || []).slice(0, 8);
      if (top8.length === 0) {
        setError('No matching records found in Discogs. Try manual search.');
        setPhase('error');
        return;
      }

      setPhase('identifying');

      const fullDetails = await Promise.all(
        top8.map((r) => api.fetchRelease(r.id).catch(() => null))
      );
      const valid = fullDetails.filter(Boolean);

      const detailsMap = {};
      valid.forEach((r) => { detailsMap[r.id] = r; });
      top8.forEach((r) => {
        if (detailsMap[r.id]) detailsMap[r.id]._thumb = r.thumb || r.cover_image;
      });
      setFullReleaseDetails(detailsMap);

      const ranked = await api.identifyPressing(details, valid);
      setRankedMatches(ranked);
      setPhase('results');
    } catch (err) {
      setError(err.message);
      setPhase('error');
    }
  };

  /* ── Manual search flow ── */
  const runManualSearch = async (params) => {
    setError(null);
    setPhase('searching');
    try {
      const data = await api.searchDiscogs(params);
      setManualResults(data.results || []);
      setPhase('manual_results');
    } catch (err) {
      setError(err.message);
      setPhase('error');
    }
  };

  /* ── Add to collection ── */
  const handleAddToCollection = async (releaseId, releaseInfo) => {
    setPhase('adding');
    try {
      const data = await api.addToCollection(releaseId);
      const collected = { releaseId, ...data };
      setCollectedRelease(collected);
      if (releaseInfo) appendLog(releaseInfo);
      setPhase('success');
    } catch (err) {
      setError(err.message);
      setPhase('error');
    }
  };

  /* ── Reset ── */
  const handleReset = () => {
    setPhase('idle');
    setCapturedImage(null);
    setExtractedDetails(null);
    setFullReleaseDetails({});
    setRankedMatches([]);
    setManualResults([]);
    setCollectedRelease(null);
    setError(null);
  };

  if (phase === 'success') {
    return <SuccessScreen release={collectedRelease} onReset={handleReset} />;
  }

  const isLoading  = LOADING_PHASES.has(phase);
  const hasResults = phase === 'results';
  const isDisabled = isLoading || hasResults;
  const isIdle     = phase === 'idle' || phase === 'manual_results';

  return (
    <div className="app">
      <Header />
      <TabToggle mode={mode} onChange={setMode} disabled={isDisabled} />

      {phase === 'error' && error && (
        <div className="error-card">
          <p>{error}</p>
          <button className="btn-secondary btn-sm" onClick={handleReset}>Try Again</button>
        </div>
      )}

      {mode === 'photo' ? (
        <>
          <PhotoMode
            phase={phase}
            capturedImage={capturedImage}
            statusMessage={STATUS[phase]}
            onCapture={(base64, mediaType, dataUrl) => {
              setCapturedImage(dataUrl);
              runPhotoFlow(base64, mediaType);
            }}
            onReset={handleReset}
          />

          {extractedDetails && phase !== 'idle' && (
            <ExtractedDetails details={extractedDetails} />
          )}

          {hasResults && rankedMatches.length > 0 && (
            <VariantList
              matches={rankedMatches}
              releaseDetails={fullReleaseDetails}
              onAdd={handleAddToCollection}
            />
          )}

          {/* Show Last Logged only on idle home screen */}
          {phase === 'idle' && <LastLogged entries={recentLogs} />}
        </>
      ) : (
        <>
          <ManualSearch
            phase={phase}
            results={manualResults}
            onSearch={runManualSearch}
            onAdd={handleAddToCollection}
          />
          {isIdle && mode === 'manual' && <LastLogged entries={recentLogs} />}
        </>
      )}
    </div>
  );
}
