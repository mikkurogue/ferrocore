import { test, expect } from "vitest";
import { Option, Some, None, fromNullable } from "../option";
import { Result, Ok, Err } from "../result";
import { Iter } from "../iter";

test("Option.some holds value", () => {
	const value = Option.some(123);
	expect(value.isSome()).toBe(true);
	expect(value.isNone()).toBe(false);
});

test("Option.none is none", () => {
	const value = Option.none();
	expect(value.isNone()).toBe(true);
	expect(value.isSome()).toBe(false);
});

test("Option.fromNullable null value returns none", () => {
	const val = Option.fromNullable(null);
	expect(val.isNone()).toBe(true);
});

test("Option.fromNullable undefined value returns none", () => {
	const val = Option.fromNullable(undefined);
	expect(val.isNone()).toBe(true);
});

test("Option.fromNullable non-null value returns some", () => {
	const val = Option.fromNullable(123);
	expect(val.isSome()).toBe(true);
	expect(val.unwrap()).toBe(123);
});

test("unwrap Some returns value", () => {
	expect(Option.some(5).unwrap()).toBe(5);
});

test("unwrap None throws error", () => {
	expect(() => Option.none().unwrap()).toThrow("Called unwrap on a None value");
});

test("unwrapOr Some returns value", () => {
	expect(Option.some(5).unwrapOr(10)).toBe(5);
});

test("unwrapOr None returns fallback", () => {
	expect(Option.none().unwrapOr(10)).toBe(10);
});

test("map transforms Some value", () => {
	const result = Option.some(5).map((x: number) => x * 2);
	expect(result.isSome()).toBe(true);
	expect(result.unwrap()).toBe(10);
});

test("map does not transform None", () => {
	const result = Option.none().map((x: number) => x * 2);
	expect(result.isNone()).toBe(true);
});

test("flatMap chains Some values", () => {
	const result = Option.some(5).flatMap((x: number) => Option.some(x * 2));
	expect(result.isSome()).toBe(true);
	expect(result.unwrap()).toBe(10);
});

test("flatMap propagates None", () => {
	const result = Option.some(5).flatMap((x: number) => Option.none());
	expect(result.isNone()).toBe(true);
});

test("flatMap handles initial None", () => {
	const result = Option.none().flatMap((x: number) => Option.some(x * 2));
	expect(result.isNone()).toBe(true);
});

test("Option.orElse returns original Some", () => {
	const result = Option.orElse(Option.some(5), Option.some(10));
	expect(result.isSome()).toBe(true);
	expect(result.unwrap()).toBe(5);
});

test("Option.orElse does not evaluate fallback for Some", () => {
	const result = Option.orElse(Option.some(5), Option.none());
	expect(result.isSome()).toBe(true);
	expect(result.unwrap()).toBe(5);
});

test("Option.orElse returns fallback for None", () => {
	const result = Option.orElse(Option.none(), Option.some(10));
	expect(result.isSome()).toBe(true);
	expect(result.unwrap()).toBe(10);
});

test("Option.filter returns Some if predicate is true", () => {
	const result = Option.filter(Option.some(5), (x: number) => x > 0);
	expect(result.isSome()).toBe(true);
	expect(result.unwrap()).toBe(5);
});

test("Option.filter returns None if predicate is false", () => {
	const result = Option.filter(Option.some(5), (x: number) => x < 0);
	expect(result.isNone()).toBe(true);
});

test("Option.filter returns None for initial None", () => {
	const result = Option.filter(Option.none(), (x: number) => x > 0);
	expect(result.isNone()).toBe(true);
});

test("Option.match Some returns Some of result", () => {
	const result = Option.match(
		Option.some(10),
		(val: number) => val * 2,
		() => 0,
	);
	expect(result).toBe(20);
});

test("Option.match None returns Some of result", () => {
	const result = Option.match(
		Option.none(),
		(val: never) => val,
		() => "default",
	);
	expect(result).toBe("default");
});

test("Option.fromThrowable returns Some on success", () => {
	const safeDivide = Option.fromThrowable((a: number, b: number) => {
		if (b === 0) throw new Error("Division by zero");
		return a / b;
	});
	const result = safeDivide(10, 2);
	expect(result.isSome()).toBe(true);
	expect(result.unwrap()).toBe(5);
});

test("Option.fromThrowable returns None on error", () => {
	const safeDivide = Option.fromThrowable((a: number, b: number) => {
		if (b === 0) throw new Error("Division by zero");
		return a / b;
	});
	const result = safeDivide(10, 0);
	expect(result.isNone()).toBe(true);
});

// Result Type Tests

test("Result.ok holds value", () => {
	const value = Result.ok(123);
	expect(value.isOk()).toBe(true);
	expect(value.isErr()).toBe(false);
});

