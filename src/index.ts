export type Option<T> = { kind: "Some"; value: T } | { kind: "None" };
export const Some = <T>(value: T): Option<T> => ({ kind: "Some", value });
export const None = (): Option<never> => ({ kind: "None" });

export function isSome<T>(opt: Option<T>): opt is { kind: "Some"; value: T } {
  return opt.kind === "Some";
}

export function isNone<T>(opt: Option<T>): opt is { kind: "None" } {
  return opt.kind === "None";
}

export function ifSome<T>(opt: Option<T>, fn: (val: T) => void): void {
  if (isSome(opt)) {
    fn(opt.value);
  }
}

export function match<T, R>(opt: Option<T>) {
  return {
    Some(fn: (val: T) => R) {
      return isSome(opt) ? fn(opt.value) : undefined;
    },
    None(fn: () => R) {
      return isNone(opt) ? fn() : undefined;
    },
  };
}
