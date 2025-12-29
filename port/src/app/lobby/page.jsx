'use client';
import { useRouter } from 'next/navigation';

export default function LobbyPage() {
  const router = useRouter();

  return (
    <div className="app-shell">
      <section className="lobby-panel">
        <header className="lobby-header">Host</header>
        <div className="lobby-body">
          <div className="lobby-left">
            <div className="lobby-row">
              <span className="lobby-label">?Duel</span>
              <button className="menu-button" type="button">
                Local AI
              </button>
            </div>
            <div className="lobby-players">
              <div className="lobby-player">
                <button className="lobby-slot" type="button">
                  X
                </button>
                <span>Zayelion</span>
              </div>
              <div className="lobby-player">
                <button className="lobby-slot" type="button">
                  X
                </button>
                <span>&nbsp;</span>
              </div>
            </div>
            <div className="lobby-row">
              <button className="menu-button" type="button">
                ?Spectate
              </button>
              <button className="menu-button" type="button">
                Ready
              </button>
            </div>
            <div className="lobby-info">Current Spectators: 0</div>
            <div className="lobby-row">
              <label className="lobby-label" htmlFor="deck">
                Select Deck:
              </label>
              <div className="lobby-select">
                <select id="deck" className="host-input">
                  <option>Dark Magician</option>
                </select>
              </div>
            </div>
          </div>
          <aside className="lobby-right">
            <div className="lobby-rules">
              <p>Forbidden List: N/A</p>
              <p>Allowed Cards: Prerelease</p>
              <p>Duel Mode: Best of 3</p>
              <p>Time limit: 1800</p>
              <div className="lobby-divider" />
              <p>Starting LP: 8000</p>
              <p>Starting Hand: 5</p>
              <p>Cards per Draw: 1</p>
            </div>
          </aside>
        </div>
        <div className="lobby-footer">
          <button className="menu-button" type="button" disabled>
            Start
          </button>
          <button className="menu-button exit" type="button" onClick={() => router.push('/')}>
            Exit
          </button>
        </div>
      </section>
    </div>
  );
}
