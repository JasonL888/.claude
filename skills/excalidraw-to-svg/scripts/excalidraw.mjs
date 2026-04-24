#!/usr/bin/env node
import { program } from 'commander';
import { exportSvg } from './lib/export-svg.mjs';

program
  .name('excalidraw')
  .description('Export Excalidraw diagrams to SVG')
  .version('1.0.0');

program
  .command('export <input>')
  .description('Export a .excalidraw file to SVG')
  .option('-o, --output <path>', 'Output SVG path (default: same name with .svg extension)')
  .action(async (input, opts) => {
    await exportSvg(input, opts.output);
  });

program.parseAsync(process.argv).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
