import marked from 'marked';
import { highlightAuto } from 'highlight.js';
import { html } from 'htm/preact';
import render from 'preact-render-to-string';
import { resolve } from 'path';
import { promises as fs } from 'fs';
import components from './components';

marked.setOptions({
  baseUrl: 'https://jonathanseitz.com/',
  gfm: true,
  tables: true,
  smartypants: true,
  smartLists: true,
  highlight: code => highlightAuto(code).value,
});

export default async ({ body, attributes, outPath }) => {
  const contentHTML = marked(body);
  let pageComponent;
  const {
    title,
    slug,
    pageType,
  } = attributes;
  if (slug && slug in components) {
    pageComponent = components[slug];
  } else if (pageType in components) {
    pageComponent = components[pageType];
  } else {
    pageComponent = components.page;
  }
  const pageHTML = render(html`
    <${pageComponent} title=${title}>
      ${contentHTML}
    <//>
  `);
  console.debug(pageHTML);
};
