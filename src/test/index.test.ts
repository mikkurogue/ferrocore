import { test, expect } from "vitest";
import { Option, Some, None, isSome, isNone, ifSome, unwrap, unwrapOr, fromNullable, fromUndefined, match, map, fromThrowable, flatMap, orElse, filter } from "@mikkurogue/ferrocore/option";
import { Result, Ok, Err, isOk, isErr, unwrap as unwrapResult, unwrapErr, unwrapOr as unwrapOrResult, map as mapResult, mapErr, flatMap as flatMapResult, orElse as orElseResult, fromThrowable as fromThrowableResult, match as matchResult } from "@mikkurogue/ferrocore/result";

test("Some holds value", () => {
    const value = Some(123);
    expect(isSome(value)).toBe(true);
});

test("ifSome works", () => {
    let x = 0;
    ifSome(Some(10), (v: number) => (x = v));
    expect(x).toBe(10);
});

test("fromNullable null value returns none", () => {
    const val = fromNullable(null);
    expect(val.kind).toBe("None")
})

test("unwrap Some returns value", () => {
    expect(unwrap(Some(5))).toBe(5);
});

test("unwrap None throws error", () => {
    expect(() => unwrap(None())).toThrow("Tried to unwrap None");
});

test("unwrapOr Some returns value", () => {
    expect(unwrapOr(Some(5), 10)).toBe(5);
});

test("unwrapOr None returns fallback", () => {
    expect(unwrapOr(None(), 10)).toBe(10);
});

test("map transforms Some value", () => {
    const result = map(Some(5), (x: number) => x * 2);
    expect(isSome(result)).toBe(true);
    expect(unwrap(result)).toBe(10);
});

test("map does not transform None", () => {
    const result = map(None(), (x: number) => x * 2);
    expect(result.kind).toBe("None");
});

test("flatMap chains Some values", () => {
    const result = flatMap(Some(5), (x: number) => Some(x * 2));
    expect(isSome(result)).toBe(true);
    expect(unwrap(result)).toBe(10);
});

test("flatMap propagates None", () => {
    const result = flatMap(Some(5), (x: number) => None());
    expect(result.kind).toBe("None");
});

test("flatMap handles initial None", () => {
    const result = flatMap(None(), (x: number) => Some(x * 2));
    expect(result.kind).toBe("None");
});

test("orElse returns original Some", () => {
    const result = orElse(Some(5), Some(10));
    expect(isSome(result)).toBe(true);
    expect(unwrap(result)).toBe(5);
});

test("orElse returns fallback for None", () => {
    const result = orElse(None(), Some(10));
    expect(isSome(result)).toBe(true);
    expect(unwrap(result)).toBe(10);
});

test("filter returns Some if predicate is true", () => {
    const result = filter(Some(5), (x: number) => x > 0);
    expect(isSome(result)).toBe(true);
    expect(unwrap(result)).toBe(5);
});

test("filter returns None if predicate is false", () => {
    const result = filter(Some(5), (x: number) => x < 0);
    expect(result.kind).toBe("None");
});

test("filter returns None for initial None", () => {
    const result = filter(None(), (x: number) => x > 0);
    expect(result.kind).toBe("None");
});

test("match Some returns Some of result", () => {
    const result = match(Some(10)).Some((val: number) => val * 2);
    expect(isSome(result)).toBe(true);
    expect(unwrap(result)).toBe(20);
});

test("match Some returns None when None branch is taken", () => {
    const result = match(None()).Some((val: number) => val * 2);
    expect(result.kind).toBe("None");
});

test("match None returns Some of result", () => {
    const result = match(None()).None(() => "default");
    expect(isSome(result)).toBe(true);
    expect(unwrap(result)).toBe("default");
});

test("match None returns None when Some branch is taken", () => {
    const result = match(Some(10)).None(() => "default");
    expect(result.kind).toBe("None");
});

test("fromThrowable returns Some on success", () => {
    const safeDivide = fromThrowable((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    });
    const result = safeDivide(10, 2);
    expect(isSome(result)).toBe(true);
    expect(unwrap(result)).toBe(5);
});

