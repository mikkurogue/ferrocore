# @mikkurogue/ferrocore

A TypeScript library providing Rust-inspired `Option` and `Result` types for robust error handling and explicit value presence.

## Features

- **`Option<T>` Type:** Represents the presence (`Some`) or absence (`None`) of a value, helping to eliminate `null` and `undefined` related bugs.
- **`Result<T, E>` Type:** Encapsulates either a successful value (`Ok`) or an error (`Err`), promoting explicit error handling over exceptions.
- **Functional API:** Provides `map`, `flatMap`, `orElse`, `filter`, and `match` functions for composing operations on `Option` and `Result` types.
- **`fromThrowable`:** A utility to convert potentially throwing functions into `Option` or `Result` returning functions, enabling a more functional error handling style.
- **Clean API:** Designed for ease of use and integration into existing TypeScript projects.

## Installation

```bash
npm install @mikkurogue/ferrocore
# or
yarn add @mikkurogue/ferrocore
```

## Usage

### Option Example

```typescript
import { Option, Some, None, ifSome, unwrapOption, unwrapOrOption } from '@mikkurogue/ferrocore/option';

function getUserById(id: string): Option<{ name: string }> {
  if (id === "123") {
    return Some({ name: "Alice" });
  }
  return None();
}

const user = getUserById("123");

ifSome(user, (u) => {
  console.log(`User found: ${u.name}`);
});

const userName = unwrapOrOption(user, { name: "Guest" }).name;
console.log(userName); // Alice

const nonExistentUser = getUserById("456");
const defaultUserName = unwrapOrOption(nonExistentUser, { name: "Guest" }).name;
console.log(defaultUserName); // Guest
```

### Result Example

```typescript
import { Result, Ok, Err, match, fromThrowable } from '@mikkurogue/ferrocore/result';

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Err("Cannot divide by zero");
  }
  return Ok(a / b);
}

const division1 = divide(10, 2);
match(
  division1,
  (val) => console.log(`Result: ${val}`), // Result: 5
  (err) => console.error(`Error: ${err}`)
);

const division2 = divide(10, 0);
match(
  division2,
  (val) => console.log(`Result: ${val}`),
  (err) => console.error(`Error: ${err}`) // Error: Cannot divide by zero
);

const safeParseJson = fromThrowable(
  JSON.parse,
  (e) => (e as Error).message
);

const parsedJson = safeParseJson('{"key": "value"}');
match(
  parsedJson,
  (data) => console.log("Parsed JSON:", data), // Parsed JSON: { key: 'value' }
  (error) => console.error("JSON Error:", error)
);
```

# @mikkurogue/ferrocore

A TypeScript library providing Rust-inspired `Option` and `Result` types for robust error handling and explicit value presence.

## Features

- **`Option<T>` Type:** Represents the presence (`Some`) or absence (`None`) of a value, helping to eliminate `null` and `undefined` related bugs.
- **`Result<T, E>` Type:** Encapsulates either a successful value (`Ok`) or an error (`Err`), promoting explicit error handling over exceptions.
- **Functional API:** Provides `map`, `flatMap`, `orElse`, `filter`, and `match` functions for composing operations on `Option` and `Result` types.
- **`fromThrowable`:** A utility to convert potentially throwing functions into `Option` or `Result` returning functions, enabling a more functional error handling style.
- **Clean API:** Designed for ease of use and integration into existing TypeScript projects.

## Installation

```bash
npm install @mikkurogue/ferrocore
# or
yarn add @mikkurogue/ferrocore
```

## Usage

### Option Example

```typescript
import { Option, Some, None, ifSome, unwrapOption, unwrapOrOption } from '@mikkurogue/ferrocore/option';

function getUserById(id: string): Option<{ name: string }> {
  if (id === "123") {
    return Some({ name: "Alice" });
  }
  return None();
}

const user = getUserById("123");

ifSome(user, (u) => {
  console.log(`User found: ${u.name}`);
});

const userName = unwrapOrOption(user, { name: "Guest" }).name;
console.log(userName); // Alice

const nonExistentUser = getUserById("456");
const defaultUserName = unwrapOrOption(nonExistentUser, { name: "Guest" }).name;
console.log(defaultUserName); // Guest
```

### Result Example

```typescript
import { Result, Ok, Err, match, fromThrowable } from '@mikkurogue/ferrocore/result';

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Err("Cannot divide by zero");
  }
  return Ok(a / b);
}

const division1 = divide(10, 2);
match(
  division1,
  (val) => console.log(`Result: ${val}`), // Result: 5
  (err) => console.error(`Error: ${err}`)
);

const division2 = divide(10, 0);
match(
  division2,
  (val) => console.log(`Result: ${val}`),
  (err) => console.error(`Error: ${err}`) // Error: Cannot divide by zero
);

const safeParseJson = fromThrowable(
  JSON.parse,
  (e) => (e as Error).message
);

const parsedJson = safeParseJson('{"key": "value"}');
match(
  parsedJson,
  (data) => console.log("Parsed JSON:", data), // Parsed JSON: { key: 'value' }
  (error) => console.error("JSON Error:", error)
);
```

### Iter Example

