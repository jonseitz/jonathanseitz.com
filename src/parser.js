import { promises as fs } from 'fs';
import { resolve, join } from 'path';
import { readFrontMatter, flattenDeep } from './util';

const extractTextFromFiles = async (paths, parentDir = '') => {
  const fileContents = await Promise.all(
    paths.map(async (path) => {
      if (path.isDirectory()) {
        return fs.readdir(resolve(parentDir, path.name), { withFileTypes: true })
          .then(files => extractTextFromFiles(files, `${parentDir ? `${parentDir}/` : ''}${path.name}`));
      } if (/\.md$/.test(path.name)) {
        return fs.readFile(
          resolve(parentDir, path.name),
          {
            encoding: 'utf8',
          },
        ).then(content => (
          {
            ...readFrontMatter(content),
            contentType: parentDir.split('/'),
            outPath: join(parentDir.replace(/^\w*\/?/, ''), path.name.replace(/\.md$/, '/index.html')),
          }));
      }
      return null;
    }),
  );
  return flattenDeep(fileContents);
};

export default extractTextFromFiles;
