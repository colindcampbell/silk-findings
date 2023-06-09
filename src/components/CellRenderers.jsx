import {
  apiActions,
  chartColorsByField,
  highToLowRankedSeverities,
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
import { calcLabelFromName, isFunction, NullRender } from "../utils";
import * as R from "ramda";
import { modelGetOperation } from "../service";
import { useQuery } from "@tanstack/react-query";
import "../styles/Cell.css";
import { Loading } from "./Loading";
import { lighten } from "@mui/material";
import moment from "moment";
import { forwardRef } from "react";

export const ChipCell = forwardRef(({ value, field, ...rest }, ref) => {
  const backgroundColor = R.pathOr(
    "#666666",
    [field, value],
    chartColorsByField
  );
  return (
    <Chip
      label={calcLabelFromName(value)}
      sx={{
        backgroundColor,
        color: "white",
        "&:hover": {
          backgroundColor: lighten(backgroundColor, 0.3),
        },
      }}
      ref={ref}
      {...rest}
    />
  );
});

export const SeverityCell = ({ value, field, setFilter }) => {
  const Icon = R.propOr(NullRender, value, severityIconMap);
  const handleClick = () => {
    setFilter(field, (currentVal) =>
      R.equals(currentVal, [value]) ? highToLowRankedSeverities : [value]
    );
  };
  return (
    <ChipCell
      icon={<Icon sx={{ color: "white!important" }} />}
      value={value}
      field={field}
      onClick={isFunction(setFilter) ? handleClick : undefined}
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
    <Box className="d-f fd-c g-6 ai-c w-100" sx={{ width: 164 }}>
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
    </Box>
  );
};

const IconTextCell = ({ value, iconType }) => {
  const Icon = R.propOr(NullRender, iconType, iconTypeMap);
  return (
    <div className="d-f g-6 ai-c">
      <Icon />
      {value}
    </div>
  );
};

const FindingCountCell = ({ field, id, toggleIsOpen, isOpen }) => {
  const { isLoading, data = {} } = useQuery({
    queryKey: [
      modelTypes.findings,
      apiActions.filter,
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
      <Tooltip title={`${isOpen ? "Hide" : "View"} findings`} placement="top">
        <ChipCell
          label={R.path(["meta", "totalCount"], data)}
          field={field}
          value="default"
          onClick={toggleIsOpen}
        />
      </Tooltip>
    </Loading>
  );
};

const DatetimeCell = ({ value }) =>
  moment(value).format("MMM DD YYYY, kk:mm:ss.SS");

const DefaultCell = ({ value }) => value;

const knownCellRenders = {
  [knownColumnTypes.severity]: SeverityCell,
  [knownColumnTypes.status]: StatusCell,
  [knownColumnTypes.statusProgress]: StatusProgressCell,
  [knownColumnTypes.iconText]: IconTextCell,
  [knownColumnTypes.findingCount]: FindingCountCell,
  [knownColumnTypes.datetime]: DatetimeCell,
};

export const getCellRenderer = (type, DefaultRenderer = DefaultCell) => {
  return R.propOr(DefaultRenderer, type, knownCellRenders);
};

const severityIconMap = {
  [knownSeverities.critical]: WhatshotIcon,
  [knownSeverities.high]: WarningIcon,
  [knownSeverities.medium]: ErrorIcon,
  [knownSeverities.low]: ErrorOutlineIcon,
};

const iconTypeMap = {
  [knownIconTypes.avatar]: FaceIcon,
  [knownIconTypes.tool]: ConstructionIcon,
};

const calcProgressClassName = (progress) =>
  R.cond([
    [R.allPass([R.gte(R.__, 0), R.lte(R.__, 0.25)]), R.always("progress-1")],
    [R.allPass([R.gt(R.__, 0.25), R.lte(R.__, 0.5)]), R.always("progress-2")],
    [R.allPass([R.gt(R.__, 0.5), R.lte(R.__, 0.75)]), R.always("progress-3")],
    [R.T, R.always("progress-4")],
  ])(progress);
