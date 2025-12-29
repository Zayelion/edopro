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

	const handleLAN = () => {
		window.location.href = '/lan';
	};

	const handlePuzzles = () => {
		window.location.href = '/puzzles';
	};

	const handleReplays = () => {
		window.location.href = '/replays';
	};

	const handleDecks = () => {
		window.location.href = '/decks';
	};

  return (
    <div className="app-shell">
      <main className="menu-panel">
        <button className="menu-button" type="button" >
          Servers
        </button>
        <button className="menu-button" type="button" onClick={handleLAN}>
          LAN + AI
        </button>
        <button className="menu-button" type="button" onClick={handlePuzzles}>
          Puzzles
        </button>
        <button className="menu-button" type="button" onClick={handleReplays}>
          Replays
        </button>
        <button className="menu-button" type="button" onClick={handleDecks}>
          Decks
        </button>
        <button className="menu-button exit" type="button" onClick={handleExit} disabled={!canExit}>
          Exit
        </button>
      </main>
    </div>
  );
}
