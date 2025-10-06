/**
 * Global type augmentations for ferrocore
 * This file ensures type definitions are available throughout the project
 */

declare global {
	interface Array<T> {
		/**
		 * Calculates the sum of all elements in the array.
		 * - For arrays of numbers: returns the sum of all numbers
		 * - For arrays of objects: requires a key parameter to specify which property to sum
		 * @param key Optional key for object arrays to specify which property to sum
		 * @returns The sum of the elements
		 * @throws Error if the array contains non-numeric values when no key is provided
		 * @throws Error if the specified key does not exist or is not a number
		 */
		sum(this: number[]): number;
		sum<K extends keyof T>(
			this: Array<T>,
			key: T[K] extends number ? K : never,
		): number;

		/**
		 * Calculates the product of all elements in the array.
		 * - For arrays of numbers: returns the product of all numbers
		 * - For arrays of objects: requires a key parameter to specify which property to multiply
		 * @param key Optional key for object arrays to specify which property to multiply
		 * @returns The product of the elements
		 * @throws Error if the array contains non-numeric values when no key is provided
		 * @throws Error if the specified key does not exist or is not a number
		 */
		product(this: number[]): number;
		product<K extends keyof T>(
			this: Array<T>,
			key: T[K] extends number ? K : never,
		): number;
	}
}

export {};
