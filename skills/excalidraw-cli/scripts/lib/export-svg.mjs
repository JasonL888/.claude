import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPTS_DIR = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(SCRIPTS_DIR, 'node_modules/@excalidraw/excalidraw/dist/excalidraw-assets');
const LOCAL_ASSETS_DIR = path.join(SCRIPTS_DIR, 'assets');

// Use globally-installed playwright (npm install -g playwright)
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/homebrew/lib/node_modules/playwright');

const REACT_PATH = path.join(SCRIPTS_DIR, 'node_modules/react/umd/react.production.min.js');
const REACT_DOM_PATH = path.join(SCRIPTS_DIR, 'node_modules/react-dom/umd/react-dom.production.min.js');
const EXCALIDRAW_PATH = path.join(SCRIPTS_DIR, 'node_modules/@excalidraw/excalidraw/dist/excalidraw.production.min.js');

// Excalidraw font family IDs → CSS font names
const FONT_FAMILIES = {
  1: 'Virgil',
  2: 'Assistant',  // Excalidraw uses Assistant, not Helvetica
  3: 'Cascadia',
  4: 'Excalifont',
  5: 'Nunito'
};

// Font file paths for embedding
const FONT_FILES = {
  Virgil: path.join(ASSETS_DIR, 'Virgil.woff2'),
  Assistant: path.join(ASSETS_DIR, 'Assistant-Regular.woff2'),
  Cascadia: path.join(ASSETS_DIR, 'Cascadia.woff2'),
  Excalifont: path.join(LOCAL_ASSETS_DIR, 'Excalifont.woff2'),
  Nunito: path.join(LOCAL_ASSETS_DIR, 'Nunito.woff2')
};

/**
 * Get the fonts used in an Excalidraw diagram.
 * @param {object} diagram - Parsed Excalidraw JSON.
 * @returns {Set<string>} Set of font names used.
 */
function getUsedFonts(diagram) {
  const usedFonts = new Set();
  for (const el of diagram.elements) {
    if (el.type === 'text' && el.fontFamily) {
      const fontName = FONT_FAMILIES[el.fontFamily];
      if (fontName && FONT_FILES[fontName]) {
        usedFonts.add(fontName);
      }
    }
  }
  return usedFonts;
}

/**
 * Generate CSS @font-face rules with embedded base64 fonts.
 * @param {Set<string>} fonts - Set of font names to embed.
 * @returns {string} CSS string with @font-face rules.
 */
function generateFontCss(fonts) {
  let css = '';
  for (const fontName of fonts) {
    const fontPath = FONT_FILES[fontName];
    if (fontPath && fs.existsSync(fontPath)) {
      const fontData = fs.readFileSync(fontPath);
      const base64 = fontData.toString('base64');
      css += `@font-face{font-family:'${fontName}';src:url(data:font/woff2;charset=utf-8;base64,${base64})format('woff2');font-weight:normal;font-style:normal;}`;
    }
  }
  return css;
}

/**
 * Embed fonts into an SVG string.
 * @param {string} svgString - The SVG content.
 * @param {string} fontCss - CSS @font-face rules.
 * @returns {string} SVG with embedded fonts.
 */
/**
 * Remove @font-face rules whose src URL contains "@undefined" — emitted by
 * the Excalidraw library when it cannot resolve its own package version for
 * CDN URLs (e.g. `@excalidraw/excalidraw@undefined/...`).
 * @param {string} svgString
 * @returns {string}
 */
function removeUndefinedFontFaces(svgString) {
  return svgString.replace(/@font-face\s*\{[^}]*@undefined[^}]*\}/g, '');
}

function embedFontsInSvg(svgString, fontCss) {
  if (!fontCss) return svgString;

  // Insert <style> block after the opening <svg> tag
  const styleBlock = `<style>${fontCss}</style>`;
  return svgString.replace(/(<svg[^>]*>)/, `$1${styleBlock}`);
}

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

  // Determine which fonts are used in this diagram
  const usedFonts = getUsedFonts(excalidrawData);
  const fontCss = generateFontCss(usedFonts);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.setContent('<html><body></body></html>');
    // Inject the UMD bundle — exposes ExcalidrawUtils as a global
    await page.addScriptTag({ path: REACT_PATH });
    await page.addScriptTag({ path: REACT_DOM_PATH });
    await page.addScriptTag({ path: EXCALIDRAW_PATH });

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
          const lineHeightPx = el.fontSize * (el.lineHeight ?? 1.25);
          // baseline = ascent of first line + full height of remaining lines
          el.baseline = (nLines - 1) * lineHeightPx + metrics.actualBoundingBoxAscent;
        }
      }

      const svg = await ExcalidrawLib.exportToSvg(diagram);

      // Fix font-family: ExcalidrawLib doesn't map custom fontFamily IDs correctly
      // (e.g. 5=Nunito falls back to "Segoe UI Emoji"). The exported <g> elements
      // carry no id attributes and their translate() values are shifted by the
      // diagram bounding box offset. Instead, match each source text element to its
      // SVG <text> node by text content (first line), then patch font-family on
      // the whole containing <g>.
      const svgTexts = Array.from(svg.querySelectorAll('text'));
      for (const el of diagram.elements) {
        if (el.type !== 'text' || !el.fontFamily) continue;
        const fontName = fontFamilies[el.fontFamily];
        if (!fontName) continue;
        const firstLine = el.text.split('\n')[0].trim();
        if (!firstLine) continue;
        const match = svgTexts.find(t => t.textContent.trim().startsWith(firstLine));
        if (!match) continue;
        const group = match.closest('g') || match;
        group.querySelectorAll('text, tspan').forEach(t => {
          t.setAttribute('font-family', fontName);
        });
      }

      return svg.outerHTML;
    }, { diagram: excalidrawData, fontFamilies: FONT_FAMILIES });

    // Strip broken @font-face rules with unresolved CDN version, then embed our fonts
    const cleanedSvg = removeUndefinedFontFaces(svgString);
    const svgWithFonts = embedFontsInSvg(cleanedSvg, fontCss);

    fs.writeFileSync(resolvedOut, svgWithFonts, 'utf8');
  } finally {
    await browser.close();
  }

  console.log(resolvedOut);
}
