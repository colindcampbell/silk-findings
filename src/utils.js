import * as R from "ramda";

export const isNotNil = R.pipe(R.isNil, R.not);

export const capitalize = R.ifElse(
  R.is(String),
  R.converge(R.concat, [R.pipe(R.head, R.toUpper), R.pipe(R.tail, R.toLower)]),
  R.always("")
);

export const calcLabelFromName = (name) => {
  return R.pipe(R.split("_"), R.map(capitalize), R.join(" "))(name);
};
