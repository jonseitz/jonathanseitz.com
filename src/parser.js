import { promises as fs } from 'fs';
import { resolve, join } from 'path';
import marked from 'marked';
import fm from 'front-matter';
import flattenDeep from './util';

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
        ).then((content) => {
          const data = fm(content);
          if (path.name === 'index.md') {
            data.outPath = 'index.html';
          } else {
            data.outPath = join(parentDir.replace(/^\w*\/?/, ''), path.name.replace(/\.md$/, '/index.html'));
          }
          data.pageHtml = marked(data.body);
          ([data.contentType] = parentDir.split('/'));
          return data;
        });
      }
      return null;
    }),
  );
  return flattenDeep(fileContents);
};

export default extractTextFromFiles;
