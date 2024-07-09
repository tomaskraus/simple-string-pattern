// id :: a -> a
export const id = <T>(a: T) => a;

// addPrefix :: String -> String -> String
export const addPrefix = (p: string, s: string) => p + s;

// addSuffix :: String -> String -> String
export const addSuffix = (p: string, s: string) => s + p;

// toStartPatt :: String -> String
export const toStartPatt = (s: string) => addSuffix(' ...', s);
export const toEndPatt = (s: string) => addPrefix('... ', s);
export const toMiddlePatt = (s: string) => toStartPatt(toEndPatt(s));

export default {
  id,
  addPrefix,
  addSuffix,
  toStartPatt,
  toEndPatt,
  toMiddlePatt,
};
