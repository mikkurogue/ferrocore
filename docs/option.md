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
import { Option } from '@mikkurogue/option-ts';

const myValue = Option.Some(123);
// myValue is { kind: "Some", value: 123 }
```

### `None(): Option<never>`

Creates an `Option` that represents the absence of a value.

```typescript
import { Option } from '@mikkurogue/option-ts';

const noValue = Option.None();
// noValue is { kind: "None" }
```

### `isSome<T>(opt: Option<T>): opt is { kind: "Some"; value: T }`

Checks if an `Option` contains a value (is "Some").

```typescript
import { Option } from '@mikkurogue/option-ts';

const value = Option.Some(10);
if (Option.isSome(value)) {
  console.log(value.value); // 10
}

const noValue = Option.None();
console.log(Option.isSome(noValue)); // false
```

### `isNone<T>(opt: Option<T>): opt is { kind: "None" }`

Checks if an `Option` represents the absence of a value (is "None").

```typescript
import { Option } from '@mikkurogue/option-ts';

const noValue = Option.None();
if (Option.isNone(noValue)) {
  console.log("No value present");
}

const value = Option.Some(10);
console.log(Option.isNone(value)); // false
```

### `ifSome<T>(opt: Option<T>, fn: (val: T) => void): void`

Executes a function if the `Option` is "Some".

```typescript
import { Option } from '@mikkurogue/option-ts';

let result: number | undefined;
Option.ifSome(Option.Some(5), (val) => {
  result = val * 2; // result will be 10
});

Option.ifSome(Option.None(), (val) => {
  // This function will not be executed
});
```

### `unwrap<T>(opt: Option<T>): T`

Extracts the value from a "Some" `Option`. Throws an error if the `Option` is "None". Use with caution.

```typescript
import { Option } from '@mikkurogue/option-ts';

const value = Option.Some(10);
console.log(Option.unwrap(value)); // 10

const noValue = Option.None();
// Option.unwrap(noValue); // Throws Error: Tried to unwrap None
```

### `unwrapOr<T>(opt: Option<T>, fallback: T): T`

Extracts the value from a "Some" `Option`, or returns a fallback value if it's "None".

```typescript
import { Option } from '@mikkurogue/option-ts';

const value = Option.Some(10);
console.log(Option.unwrapOr(value, 0)); // 10

const noValue = Option.None();
console.log(Option.unwrapOr(noValue, 0)); // 0
```

### `fromNullable<T>(val: T | null): Option<T>`

Converts a nullable value (`T | null`) into an `Option<T>`. Returns `Some(value)` if the value is not `null`, otherwise returns `None()`.

```typescript
import { Option } from '@mikkurogue/option-ts';

const nullableValue: number | null = 123;
const option1 = Option.fromNullable(nullableValue); // Option.Some(123)

const nullValue: number | null = null;
const option2 = Option.fromNullable(nullValue); // Option.None()
```

### `fromUndefined<T>(val: T | undefined): Option<T>`

Converts an undefined value (`T | undefined`) into an `Option<T>`. Returns `Some(value)` if the value is not `undefined`, otherwise returns `None()`.

```typescript
import { Option } from '@mikkurogue/option-ts';

const undefinedValue: number | undefined = undefined;
const option1 = Option.fromUndefined(undefinedValue); // Option.None()

const definedValue: number | undefined = 456;
const option2 = Option.fromUndefined(definedValue); // Option.Some(456)
```

### `match<T, R>(opt: Option<T>)`

Provides a way to handle both "Some" and "None" cases of an `Option`.

```typescript
import { Option } from '@mikkurogue/option-ts';

const value = Option.Some(10);
const result1 = Option.match(value).Some((val) => val * 2);
// result1 is Option.Some(20)

const noValue = Option.None();
const result2 = Option.match(noValue).None(() => "default");
// result2 is Option.Some("default")
```

### `map<T, U>(opt: Option<T>, fn: (value: T) => U): Option<U>`

Transforms the value inside a "Some" `Option` using a mapping function. If the `Option` is "None", it remains "None".

```typescript
import { Option } from '@mikkurogue/option-ts';

const value = Option.Some(5);
const mappedValue = Option.map(value, (x) => x * 2); // Option.Some(10)

const noValue = Option.None();
const mappedNoValue = Option.map(noValue, (x: number) => x * 2); // Option.None()
```

### `fromThrowable<T, Args extends any[]>(fn: (...args: Args) => T): (...args: Args) => Option<T>`

Wraps a potentially throwing function into a function that returns an `Option`. If the original function executes successfully, it returns `Some(result)`. If it throws, it returns `None()`.

```typescript
import { Option } from '@mikkurogue/option-ts';

const safeParseInt = Option.fromThrowable(parseInt);

const num1 = safeParseInt("123"); // Option.Some(123)
const num2 = safeParseInt("abc"); // Option.None()
```

### `flatMap<T, U>(opt: Option<T>, fn: (value: T) => Option<U>): Option<U>`

Chains operations that return `Option` types. If the current `Option` is "Some", it applies the function and returns the new `Option`. If it's "None", it propagates the "None".

```typescript
import { Option } from '@mikkurogue/option-ts';

const getUserAge = (user: { name: string; age?: number }): Option.Option<number> => {
  return Option.fromUndefined(user.age);
};

const user1 = Option.Some({ name: "Alice", age: 30 });
const age1 = Option.flatMap(user1, getUserAge); // Option.Some(30)

const user2 = Option.Some({ name: "Bob" });
const age2 = Option.flatMap(user2, getUserAge); // Option.None()
```

### `orElse<T>(opt: Option<T>, fallback: Option<T>): Option<T>`

Returns the `Option` if it is "Some", otherwise returns the provided fallback `Option`.

```typescript
import { Option } from '@mikkurogue/option-ts';

const value = Option.Some(10);
const result1 = Option.orElse(value, Option.Some(0)); // Option.Some(10)

const noValue = Option.None();
const result2 = Option.orElse(noValue, Option.Some(0)); // Option.Some(0)
```

### `filter<T>(opt: Option<T>, predicate: (value: T) => boolean): Option<T>`

Filters a "Some" `Option` based on a predicate. If the `Option` is "Some" and the predicate returns `true`, it remains "Some". Otherwise, it becomes "None".

```typescript
import { Option } from '@mikkurogue/option-ts';

const value = Option.Some(10);
const filteredValue1 = Option.filter(value, (x) => x > 5); // Option.Some(10)

const filteredValue2 = Option.filter(value, (x) => x > 15); // Option.None()
```
