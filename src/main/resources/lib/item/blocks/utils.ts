/**
 * Returns an id generated from the part path.
 * @param {string | undefined} partPath The parts path. Needs to support undefined because of Fragments.
 */
export function partPathToId(partPath: string | undefined): string {
  return partPath ? partPath.substring(1).replace(/\//g, "-") : generateId();
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function notNullOrUndefined<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}

export function notEmptyOrUndefined(str?: string | null): str is string {
  return str !== undefined && str !== null && str.length > 0;
}

export function isEmptyOrUndefined(str?: string | null): str is string {
  return str === undefined || str === null || str === "";
}

export function assertIsDefined<T>(value: T, name?: string): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`${name ?? value} is not defined`);
  }
}

export function objectKeys<Obj extends object>(obj: Obj): (keyof Obj)[] {
  return Object.keys(obj) as (keyof Obj)[];
}

export function toSnakeCase(nonSnake?: string): string | undefined {
  if (notEmptyOrUndefined(nonSnake)) {
    return nonSnake
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      ?.map((x) => x.toLowerCase())
      .join("_");
  }

  return;
}

export function startsWith(str: string, prefix: string): boolean {
  return str.indexOf(prefix) === 0;
}

export function forceArray<A>(data: A | Array<A> | undefined | null): Array<A>;
export function forceArray<A>(data: A | ReadonlyArray<A> | undefined | null): ReadonlyArray<A>;
export function forceArray<A>(data: A | Array<A> | undefined | null): ReadonlyArray<A> {
  data = data ?? [];
  return Array.isArray(data) ? data : [data];
}
