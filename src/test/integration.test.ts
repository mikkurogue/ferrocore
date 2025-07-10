import { test, expect } from "vitest";
import { Option, Result } from "..";

// --- Scenario 1: User Input Parsing and Calculation ---

// Function that parses a string to a number, returning Option<number>
function parseNumber(input: string): Option.Option<number> {
    const num = Number(input);
    return isNaN(num) ? Option.None() : Option.Some(num);
}

// Function that performs division, returning Result<number, string>
function divide(numerator: number, denominator: number): Result.Result<number, string> {
    if (denominator === 0) {
        return Result.Err("Division by zero");
    }
    return Result.Ok(numerator / denominator);
}

// Integration test: Parse input, perform division, and handle results
test("Integration: Parse, Divide, and Handle Results", () => {
    // Scenario A: Successful parsing and division
    const inputA = "10";
    const inputB = "2";

    const numA = parseNumber(inputA);
    const numB = parseNumber(inputB);

    const divisionResultA = Option.flatMap(numA, (a) =>
        Option.flatMap(numB, (b) => {
            const divisionResult = divide(a, b); // This returns Result<number, string>
            return Option.Some(divisionResult); // Wrap the Result in an Option.Some
        })
    );

    expect(Option.isSome(divisionResultA)).toBe(true);
    expect(Result.isOk(Option.unwrap(divisionResultA))).toBe(true);
    expect(Result.unwrap(Option.unwrap(divisionResultA))).toBe(5);

    // Scenario B: Invalid input for numerator
    const inputC = "abc";
    const inputD = "2";

    const numC = parseNumber(inputC);
    const numD = parseNumber(inputD);

    const divisionResultB = Option.flatMap(numC, (a) =>
        Option.flatMap(numD, (b) => {
            const divisionResult = divide(a, b); // This returns Result<number, string>
            return Option.Some(divisionResult); // Wrap the Result in an Option.Some
        })
    );

    expect(Option.isSome(divisionResultB)).toBe(false); // Expect None because numC is None

    // Scenario C: Division by zero
    const inputE = "10";
    const inputF = "0";

    const numE = parseNumber(inputE);
    const numF = parseNumber(inputF);

    const divisionResultC = Option.flatMap(numE, (a) =>
        Option.flatMap(numF, (b) => {
            const divisionResult = divide(a, b); // This returns Result<number, string>
            return Option.Some(divisionResult); // Wrap the Result in an Option.Some
        })
    );

    expect(Option.isSome(divisionResultC)).toBe(true);
    expect(Result.isErr(Option.unwrap(divisionResultC))).toBe(true);
    expect(Result.unwrapErr(Option.unwrap(divisionResultC))).toBe("Division by zero");
});

// --- Scenario 2: Chaining operations with mixed Option and Result ---

// Function that fetches user data (might not exist)
function fetchUser(id: string): Option.Option<{ name: string; age: number }> {
    if (id === "123") {
        return Option.Some({ name: "Alice", age: 30 });
    }
    return Option.None();
}

// Function that validates user age (might fail validation)
function validateAge(user: { name: string; age: number }): Result.Result<{ name: string; age: number }, string> {
    if (user.age < 18) {
        return Result.Err("User is too young");
    }
    return Result.Ok(user);
}

test("Integration: Chaining Option and Result operations", () => {
    // Scenario A: User found and age valid
    const userA = fetchUser("123");
    const processedUserA = Option.flatMap(userA, (user) => {
        return Result.match(
            validateAge(user),
            (validUser) => Option.Some(validUser),
            (error) => Option.None()
        );
    });

    expect(Option.isSome(processedUserA)).toBe(true);
    expect(Option.unwrap(processedUserA)?.name).toBe("Alice");

    // Scenario B: User not found
    const userB = fetchUser("456");
    const processedUserB = Option.flatMap(userB, (user) => {
        return Result.match(
            validateAge(user),
            (validUser) => Option.Some(validUser),
            (error) => Option.None()
        );
    });

    expect(processedUserB.kind).toBe("None");

    // Scenario C: User found but age invalid
    const userC = Option.Some({ name: "Bob", age: 16 });
    const processedUserC = Option.flatMap(userC, (user) => {
        return Result.match(
            validateAge(user),
            (validUser) => Option.Some(validUser),
            (error) => Option.None()
        );
    });

    expect(processedUserC.kind).toBe("None");
});