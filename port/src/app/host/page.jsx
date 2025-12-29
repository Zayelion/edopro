'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TABS = ['Duel', 'Deck Options', 'Custom Rule'];

export default function HostPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Duel');

  return (
    <div className="app-shell">
      <section className="host-panel">
        <header className="host-header">Host</header>
        <nav className="host-tabs" aria-label="Host tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`host-tab ${activeTab === tab ? 'is-active' : ''}`}
              type="button"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === 'Duel' ? (
          <div className="host-body">
            <div className="host-grid">
              <label className="host-label" htmlFor="forbidden">
                Forbidden List:
              </label>
              <select id="forbidden" className="host-input">
                <option>N/A</option>
              </select>

              <label className="host-label" htmlFor="allowed">
                Allowed Cards:
              </label>
              <select id="allowed" className="host-input">
                <option>Prerelease</option>
              </select>

              <label className="host-label">Duel Mode:</label>
              <div className="host-inline">
                <input className="host-input host-small" defaultValue="1" />
                <span className="host-inline-text">vs.</span>
                <input className="host-input host-small" defaultValue="1" />
                <span className="host-inline-text">Best of</span>
                <input className="host-input host-small" defaultValue="3" />
                <button className="host-pill" type="button">
                  Relay
                </button>
              </div>

              <label className="host-label" htmlFor="time-limit">
                Time limit:
              </label>
              <input id="time-limit" className="host-input host-small" defaultValue="1800" />

              <label className="host-label" htmlFor="rule">
                Rule:
              </label>
              <select id="rule" className="host-input">
                <option>Master Rules (2020)</option>
              </select>

              <div className="host-checkbox">
                <input type="checkbox" id="no-shuffle" />
                <label htmlFor="no-shuffle">Don't shuffle Deck</label>
              </div>
              <div className="host-checkbox">
                <input type="checkbox" id="tcg" />
                <label htmlFor="tcg">TCG SEGOC Rulings</label>
              </div>

              <div className="host-checkbox">
                <input type="checkbox" id="no-check-contents" />
                <label htmlFor="no-check-contents">Don't check Deck contents</label>
              </div>
              <div className="host-checkbox">
                <input type="checkbox" id="no-check-size" />
                <label htmlFor="no-check-size">Don't check Deck size</label>
              </div>

              <label className="host-label" htmlFor="starting-lp">
                Starting LP:
              </label>
              <input id="starting-lp" className="host-input host-small" defaultValue="8000" />

              <label className="host-label" htmlFor="starting-hand">
                Starting Hand:
              </label>
              <input id="starting-hand" className="host-input host-small" defaultValue="5" />

              <label className="host-label" htmlFor="draw">
                Cards per Draw:
              </label>
              <input id="draw" className="host-input host-small" defaultValue="1" />

              <label className="host-label" htmlFor="host-name">
                Host Name:
              </label>
              <input id="host-name" className="host-input" />

              <label className="host-label" htmlFor="host-password">
                Password:
              </label>
              <input id="host-password" className="host-input" type="password" />

              <label className="host-label" htmlFor="host-port">
                Host Port:
              </label>
              <input id="host-port" className="host-input host-small" defaultValue="7911" />
            </div>

            <div className="host-actions">
              <button className="menu-button" type="button">
                Extra Rules
              </button>
              <button className="menu-button" type="button">
                OK
              </button>
              <button className="menu-button exit" type="button" onClick={() => router.push('/lobby')}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="host-placeholder">Content coming soon.</div>
        )}
      </section>
    </div>
  );
}
