# Option Type

The `Option` type is a way to represent a value that may or may not be present. It helps in avoiding `null` or `undefined` checks and promotes more robust code.

## Types

```typescript
export type Option<T> = { kind: "Some"; value: T } | { kind: "None" };
```

## Functions

### `Some<T>(value: T): Option<T>`

Creates an `Option` that contains a value.

```typescript
import { Option, Some } from '@mikkurogue/ferrocore/option';

const myValue = Some(123);
// myValue is { kind: "Some", value: 123 }
```

### `None(): Option<never>`

Creates an `Option` that represents the absence of a value.

```typescript
import { Option, None } from '@mikkurogue/ferrocore/option';

const noValue = None();
// noValue is { kind: "None" }
```

### `isSome<T>(opt: Option<T>): opt is { kind: "Some"; value: T }`

Checks if an `Option` contains a value (is "Some").

```typescript
import { Option, isSome } from '@mikkurogue/ferrocore/option';

const value = Some(10);
if (isSome(value)) {
  console.log(value.value); // 10
}

const noValue = None();
console.log(isSome(noValue)); // false
```

### `isNone<T>(opt: Option<T>): opt is { kind: "None" }`

Checks if an `Option` represents the absence of a value (is "None").

```typescript
import { Option, isNone } from '@mikkurogue/ferrocore/option';

const noValue = None();
if (isNone(noValue)) {
  console.log("No value present");
}

const value = Some(10);
console.log(isNone(value)); // false
```

### `ifSome<T>(opt: Option<T>, fn: (val: T) => void): void`

Executes a function if the `Option` is "Some".

```typescript
import { Option, Some, ifSome, None } from '@mikkurogue/ferrocore/option';

let result: number | undefined;
ifSome(Some(5), (val) => {
  result = val * 2; // result will be 10
});

ifSome(None(), (val) => {
  // This function will not be executed
});
```

### `unwrap<T>(opt: Option<T>): T`

Extracts the value from a "Some" `Option`. Throws an error if the `Option` is "None". Use with caution.

```typescript
import { Option, Some, None, unwrap } from '@mikkurogue/ferrocore/option';

const value = Some(10);
console.log(unwrap(value)); // 10

const noValue = None();
// unwrap(noValue); // Throws Error: Tried to unwrap None
```

### `unwrapOr<T>(opt: Option<T>, fallback: T): T`

Extracts the value from a "Some" `Option`, or returns a fallback value if it's "None".

```typescript
import { Option, Some, None, unwrapOr } from '@mikkurogue/ferrocore/option';

const value = Some(10);
console.log(unwrapOr(value, 0)); // 10

const noValue = None();
console.log(unwrapOr(noValue, 0)); // 0
```

### `fromNullable<T>(val: T | null): Option<T>`

Converts a nullable value (`T | null`) into an `Option<T>`. Returns `Some(value)` if the value is not `null`, otherwise returns `None()`.

```typescript
import { Option, Some, None, fromNullable } from '@mikkurogue/ferrocore/option';

const nullableValue: number | null = 123;
const option1 = fromNullable(nullableValue); // Some(123)

const nullValue: number | null = null;
const option2 = fromNullable(nullValue); // None()
```

### `fromUndefined<T>(val: T | undefined): Option<T>`

Converts an undefined value (`T | undefined`) into an `Option<T>`. Returns `Some(value)` if the value is not `undefined`, otherwise returns `None()`.

```typescript
import { Option, Some, None, fromUndefined } from '@mikkurogue/ferrocore/option';

const undefinedValue: number | undefined = undefined;
const option1 = fromUndefined(undefinedValue); // None()

const definedValue: number | undefined = 456;
const option2 = fromUndefined(definedValue); // Some(456)
```

### `match<T, R>(opt: Option<T>)`

Provides a way to handle both "Some" and "None" cases of an `Option`.

```typescript
import { Option, Some, None, match } from '@mikkurogue/ferrocore/option';

const value = Some(10);
const result1 = match(value).Some((val) => val * 2);
// result1 is Some(20)

const noValue = None();
const result2 = match(noValue).None(() => "default");
// result2 is Some("default")
```

### `map<T, U>(opt: Option<T>, fn: (value: T) => U): Option<U>`

Transforms the value inside a "Some" `Option` using a mapping function. If the `Option` is "None", it remains "None".

```typescript
import { Option, Some, None, map } from '@mikkurogue/ferrocore/option';

const value = Some(5);
const mappedValue = map(value, (x) => x * 2); // Some(10)

const noValue = None();
const mappedNoValue = map(noValue, (x: number) => x * 2); // None()
```

### `fromThrowable<T, Args extends any[]>(fn: (...args: Args) => T): (...args: Args) => Option<T>`

Wraps a potentially throwing function into a function that returns an `Option`. If the original function executes successfully, it returns `Some(result)`. If it throws, it returns `None()`.

```typescript
import { Option, Some, None, fromThrowable } from '@mikkurogue/ferrocore/option';

const safeParseInt = fromThrowable(parseInt);

const num1 = safeParseInt("123"); // Some(123)
const num2 = safeParseInt("abc"); // None()
```

### `flatMap<T, U>(opt: Option<T>, fn: (value: T) => Option<U>): Option<U>`

Chains operations that return `Option` types. If the current `Option` is "Some", it applies the function and returns the new `Option`. If it's "None", it propagates the "None".

```typescript
import { Option, Some, None, fromUndefined, flatMap } from '@mikkurogue/ferrocore/option';

const getUserAge = (user: { name: string; age?: number }): Option<number> => {
  return fromUndefined(user.age);
};

const user1 = Some({ name: "Alice", age: 30 });
const age1 = flatMap(user1, getUserAge); // Some(30)

const user2 = Some({ name: "Bob" });
const age2 = flatMap(user2, getUserAge); // None()
```

### `orElse<T>(opt: Option<T>, fallback: Option<T>): Option<T>`

Returns the `Option` if it is "Some", otherwise returns the provided fallback `Option`.

```typescript
import { Option, Some, None, orElse } from '@mikkurogue/ferrocore/option';

const value = Some(10);
const result1 = orElse(value, Some(0)); // Some(10)

const noValue = None();
const result2 = orElse(noValue, Some(0)); // Some(0)
```

### `filter<T>(opt: Option<T>, predicate: (value: T) => boolean): Option<T>`

Filters a "Some" `Option` based on a predicate. If the `Option` is "Some" and the predicate returns `true`, it remains "Some". Otherwise, it becomes "None".

```typescript
import { Option, Some, None, filter } from '@mikkurogue/ferrocore/option';

const value = Some(10);
const filteredValue1 = filter(value, (x) => x > 5); // Some(10)

const filteredValue2 = filter(value, (x) => x > 15); // None()
```