test("fromThrowable returns None on error", () => {
    const safeDivide = fromThrowable((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    });
    const result = safeDivide(10, 0);
    expect(result.kind).toBe("None");
});

// Result Type Tests

test("Ok holds value", () => {
    const value = Ok(123);
    expect(isOk(value)).toBe(true);
    expect(isErr(value)).toBe(false);
});

test("Err holds error", () => {
    const error = Err("Something went wrong");
    expect(isErr(error)).toBe(true);
    expect(isOk(error)).toBe(false);
});

test("unwrap Ok returns value", () => {
    expect(unwrapResult(Ok(5))).toBe(5);
});

test("unwrap Err throws error", () => {
    expect(() => unwrapResult(Err("Error"))).toThrow("Tried to unwrap Err");
});

test("unwrapErr Err returns error", () => {
    expect(unwrapErr(Err("Error"))).toBe("Error");
});

test("unwrapErr Ok throws error", () => {
    expect(() => unwrapErr(Ok(5))).toThrow("Tried to unwrap Ok as Err");
});

test("unwrapOr Ok returns value", () => {
    expect(unwrapOrResult(Ok(5), 10)).toBe(5);
});

test("unwrapOr Err returns fallback", () => {
    expect(unwrapOrResult(Err("Error"), 10)).toBe(10);
});

test("map transforms Ok value", () => {
    const result = mapResult(Ok(5), (x: number) => x * 2);
    expect(isOk(result)).toBe(true);
    expect(unwrapResult(result)).toBe(10);
});

test("map does not transform Err", () => {
    const result = mapResult(Err<number, string>("Error"), (x: number) => x * 2);
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toBe("Error");
});

test("mapErr transforms Err value", () => {
    const result = mapErr(Err<number, Error>(new Error("Original")), (e: Error) => e.message);
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toBe("Original");
});

test("mapErr does not transform Ok", () => {
    const result = mapErr(Ok<number, Error>(5), (e: Error) => e.message);
    expect(isOk(result)).toBe(true);
    expect(unwrapResult(result)).toBe(5);
});

test("flatMap chains Ok values", () => {
    const result = flatMapResult(Ok(5), (x: number) => Ok(x * 2));
    expect(isOk(result)).toBe(true);
    expect(unwrapResult(result)).toBe(10);
});

test("flatMap propagates Err", () => {
    const result = flatMapResult(Ok(5), (x: number) => Err<number, string>("Error from flatMap"));
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toBe("Error from flatMap");
});

test("flatMap handles initial Err", () => {
    const result = flatMapResult(Err<number, string>("Initial error"), (x: number) => Ok(x * 2));
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toBe("Initial error");
});

test("orElse returns original Ok", () => {
    const result = orElseResult(Ok(5), Ok(10));
    expect(isOk(result)).toBe(true);
    expect(unwrapResult(result)).toBe(5);
});

test("orElse returns fallback for Err", () => {
    const result = orElseResult(Err("Error"), Ok(10));
    expect(isOk(result)).toBe(true);
    expect(unwrapResult(result)).toBe(10);
});

test("fromThrowable returns Ok on success", () => {
    const safeDivide = fromThrowableResult((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    }, (e: unknown) => (e as Error).message);
    const result = safeDivide(10, 2);
    expect(isOk(result)).toBe(true);
    expect(unwrapResult(result)).toBe(5);
});

test("fromThrowable returns Err on error", () => {
    const safeDivide = fromThrowableResult((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    }, (e: unknown) => (e as Error).message);
    const result = safeDivide(10, 0);
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toBe("Division by zero");
});

test("match calls onOk for Ok", () => {
    const result = matchResult(Ok<number, string>(10), (val: number) => val * 2, (err: string) => 0);
    expect(result).toBe(20);
});

test("match calls onErr for Err", () => {
    const result = matchResult(Err<number, string>(("Error")), (val: number) => val * 2, (err: string) => err.length);
    expect(result).toBe(5);
});