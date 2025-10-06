export interface From<T, U> {
	from(value: T): U;
}

export interface Into<U> {
	into(): U;
}

export const From = {
	impl: <T, U>(f: (value: T) => U): From<T, U> => ({ from: f }),
};

export const Into = {
	of: <T>(value: T) => ({
		into: <U>(from: From<T, U>): U => from.from(value),
	}),
};
