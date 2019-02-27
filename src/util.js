export const flattenDeep = fileArray => fileArray.reduce((acc, val) => {
  if (Array.isArray(val)) {
    return acc.concat(flattenDeep(val));
  }
  return acc.concat(val);
}, []);


export const readFrontMatter = (mdFile) => {
  const mdre = /^---\n*(?<head>[\n\t\w\W]+)\n+---\n*(?<body>[\n\t\w\W]+)\$/;
  const sectionMatches = mdFile.match(mdre);
  return {
    attributes: JSON.parse(sectionMatches.groups.head.trim()),
    body: sectionMatches.groups.body.trim(),
  };
};
