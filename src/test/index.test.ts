import { test, expect } from "vitest";
import { Option, Result } from "..";

test("Some holds value", () => {
    const value = Option.Some(123);
    expect(Option.isSome(value)).toBe(true);
});

test("ifSome works", () => {
    let x = 0;
    Option.ifSome(Option.Some(10), (v) => (x = v));
    expect(x).toBe(10);
});

test("fromNullable null value returns none", () => {
    const val = null;
    const x = Option.fromNullable(val);
    expect(x.kind).toBe("None")
})

test("unwrap Some returns value", () => {
    expect(Option.unwrap(Option.Some(5))).toBe(5);
});

test("unwrap None throws error", () => {
    expect(() => Option.unwrap(Option.None())).toThrow("Tried to unwrap None");
});

test("unwrapOr Some returns value", () => {
    expect(Option.unwrapOr(Option.Some(5), 10)).toBe(5);
});

test("unwrapOr None returns fallback", () => {
    expect(Option.unwrapOr(Option.None(), 10)).toBe(10);
});

test("map transforms Some value", () => {
    const result = Option.map(Option.Some(5), (x) => x * 2);
    expect(Option.isSome(result)).toBe(true);
    expect(Option.unwrap(result)).toBe(10);
});

test("map does not transform None", () => {
    const result = Option.map(Option.None(), (x: number) => x * 2);
    expect(result.kind).toBe("None");
});

test("flatMap chains Some values", () => {
    const result = Option.flatMap(Option.Some(5), (x) => Option.Some(x * 2));
    expect(Option.isSome(result)).toBe(true);
    expect(Option.unwrap(result)).toBe(10);
});

test("flatMap propagates None", () => {
    const result = Option.flatMap(Option.Some(5), (x) => Option.None());
    expect(result.kind).toBe("None");
});

test("flatMap handles initial None", () => {
    const result = Option.flatMap(Option.None(), (x: number) => Option.Some(x * 2));
    expect(result.kind).toBe("None");
});

test("orElse returns original Some", () => {
    const result = Option.orElse(Option.Some(5), Option.Some(10));
    expect(Option.isSome(result)).toBe(true);
    expect(Option.unwrap(result)).toBe(5);
});

test("orElse returns fallback for None", () => {
    const result = Option.orElse(Option.None(), Option.Some(10));
    expect(Option.isSome(result)).toBe(true);
    expect(Option.unwrap(result)).toBe(10);
});

test("filter returns Some if predicate is true", () => {
    const result = Option.filter(Option.Some(5), (x) => x > 0);
    expect(Option.isSome(result)).toBe(true);
    expect(Option.unwrap(result)).toBe(5);
});

test("filter returns None if predicate is false", () => {
    const result = Option.filter(Option.Some(5), (x) => x < 0);
    expect(result.kind).toBe("None");
});

test("filter returns None for initial None", () => {
    const result = Option.filter(Option.None(), (x: number) => x > 0);
    expect(result.kind).toBe("None");
});

test("match Some returns Some of result", () => {
    const result = Option.match(Option.Some(10)).Some((val) => val * 2);
    expect(Option.isSome(result)).toBe(true);
    expect(Option.unwrap(result)).toBe(20);
});

test("match Some returns None when None branch is taken", () => {
    const result = Option.match(Option.None()).Some((val: number) => val * 2);
    expect(result.kind).toBe("None");
});

test("match None returns Some of result", () => {
    const result = Option.match(Option.None()).None(() => "default");
    expect(Option.isSome(result)).toBe(true);
    expect(Option.unwrap(result)).toBe("default");
});

test("match None returns None when Some branch is taken", () => {
    const result = Option.match(Option.Some(10)).None(() => "default");
    expect(result.kind).toBe("None");
});

test("fromThrowable returns Some on success", () => {
    const safeDivide = Option.fromThrowable((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    });
    const result = safeDivide(10, 2);
    expect(Option.isSome(result)).toBe(true);
    expect(Option.unwrap(result)).toBe(5);
});

test("fromThrowable returns None on error", () => {
    const safeDivide = Option.fromThrowable((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    });
    const result = safeDivide(10, 0);
    expect(result.kind).toBe("None");
});

// Result Type Tests

test("Ok holds value", () => {
    const value = Result.Ok(123);
    expect(Result.isOk(value)).toBe(true);
    expect(Result.isErr(value)).toBe(false);
});

