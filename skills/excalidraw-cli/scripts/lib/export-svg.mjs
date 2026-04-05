import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPTS_DIR = path.resolve(__dirname, '..');

// Use globally-installed playwright (npm install -g playwright)
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/homebrew/lib/node_modules/playwright');

const UTILS_PATH = path.join(
  SCRIPTS_DIR,
  'node_modules/@excalidraw/utils/dist/excalidraw-utils.min.js'
);

// Excalidraw font family IDs → CSS font names
const FONT_FAMILIES = { 1: 'Virgil', 2: 'Helvetica', 3: 'Cascadia, Segoe UI Emoji' };

/**
 * Export a .excalidraw file to SVG using Playwright (real Chromium).
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

  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.setContent('<html><body></body></html>');
    // Inject the UMD bundle — exposes ExcalidrawUtils as a global
    await page.addScriptTag({ path: UTILS_PATH });

    const svgString = await page.evaluate(async ({ diagram, fontFamilies }) => {
      // @excalidraw/utils stores text y-positions as:
      //   y = (lineIndex + 1) * lineHeight - (element.height - element.baseline)
      // The `baseline` field is computed by the Excalidraw editor but not always
      // persisted in the file. Compute it here from real canvas metrics so that
      // multi-line text renders at the correct vertical positions.
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      for (const el of diagram.elements) {
        if (el.type === 'text' && el.baseline == null) {
          const fontFamily = fontFamilies[el.fontFamily] ?? 'sans-serif';
          ctx.font = `${el.fontSize}px ${fontFamily}`;
          const metrics = ctx.measureText(el.text);
          const nLines = el.text.split('\n').length;
          const lineHeightPx = el.fontSize * el.lineHeight;
          // baseline = ascent of first line + full height of remaining lines
          el.baseline = (nLines - 1) * lineHeightPx + metrics.actualBoundingBoxAscent;
        }
      }

      const svg = await ExcalidrawUtils.exportToSvg(diagram);
      return svg.outerHTML;
    }, { diagram: excalidrawData, fontFamilies: FONT_FAMILIES });

    fs.writeFileSync(resolvedOut, svgString, 'utf8');
  } finally {
    await browser.close();
  }

  console.log(resolvedOut);
}
