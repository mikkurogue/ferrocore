import { test, expect, describe } from "vitest";
import "../array";

describe("Array.prototype.sum", () => {
	test("sums an array of numbers", () => {
		const numbers = [1, 2, 3, 4, 5];
		expect(numbers.sum()).toBe(15);
	});

	test("returns 0 for empty array", () => {
		const numbers: number[] = [];
		expect(numbers.sum()).toBe(0);
	});

	test("handles negative numbers", () => {
		const numbers = [1, -2, 3, -4, 5];
		expect(numbers.sum()).toBe(3);
	});

	test("handles decimal numbers", () => {
		const numbers = [1.5, 2.5, 3.0];
		expect(numbers.sum()).toBe(7);
	});

	test("sums objects by key", () => {
		const items = [
			{ value: 10, name: "a" },
			{ value: 20, name: "b" },
			{ value: 30, name: "c" },
		];
		expect(items.sum("value")).toBe(60);
	});

	test("sums objects with different keys", () => {
		const items = [
			{ price: 100, quantity: 1 },
			{ price: 200, quantity: 2 },
			{ price: 300, quantity: 3 },
		];
		expect(items.sum("price")).toBe(600);
		expect(items.sum("quantity")).toBe(6);
	});

	test("throws error for non-numeric values without key", () => {
		const invalid = [1, 2, "three", 4] as unknown as number[];
		expect(() => invalid.sum()).toThrow(TypeError);
		expect(() => invalid.sum()).toThrow(
			"Array.sum() requires all elements to be numbers",
		);
	});

	test("throws error for objects without key parameter", () => {
		const objects = [{ value: 1 }, { value: 2 }] as unknown as number[];
		expect(() => objects.sum()).toThrow(TypeError);
	});

	test("throws error for objects with missing key", () => {
		const items = [
			{ value: 10 },
			{ value: 20 },
			{ other: 30 },
		] as unknown as Array<{ value: number }>;
		expect(() => items.sum("value")).toThrow(TypeError);
	});

	test("throws error for objects with non-numeric key", () => {
		const items = [
			{ value: 10 },
			{ value: "twenty" },
		] as unknown as Array<{ value: number }>;
		expect(() => items.sum("value")).toThrow(TypeError);
	});

	test("handles single element array", () => {
		expect([42].sum()).toBe(42);
	});

	test("handles zero in array", () => {
		expect([1, 0, 2, 0, 3].sum()).toBe(6);
	});
});

describe("Array.prototype.product", () => {
	test("calculates product of an array of numbers", () => {
		const numbers = [2, 3, 4];
		expect(numbers.product()).toBe(24);
	});

	test("returns 1 for empty array", () => {
		const numbers: number[] = [];
		expect(numbers.product()).toBe(1);
	});

	test("handles negative numbers", () => {
		const numbers = [2, -3, 4];
		expect(numbers.product()).toBe(-24);
	});

	test("handles decimal numbers", () => {
		const numbers = [2.5, 2, 2];
		expect(numbers.product()).toBe(10);
	});

	test("multiplies objects by key", () => {
		const items = [
			{ value: 2, name: "a" },
			{ value: 3, name: "b" },
			{ value: 4, name: "c" },
		];
		expect(items.product("value")).toBe(24);
	});

	test("multiplies objects with different keys", () => {
		const items = [
			{ price: 2, quantity: 10 },
			{ price: 3, quantity: 5 },
			{ price: 4, quantity: 2 },
		];
		expect(items.product("price")).toBe(24);
		expect(items.product("quantity")).toBe(100);
	});

	test("throws error for non-numeric values without key", () => {
		const invalid = [2, 3, "four", 5] as unknown as number[];
		expect(() => invalid.product()).toThrow(TypeError);
		expect(() => invalid.product()).toThrow(
			"Array.product() requires all elements to be numbers",
		);
	});

	test("throws error for objects without key parameter", () => {
		const objects = [{ value: 2 }, { value: 3 }] as unknown as number[];
		expect(() => objects.product()).toThrow(TypeError);
	});

	test("throws error for objects with missing key", () => {
		const items = [
			{ value: 2 },
			{ value: 3 },
			{ other: 4 },
		] as unknown as Array<{ value: number }>;
		expect(() => items.product("value")).toThrow(TypeError);
	});

	test("throws error for objects with non-numeric key", () => {
		const items = [
			{ value: 2 },
			{ value: "three" },
		] as unknown as Array<{ value: number }>;
		expect(() => items.product("value")).toThrow(TypeError);
	});

	test("handles single element array", () => {
		expect([42].product()).toBe(42);
	});

	test("handles zero in array", () => {
		expect([1, 2, 0, 3].product()).toBe(0);
	});

	test("handles one in array", () => {
		expect([2, 1, 3, 1, 4].product()).toBe(24);
	});
});

describe("Array utilities TypeScript types", () => {
	test("number arrays work without key", () => {
		const numbers: number[] = [1, 2, 3];
		const sum: number = numbers.sum();
		const product: number = numbers.product();
		expect(sum).toBe(6);
		expect(product).toBe(6);
	});

	test("object arrays require key parameter", () => {
		type Item = { value: number; count: number };
		const items: Item[] = [
			{ value: 10, count: 2 },
			{ value: 20, count: 3 },
		];

		// These should work with type safety
		const sumValue: number = items.sum("value");
		const sumCount: number = items.sum("count");
		const productValue: number = items.product("value");
		const productCount: number = items.product("count");

		expect(sumValue).toBe(30);
		expect(sumCount).toBe(5);
		expect(productValue).toBe(200);
		expect(productCount).toBe(6);
	});
});