test("Err holds error", () => {
    const error = Result.Err("Something went wrong");
    expect(Result.isErr(error)).toBe(true);
    expect(Result.isOk(error)).toBe(false);
});

test("unwrap Ok returns value", () => {
    expect(Result.unwrap(Result.Ok(5))).toBe(5);
});

test("unwrap Err throws error", () => {
    expect(() => Result.unwrap(Result.Err("Error"))).toThrow("Tried to unwrap Err");
});

test("unwrapErr Err returns error", () => {
    expect(Result.unwrapErr(Result.Err("Error"))).toBe("Error");
});

test("unwrapErr Ok throws error", () => {
    expect(() => Result.unwrapErr(Result.Ok(5))).toThrow("Tried to unwrap Ok as Err");
});

test("unwrapOr Ok returns value", () => {
    expect(Result.unwrapOr(Result.Ok(5), 10)).toBe(5);
});

test("unwrapOr Err returns fallback", () => {
    expect(Result.unwrapOr(Result.Err("Error"), 10)).toBe(10);
});

test("map transforms Ok value", () => {
    const result = Result.map(Result.Ok(5), (x) => x * 2);
    expect(Result.isOk(result)).toBe(true);
    expect(Result.unwrap(result)).toBe(10);
});

test("map does not transform Err", () => {
    const result = Result.map(Result.Err<number, string>("Error"), (x: number) => x * 2);
    expect(Result.isErr(result)).toBe(true);
    expect(Result.unwrapErr(result)).toBe("Error");
});

test("mapErr transforms Err value", () => {
    const result = Result.mapErr(Result.Err<number, Error>(new Error("Original")), (e) => e.message);
    expect(Result.isErr(result)).toBe(true);
    expect(Result.unwrapErr(result)).toBe("Original");
});

test("mapErr does not transform Ok", () => {
    const result = Result.mapErr(Result.Ok<number, Error>(5), (e: Error) => e.message);
    expect(Result.isOk(result)).toBe(true);
    expect(Result.unwrap(result)).toBe(5);
});

test("flatMap chains Ok values", () => {
    const result = Result.flatMap(Result.Ok(5), (x) => Result.Ok(x * 2));
    expect(Result.isOk(result)).toBe(true);
    expect(Result.unwrap(result)).toBe(10);
});

test("flatMap propagates Err", () => {
    const result = Result.flatMap(Result.Ok(5), (x) => Result.Err<number, string>("Error from flatMap"));
    expect(Result.isErr(result)).toBe(true);
    expect(Result.unwrapErr(result)).toBe("Error from flatMap");
});

test("flatMap handles initial Err", () => {
    const result = Result.flatMap(Result.Err<number, string>("Initial error"), (x: number) => Result.Ok(x * 2));
    expect(Result.isErr(result)).toBe(true);
    expect(Result.unwrapErr(result)).toBe("Initial error");
});

test("orElse returns original Ok", () => {
    const result = Result.orElse(Result.Ok(5), Result.Ok(10));
    expect(Result.isOk(result)).toBe(true);
    expect(Result.unwrap(result)).toBe(5);
});

test("orElse returns fallback for Err", () => {
    const result = Result.orElse(Result.Err("Error"), Result.Ok(10));
    expect(Result.isOk(result)).toBe(true);
    expect(Result.unwrap(result)).toBe(10);
});

test("fromThrowable returns Ok on success", () => {
    const safeDivide = Result.fromThrowable((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    }, (e) => (e as Error).message);
    const result = safeDivide(10, 2);
    expect(Result.isOk(result)).toBe(true);
    expect(Result.unwrap(result)).toBe(5);
});

test("fromThrowable returns Err on error", () => {
    const safeDivide = Result.fromThrowable((a: number, b: number) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    }, (e) => (e as Error).message);
    const result = safeDivide(10, 0);
    expect(Result.isErr(result)).toBe(true);
    expect(Result.unwrapErr(result)).toBe("Division by zero");
});

test("match calls onOk for Ok", () => {
    const result = Result.match(Result.Ok<number, string>(10), (val: number) => val * 2, (err: string) => 0);
    expect(result).toBe(20);
});

test("match calls onErr for Err", () => {
    const result = Result.match(Result.Err<number, string>("Error"), (val: number) => val * 2, (err: string) => err.length);
    expect(result).toBe(5);
});
