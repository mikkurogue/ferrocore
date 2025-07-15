import { test, expect } from "vitest";
import { Option, Result } from "../";

// Option Type Tests

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
    const result = Option.match(Option.some(10), (val: number) => val * 2, () => 0);
    expect(result).toBe(20);
});

test("Option.match None returns Some of result", () => {
    const result = Option.match(Option.none(), (val: never) => val, () => "default");
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
    expect(() => Result.err("Error").unwrap()).toThrow("Called unwrap on an Err value");
});

test("unwrapErr Err returns error", () => {
    expect(Result.err("Error").unwrapErr()).toBe("Error");
});

test("unwrapErr Ok throws error", () => {
    expect(() => Result.ok(5).unwrapErr()).toThrow("Called unwrapErr on an Ok value");
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
    const result = Result.err<number, Error>(new Error("Original")).mapErr((e: Error) => e.message);
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
    const result = Result.ok(5).flatMap((x: number) => Result.err<number, string>("Error from flatMap"));
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBe("Error from flatMap");
});

test("flatMap handles initial Err", () => {
    const result = Result.err<number, string>("Initial error").flatMap((x: number) => Result.ok(x * 2));
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
    const safeDivide = Result.fromThrowable((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    }, (e: unknown) => (e as Error).message);
    const result = safeDivide(10, 2);
    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(5);
});

test("Result.fromThrowable returns Err on error", () => {
    const safeDivide = Result.fromThrowable((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    }, (e: unknown) => (e as Error).message);
    const result = safeDivide(10, 0);
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBe("Division by zero");
});

test("Result.match calls onOk for Ok", () => {
    const result = Result.match(Result.ok<number, string>(10), (val: number) => val * 2, (err: string) => 0);
    expect(result).toBe(20);
});

test("Result.match calls onErr for Err", () => {
    const result = Result.match(Result.err<number, string>("Error"), (val: number) => val * 2, (err: string) => err.length);
    expect(result).toBe(5);
});
