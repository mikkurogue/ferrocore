export interface Ok<T, E> {
  readonly _tag: 'Ok';
  readonly value: T;
  isOk(): true;
  isErr(): false;
  unwrap(): T;
  unwrapErr(): E;
  unwrapOr(fallback: T): T;
  map<U>(fn: (value: T) => U): Result<U, E>;
  mapErr<F>(fn: (error: E) => F): Result<T, F>;
  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
  orElse(fallback: Result<T, E>): Result<T, E>;
  match<R>(onOk: (val: T) => R, onErr: (err: E) => R): R;
}

export interface Err<T, E> {
  readonly _tag: 'Err';
  readonly error: E;
  isOk(): false;
  isErr(): true;
  unwrap(): T;
  unwrapErr(): E;
  unwrapOr(fallback: T): T;
  map<U>(fn: (value: T) => U): Result<U, E>;
  mapErr<F>(fn: (error: E) => F): Result<T, F>;
  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
  orElse(fallback: Result<T, E>): Result<T, E>;
  match<R>(onOk: (val: T) => R, onErr: (err: E) => R): R;
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export const Ok = <T, E>(value: T): Ok<T, E> => ({
  _tag: 'Ok',
  value,
  isOk: () => true,
  isErr: () => false,
  unwrap: () => value,
  unwrapErr: () => {
    throw new Error("Tried to unwrap Ok as Err");
  },
  unwrapOr: () => value,
  map: (fn) => Ok(fn(value)),
  mapErr: <F>(fn: (error: E) => F): Result<T, F> => Ok(value),
  flatMap: (fn) => fn(value),
  orElse: (fallback) => Ok(value),
  match: (onOk, _) => onOk(value),
});

export const Err = <T, E>(error: E): Err<T, E> => ({
  _tag: 'Err',
  error,
  isOk: () => false,
  isErr: () => true,
  unwrap: () => {
    throw new Error("Tried to unwrap Err");
  },
  unwrapErr: () => error,
  unwrapOr: (fallback) => fallback,
  map: () => Err(error),
  mapErr: (fn) => Err(fn(error)),
  flatMap: () => Err(error),
  orElse: (fallback) => fallback,
  match: (_, onErr) => onErr(error),
});

const fromThrowable = <T, E, Args extends unknown[]>(
  fn: (...args: Args) => T,
  errorMap: (e: unknown) => E
): ((...args: Args) => Result<T, E>) => {
  return (...args: Args): Result<T, E> => {
    try {
      return Ok(fn(...args));
    } catch (e) {
      return Err(errorMap(e));
    }
  };
};

export const Result = {
    fromThrowable
}