export {} from "./array";
export { None, Option, Some } from "./option";
export { Err, Ok, Result } from "./result";

const arr = [1, 2, 3, 4];
const arrWithObjectsAndNumericValueOnKey = [
	{ value: 1 },
	{ value: 2 },
	{ value: 3 },
	{ value: 4 },
];

const arrWithObjectsAndStringValueOnKey = [{ value: "s" }, { value: "asdf" }];

arr.sum();
arr.sum();

arrWithObjectsAndNumericValueOnKey.sum("value");
arrWithObjectsAndStringValueOnKey.sum("value");
arrWithObjectsAndStringValueOnKey.product("value");
