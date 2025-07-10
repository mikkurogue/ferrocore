/**
 * Represents a value that can be either a success (`Ok`) or a failure (`Err`).
 * This is useful for handling operations that might fail, providing explicit error handling.
 */
export type Result<T, E> = { kind: "Ok"; value: T } | { kind: "Err"; error: E };

/**
 * Creates a `Result` that represents a successful outcome.
 * @param value The successful value.
 * @returns A `Result` of kind "Ok" containing the provided value.
 */
export const Ok = <T, E>(value: T): Result<T, E> => ({ kind: "Ok", value });

/**
 * Creates a `Result` that represents a failed outcome.
 * @param error The error value.
 * @returns A `Result` of kind "Err" containing the provided error.
 */
export const Err = <T, E>(error: E): Result<T, E> => ({ kind: "Err", error });

/**
 * Checks if a `Result` represents a successful outcome (is "Ok").
 * @param res The `Result` to check.
 * @returns `true` if the `Result` is "Ok", `false` otherwise.
 */
export function isOk<T, E>(res: Result<T, E>): res is { kind: "Ok"; value: T } {
  return res.kind === "Ok";
}

/**
 * Checks if a `Result` represents a failed outcome (is "Err").
 * @param res The `Result` to check.
 * @returns `true` if the `Result` is "Err", `false` otherwise.
 */
export function isErr<T, E>(
  res: Result<T, E>,
): res is { kind: "Err"; error: E } {
  return res.kind === "Err";
}

/**
 * Extracts the successful value from an "Ok" `Result`.
 * Throws an error if the `Result` is "Err". Use with caution.
 * @param res The `Result` to unwrap.
 * @returns The inner value of the "Ok" `Result`.
 * @throws {Error} If the `Result` is "Err".
 */
export function unwrap<T, E>(res: Result<T, E>): T {
  if (isOk(res)) return res.value;
  throw new Error("Tried to unwrap Err");
}

/**
 * Extracts the error value from an "Err" `Result`.
 * Throws an error if the `Result` is "Ok". Use with caution.
 * @param res The `Result` to unwrap.
 * @returns The inner error of the "Err" `Result`.
 * @throws {Error} If the `Result` is "Ok".
 */
export function unwrapErr<T, E>(res: Result<T, E>): E {
  if (isErr(res)) return res.error;
  throw new Error("Tried to unwrap Ok as Err");
}

/**
 * Extracts the successful value from an "Ok" `Result`, or returns a fallback value if it's "Err".
 * @param res The `Result` to unwrap.
 * @param fallback The value to return if `res` is "Err".
 * @returns The inner value of the "Ok" `Result`, or the fallback value.
 */
export function unwrapOr<T, E>(res: Result<T, E>, fallback: T): T {
  return isOk(res) ? res.value : fallback;
}

/**
 * Transforms the successful value inside an "Ok" `Result` using a mapping function.
 * If the `Result` is "Err", it remains "Err".
 * @param res The `Result` to map.
 * @param fn The mapping function to apply to the successful value.
 * @returns A new `Result` with the transformed value, or "Err" if the original was "Err".
 */
export function map<T, E, U>(
  res: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> {
  return isOk(res) ? Ok(fn(res.value)) : Err(res.error);
}

/**
 * Transforms the error value inside an "Err" `Result` using a mapping function.
 * If the `Result` is "Ok", it remains "Ok".
 * @param res The `Result` to map.
 * @param fn The mapping function to apply to the error value.
 * @returns A new `Result` with the transformed error, or "Ok" if the original was "Ok".
 */
export function mapErr<T, E, F>(
  res: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> {
  return isErr(res) ? Err(fn(res.error)) : Ok(res.value);
}

/**
 * Chains operations that return `Result` types.
 * If the current `Result` is "Ok", it applies the function and returns the new `Result`.
 * If it's "Err", it propagates the "Err".
 * @param res The `Result` to flatMap.
 * @param fn The function to apply, which returns another `Result`.
 * @returns A new `Result` resulting from the chained operation.
 */
export function flatMap<T, E, U>(
  res: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  return isOk(res) ? fn(res.value) : Err(res.error);
}

/**
 * Returns the `Result` if it is "Ok", otherwise returns the provided fallback `Result`.
 * @param res The original `Result`.
 * @param fallback The `Result` to return if `res` is "Err".
 * @returns The original `Result` if "Ok", or the fallback `Result` if "Err".
 */
export function orElse<T, E>(
  res: Result<T, E>,
  fallback: Result<T, E>,
): Result<T, E> {
  return isOk(res) ? res : fallback;
}

/**
 * Wraps a potentially throwing function into a function that returns a `Result`.
 * If the original function executes successfully, it returns `Ok(result)`. If it throws, it returns `Err(errorMap(e))`.
 * @param fn The function that might throw an error.
 * @param errorMap A function to transform the caught error into the desired error type `E`.
 * @returns A new function that returns a `Result`.
 */
export function fromThrowable<T, E, Args extends unknown[]>(
  fn: (...args: Args) => T,
  errorMap: (e: unknown) => E,
): (...args: Args) => Result<T, E> {
  return (...args: Args): Result<T, E> => {
    try {
      return Ok(fn(...args));
    } catch (e) {
      return Err(errorMap(e));
    }
  };
}

/**
 * Provides a way to handle both "Ok" and "Err" cases of a `Result`.
 * @param res The `Result` to match against.
 * @param onOk The function to execute if the `Result` is "Ok".
 * @param onErr The function to execute if the `Result` is "Err".
 * @returns The result of applying either `onOk` or `onErr`.
 */
export function match<T, E, R>(
  res: Result<T, E>,
  onOk: (val: T) => R,
  onErr: (err: E) => R,
): R {
  if (isOk(res)) {
    return onOk(res.value);
  } else {
    return onErr(res.error);
  }
}

