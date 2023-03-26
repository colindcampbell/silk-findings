import * as R from "ramda";

export const isNotNil = R.pipe(R.isNil, R.not);
const isNotEmpty = R.pipe(R.isEmpty, R.not);
export const existsAndIsNotEmpty = R.allPass([isNotNil, isNotEmpty]);
export const notEquals = R.pipe(R.equals, R.not);
export const isFunction = R.is(Function);

export const capitalize = R.ifElse(
  R.is(String),
  R.converge(R.concat, [R.pipe(R.head, R.toUpper), R.pipe(R.tail, R.toLower)]),
  R.always("")
);

export const calcLabelFromName = (name) => {
  return R.pipe(R.split("_"), R.map(capitalize), R.join(" "))(name);
};

export const mapIndexed = R.addIndex(R.map);

export const toggleItemInList = R.curry((item, list) =>
  R.includes(item, list) ? R.without([item], list) : R.append(item, list)
);
