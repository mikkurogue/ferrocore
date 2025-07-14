/**
 * Represents an optional value: either a value of type `T` (Some) or no value (None).
 * This is useful for handling cases where a value might be absent, avoiding `null` or `undefined`.
 */
export type Option<T> = { kind: "Some"; value: T } | { kind: "None" };

/**
 * Creates an `Option` that contains a value.
 * @param value The value to wrap in a `Some`.
 * @returns An `Option` of kind "Some" containing the provided value.
 */
export const Some = <T>(value: T): Option<T> => ({ kind: "Some", value });

/**
 * Creates an `Option` that represents the absence of a value.
 * @returns An `Option` of kind "None".
 */
export const None = (): Option<never> => ({ kind: "None" });

/**
 * Checks if an `Option` contains a value (is "Some").
 * @param opt The `Option` to check.
 * @returns `true` if the `Option` is "Some", `false` otherwise.
 */
export function isSome<T>(opt: Option<T>): opt is { kind: "Some"; value: T } {
  return opt.kind === "Some";
}

/**
 * Checks if an `Option` represents the absence of a value (is "None").
 * @param opt The `Option` to check.
 * @returns `true` if the `Option` is "None", `false` otherwise.
 */
export function isNone<T>(opt: Option<T>): opt is { kind: "None" } {
  return opt.kind === "None";
}

/**
 * Executes a function if the `Option` is "Some".
 * @param opt The `Option` to check.
 * @param fn The function to execute with the inner value if `opt` is "Some".
 */
export function ifSome<T>(opt: Option<T>, fn: (val: T) => void): void {
  if (isSome(opt)) {
    fn(opt.value);
  }
}

/**
 * Extracts the value from a "Some" `Option`.
 * Throws an error if the `Option` is "None". Use with caution.
 * @param opt The `Option` to unwrap.
 * @returns The inner value of the "Some" `Option`.
 * @throws {Error} If the `Option` is "None".
 */
export function unwrap<T>(opt: Option<T>): T {
  if (isSome(opt)) return opt.value;

  throw new Error("Tried to unwrap None");
}

/**
 * Extracts the value from a "Some" `Option`, or returns a fallback value if it's "None".
 * @param opt The `Option` to unwrap.
 * @param fallback The value to return if `opt` is "None".
 * @returns The inner value of the "Some" `Option`, or the fallback value.
 */
export function unwrapOr<T>(opt: Option<T>, fallback: T): T {
  return isSome(opt) ? opt.value : fallback;
}

/**
 * Converts a nullable value (`T | null`) into an `Option<T>`.
 * Returns `Some(value)` if the value is not `null`, otherwise returns `None()`.
 * @param val The nullable value.
 * @returns An `Option` representing the nullable value.
 */
export function fromNullable<T>(val: T | null): Option<T> {
  return val != null ? Some(val) : None();
}

/**
 * Converts an undefined value (`T | undefined`) into an `Option<T>`.
 * Returns `Some(value)` if the value is not `undefined`, otherwise returns `None()`.
 * @param val The undefined value.
 * @returns An `Option` representing the undefined value.
 */
export function fromUndefined<T>(val: T | undefined): Option<T> {
  return val !== undefined ? Some(val) : None();
}

/**
 * Provides a way to handle both "Some" and "None" cases of an `Option`.
 * @param opt The `Option` to match against.
 * @returns An object with `Some` and `None` methods to handle each case.
 */
export function match<T, R>(opt: Option<T>) {
  return {
    /**
     * Executes a function if the `Option` is "Some" and returns a new `Option` with the transformed value.
     * @param fn The function to apply to the inner value.
     * @returns A new `Option` containing the result of `fn`, or `None()` if the original `Option` was "None".
     */
    Some(fn: (val: T) => R): Option<R> {
      return isSome(opt) ? Some(fn(opt.value)) : None();
    },
    /**
     * Executes a function if the `Option` is "None" and returns a new `Option` with the result.
     * @param fn The function to execute when the `Option` is "None".
     * @returns A new `Option` containing the result of `fn`, or `None()` if the original `Option` was "Some".
     */
    None(fn: () => R): Option<R> {
      return isNone(opt) ? Some(fn()) : None();
    },
  };
}

/**
 * Transforms the value inside a "Some" `Option` using a mapping function.
 * If the `Option` is "None", it remains "None".
 * @param opt The `Option` to map.
 * @param fn The mapping function to apply to the inner value.
 * @returns A new `Option` with the transformed value, or "None" if the original was "None".
 */
export function map<T, U>(
  opt: Option<T>,
  fn: (value: T) => U,
): Option<U> {
  return isSome(opt) ? Some(fn(opt.value)) : None();
}

/**
 * Wraps a potentially throwing function into a function that returns an `Option`.
 * If the original function executes successfully, it returns `Some(result)`. If it throws, it returns `None()`.
 * @param fn The function that might throw an error.
 * @returns A new function that returns an `Option`.
 */
export function fromThrowable<T, Args extends unknown[]>(
  fn: (...args: Args) => T,
): (...args: Args) => Option<T> {
  return (...args: Args): Option<T> => {
    try {
      return Some(fn(...args));
    } catch {
      return None();
    }
  };
}

/**
 * Chains operations that return `Option` types.
 * If the current `Option` is "Some", it applies the function and returns the new `Option`.
 * If it's "None", it propagates the "None".
 * @param opt The `Option` to flatMap.
 * @param fn The function to apply, which returns another `Option`.
 * @returns A new `Option` resulting from the chained operation.
 */
export function flatMap<T, U>(
  opt: Option<T>,
  fn: (value: T) => Option<U>,
): Option<U> {
  return isSome(opt) ? fn(opt.value) : None();
}

/**
 * Returns the `Option` if it is "Some", otherwise returns the provided fallback `Option`.
 * @param opt The original `Option`.
 * @param fallback The `Option` to return if `opt` is "None".
 * @returns The original `Option` if "Some", or the fallback `Option` if "None".
 */
export function orElse<T>(
  opt: Option<T>,
  fallback: Option<T>,
): Option<T> {
  return isSome(opt) ? opt : fallback;
}

/**
 * Filters a "Some" `Option` based on a predicate.
 * If the `Option` is "Some" and the predicate returns `true`, it remains "Some".
 * Otherwise, it becomes "None".
 * @param opt The `Option` to filter.
 * @param predicate The function to test the inner value.
 * @returns The filtered `Option`.
 */
export function filter<T>(
  opt: Option<T>,
  predicate: (value: T) => boolean,
): Option<T> {
  return isSome(opt) && predicate(opt.value) ? opt : None();
}

