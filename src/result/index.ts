/**
 * Represents a value that is either a success (`Ok`) or a failure (`Err`).
 * This is an abstract class that serves as the base for `Ok` and `Err`.
 * Use the static factory methods `Result.ok()` and `Result.err()` to create instances.
 */
export abstract class Result<T, E> {
	/**
	 * Creates a `Result` that represents a successful outcome.
	 * @param value The successful value.
	 * @returns An `Ok` instance.
	 */
	public static ok<T, E>(value: T): Result<T, E> {
		return new Ok(value);
	}

	/**
	 * Creates a `Result` that represents a failed outcome.
	 * @param error The error value.
	 * @returns An `Err` instance.
	 */
	public static err<T, E>(error: E): Result<T, E> {
		return new Err(error);
	}

	/**
	 * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value,
	 * leaving an `Ok` value untouched.
	 * @param result The result to map.
	 * @param f The function to apply to the error if it's `Err`.
	 * @returns A `Result<T, F>`.
	 */
	public static mapErr<T, E, F>(
		result: Result<T, E>,
		f: (error: E) => F,
	): Result<T, F> {
		if (result.isErr()) {
			return Result.err(f(result.unwrapErr()));
		}
		return Result.ok((result as Ok<T, E>).unwrap());
	}

	/**
	 * Returns the first `Result` if it is `Ok`, otherwise returns the second `Result`.
	 * @param result1 The first result.
	 * @param result2 The second result.
	 * @returns A `Result`.
	 */
	public static orElse<T, E>(
		result1: Result<T, E>,
		result2: Result<T, E>,
	): Result<T, E> {
		return result1.isOk() ? result1 : result2;
	}

	/**
	 * Matches the `Result` and applies the appropriate function.
	 * @param result The result to match.
	 * @param onOk The function to apply if the result is `Ok`.
	 * @param onErr The function to apply if the result is `Err`.
	 * @returns The result of applying the appropriate function.
	 */
	public static match<T, E, U>(
		result: Result<T, E>,
		onOk: (value: T) => U,
		onErr: (error: E) => U,
	): U {
		return result.isOk() ? onOk(result.unwrap()) : onErr(result.unwrapErr());
	}

	/**
	 * Creates a function that returns a `Result` from a potentially throwing function.
	 * If the function executes successfully, returns `Ok(result)`.
	 * If the function throws an error, returns `Err(mappedError)`.
	 * @param fn The function that might throw an error.
	 * @param errorMapper A function to map the thrown error to the error type `E`.
	 * @returns A new function that returns a `Result`.
	 */
	public static fromThrowable<T, E, Args extends unknown[]>(
		fn: (...args: Args) => T,
		errorMapper: (e: unknown) => E,
	): (...args: Args) => Result<T, E> {
		return (...args: Args): Result<T, E> => {
			try {
				return Result.ok(fn(...args));
			} catch (_e) {
				return Result.err(errorMapper(_e));
			}
		};
	}

	/**
	 * Returns `true` if the result is `Ok`.
	 */
	public abstract isOk(): this is Ok<T, E>;

	/**
	 * Returns `true` if the result is `Err`.
	 */
	public abstract isErr(): this is Err<T, E>;

	/**
	 * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value,
	 * leaving an `Err` value untouched.
	 * @param f The function to apply to the value if it's `Ok`.
	 * @returns A `Result<U, E>`.
	 */
	public abstract map<U>(f: (value: T) => U): Result<U, E>;

	/**
	 * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value,
	 * leaving an `Ok` value untouched.
	 * @param f The function to apply to the error if it's `Err`.
	 * @returns A `Result<T, F>`.
	 */
	public abstract mapErr<F>(f: (error: E) => F): Result<T, F>;

	/**
	 * Returns `Err` if the result is `Err`, otherwise calls `f` with the wrapped value
	 * and returns the result.
	 * @param f The function to apply to the value if it's `Ok`.
	 * @returns A `Result<U, E>`.
	 */
	public abstract flatMap<U>(f: (value: T) => Result<U, E>): Result<U, E>;

	/**
	 * Returns the contained `Ok` value, or throws an error if the result is `Err`.
	 * @param message The error message to throw if the result is `Err`.
	 * @returns The contained value.
	 * @throws {Error} If the result is `Err`.
	 */
	public abstract unwrap(message?: string): T;

	/**
	 * Returns the contained `Err` value, or throws an error if the result is `Ok`.
	 * @param message The error message to throw if the result is `Ok`.
	 * @returns The contained error.
	 * @throws {Error} If the result is `Ok`.
	 */
	public abstract unwrapErr(message?: string): E;

	/**
	 * Returns the contained `Ok` value or a provided default.
	 * @param defaultValue The default value to return if the result is `Err`.
	 * @returns The contained value or the default value.
	 */
	public abstract unwrapOr(defaultValue: T): T;
}

/**
 * Represents a successful `Result`.
 */
export class Ok<T, E> extends Result<T, E> {
	public constructor(private readonly value: T) {
		super();
	}

	public isOk(): this is Ok<T, E> {
		return true;
	}

	public isErr(): this is Err<T, E> {
		return false;
	}

	public map<U>(f: (value: T) => U): Result<U, E> {
		return Result.ok(f(this.value));
	}

	public mapErr<F>(_f: (error: E) => F): Result<T, F> {
		return Result.ok(this.value);
	}

	public flatMap<U>(f: (value: T) => Result<U, E>): Result<U, E> {
		return f(this.value);
	}

	public unwrap(_message?: string): T {
		return this.value;
	}

	public unwrapErr(message: string = "Called unwrapErr on an Ok value"): E {
		throw new Error(message);
	}

	public unwrapOr(_defaultValue: T): T {
		return this.value;
	}
}

/**
 * Represents a failed `Result`.
 */
export class Err<T, E> extends Result<T, E> {
	public constructor(private readonly error: E) {
		super();
	}

	public isOk(): this is Ok<T, E> {
		return false;
	}

	public isErr(): this is Err<T, E> {
		return true;
	}

	public map<U>(_f: (value: T) => U): Result<U, E> {
		return Result.err(this.error);
	}

	public mapErr<F>(f: (error: E) => F): Result<T, F> {
		return Result.err(f(this.error));
	}

	public flatMap<U>(_f: (value: T) => Result<U, E>): Result<U, E> {
		return Result.err(this.error);
	}

	public unwrap(message: string = "Called unwrap on an Err value"): T {
		throw new Error(message);
	}

	public unwrapErr(_message?: string): E {
		return this.error;
	}

	public unwrapOr(defaultValue: T): T {
		return defaultValue;
	}
}
