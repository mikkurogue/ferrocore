import { test, expect } from "vitest";
import { Option, Some, None, fromNullable } from "../option";
import { Result, Ok, Err } from "../result";

test("Some holds value", () => {
    const value = Some(123);
    expect(value.isSome()).toBe(true);
});

test("ifSome works", () => {
    let x = 0;
    Some(10).ifSome((v: number) => (x = v));
    expect(x).toBe(10);
});

test("fromNullable null value returns none", () => {
    const val = fromNullable(null);
    expect(val.isNone()).toBe(true);
})

test("unwrap Some returns value", () => {
    expect(Some(5).unwrap()).toBe(5);
});

test("unwrap None throws error", () => {
    expect(() => None().unwrap()).toThrow("Tried to unwrap None");
});

test("unwrapOr Some returns value", () => {
    expect(Some(5).unwrapOr(10)).toBe(5);
});

test("unwrapOr None returns fallback", () => {
    expect(None().unwrapOr(10)).toBe(10);
});

test("map transforms Some value", () => {
    const result = Some(5).map((x: number) => x * 2);
    expect(result.isSome()).toBe(true);
    expect(result.unwrap()).toBe(10);
});

test("map does not transform None", () => {
    const result = None().map((x: number) => x * 2);
    expect(result.isNone()).toBe(true);
});

test("flatMap chains Some values", () => {
    const result = Some(5).flatMap((x: number) => Some(x * 2));
    expect(result.isSome()).toBe(true);
    expect(result.unwrap()).toBe(10);
});

test("flatMap propagates None", () => {
    const result = Some(5).flatMap((x: number) => None());
    expect(result.isNone()).toBe(true);
});

test("flatMap handles initial None", () => {
    const result = None().flatMap((x: number) => Some(x * 2));
    expect(result.isNone()).toBe(true);
});

test("orElse returns original Some", () => {
    const result = Some(5).orElse(Some(10));
    expect(result.isSome()).toBe(true);
    expect(result.unwrap()).toBe(5);
});

test("orElse does not evaluate fallback for Some", () => {
    const result = Some(5).orElse(None());
    expect(result.isSome()).toBe(true);
    expect(result.unwrap()).toBe(5);
});

test("orElse returns fallback for None", () => {
    const result = None().orElse(Some(10));
    expect(result.isSome()).toBe(true);
    expect(result.unwrap()).toBe(10);
});

test("filter returns Some if predicate is true", () => {
    const result = Some(5).filter((x: number) => x > 0);
    expect(result.isSome()).toBe(true);
    expect(result.unwrap()).toBe(5);
});

test("filter returns None if predicate is false", () => {
    const result = Some(5).filter((x: number) => x < 0);
    expect(result.isNone()).toBe(true);
});

test("filter returns None for initial None", () => {
    const result = None().filter((x: number) => x > 0);
    expect(result.isNone()).toBe(true);
});

test("match Some returns Some of result", () => {
    const result = Some(10).match((val: number) => val * 2, () => 0);
    expect(result).toBe(20);
});

test("match None returns Some of result", () => {
    const result = None().match((val: never) => val, () => "default");
    expect(result).toBe("default");
});

test("fromThrowable returns Some on success", () => {
    const safeDivide = Option.fromThrowable((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    });
    const result = safeDivide(10, 2);
    expect(result.isSome()).toBe(true);
    expect(result.unwrap()).toBe(5);
});

test("fromThrowable returns None on error", () => {
    const safeDivide = Option.fromThrowable((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    });
    const result = safeDivide(10, 0);
    expect(result.isNone()).toBe(true);
});

// Result Type Tests

test("Ok holds value", () => {
    const value = Ok(123);
    expect(value.isOk()).toBe(true);
    expect(value.isErr()).toBe(false);
});

test("Err holds error", () => {
    const error = Err("Something went wrong");
    expect(error.isErr()).toBe(true);
    expect(error.isOk()).toBe(false);
});

test("unwrap Ok returns value", () => {
    expect(Ok(5).unwrap()).toBe(5);
});

test("unwrap Err throws error", () => {
    expect(() => Err("Error").unwrap()).toThrow("Tried to unwrap Err");
});

test("unwrapErr Err returns error", () => {
    expect(Err("Error").unwrapErr()).toBe("Error");
});

test("unwrapErr Ok throws error", () => {
    expect(() => Ok(5).unwrapErr()).toThrow("Tried to unwrap Ok as Err");
});

test("unwrapOr Ok returns value", () => {
    expect(Ok(5).unwrapOr(10)).toBe(5);
});

test("unwrapOr Err returns fallback", () => {
    expect(Err("Error").unwrapOr(10)).toBe(10);
});

test("map transforms Ok value", () => {
    const result = Ok(5).map((x: number) => x * 2);
    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(10);
});

test("map does not transform Err", () => {
    const result = Err<number, string>("Error").map((x: number) => x * 2);
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBe("Error");
});

test("mapErr transforms Err value", () => {
    const result = Err<number, Error>(new Error("Original")).mapErr((e: Error) => e.message);
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBe("Original");
});

test("mapErr does not transform Ok", () => {
    const result = Ok<number, Error>(5).mapErr((e: Error) => e.message);
    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(5);
});

test("flatMap chains Ok values", () => {
    const result = Ok(5).flatMap((x: number) => Ok(x * 2));
    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(10);
});

test("flatMap propagates Err", () => {
    const result = Ok(5).flatMap((x: number) => Err<number, string>("Error from flatMap"));
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBe("Error from flatMap");
});

test("flatMap handles initial Err", () => {
    const result = Err<number, string>("Initial error").flatMap((x: number) => Ok(x * 2));
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBe("Initial error");
});

test("orElse returns original Ok", () => {
    const result = Ok(5).orElse(Ok(10));
    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(5);
});

test("orElse does not evaluate fallback for Ok", () => {
    const result = Ok(5).orElse(Err("Error"));
    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(5);
});

test("orElse returns fallback for Err", () => {
    const result = Err("Error").orElse(Ok(10));
    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(10);
});

test("fromThrowable returns Ok on success", () => {
    const safeDivide = Result.fromThrowable((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    }, (e: unknown) => (e as Error).message);
    const result = safeDivide(10, 2);
    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(5);
});

test("fromThrowable returns Err on error", () => {
    const safeDivide = Result.fromThrowable((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    }, (e: unknown) => (e as Error).message);
    const result = safeDivide(10, 0);
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBe("Division by zero");
});

test("match calls onOk for Ok", () => {
    const result = Ok<number, string>(10).match((val: number) => val * 2, (err: string) => 0);
    expect(result).toBe(20);
});

test("match calls onErr for Err", () => {
    const result = Err<number, string>("Error").match((val: number) => val * 2, (err: string) => err.length);
    expect(result).toBe(5);
});