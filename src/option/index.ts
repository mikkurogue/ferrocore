/**
 * Represents an optional value: either a value of type `T` (Some) or no value (None).
 * This is an abstract class that serves as the base for `Some` and `None`.
 * Use the static factory methods `Option.some()` and `Option.none()` to create instances.
 */
export abstract class Option<T> {
	/**
	 * Creates an `Option` that contains a value.
	 * @param value The value to wrap in a `Some`.
	 * @returns A `Some` instance.
	 */
	public static some<T>(value: T): Option<T> {
		return new Some(value);
	}

	/**
	 * Creates an `Option` that contains no value.
	 * @returns A `None` instance.
	 */
	public static none(): Option<never> {
		return new None();
	}

	/**
	 * Converts a nullable value to an `Option`.
	 * Returns `Some(value)` if the value is not `null` or `undefined`, otherwise returns `None`.
	 * @param value The nullable value.
	 * @returns An `Option` representing the nullable value.
	 */
	public static fromNullable<T>(value: T | null | undefined): Option<T> {
		return value === null || value === undefined
			? Option.none()
			: Option.some(value);
	}

	/**
	 * Returns the first `Option` if it is `Some`, otherwise returns the second `Option`.
	 * @param option1 The first option.
	 * @param option2 The second option.
	 * @returns An `Option`.
	 */
	public static orElse<T>(option1: Option<T>, option2: Option<T>): Option<T> {
		return option1.isSome() ? option1 : option2;
	}

	/**
	 * Filters an `Option` based on a predicate.
	 * If the `Option` is `Some` and the predicate returns `true`, returns the original `Some`.
	 * Otherwise, returns `None`.
	 * @param option The option to filter.
	 * @param predicate The predicate function.
	 * @returns An `Option`.
	 */
	public static filter<T>(
		option: Option<T>,
		predicate: (value: T) => boolean,
	): Option<T> {
		if (option.isSome() && !predicate(option.unwrap())) {
			return Option.none();
		}
		return option;
	}

	/**
	 * Matches the `Option` and applies the appropriate function.
	 * @param option The option to match.
	 * @param onSome The function to apply if the option is `Some`.
	 * @param onNone The function to apply if the option is `None`.
	 * @returns The result of applying the appropriate function.
	 */
	public static match<T, U>(
		option: Option<T>,
		onSome: (value: T) => U,
		onNone: () => U,
	): U {
		return option.isSome() ? onSome(option.unwrap()) : onNone();
	}

	/**
	 * Creates a function that returns an `Option` from a potentially throwing function.
	 * If the function executes successfully, returns `Some(result)`.
	 * If the function throws an error, returns `None`.
	 * @param fn The function that might throw an error.
	 * @returns A new function that returns an `Option`.
	 */
	public static fromThrowable<T, Args extends unknown[]>(
		fn: (...args: Args) => T,
	): (...args: Args) => Option<T> {
		return (...args: Args): Option<T> => {
			try {
				return Option.some(fn(...args));
			} catch (_e) {
				return Option.none();
			}
		};
	}

	/**
	 * Returns `true` if the option is a `Some` value.
	 */
	public abstract isSome(): this is Some<T>;

	/**
	 * Returns `true` if the option is a `None` value.
	 */
	public abstract isNone(): this is None;

	/**
	 * Executes a side effect if the option is `Some`.
	 * @param f The function to execute with the contained value.
	 */
	public ifSome(f: (value: T) => void): void {
		if (this.isSome()) {
			f(this.unwrap());
		}
	}

	/**
	 * Maps an `Option<T>` to `Option<U>` by applying a function to a contained `Some` value,
	 * or returns a `None` if the option is `None`.
	 * @param f The function to apply to the value if it's `Some`.
	 * @returns An `Option<U>`.
	 */
	public abstract map<U>(f: (value: T) => U): Option<U>;

	/**
	 * Returns `None` if the option is `None`, otherwise calls `f` with the wrapped value
	 * and returns the result.
	 * @param f The function to apply to the value if it's `Some`.
	 * @returns An `Option<U>`.
	 */
	public abstract flatMap<U>(f: (value: T) => Option<U>): Option<U>;

	/**
	 * Returns the contained `Some` value, or throws an error if the option is `None`.
	 * @param message The error message to throw if the option is `None`.
	 * @returns The contained value.
	 * @throws {Error} If the option is `None`.
	 */
	public abstract unwrap(message?: string): T;

	/**
	 * Returns the contained `Some` value or a provided default.
	 * @param defaultValue The default value to return if the option is `None`.
	 * @returns The contained value or the default value.
	 */
	public abstract unwrapOr<U>(defaultValue: U): T | U;
}

/**
 * Represents an `Option` that contains a value.
 */
export class Some<T> extends Option<T> {
	public constructor(private readonly value: T) {
		super();
	}

	public isSome(): this is Some<T> {
		return true;
	}

	public isNone(): this is None {
		return false;
	}

	public map<U>(f: (value: T) => U): Option<U> {
		return Option.some(f(this.value));
	}

	public flatMap<U>(f: (value: T) => Option<U>): Option<U> {
		return f(this.value);
	}

	public unwrap(_message?: string): T {
		return this.value;
	}

	public unwrapOr<U>(_defaultValue: U): T | U {
		return this.value;
	}
}

/**
 * Represents an `Option` that contains no value.
 */
export class None extends Option<never> {
	public isSome(): this is Some<never> {
		return false;
	}

	public isNone(): this is None {
		return true;
	}

	public map<U>(_f: (value: never) => U): Option<U> {
		return Option.none();
	}

	public flatMap<U>(_f: (value: never) => Option<U>): Option<U> {
		return Option.none();
	}

	public unwrap(message: string = "Called unwrap on a None value"): never {
		throw new Error(message);
	}

	public unwrapOr<U>(defaultValue: U): U {
		return defaultValue;
	}
}
