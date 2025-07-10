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
import { Result } from '@mikkurogue/option-ts';

const success = Result.Ok(123);
// success is { kind: "Ok", value: 123 }
```

### `Err<T, E>(error: E): Result<T, E>`

Creates a `Result` that represents a failed outcome.

```typescript
import { Result } from '@mikkurogue/option-ts';

const failure = Result.Err("Something went wrong");
// failure is { kind: "Err", error: "Something went wrong" }
```

### `isOk<T, E>(res: Result<T, E>): res is { kind: "Ok"; value: T }`

Checks if a `Result` represents a successful outcome (is "Ok").

```typescript
import { Result } from '@mikkurogue/option-ts';

const res = Result.Ok(10);
if (Result.isOk(res)) {
  console.log(res.value); // 10
}

const err = Result.Err("Error");
console.log(Result.isOk(err)); // false
```

### `isErr<T, E>(res: Result<T, E>): res is { kind: "Err"; error: E }`

Checks if a `Result` represents a failed outcome (is "Err").

```typescript
import { Result } from '@mikkurogue/option-ts';

const err = Result.Err("Error");
if (Result.isErr(err)) {
  console.log(err.error); // Error
}

const res = Result.Ok(10);
console.log(Result.isErr(res)); // false
```

### `unwrap<T, E>(res: Result<T, E>): T`

Extracts the successful value from an "Ok" `Result`. Throws an error if the `Result` is "Err". Use with caution.

```typescript
import { Result } from '@mikkurogue/option-ts';

const res = Result.Ok(10);
console.log(Result.unwrap(res)); // 10

const err = Result.Err("Error");
// Result.unwrap(err); // Throws Error: Tried to unwrap Err
```

### `unwrapErr<T, E>(res: Result<T, E>): E`

Extracts the error value from an "Err" `Result`. Throws an error if the `Result` is "Ok". Use with caution.

```typescript
import { Result } from '@mikkurogue/option-ts';

const err = Result.Err("Something went wrong");
console.log(Result.unwrapErr(err)); // Something went wrong

const res = Result.Ok(10);
// Result.unwrapErr(res); // Throws Error: Tried to unwrap Ok as Err
```

### `unwrapOr<T, E>(res: Result<T, E>, fallback: T): T`

Extracts the successful value from an "Ok" `Result`, or returns a fallback value if it's "Err".

```typescript
import { Result } from '@mikkurogue/option-ts';

const res = Result.Ok(10);
console.log(Result.unwrapOr(res, 0)); // 10

const err = Result.Err("Error");
console.log(Result.unwrapOr(err, 0)); // 0
```

### `map<T, E, U>(res: Result<T, E>, fn: (value: T) => U): Result<U, E>`

Transforms the successful value inside an "Ok" `Result` using a mapping function. If the `Result` is "Err", it remains "Err".

```typescript
import { Result } from '@mikkurogue/option-ts';

const res = Result.Ok(5);
const mappedRes = Result.map(res, (x) => x * 2); // Result.Ok(10)

const err = Result.Err("Error");
const mappedErr = Result.map(err, (x: number) => x * 2); // Result.Err("Error")
```

### `mapErr<T, E, F>(res: Result<T, E>, fn: (error: E) => F): Result<T, F>`

Transforms the error value inside an "Err" `Result` using a mapping function. If the `Result` is "Ok", it remains "Ok".

```typescript
import { Result } from '@mikkurogue/option-ts';

const err = Result.Err("File not found");
const mappedErr = Result.mapErr(err, (e) => `Failed: ${e}`); // Result.Err("Failed: File not found")

const res = Result.Ok(10);
const mappedRes = Result.mapErr(res, (e: string) => `Failed: ${e}`); // Result.Ok(10)
```

### `flatMap<T, E, U>(res: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E>`

Chains operations that return `Result` types. If the current `Result` is "Ok", it applies the function and returns the new `Result`. If it's "Err", it propagates the "Err".

```typescript
import { Result } from '@mikkurogue/option-ts';

const divideByTwo = (num: number): Result.Result<number, string> => {
  if (num % 2 !== 0) return Result.Err("Not divisible by 2");
  return Result.Ok(num / 2);
};

const res1 = Result.Ok(10);
const chainedRes1 = Result.flatMap(res1, divideByTwo); // Result.Ok(5)

const res2 = Result.Ok(7);
const chainedRes2 = Result.flatMap(res2, divideByTwo); // Result.Err("Not divisible by 2")
```

### `orElse<T, E>(res: Result<T, E>, fallback: Result<T, E>): Result<T, E>`

Returns the `Result` if it is "Ok", otherwise returns the provided fallback `Result`.

```typescript
import { Result } from '@mikkurogue/option-ts';

const res = Result.Ok(10);
const result1 = Result.orElse(res, Result.Ok(0)); // Result.Ok(10)

const err = Result.Err("Error");
const result2 = Result.orElse(err, Result.Ok(0)); // Result.Ok(0)
```

### `fromThrowable<T, E, Args extends any[]>(fn: (...args: Args) => T, errorMap: (e: unknown) => E): (...args: Args) => Result<T, E>`

Wraps a potentially throwing function into a function that returns a `Result`. If the original function executes successfully, it returns `Ok(result)`. If it throws, it returns `Err(errorMap(e))`.

```typescript
import { Result } from '@mikkurogue/option-ts';

const safeParseJson = Result.fromThrowable(
  JSON.parse,
  (e) => (e as Error).message // Map any error to its message string
);

const json1 = safeParseJson('{"a": 1}'); // Result.Ok({ a: 1 })
const json2 = safeParseJson('invalid json'); // Result.Err("Unexpected token 'i'...")
```

### `match<T, E, R>(res: Result<T, E>, onOk: (val: T) => R, onErr: (err: E) => R): R`

Provides a way to handle both "Ok" and "Err" cases of a `Result`.

```typescript
import { Result } from '@mikkurogue/option-ts';

const res = Result.Ok(10);
const result1 = Result.match(
  res,
  (val) => `Success: ${val}`,
  (err) => `Failure: ${err}`
); // "Success: 10"

const err = Result.Err("Network error");
const result2 = Result.match(
  err,
  (val) => `Success: ${val}`,
  (err) => `Failure: ${err}`
); // "Failure: Network error"
```
