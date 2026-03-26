import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// scripts/ is one level up from lib/
const SCRIPTS_DIR = path.resolve(__dirname, '..');

/**
 * Export a .excalidraw file to SVG using excalidraw-to-svg (jsdom-based, no Playwright needed).
 * @param {string} input - Path to .excalidraw file.
 * @param {string|undefined} output - Output .svg path. Defaults to same basename + .svg.
 */
export async function exportSvg(input, output) {
  const inputPath = path.resolve(input);
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const resolvedOut = output
    ? path.resolve(output)
    : (() => {
        const { dir, name } = path.parse(inputPath);
        return path.join(dir, name + '.svg');
      })();

  const excalidrawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  // excalidraw-to-svg uses CWD-relative paths to load its bundled assets,
  // so we must temporarily set CWD to the scripts directory.
  const originalCwd = process.cwd();
  process.chdir(SCRIPTS_DIR);
  try {
    const require = createRequire(import.meta.url);
    const excalidrawToSvg = require('excalidraw-to-svg');
    const svgElement = await excalidrawToSvg(excalidrawData);
    const svgString = svgElement.outerHTML ?? svgElement.toString();
    fs.writeFileSync(resolvedOut, svgString, 'utf8');
  } finally {
    process.chdir(originalCwd);
  }

  console.log(resolvedOut);
}
