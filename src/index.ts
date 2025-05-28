export type Option<T> = { kind: "Some"; value: T } | { kind: "None" };
export const Some = <T>(value: T): Option<T> => ({ kind: "Some", value });
export const None = (): Option<never> => ({ kind: "None" });

/*
 * Check if a value is "Some" meaning that the value exists
 */
export function isSome<T>(opt: Option<T>): opt is { kind: "Some"; value: T } {
  return opt.kind === "Some";
}

/*
 * Check if a value is "None" meaning that the value does not exist
 */
export function isNone<T>(opt: Option<T>): opt is { kind: "None" } {
  return opt.kind === "None";
}

/*
 * Basically the rust if let Some syntax
 */
export function ifSome<T>(opt: Option<T>, fn: (val: T) => void): void {
  if (isSome(opt)) {
    fn(opt.value);
  }
}

/*
 * Basically the rust unwrap function
 */
export function unwrap<T>(opt: Option<T>): T {
  if (isSome(opt)) return opt.value;

  throw new Error("Tried to unwrap None");
}

/*
 * Basically the rust unwrap_or function
 */
export function unwrapOr<T>(opt: Option<T>, fallback: T): T {
  return isSome(opt) ? opt.value : fallback;
}

/*
 * A check to see if we can convert a possible null value to a Some
 */
export function fromNullable<T>(val: T | null): Option<T> {
  return val != null ? Some(val) : None();
}

export function fromUndefined<T>(val: T | undefined): Option<T> {
  return val !== undefined ? Some(val) : None();
}

/**
 * Simple matcher to see if a value is Some or None (something or undefined)
 */
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
