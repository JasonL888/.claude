import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

/**
 * Upload a .excalidraw file to json.excalidraw.com and open the resulting URL in the browser.
 * @param {string} input - Path to .excalidraw file.
 */
export async function openInBrowser(input) {
  const inputPath = path.resolve(input);
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  const payload = {
    elements: data.elements ?? [],
    appState: data.appState ?? {},
    files: data.files ?? {},
  };

  const response = await fetch('https://json.excalidraw.com/api/v2/post/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`excalidraw.com API error: ${response.status} ${response.statusText}`);
  }

  const { id, key } = await response.json();
  if (!id || !key) {
    throw new Error('excalidraw.com API returned unexpected response (missing id/key).');
  }

  const url = `https://excalidraw.com/#json=${id},${key}`;
  console.log(url);

  // Open in default browser using execFile (no shell injection risk)
  const platform = process.platform;
  if (platform === 'darwin') {
    await execFileAsync('open', [url]);
  } else if (platform === 'win32') {
    await execFileAsync('cmd', ['/c', 'start', '', url]);
  } else {
    await execFileAsync('xdg-open', [url]);
  }
}
