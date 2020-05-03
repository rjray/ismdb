/*
 * Various utility methods taken from
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
 * to avoid using lodash.
 */

export const chunk = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
};

export const isEmpty = (obj) =>
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;

export default { chunk, isEmpty };
