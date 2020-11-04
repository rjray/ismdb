/*
 * Simple useFocus hook adapted from
 * https://stackoverflow.com/questions/28889826/set-focus-on-input-after-render
 */

import { useRef } from "react";

export const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};
