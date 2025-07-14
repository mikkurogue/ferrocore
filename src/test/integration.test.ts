import { test, expect } from "vitest";
import { type Option, Some, None, isSome, unwrap, flatMap } from "@mikkurogue/ferrocore/option";
import { type Result, Ok, Err, isOk, isErr, unwrap as unwrapResult, unwrapErr, match } from "@mikkurogue/ferrocore/result";

// --- Scenario 1: User Input Parsing and Calculation ---

// Function that parses a string to a number, returning Option<number>
function parseNumber(input: string): Option<number> {
    const num = Number(input);
    return isNaN(num) ? None() : Some(num);
}

// Function that performs division, returning Result<number, string>
function divide(numerator: number, denominator: number): Result<number, string> {
    if (denominator === 0) {
        return Err("Division by zero");
    }
    return Ok(numerator / denominator);
}

// Integration test: Parse input, perform division, and handle results
test("Integration: Parse, Divide, and Handle Results", () => {
    // Scenario A: Successful parsing and division
    const inputA = "10";
    const inputB = "2";

    const numA = parseNumber(inputA);
    const numB = parseNumber(inputB);

    const divisionResultA = flatMap(numA, (a: number) =>
        flatMap(numB, (b: number) => {
            const divisionResult = divide(a, b); // This returns Result<number, string>
            return Some(divisionResult); // Wrap the Result in an Option.Some
        })
    );

    expect(isSome(divisionResultA)).toBe(true);
    expect(isOk(unwrap(divisionResultA))).toBe(true);
    expect(unwrapResult(unwrap(divisionResultA))).toBe(5);

    // Scenario B: Invalid input for numerator
    const inputC = "abc";
    const inputD = "2";

    const numC = parseNumber(inputC);
    const numD = parseNumber(inputD);

    const divisionResultB = flatMap(numC, (a: number) =>
        flatMap(numD, (b: number) => {
            const divisionResult = divide(a, b); // This returns Result<number, string>
            return Some(divisionResult); // Wrap the Result in an Option.Some
        })
    );

    expect(isSome(divisionResultB)).toBe(false); // Expect None because numC is None

    // Scenario C: Division by zero
    const inputE = "10";
    const inputF = "0";

    const numE = parseNumber(inputE);
    const numF = parseNumber(inputF);

    const divisionResultC = flatMap(numE, (a: number) =>
        flatMap(numF, (b: number) => {
            const divisionResult = divide(a, b); // This returns Result<number, string>
            return Some(divisionResult); // Wrap the Result in an Option.Some
        })
    );

    expect(isSome(divisionResultC)).toBe(true);
    expect(isErr(unwrap(divisionResultC))).toBe(true);
    expect(unwrapErr(unwrap(divisionResultC))).toBe("Division by zero");
});

// --- Scenario 2: Chaining operations with mixed Option and Result ---

// Function that fetches user data (might not exist)
function fetchUser(id: string): Option<{ name: string; age: number }> {
    if (id === "123") {
        return Some({ name: "Alice", age: 30 });
    }
    return None();
}

// Function that validates user age (might fail validation)
function validateAge(user: { name: string; age: number }): Result< { name: string; age: number }, string> {
    if (user.age < 18) {
        return Err("User is too young");
    }
    return Ok(user);
}

test("Integration: Chaining Option and Result operations", () => {
    // Scenario A: User found and age valid
    const userA = fetchUser("123");
    const processedUserA = flatMap(userA, (user: { name: string; age: number }) => {
        return match( // Use match from Result
            validateAge(user),
            (validUser: { name: string; age: number }) => Some(validUser),
            (error: string) => None()
        );
    });

    expect(isSome(processedUserA)).toBe(true);
    if (isSome(processedUserA)) {
        expect(unwrap(processedUserA).name).toBe("Alice");
    }

    // Scenario B: User not found
    const userB = fetchUser("456");
    const processedUserB = flatMap(userB, (user: { name: string; age: number }) => {
        return match( // Use match from Result
            validateAge(user),
            (validUser: { name: string; age: number }) => Some(validUser),
            (error: string) => None()
        );
    });

    expect(processedUserB.kind).toBe("None");

    // Scenario C: User found but age invalid
    const userC = Some({ name: "Bob", age: 16 });
    const processedUserC = flatMap(userC, (user: { name: string; age: number }) => {
        return match( // Use match from Result
            validateAge(user),
            (validUser: { name: string; age: number }) => Some(validUser),
            (error: string) => None()
        );
    });

    expect(processedUserC.kind).toBe("None");
});