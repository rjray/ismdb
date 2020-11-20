/* eslint-disable no-param-reassign */
// Adapted from https://helloacm.com/the-javascript-function-to-compare-version-number-strings/
const compareVersion = (a, b) => {
  if (typeof a !== "string") return false;
  if (typeof b !== "string") return false;
  if (a.match(/[^.\d]/) || b.match(/[^.\d]/)) {
    return a.localeCompare(b);
  }
  a = a.split(".");
  b = b.split(".");
  const k = Math.min(a.length, b.length);
  for (let i = 0; i < k; ++i) {
    a[i] = parseInt(a[i], 10);
    b[i] = parseInt(b[i], 10);
    if (a[i] > b[i]) return 1;
    if (a[i] < b[i]) return -1;
  }
  return a.length === b.length ? 0 : a.length < b.length ? -1 : 1;
};

export default compareVersion;
