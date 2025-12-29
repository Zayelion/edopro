'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const SAMPLE_ENTRIES = [
  { name: '[..]', type: 'up' },
  { name: '[Duel Links]', type: 'dir' },
  { name: '[GX Spirit Caller]', type: 'dir' },
  { name: '[Miscellaneous]', type: 'dir' },
  { name: '[Nightmare Troubadour]', type: 'dir' },
  { name: '[RUSH DUEL Dawn of the Battle Royale!!]', type: 'dir' },
  { name: '[Tutorials]', type: 'dir' },
  { name: '[World Championship]', type: 'dir' },
  { name: 'Puzzle Creator.lua', type: 'file' }
];

const LUA_MESSAGES = {
  'Puzzle Creator.lua':
    'This is a Puzzle that generates other puzzles. When played, it prompts you to add cards to locations you choose -- until you select No, when the puzzle is saved.'
};

export default function PuzzelsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState('Puzzle Creator.lua');

  const mainMessage = useMemo(() => {
    return LUA_MESSAGES[selected] || 'Select a .lua puzzle file to read its message.';
  }, [selected]);

  const handleOpen = () => {
    if (!selected.endsWith('.lua')) {
      return;
    }
    console.log('Open puzzle file', selected);
  };

  return (
    <div className="app-shell">
      <section className="puzzle-panel">
        <header className="puzzle-header">Puzzles</header>
        <div className="puzzle-body">
          <div className="puzzle-explorer">
            {SAMPLE_ENTRIES.map((entry) => (
              <button
                key={entry.name}
                type="button"
                className={`puzzle-entry ${selected === entry.name ? 'is-active' : ''}`}
                onClick={() => setSelected(entry.name)}
              >
                {entry.name}
              </button>
            ))}
          </div>
          <div className="puzzle-message">
            <p className="puzzle-message-title">Main message:</p>
            <p className="puzzle-message-body">{mainMessage}</p>
          </div>
          <div className="puzzle-actions">
            <button className="menu-button" type="button" onClick={handleOpen}>
              Open File
            </button>
            <button className="menu-button" type="button">
              Enter Folder
            </button>
            <button className="menu-button" type="button">
              Delete
            </button>
            <button className="menu-button" type="button">
              Rename
            </button>
            <button className="menu-button exit" type="button" onClick={() => router.push('/')}>
              Exit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