test("Result.err holds error", () => {
	const error = Result.err("Something went wrong");
	expect(error.isErr()).toBe(true);
	expect(error.isOk()).toBe(false);
});

test("unwrap Ok returns value", () => {
	expect(Result.ok(5).unwrap()).toBe(5);
});

test("unwrap Err throws error", () => {
	expect(() => Result.err("Error").unwrap()).toThrow(
		"Called unwrap on an Err value",
	);
});

test("unwrapErr Err returns error", () => {
	expect(Result.err("Error").unwrapErr()).toBe("Error");
});

test("unwrapErr Ok throws error", () => {
	expect(() => Result.ok(5).unwrapErr()).toThrow(
		"Called unwrapErr on an Ok value",
	);
});

test("unwrapOr Ok returns value", () => {
	expect(Result.ok(5).unwrapOr(10)).toBe(5);
});

test("unwrapOr Err returns fallback", () => {
	expect(Result.err("Error").unwrapOr(10)).toBe(10);
});

test("map transforms Ok value", () => {
	const result = Result.ok(5).map((x: number) => x * 2);
	expect(result.isOk()).toBe(true);
	expect(result.unwrap()).toBe(10);
});

test("map does not transform Err", () => {
	const result = Result.err<number, string>("Error").map((x: number) => x * 2);
	expect(result.isErr()).toBe(true);
	expect(result.unwrapErr()).toBe("Error");
});

test("mapErr transforms Err value", () => {
	const result = Result.err<number, Error>(new Error("Original")).mapErr(
		(e: Error) => e.message,
	);
	expect(result.isErr()).toBe(true);
	expect(result.unwrapErr()).toBe("Original");
});

test("mapErr does not transform Ok", () => {
	const result = Result.ok<number, Error>(5).mapErr((e: Error) => e.message);
	expect(result.isOk()).toBe(true);
	expect(result.unwrap()).toBe(5);
});

test("flatMap chains Ok values", () => {
	const result = Result.ok(5).flatMap((x: number) => Result.ok(x * 2));
	expect(result.isOk()).toBe(true);
	expect(result.unwrap()).toBe(10);
});

test("flatMap propagates Err", () => {
	const result = Result.ok(5).flatMap((x: number) =>
		Result.err<number, string>("Error from flatMap"),
	);
	expect(result.isErr()).toBe(true);
	expect(result.unwrapErr()).toBe("Error from flatMap");
});

test("flatMap handles initial Err", () => {
	const result = Result.err<number, string>("Initial error").flatMap(
		(x: number) => Result.ok(x * 2),
	);
	expect(result.isErr()).toBe(true);
	expect(result.unwrapErr()).toBe("Initial error");
});

test("Result.orElse returns original Ok", () => {
	const result = Result.orElse(Result.ok(5), Result.ok(10));
	expect(result.isOk()).toBe(true);
	expect(result.unwrap()).toBe(5);
});

test("Result.orElse does not evaluate fallback for Ok", () => {
	const result = Result.orElse(Result.ok(5), Result.err("Error"));
	expect(result.isOk()).toBe(true);
	expect(result.unwrap()).toBe(5);
});

test("Result.orElse returns fallback for Err", () => {
	const result = Result.orElse(Result.err("Error"), Result.ok(10));
	expect(result.isOk()).toBe(true);
	expect(result.unwrap()).toBe(10);
});

test("Result.fromThrowable returns Ok on success", () => {
	const safeDivide = Result.fromThrowable(
		(a: number, b: number) => {
			if (b === 0) throw new Error("Division by zero");
			return a / b;
		},
		(e: unknown) => (e as Error).message,
	);
	const result = safeDivide(10, 2);
	expect(result.isOk()).toBe(true);
	expect(result.unwrap()).toBe(5);
});

test("Result.fromThrowable returns Err on error", () => {
	const safeDivide = Result.fromThrowable(
		(a: number, b: number) => {
			if (b === 0) throw new Error("Division by zero");
			return a / b;
		},
		(e: unknown) => (e as Error).message,
	);
	const result = safeDivide(10, 0);
	expect(result.isErr()).toBe(true);
	expect(result.unwrapErr()).toBe("Division by zero");
});

test("Result.match calls onOk for Ok", () => {
	const result = Result.match(
		Result.ok<number, string>(10),
		(val: number) => val * 2,
		(err: string) => 0,
	);
	expect(result).toBe(20);
});

test("Result.match calls onErr for Err", () => {
	const result = Result.match(
		Result.err<number, string>("Error"),
		(val: number) => val * 2,
		(err: string) => err.length,
	);
	expect(result).toBe(5);
});

// Iter Type Tests
test("Iter.from creates an iterator", () => {
	const iter = Iter.from([1, 2, 3]);
	expect(iter.collect()).toEqual([1, 2, 3]);
});

