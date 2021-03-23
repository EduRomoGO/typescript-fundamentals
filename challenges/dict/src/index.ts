export type Dict<T> = {
  [key: string]: T;
};

// Array.prototype.map, but for Dict
export function mapDict<T, S>(obj: Dict<T>, cb: (value: T) => S): Dict<S> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    return { ...acc, ...(value && { [key]: cb(value) }) };
  }, {});
}

const obj = {
  a: "a",
  b: "b",
};

const transfromer = <T>(item: T): T[] => [item];

mapDict(obj, (item) => [item]);

// Array.prototype.reduce, but for Dict
export function reduceDict<T, S>(
  obj: Dict<T>,
  cb: (acc: S, value: T) => S,
  initialValue: S
): S {
  return Object.values(obj).reduce((acc, next) => {
    return cb(acc, next);
  }, initialValue);
}
