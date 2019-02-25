export const flattenDeep = fileArray => fileArray.reduce((acc, val) => {
  if (Array.isArray(val)) {
    return acc.concat(flattenDeep(val));
  }
  return acc.concat(val);
}, []);
