export interface Some<T> {
  readonly _tag: 'Some';
  readonly value: T;
  isSome(): true;
  isNone(): false;
  ifSome(fn: (val: T) => void): void;
  unwrap(): T;
  unwrapOr(fallback: T): T;
  match<R>(onSome: (val: T) => R, onNone: () => R): R;
  map<U>(fn: (value: T) => U): Option<U>;
  flatMap<U>(fn: (value: T) => Option<U>): Option<U>;
  orElse(fallback: Option<T>): Option<T>;
  filter(predicate: (value: T) => boolean): Option<T>;
}

export interface None {
  readonly _tag: 'None';
  isSome(): false;
  isNone(): true;
  ifSome(fn: (val: never) => void): void;
  unwrap(): never;
  unwrapOr<T>(fallback: T): T;
  match<R>(onSome: (val: never) => R, onNone: () => R): R;
  map<U>(fn: (value: never) => U): Option<U>;
  flatMap<U>(fn: (value: never) => Option<U>): Option<U>;
  orElse<T>(fallback: Option<T>): Option<T>;
  filter(predicate: (value: never) => boolean): Option<never>;
}

export type Option<T> = Some<T> | None;

export const Some = <T>(value: T): Some<T> => ({
  _tag: 'Some',
  value,
  isSome: () => true,
  isNone: () => false,
  ifSome: (fn) => fn(value),
  unwrap: () => value,
  unwrapOr: () => value,
  match: (onSome, _) => onSome(value),
  map: (fn) => Some(fn(value)),
  flatMap: (fn) => fn(value),
  orElse: (_fallback) => Some(value),
  filter: (predicate) => (predicate(value) ? Some(value) : None()),
});

const noneInstance: None = {
  _tag: 'None',
  isSome: () => false,
  isNone: () => true,
  ifSome: () => {},
  unwrap: () => {
    throw new Error("Tried to unwrap None");
  },
  unwrapOr: (fallback) => fallback,
  match: (_, onNone) => onNone(),
  map: () => noneInstance,
  flatMap: () => noneInstance,
  orElse: (fallback) => fallback,
  filter: () => noneInstance,
};

export const None = (): None => noneInstance;

export const fromNullable = <T>(val: T | null): Option<T> =>
  val != null ? Some(val) : None();

export const fromUndefined = <T>(val: T | undefined): Option<T> =>
  val !== undefined ? Some(val) : None();

const fromThrowable = <T, Args extends unknown[]>(
  fn: (...args: Args) => T
): ((...args: Args) => Option<T>) => {
  return (...args: Args): Option<T> => {
    try {
      return Some(fn(...args));
    } catch {
      return None();
    }
  };
};

export const Option = {
    fromThrowable
}