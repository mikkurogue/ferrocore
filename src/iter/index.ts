export type Maybe<T> = T | undefined;

/**
 * A simple iterator class that supports map, filter, and filterMap operations.
 */
export class Iter<T> {
	private generator: Generator<T>;

	constructor(generator: Generator<T>) {
		this.generator = generator;
	}

	/**
	 * Creates an Iter instance from any iterable.
	 * @param iterable An iterable object (e.g., array, set, etc.)
	 * @returns An Iter instance wrapping the provided iterable.
	 */
	static from<T>(iterable: Iterable<T>): Iter<T> {
		return new Iter(
			(function* () {
				yield* iterable;
			})(),
		);
	}

	/**
	 * Returns the next item from the iterator.
	 * @returns An object containing the next value and a done flag.
	 */
	next(): IteratorResult<T> {
		return this.generator.next();
	}

	/**
	 * Applies a mapping function to each item in the iterator.
	 * @param fn A function that takes an item of type T and returns an item of type U.
	 * @returns A new Iter instance containing the mapped items.
	 */
	map<U>(fn: (item: T) => U): Iter<U> {
		const self = this;
		return new Iter(
			(function* () {
				for (const item of self.generator) {
					yield fn(item);
				}
			})(),
		);
	}

	/**
	 * Filters items in the iterator based on a predicate function.
	 * @param fn A function that takes an item of type T and returns a boolean indicating whether to keep the item.
	 * @returns A new Iter instance containing only the items that satisfy the predicate.
	 */
	filter(fn: (item: T) => boolean): Iter<T> {
		const self = this;
		return new Iter(
			(function* () {
				for (const item of self.generator) {
					if (fn(item)) yield item;
				}
			})(),
		);
	}

	/**
	 * Applies a function that can both map and filter items in the iterator.
	 * If the function returns undefined, the item is filtered out.
	 * @param fn A function that takes an item of type T and returns a Maybe<U> (U or undefined).
	 * @returns A new Iter instance containing the mapped items, excluding any that were filtered out.
	 */
	filterMap<U>(fn: (item: T) => Maybe<U>): Iter<U> {
		const self = this;
		return new Iter(
			(function* () {
				for (const item of self.generator) {
					const mapped = fn(item);
					if (mapped !== undefined) yield mapped;
				}
			})(),
		);
	}

	/**
	 * Collects all items from the iterator into an array.
	 * @returns An array containing all items from the iterator.
	 */
	collect(): T[] {
		return Array.from(this.generator);
	}

	/**
	 * Folds the iterator to a single value.
	 * @param initialValue The initial value of the accumulator.
	 * @param fn A function that takes an accumulator and an item and returns a new accumulator.
	 * @returns The final accumulated value.
	 */
	fold<U>(initialValue: U, fn: (acc: U, item: T) => U): U {
		let acc = initialValue;
		for (const item of this.generator) {
			acc = fn(acc, item);
		}
		return acc;
	}

	/**
	 * Searches for an element in the iterator that satisfies a predicate.
	 * @param fn A function that takes an item and returns a boolean.
	 * @returns The first item that satisfies the predicate, or undefined if no such item is found.
	 */
	find(fn: (item: T) => boolean): T | undefined {
		for (const item of this.generator) {
			if (fn(item)) {
				return item;
			}
		}
		return undefined;
	}

	/**
	 * Flattens an iterator of iterables into a single iterator.
	 * @returns A new Iter instance containing all items from the nested iterables.
	 */
	flatten<InnerT>(this: Iter<Iterable<InnerT>>): Iter<InnerT> {
		const self = this;
		return new Iter(
			(function* () {
				for (const iterable of self.generator) {
					yield* iterable;
				}
			})(),
		);
	}

	/**
	 * Creates an iterator that yields the first `n` elements.
	 * @param n The number of elements to take.
	 * @returns A new Iter instance that will yield at most `n` elements.
	 */
	take(n: number): Iter<T> {
		const self = this;
		return new Iter(
			(function* () {
				let i = 0;
				for (const item of self.generator) {
					if (i >= n) {
						break;
					}
					yield item;
					i++;
				}
			})(),
		);
	}

	/**
	 * Creates an iterator that skips the first `n` elements.
	 * @param n The number of elements to skip.
	 * @returns A new Iter instance that will skip the first `n` elements.
	 */
	skip(n: number): Iter<T> {
		const self = this;
		return new Iter(
			(function* () {
				let i = 0;
				for (const item of self.generator) {
					if (i < n) {
						i++;
						continue;
					}
					yield item;
				}
			})(),
		);
	}

