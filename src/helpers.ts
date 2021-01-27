type Collection = Record<string, any>;

export function set<TCollection extends Collection>(
  collection: TCollection,
  path: string | string[],
  value: unknown
): TCollection {
  const _path = Array.isArray(path) ? [...path] : path.split('.');
  let handler = collection as Collection;
  const last = _path.pop() as string;

  for (const p of _path) {
    handler[p] = handler[p] || {};
    handler = handler[p];
  }

  handler[last] = value;

  return collection;
}

export function get<TCollection extends Collection>(
  collection: TCollection,
  path: string | string[]
): TCollection | TCollection[string] | undefined {
  const _path = Array.isArray(path) ? [...path] : path.split('.');
  if (!_path.length) return undefined;
  let handler = collection;
  let key: string;
  while (_path.length && handler) {
    key = _path.shift() as string;
    handler = handler[key];
  }
  return handler;
}
