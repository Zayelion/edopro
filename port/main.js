const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const NEXT_PORT = process.env.NEXT_PORT || 3000;
const NEXT_HOST = process.env.NEXT_HOST || '127.0.0.1';
const NEXT_URL = `http://${NEXT_HOST}:${NEXT_PORT}`;

let nextProcess = null;

function startNextServer() {
  const serverScript = path.join(__dirname, 'server', 'next-server.js');
  nextProcess = spawn(process.execPath, [serverScript], {
    env: {
      ...process.env,
      NEXT_PORT: String(NEXT_PORT),
      NEXT_HOST
    },
    stdio: 'inherit'
  });

  nextProcess.on('exit', (code, signal) => {
    if (code !== 0 && !app.isQuitting) {
      console.error(`Next server exited with code ${code ?? 'null'} signal ${signal ?? 'null'}`);
      app.quit();
    }
  });
}

function waitForServer(timeoutMs = 20000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(NEXT_URL, (res) => {
        res.destroy();
        resolve();
      });

      req.on('error', () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error('Timed out waiting for Next server'));
          return;
        }
        setTimeout(attempt, 300);
      });
    };

    attempt();
  });
}

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0f1115',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  await waitForServer();
  await mainWindow.loadURL(NEXT_URL);
}

app.whenReady().then(async () => {
  startNextServer();
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.on('app:exit', () => {
  app.isQuitting = true;
  app.quit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
  if (nextProcess) {
    nextProcess.kill();
  }
});
