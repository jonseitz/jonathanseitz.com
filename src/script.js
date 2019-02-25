import { promises as fs } from 'fs';
import { resolve } from 'path';
import parseFiles from './parser';
import renderPage from './renderer';

const CONTENT_DIR = resolve(__dirname, '../content');

fs.readdir(CONTENT_DIR, { withFileTypes: true })
  .then(files => parseFiles(files, CONTENT_DIR))
  .then(contents => Promise.all(contents.map((page) => {
    renderPage(page);
  })))
  .then(() => {
    process.exit(0);
  });