	/**
	 * Creates an iterator that yields the current count and the element.
	 * @returns A new Iter instance that yields tuples of `[index, item]`.
	 */
	enumerate(): Iter<[number, T]> {
		const self = this;
		return new Iter(
			(function* () {
				let i = 0;
				for (const item of self.generator) {
					yield [i, item];
					i++;
				}
			})(),
		);
	}

	/**
	 * Chains this iterator with another.
	 * @param other The other iterator to chain.
	 * @returns A new Iter instance that will yield all items from this iterator, then all items from the other iterator.
	 */
	chain(other: Iter<T>): Iter<T> {
		const self = this;
		return new Iter(
			(function* () {
				yield* self.generator;
				yield* other.generator;
			})(),
		);
	}

	/**
	 * Zips this iterator with another.
	 * @param other The other iterator to zip with.
	 * @returns A new Iter instance that will yield pairs of `[this_item, other_item]`.
	 */
	zip<U>(other: Iter<U>): Iter<[T, U]> {
		const self = this;
		return new Iter(
			(function* () {
				while (true) {
					const a = self.next();
					const b = other.next();
					if (a.done || b.done) {
						break;
					}
					yield [a.value, b.value];
				}
			})(),
		);
	}

	/**
	 * Tests if every element of the iterator matches a predicate.
	 * @param fn A function that takes an item and returns a boolean.
	 * @returns `true` if every element matches the predicate, `false` otherwise.
	 */
	all(fn: (item: T) => boolean): boolean {
		for (const item of this.generator) {
			if (!fn(item)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Tests if any element of the iterator matches a predicate.
	 * @param fn A function that takes an item and returns a boolean.
	 * @returns `true` if any element matches the predicate, `false` otherwise.
	 */
	any(fn: (item: T) => boolean): boolean {
		for (const item of this.generator) {
			if (fn(item)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Consumes the iterator, counting the number of iterations and returning it.
	 * @returns The number of elements in the iterator.
	 */
	count(): number {
		return this.collect().length;
	}

	/**
	 * Consumes the iterator and returns the last element.
	 * @returns The last element of the iterator, or `undefined` if it is empty.
	 */
	last(): T | undefined {
		let last: T | undefined;
		for (const item of this.generator) {
			last = item;
		}
		return last;
	}

	/**
	 * Returns the `n`-th element of the iterator.
	 * @param n The index of the element to return.
	 * @returns The `n`-th element, or `undefined` if `n` is out of bounds.
	 */
	nth(n: number): T | undefined {
		return this.skip(n).next().value;
	}

	/**
	 * Maps a function over the iterator and flattens the result.
	 * @param fn A function that takes an item and returns an iterable.
	 * @returns A new Iter instance with the mapped and flattened items.
	 */
	flatMap<U>(fn: (item: T) => Iterable<U>): Iter<U> {
		return this.map(fn).flatten();
	}

	/**
	 * Does something with each element of an iterator, but passes the element through.
	 * @param fn A function to call on each element.
	 * @returns A new Iter instance that will have the same elements as the original.
	 */
	inspect(fn: (item: T) => void): Iter<T> {
		const self = this;
		return new Iter(
			(function* () {
				for (const item of self.generator) {
					fn(item);
					yield item;
				}
			})(),
		);
	}

	/**
	 * Returns the index of the first element that satisfies a predicate.
	 * @param fn A function that takes an item and returns a boolean.
	 * @returns The index of the first matching element, or `undefined` if no element matches.
	 */
	position(fn: (item: T) => boolean): number | undefined {
		let i = 0;
		for (const item of this.generator) {
			if (fn(item)) {
				return i;
			}
			i++;
		}
		return undefined;
	}

	/**
	 * Returns the maximum element of an iterator.
	 * @returns The maximum element, or `undefined` if the iterator is empty.
	 */
	max(): T | undefined {
		let maxVal: T | undefined;
		for (const item of this.generator) {
			if (maxVal === undefined) {
				maxVal = item;
			} else if (item > maxVal!) {
				maxVal = item;
			}
		}
		return maxVal;
	}

	/**
	 * Returns the minimum element of an iterator.
	 * @returns The minimum element, or `undefined` if the iterator is empty.
	 */
	min(): T | undefined {
		let minVal: T | undefined;
		for (const item of this.generator) {
			if (minVal === undefined) {
				minVal = item;
			} else if (item < minVal!) {
				minVal = item;
			}
		}
		return minVal;
	}

	/**
	 * Sums the elements of an iterator.
	 * This method is only available on iterators of numbers.
	 * @returns The sum of the elements.
	 */
	sum(this: Iter<number>): number {
		return this.fold(0, (acc, item) => acc + item);
	}

	/**
	 * Multiplies the elements of an iterator.
	 * This method is only available on iterators of numbers.
	 * @returns The product of the elements.
	 */
	product(this: Iter<number>): number {
		return this.fold(1, (acc, item) => acc * item);
	}
}
