/**
 * Array prototype extensions for sum and product operations.
 * Supports both arrays of numbers and arrays of objects with a specified key.
 */

/**
 * Type guard to check if a value is a number
 */
function isNumber(value: unknown): value is number {
	return typeof value === "number";
}

/**
 * Type guard to check if a value is an object with a specific key
 */
function isObjectWithKey<K extends string>(
	value: unknown,
	key: K,
): value is Record<K, number> {
	return (
		typeof value === "object" &&
		value !== null &&
		key in value &&
		typeof (value as Record<K, unknown>)[key] === "number"
	);
}

/**
 * Implementation of Array.prototype.sum
 */
Array.prototype.sum = function <T, K extends keyof T>(
	this: Array<T>,
	key?: K,
): number {
	if (this.length === 0) {
		return 0;
	}

	// If no key is provided, assume array of numbers
	if (key === undefined) {
		return this.reduce((acc: number, item: T) => {
			if (!isNumber(item)) {
				throw new TypeError(
					`Array.sum() requires all elements to be numbers when no key is provided. Got ${typeof item} at index ${this.indexOf(item)}`,
				);
			}
			return acc + item;
		}, 0);
	}

	// If key is provided, extract values from objects
	return this.reduce((acc: number, item: T) => {
		if (!isObjectWithKey(item, key as string)) {
			throw new TypeError(
				`Array.sum() requires all elements to have a numeric property '${String(key)}'. Element at index ${this.indexOf(item)} is invalid.`,
			);
		}
		return acc + (item[key as string] as number);
	}, 0);
};

/**
 * Implementation of Array.prototype.product
 */
Array.prototype.product = function <T, K extends keyof T>(
	this: Array<T>,
	key?: K,
): number {
	if (this.length === 0) {
		return 1;
	}

	// If no key is provided, assume array of numbers
	if (key === undefined) {
		return this.reduce((acc: number, item: T) => {
			if (!isNumber(item)) {
				throw new TypeError(
					`Array.product() requires all elements to be numbers when no key is provided. Got ${typeof item} at index ${this.indexOf(item)}`,
				);
			}
			return acc * item;
		}, 1);
	}

	// If key is provided, extract values from objects
	return this.reduce((acc: number, item: T) => {
		if (!isObjectWithKey(item, key as string)) {
			throw new TypeError(
				`Array.product() requires all elements to have a numeric property '${String(key)}'. Element at index ${this.indexOf(item)} is invalid.`,
			);
		}
		return acc * (item[key as string] as number);
	}, 1);
};

// Export to ensure the module is loaded
export {};
