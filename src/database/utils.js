import * as R from "ramda";

const rankedSeverities = ["critical", "high", "medium", "low"];

export const decorateList = (model, list) =>
  R.map(
    R.pipe(
      R.assoc("model", model),
      R.converge(R.assoc("severityWeight"), [
        R.pipe(R.prop("severity"), R.indexOf(R.__, rankedSeverities)),
        R.identity,
      ])
    )
  )(list);
