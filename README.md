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
import { Option, Some, None, ifSome, unwrapOption, unwrapOrOption } from '@mikkurogue/ferrocore';

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
import { Result, Ok, Err, match, fromThrowable } from '@mikkurogue/ferrocore';

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

## Documentation

For more detailed information and examples, please refer to the [full documentation](./docs/README.md).

## Build System

This project uses the standard TypeScript compiler (`tsc`) for its build system.

## Contributing

Contributions are welcome, in any form you'd like.