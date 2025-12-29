'use client';

export default function GamePage() {
  return (
    <div className="game-stage">
      <div className="game-sidebar">
        <button className="menu-button" type="button">
          Exit
        </button>
        <button className="menu-button" type="button">
          Restart
        </button>
        <button className="menu-button" type="button">
          Chain: OFF
        </button>
        <button className="menu-button" type="button">
          Always Pause
        </button>
        <button className="menu-button" type="button">
          Chain: ON
        </button>
      </div>

      <div className="game-top">
        <div className="lp-box">
          <span className="lp-value">8000</span>
          <span className="lp-name">Zayelion</span>
        </div>
        <div className="lp-box enemy">
          <span className="lp-value">5500</span>
        </div>
      </div>

      <div className="game-board">
        <div className="card float-one" />
        <div className="card float-two" />
        <div className="card float-three" />
        <div className="card float-four" />
        <div className="card float-five" />
        <div className="card float-six" />
        <div className="card float-seven" />
      </div>

      <div className="game-info">
        <div className="game-tabs">
          <button className="menu-button" type="button">
            Card Info
          </button>
          <button className="menu-button" type="button">
            Log
          </button>
          <button className="menu-button" type="button">
            Chat
          </button>
          <button className="menu-button" type="button">
            Quick Settings
          </button>
          <button className="menu-button" type="button">
            Repositories
          </button>
        </div>
        <div className="game-card-panel">
          <div className="game-card-art" />
          <div className="game-card-text">
            <h2>Dark Magician, the Pharaoh's Servant</h2>
            <p>Monster/Effect DARK Spellcaster</p>
            <p>ATK 2500 / DEF 2100</p>
            <p>
              This card's name becomes &quot;Dark Magician&quot; while on the field or in
              the GY. Once per turn, you can reveal 1 spell in your hand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
