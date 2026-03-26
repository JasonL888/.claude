#!/usr/bin/env node
import { program } from 'commander';
import { fromMermaid } from './lib/from-mermaid.mjs';
import { exportSvg } from './lib/export-svg.mjs';
import { aiGenerate } from './lib/ai-generate.mjs';
import { openInBrowser } from './lib/open-browser.mjs';

program
  .name('excalidraw')
  .description('Excalidraw CLI — create, convert, export, and open diagrams')
  .version('1.0.0');

program
  .command('mermaid <input> [output]')
  .description('Convert a Mermaid .mmd file (or inline string) to .excalidraw JSON')
  .action(async (input, output) => {
    await fromMermaid(input, output);
  });

program
  .command('export <input>')
  .description('Export a .excalidraw file to SVG')
  .option('-o, --output <path>', 'Output SVG path (default: same name with .svg extension)')
  .action(async (input, opts) => {
    await exportSvg(input, opts.output);
  });

program
  .command('generate <description> [output]')
  .description('AI-generate a .excalidraw diagram from a plain-text description')
  .action(async (description, output) => {
    await aiGenerate(description, output);
  });

program
  .command('open <input>')
  .description('Upload a .excalidraw file to excalidraw.com and open it in the browser')
  .action(async (input) => {
    await openInBrowser(input);
  });

program.parseAsync(process.argv).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