test("map transforms items", () => {
	const iter = Iter.from([1, 2, 3]).map((x) => x * 2);
	expect(iter.collect()).toEqual([2, 4, 6]);
});

test("filter keeps items that satisfy the predicate", () => {
	const iter = Iter.from([1, 2, 3, 4]).filter((x) => x % 2 === 0);
	expect(iter.collect()).toEqual([2, 4]);
});

test("filterMap transforms and filters items", () => {
	const iter = Iter.from([1, 2, 3, 4]).filterMap((x) =>
		x % 2 === 0 ? x * 2 : undefined,
	);
	expect(iter.collect()).toEqual([4, 8]);
});

test("fold folds the iterator into a single value", () => {
	const sum = Iter.from([1, 2, 3, 4]).fold(0, (acc, x) => acc + x);
	expect(sum).toBe(10);
});

test("fold on an empty iterator returns the initial value", () => {
	const sum = Iter.from<number>([]).fold(0, (acc, x) => acc + x);
	expect(sum).toBe(0);
});

test("find returns the first item that satisfies the predicate", () => {
	const found = Iter.from([1, 2, 3, 4]).find((x) => x > 2);
	expect(found).toBe(3);
});

test("find returns undefined if no item satisfies the predicate", () => {
	const found = Iter.from([1, 2, 3, 4]).find((x) => x > 5);
	expect(found).toBeUndefined();
});

test("complex chain of operations", () => {
	const result = Iter.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
		.filter((x) => x % 2 === 0) // 2, 4, 6, 8, 10
		.map((x) => x * 3) // 6, 12, 18, 24, 30
		.filterMap((x) => (x > 20 ? x : undefined)) // 24, 30
		.fold(0, (acc, x) => acc + x); // 54
	expect(result).toBe(54);
});

test("find after map", () => {
	const found = Iter.from([1, 2, 3, 4])
		.map((x) => x * 2) // 2, 4, 6, 8
		.find((x) => x > 5); // 6
	expect(found).toBe(6);
});

test("flatten flattens an iterator of iterables", () => {
	const iter = Iter.from([
		[1, 2],
		[3, 4],
		[5, 6],
	]);
	const flattened = iter.flatten();
	expect(flattened.collect()).toEqual([1, 2, 3, 4, 5, 6]);
});

test("flatten with empty iterables", () => {
	const iter = Iter.from([[], [1, 2], [], [3, 4], []]);
	const flattened = iter.flatten();
	expect(flattened.collect()).toEqual([1, 2, 3, 4]);
});

test("flatten with empty iterator", () => {
	const iter = Iter.from<number[][]>([]);
	const flattened = iter.flatten();
	expect(flattened.collect()).toEqual([]);
});

test("take returns the first n elements", () => {
	const iter = Iter.from([1, 2, 3, 4, 5]).take(3);
	expect(iter.collect()).toEqual([1, 2, 3]);
});

test("take with n > length returns all elements", () => {
	const iter = Iter.from([1, 2, 3]).take(5);
	expect(iter.collect()).toEqual([1, 2, 3]);
});

test("take with n = 0 returns an empty iterator", () => {
	const iter = Iter.from([1, 2, 3]).take(0);
	expect(iter.collect()).toEqual([]);
});

test("take from an empty iterator returns an empty iterator", () => {
	const iter = Iter.from<number>([]).take(3);
	expect(iter.collect()).toEqual([]);
});

test("skip skips the first n elements", () => {
	const iter = Iter.from([1, 2, 3, 4, 5]).skip(3);
	expect(iter.collect()).toEqual([4, 5]);
});

test("skip with n > length returns an empty iterator", () => {
	const iter = Iter.from([1, 2, 3]).skip(5);
	expect(iter.collect()).toEqual([]);
});

test("skip with n = 0 returns all elements", () => {
	const iter = Iter.from([1, 2, 3]).skip(0);
	expect(iter.collect()).toEqual([1, 2, 3]);
});

test("skip from an empty iterator returns an empty iterator", () => {
	const iter = Iter.from<number>([]).skip(3);
	expect(iter.collect()).toEqual([]);
});

test("enumerate yields [index, item] tuples", () => {
	const iter = Iter.from(["a", "b", "c"]).enumerate();
	expect(iter.collect()).toEqual([
		[0, "a"],
		[1, "b"],
		[2, "c"],
	]);
});

test("enumerate on an empty iterator returns an empty iterator", () => {
	const iter = Iter.from<string>([]).enumerate();
	expect(iter.collect()).toEqual([]);
});

test("chaining take and skip", () => {
	const iter = Iter.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).skip(2).take(3);
	expect(iter.collect()).toEqual([3, 4, 5]);
});

test("chaining skip and take", () => {
	const iter = Iter.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).take(5).skip(2);
	expect(iter.collect()).toEqual([3, 4, 5]);
});

