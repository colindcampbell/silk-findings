import {
  chartColorsByField,
  knownColumnTypes,
  knownIconTypes,
  knownSeverities,
  modelConstants,
  modelTypes,
} from "../constants";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import FaceIcon from "@mui/icons-material/Face";
import ConstructionIcon from "@mui/icons-material/Construction";
import { calcLabelFromName } from "../utils";
import * as R from "ramda";
import { modelGetOperation } from "../service";
import { useQuery } from "@tanstack/react-query";
import "../styles/Cell.css";
import { Loading } from "./Loading";

const severityIconMap = {
  [knownSeverities.critical]: WhatshotIcon,
  [knownSeverities.high]: WarningIcon,
  [knownSeverities.medium]: ErrorIcon,
  [knownSeverities.low]: ErrorOutlineIcon,
};

export const ChipCell = ({ value, field, ...rest }) => {
  const backgroundColor = R.path([field, value], chartColorsByField);
  return (
    <Chip
      label={calcLabelFromName(value)}
      sx={{ backgroundColor, color: "white" }}
      {...rest}
    />
  );
};

export const SeverityCell = ({ value, field }) => {
  const Icon = R.prop(value, severityIconMap);
  return (
    <ChipCell
      icon={<Icon sx={{ color: "white!important" }} />}
      value={value}
      field={field}
    />
  );
};
const StatusCell = ({ value, field }) => (
  <ChipCell value={value} field={field} />
);
const StatusProgressCell = ({ value, field, progress }) => {
  const progressClassName = calcProgressClassName(progress);
  const progressPercent = `${progress * 100}%`;
  return (
    <div className="d-f fd-c g-6 ai-c w-100">
      <ChipCell value={value} field={field} size="small" />
      <Tooltip title={`${progressPercent} Complete`}>
        <Box
          sx={{ width: 160, border: 2, borderColor: "divider" }}
          className="progress-bar"
        >
          <Box
            className={`${progressClassName} progress-bar`}
            sx={{ width: progressPercent }}
          />
        </Box>
      </Tooltip>
    </div>
  );
};

const iconTypeMap = {
  [knownIconTypes.avatar]: FaceIcon,
  [knownIconTypes.tool]: ConstructionIcon,
};
const IconTextCell = ({ value, iconType }) => {
  const Icon = R.prop(iconType, iconTypeMap);
  return (
    <div className="d-f g-6 ai-c">
      <Icon />
      {value}
    </div>
  );
};
const FindingCountCell = ({ field, id, toggleIsOpen }) => {
  const { isLoading, data = {} } = useQuery({
    queryKey: [
      modelTypes.findings,
      "filter",
      {
        filter: {
          grouped_finding_id: id,
        },
        sort: modelConstants[modelTypes.findings].defaultSort,
      },
    ],
    queryFn: modelGetOperation,
    keepPreviousData: true,
  });

  return (
    <Loading isLoading={isLoading}>
      <ChipCell
        label={R.path(["meta", "totalCount"], data)}
        field={field}
        value="default"
        onClick={toggleIsOpen}
      />
    </Loading>
  );
};
const DefaultCell = ({ value }) => value;

const knownCellRenders = {
  [knownColumnTypes.severity]: SeverityCell,
  [knownColumnTypes.status]: StatusCell,
  [knownColumnTypes.statusProgress]: StatusProgressCell,
  [knownColumnTypes.iconText]: IconTextCell,
  [knownColumnTypes.findingCount]: FindingCountCell,
};

export const getCellRenderer = (type) => {
  return R.propOr(DefaultCell, type, knownCellRenders);
};

const calcProgressClassName = (progress) =>
  R.cond([
    [R.allPass([R.gte(R.__, 0), R.lte(R.__, 0.25)]), R.always("progress-1")],
    [R.allPass([R.gt(R.__, 0.25), R.lte(R.__, 0.5)]), R.always("progress-2")],
    [R.allPass([R.gt(R.__, 0.5), R.lte(R.__, 0.75)]), R.always("progress-3")],
    [R.T, R.always("progress-4")],
  ])(progress);
