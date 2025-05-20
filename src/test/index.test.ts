import { ifSome, isSome, match, Some } from "..";
import { test, expect } from "vitest";

test("Some holds value", () => {
  const value = Some(123);
  expect(isSome(value)).toBe(true);
});

test("ifSome works", () => {
  let x = 0;
  ifSome(Some(10), (v) => (x = v));
  expect(x).toBe(10);
});

// TODO: Add match test
