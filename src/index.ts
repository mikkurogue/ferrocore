export type Option<T> = { kind: "Some"; value: T } | { kind: "None" };
export const Some = <T>(value: T): Option<T> => ({ kind: "Some", value });
export const None = (): Option<never> => ({ kind: "None" });

export function isSome<T>(opt: Option<T>): opt is { kind: "Some"; value: T } {
    return opt.kind === "Some";
}

export function isNone<T>(opt: Option<T>): opt is { kind: "None" } {
    return opt.kind === "None";
}

export function ifSome<T>(opt: Option<T>, fn: (val: T) => void): void {
    if (isSome(opt)) {
        fn(opt.value);
    }
}

export function unwrap<T>(opt: Option<T>): T {
    if (isSome(opt)) return opt.value;

    throw new Error("Tried to unwrap None")
}

export function unwrapOr<T>(opt: Option<T>, fallback: T): T {
    return isSome(opt) ? opt.value : fallback;
}

export function fromNullable<T>(val: T | null | undefined): Option<T> {
    return val != null ? Some(val) : None()
}

export function match<T, R>(opt: Option<T>) {
    return {
        Some(fn: (val: T) => R) {
            return isSome(opt) ? fn(opt.value) : undefined;
        },
        None(fn: () => R) {
            return isNone(opt) ? fn() : undefined;
        },
    };
}
