# @mikkurogue/option-ts

A TypeScript library providing Rust-inspired `Option` and `Result` types for robust error handling and explicit value presence.

## Features

- **`Option<T>` Type:** Represents the presence (`Some`) or absence (`None`) of a value, helping to eliminate `null` and `undefined` related bugs.
- **`Result<T, E>` Type:** Encapsulates either a successful value (`Ok`) or an error (`Err`), promoting explicit error handling over exceptions.
- **Functional API:** Provides `map`, `flatMap`, `orElse`, `filter`, and `match` functions for composing operations on `Option` and `Result` types.
- **`fromThrowable`:** A utility to convert potentially throwing functions into `Option` or `Result` returning functions, enabling a more functional error handling style.
- **Clean API:** Designed for ease of use and integration into existing TypeScript projects.

## Installation

```bash
npm install @mikkurogue/option-ts
# or
yarn add @mikkurogue/option-ts
```

## Usage

### Option Example

```typescript
import { Option } from '@mikkurogue/option-ts';

function getUserById(id: string): Option.Option<{ name: string }> {
  if (id === "123") {
    return Option.Some({ name: "Alice" });
  }
  return Option.None();
}

const user = getUserById("123");

Option.ifSome(user, (u) => {
  console.log(`User found: ${u.name}`);
});

const userName = Option.unwrapOr(user, { name: "Guest" }).name;
console.log(userName); // Alice

const nonExistentUser = getUserById("456");
const defaultUserName = Option.unwrapOr(nonExistentUser, { name: "Guest" }).name;
console.log(defaultUserName); // Guest
```

### Result Example

```typescript
import { Result } from '@mikkurogue/option-ts';

function divide(a: number, b: number): Result.Result<number, string> {
  if (b === 0) {
    return Result.Err("Cannot divide by zero");
  }
  return Result.Ok(a / b);
}

const division1 = divide(10, 2);
Result.match(
  division1,
  (val) => console.log(`Result: ${val}`), // Result: 5
  (err) => console.error(`Error: ${err}`)
);

const division2 = divide(10, 0);
Result.match(
  division2,
  (val) => console.log(`Result: ${val}`),
  (err) => console.error(`Error: ${err}`) // Error: Cannot divide by zero
);

const safeParseJson = Result.fromThrowable(
  JSON.parse,
  (e) => (e as Error).message
);

const parsedJson = safeParseJson('{"key": "value"}');
Result.match(
  parsedJson,
  (data) => console.log("Parsed JSON:", data), // Parsed JSON: { key: 'value' }
  (error) => console.error("JSON Error:", error)
);
```

## Documentation

For more detailed information and examples, please refer to the [full documentation](./docs/README.md).

## Build System

This project uses [tsgo](https://github.com/microsoft/tsgo) as its build system for fast and efficient compilation.

## Contributing

Contributions are welcome, in any form you'd like.