```typescript
import { Iter } from '@mikkurogue/ferrocore/iter';

const numbers = Iter.from([1, 2, 3, 4, 5]);

// Map and filter
const processedNumbers = numbers
  .map(x => x * 2)
  .filter(x => x > 5)
  .collect(); // [6, 8, 10]
console.log(processedNumbers);

// Fold (reduce)
const sum = Iter.from([1, 2, 3]).fold(0, (acc, x) => acc + x); // 6
console.log(sum);

// Find
const found = Iter.from([1, 2, 3, 4]).find(x => x > 2); // 3
console.log(found);

// Flatten
const nested = Iter.from([[1, 2], [3, 4]]).flatten().collect(); // [1, 2, 3, 4]
console.log(nested);

// Take and Skip
const subset = Iter.from([1, 2, 3, 4, 5]).skip(1).take(3).collect(); // [2, 3, 4]
console.log(subset);

// Enumerate
const enumerated = Iter.from(['a', 'b']).enumerate().collect(); // [[0, 'a'], [1, 'b']]
console.log(enumerated);

// Chain
const chained = Iter.from([1, 2]).chain(Iter.from([3, 4])).collect(); // [1, 2, 3, 4]
console.log(chained);

// Zip
const zipped = Iter.from([1, 2]).zip(Iter.from(['a', 'b'])).collect(); // [[1, 'a'], [2, 'b']]
console.log(zipped);

// All and Any
const allEven = Iter.from([2, 4, 6]).all(x => x % 2 === 0); // true
console.log(allEven);
const anyOdd = Iter.from([1, 2, 3]).any(x => x % 2 !== 0); // true
console.log(anyOdd);

// Count, Last, Nth
const count = Iter.from([1, 2, 3]).count(); // 3
console.log(count);
const last = Iter.from([1, 2, 3]).last(); // 3
console.log(last);
const nth = Iter.from([1, 2, 3]).nth(1); // 2
console.log(nth);

// FlatMap
const flatMapped = Iter.from([1, 2]).flatMap(x => [x, x * 10]).collect(); // [1, 10, 2, 20]
console.log(flatMapped);

// Inspect
const inspected: number[] = [];
Iter.from([1, 2]).inspect(x => inspected.push(x)).collect();
console.log(inspected); // [1, 2]

// Position
const pos = Iter.from([10, 20, 30]).position(x => x === 20); // 1
console.log(pos);

// Max and Min
const max = Iter.from([1, 5, 2]).max(); // 5
console.log(max);
const min = Iter.from([1, 5, 2]).min(); // 1
console.log(min);

// Sum and Product
const sumNumbers = Iter.from([1, 2, 3]).sum(); // 6
console.log(sumNumbers);
const productNumbers = Iter.from([1, 2, 3]).product(); // 6
console.log(productNumbers);
```

### Iter API

-   **`Iter.from<T>(iterable: Iterable<T>): Iter<T>`**
    Creates an `Iter` instance from any iterable.
-   **`next(): IteratorResult<T>`**
    Returns the next item from the iterator.
-   **`map<U>(fn: (item: T) => U): Iter<U>`**
    Applies a mapping function to each item in the iterator.
-   **`filter(fn: (item: T) => boolean): Iter<T>`**
    Filters items in the iterator based on a predicate function.
-   **`filterMap<U>(fn: (item: T) => Maybe<U>): Iter<U>`**
    Applies a function that can both map and filter items in the iterator.
-   **`collect(): T[]`**
    Collects all items from the iterator into an array.
-   **`fold<U>(initialValue: U, fn: (acc: U, item: T) => U): U`**
    Reduces the iterator to a single value.
-   **`find(fn: (item: T) => boolean): T | undefined`**
    Searches for an element in the iterator that satisfies a predicate.
-   **`flatten<InnerT>(this: Iter<Iterable<InnerT>>): Iter<InnerT>`**
    Flattens an iterator of iterables into a single iterator.
-   **`take(n: number): Iter<T>`**
    Creates an iterator that yields the first `n` elements.
-   **`skip(n: number): Iter<T>`**
    Creates an iterator that skips the first `n` elements.
-   **`enumerate(): Iter<[number, T]>`**
    Creates an iterator that yields the current count and the element.
-   **`chain(other: Iter<T>): Iter<T>`**
    Chains this iterator with another.
-   **`zip<U>(other: Iter<U>): Iter<[T, U]>`**
    Zips this iterator with another.
-   **`all(fn: (item: T) => boolean): boolean`**
    Tests if every element of the iterator matches a predicate.
-   **`any(fn: (item: T) => boolean): boolean`**
    Tests if any element of the iterator matches a predicate.
-   **`count(): number`**
    Consumes the iterator, counting the number of iterations.
-   **`last(): T | undefined`**
    Consumes the iterator and returns the last element.
-   **`nth(n: number): T | undefined`**
    Returns the `n`-th element of the iterator.
-   **`flatMap<U>(fn: (item: T) => Iterable<U>): Iter<U>`**
    Maps a function over the iterator and flattens the result.
-   **`inspect(fn: (item: T) => void): Iter<T>`**
    Allows peeking at each element of the iterator as it passes through.
-   **`position(fn: (item: T) => boolean): number | undefined`**
    Returns the index of the first element that satisfies a predicate.
-   **`max(): T | undefined`**
    Returns the maximum element of an iterator.
-   **`min(): T | undefined`**
    Returns the minimum element of an iterator.
-   **`sum(this: Iter<number>): number`**
    Sums the elements of an iterator (for numbers only).
-   **`product(this: Iter<number>): number`**
    Multiplies the elements of an iterator (for numbers only).

## Documentation

For more detailed information and examples, please refer to the [full documentation](./docs/README.md).

## Build System

This project uses the standard TypeScript compiler (`tsc`) for its build system.

## Contributing

Contributions are welcome, in any form you'd like.
