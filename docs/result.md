# Result Type

The `Result` type is a way to represent operations that can either succeed with a value (`Ok`) or fail with an error (`Err`). It provides explicit error handling, making your code more robust and readable.

## Types

```typescript
export type Result<T, E> = { kind: "Ok"; value: T } | { kind: "Err"; error: E };
```

## Functions

### `Ok<T, E>(value: T): Result<T, E>`

Creates a `Result` that represents a successful outcome.

```typescript
import { Result, Ok } from '@mikkurogue/ferrocore/result';

const success = Ok(123);
// success is { kind: "Ok", value: 123 }
```

### `Err<T, E>(error: E): Result<T, E>`

Creates a `Result` that represents a failed outcome.

```typescript
import { Result, Err } from '@mikkurogue/ferrocore/result';

const failure = Err("Something went wrong");
// failure is { kind: "Err", error: "Something went wrong" }
```

### `isOk<T, E>(res: Result<T, E>): res is { kind: "Ok"; value: T }`

Checks if a `Result` represents a successful outcome (is "Ok").

```typescript
import { Result, isOk } from '@mikkurogue/ferrocore/result';

const res = Ok(10);
if (isOk(res)) {
  console.log(res.value); // 10
}

const err = Err("Error");
console.log(isOk(err)); // false
```

### `isErr<T, E>(res: Result<T, E>): res is { kind: "Err"; error: E }`

Checks if a `Result` represents a failed outcome (is "Err").

```typescript
import { Result, isErr } from '@mikkurogue/ferrocore/result';

const err = Err("Error");
if (isErr(err)) {
  console.log(err.error); // Error
}

const res = Ok(10);
console.log(isErr(res)); // false
```

### `unwrap<T, E>(res: Result<T, E>): T`

Extracts the successful value from an "Ok" `Result`. Throws an error if the `Result` is "Err". Use with caution.

```typescript
import { Result, Ok, Err, unwrap } from '@mikkurogue/ferrocore/result';

const res = Ok(10);
console.log(unwrap(res)); // 10

const err = Err("Error");
// unwrap(err); // Throws Error: Tried to unwrap Err
```

### `unwrapErr<T, E>(res: Result<T, E>): E`

Extracts the error value from an "Err" `Result`. Throws an error if the `Result` is "Ok". Use with caution.

```typescript
import { Result, Ok, Err, unwrapErr } from '@mikkurogue/ferrocore/result';

const err = Err("Something went wrong");
console.log(unwrapErr(err)); // Something went wrong

const res = Ok(10);
// unwrapErr(res); // Throws Error: Tried to unwrap Ok as Err
```

### `unwrapOr<T, E>(res: Result<T, E>, fallback: T): T`

Extracts the successful value from an "Ok" `Result`, or returns a fallback value if it's "Err".

```typescript
import { Result, Ok, Err, unwrapOr } from '@mikkurogue/ferrocore/result';

const res = Ok(10);
console.log(unwrapOr(res, 0)); // 10

const err = Err("Error");
console.log(unwrapOr(err, 0)); // 0
```

### `map<T, E, U>(res: Result<T, E>, fn: (value: T) => U): Result<U, E>`

Transforms the successful value inside an "Ok" `Result` using a mapping function. If the `Result` is "Err", it remains "Err".

```typescript
import { Result, Ok, Err, map } from '@mikkurogue/ferrocore/result';

const res = Ok(5);
const mappedRes = map(res, (x) => x * 2); // Ok(10)

const err = Err("Error");
const mappedErr = map(err, (x: number) => x * 2); // Err("Error")
```

### `mapErr<T, E, F>(res: Result<T, E>, fn: (error: E) => F): Result<T, F>`

Transforms the error value inside an "Err" `Result` using a mapping function. If the `Result` is "Ok", it remains "Ok".

```typescript
import { Result, Ok, Err, mapErr } from '@mikkurogue/ferrocore/result';

const err = Err("File not found");
const mappedErr = mapErr(err, (e) => `Failed: ${e}`); // Err("Failed: File not found")

const res = Ok(10);
const mappedRes = mapErr(res, (e: string) => `Failed: ${e}`); // Ok(10)
```

### `flatMap<T, E, U>(res: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E>`

Chains operations that return `Result` types. If the current `Result` is "Ok", it applies the function and returns the new `Result`. If it's "Err", it propagates the "Err".

```typescript
import { Result, Ok, Err, flatMap } from '@mikkurogue/ferrocore/result';

const divideByTwo = (num: number): Result<number, string> => {
  if (num % 2 !== 0) return Err("Not divisible by 2");
  return Ok(num / 2);
};

const res1 = Ok(10);
const chainedRes1 = flatMap(res1, divideByTwo); // Ok(5)

const res2 = Ok(7);
const chainedRes2 = flatMap(res2, divideByTwo); // Err("Not divisible by 2")
```

### `orElse<T, E>(res: Result<T, E>, fallback: Result<T, E>): Result<T, E>`

Returns the `Result` if it is "Ok", otherwise returns the provided fallback `Result`.

```typescript
import { Result, Ok, Err, orElse } from '@mikkurogue/ferrocore/result';

const res = Ok(10);
const result1 = orElse(res, Ok(0)); // Ok(10)

const err = Err("Error");
const result2 = orElse(err, Ok(0)); // Ok(0)
```

### `fromThrowable<T, E, Args extends any[]>(fn: (...args: Args) => T, errorMap: (e: unknown) => E): (...args: Args) => Result<T, E>`

Wraps a potentially throwing function into a function that returns a `Result`. If the original function executes successfully, it returns `Ok(result)`. If it throws, it returns `Err(errorMap(e))`.

```typescript
import { Result, Ok, Err, fromThrowable } from '@mikkurogue/ferrocore/result';

const safeParseJson = fromThrowable(
  JSON.parse,
  (e) => (e as Error).message // Map any error to its message string
);

const json1 = safeParseJson('{"a": 1}'); // Ok({ a: 1 })
const json2 = safeParseJson('invalid json'); // Err("Unexpected token 'i'...")
```

### `match<T, E, R>(res: Result<T, E>, onOk: (val: T) => R, onErr: (err: E) => R): R`

Provides a way to handle both "Ok" and "Err" cases of a `Result`.

```typescript
import { Result, Ok, Err, match } from '@mikkurogue/ferrocore/result';

const res = Ok(10);
const result1 = match(
  res,
  (val) => `Success: ${val}`,
  (err) => `Failure: ${err}`
); // "Success: 10"

const err = Err("Network error");
const result2 = match(
  err,
  (val) => `Success: ${val}`,
  (err) => `Failure: ${err}`
); // "Failure: Network error"
```