test("chain combines two iterators", () => {
	const iter1 = Iter.from([1, 2, 3]);
	const iter2 = Iter.from([4, 5, 6]);
	const chained = iter1.chain(iter2);
	expect(chained.collect()).toEqual([1, 2, 3, 4, 5, 6]);
});

test("zip combines two iterators into pairs", () => {
	const iter1 = Iter.from([1, 2, 3]);
	const iter2 = Iter.from(["a", "b", "c"]);
	const zipped = iter1.zip(iter2);
	expect(zipped.collect()).toEqual([
		[1, "a"],
		[2, "b"],
		[3, "c"],
	]);
});

test("zip with iterators of different lengths", () => {
	const iter1 = Iter.from([1, 2]);
	const iter2 = Iter.from(["a", "b", "c"]);
	const zipped = iter1.zip(iter2);
	expect(zipped.collect()).toEqual([
		[1, "a"],
		[2, "b"],
	]);
});

test("all returns true if all elements match", () => {
	const result = Iter.from([2, 4, 6]).all((x) => x % 2 === 0);
	expect(result).toBe(true);
});

test("all returns false if any element does not match", () => {
	const result = Iter.from([2, 3, 6]).all((x) => x % 2 === 0);
	expect(result).toBe(false);
});

test("any returns true if any element matches", () => {
	const result = Iter.from([1, 3, 4]).any((x) => x % 2 === 0);
	expect(result).toBe(true);
});

test("any returns false if no elements match", () => {
	const result = Iter.from([1, 3, 5]).any((x) => x % 2 === 0);
	expect(result).toBe(false);
});

test("count returns the number of elements", () => {
	const count = Iter.from([1, 2, 3, 4, 5]).count();
	expect(count).toBe(5);
});

test("count on an empty iterator returns 0", () => {
	const count = Iter.from([]).count();
	expect(count).toBe(0);
});

test("last returns the last element", () => {
	const last = Iter.from([1, 2, 3]).last();
	expect(last).toBe(3);
});

test("last on an empty iterator returns undefined", () => {
	const last = Iter.from([]).last();
	expect(last).toBeUndefined();
});

test("nth returns the element at the given index", () => {
	const nth = Iter.from(["a", "b", "c", "d"]).nth(2);
	expect(nth).toBe("c");
});

test("nth with index out of bounds returns undefined", () => {
	const nth = Iter.from(["a", "b", "c"]).nth(5);
	expect(nth).toBeUndefined();
});

test("flatMap maps and flattens iterables", () => {
	const iter = Iter.from([1, 2, 3]).flatMap((x) => [x, x * 10]);
	expect(iter.collect()).toEqual([1, 10, 2, 20, 3, 30]);
});

test("flatMap with empty inner iterables", () => {
	const iter = Iter.from([1, 2, 3]).flatMap((x) => (x % 2 === 0 ? [x] : []));
	expect(iter.collect()).toEqual([2]);
});

test("inspect allows peeking at elements without modifying them", () => {
	const inspected: number[] = [];
	const iter = Iter.from([1, 2, 3])
		.inspect((x) => inspected.push(x * 2))
		.map((x) => x + 1);
	expect(iter.collect()).toEqual([2, 3, 4]);
	expect(inspected).toEqual([2, 4, 6]);
});

test("position returns the index of the first matching element", () => {
	const index = Iter.from([10, 20, 30, 40]).position((x) => x === 30);
	expect(index).toBe(2);
});

test("position returns undefined if no element matches", () => {
	const index = Iter.from([10, 20, 30, 40]).position((x) => x === 50);
	expect(index).toBeUndefined();
});

test("max returns the maximum element", () => {
	const max = Iter.from([1, 5, 2, 8, 3]).max();
	expect(max).toBe(8);
});

test("max on an empty iterator returns undefined", () => {
	const max = Iter.from<number>([]).max();
	expect(max).toBeUndefined();
});

test("min returns the minimum element", () => {
	const min = Iter.from([1, 5, 2, 8, 3]).min();
	expect(min).toBe(1);
});

test("min on an empty iterator returns undefined", () => {
	const min = Iter.from<number>([]).min();
	expect(min).toBeUndefined();
});

test("sum returns the sum of elements", () => {
	const sum = Iter.from([1, 2, 3, 4, 5]).sum();
	expect(sum).toBe(15);
});

test("sum on an empty iterator returns 0", () => {
	const sum = Iter.from<number>([]).sum();
	expect(sum).toBe(0);
});

test("product returns the product of elements", () => {
	const product = Iter.from([1, 2, 3, 4, 5]).product();
	expect(product).toBe(120);
});

test("product on an empty iterator returns 1", () => {
	const product = Iter.from<number>([]).product();
	expect(product).toBe(1);
});
