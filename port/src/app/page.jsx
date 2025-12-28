'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [canExit, setCanExit] = useState(false);

  useEffect(() => {
    setCanExit(Boolean(window?.electron?.exitApp));
  }, []);

  const handleExit = () => {
    if (window?.electron?.exitApp) {
      window.electron.exitApp();
    }
  };

  return (
    <div className="app-shell">
      <main className="menu-panel">
        <button className="menu-button" type="button">
          Servers
        </button>
        <button className="menu-button" type="button">
          LAN + AI
        </button>
        <button className="menu-button" type="button">
          Puzzles
        </button>
        <button className="menu-button" type="button">
          Replays
        </button>
        <button className="menu-button" type="button">
          Decks
        </button>
        <button className="menu-button exit" type="button" onClick={handleExit} disabled={!canExit}>
          Exit
        </button>
      </main>
    </div>
  );
}
