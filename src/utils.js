import * as R from "ramda";
import { knownColumnNames } from "./constants";

export const isNotNil = R.pipe(R.isNil, R.not);
const isNotEmpty = R.pipe(R.isEmpty, R.not);
export const existsAndIsNotEmpty = R.allPass([isNotNil, isNotEmpty]);
export const notEquals = R.pipe(R.equals, R.not);
export const isFunction = R.is(Function);
export const isString = R.is(String);

export const capitalize = R.ifElse(
  isString,
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

export const NullRender = () => null;

export const calcDefinitionListItems = (row, columns) => {
  const items = R.pipe(
    R.omit([
      knownColumnNames.severityWeight,
      knownColumnNames.model,
      knownColumnNames.progress,
    ]),
    R.keys,
    R.map((field) =>
      R.pipe(
        R.find((settings) => R.propEq("name", field, settings)),
        R.defaultTo({ name: field })
      )(columns)
    ),
    R.map(({ name, label, ...rest }) => ({
      label: label || calcLabelFromName(name),
      value: R.propOr("", name, row),
      name,
      ...rest,
      ...row,
    })),
    R.sortBy(R.prop("label"))
  )(row);
  return items;
};
