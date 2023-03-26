import * as R from "ramda";

export const modelTypes = {
  findings: "findings",
  groupedFindings: "groupedFindings",
};

export const knownColumnNames = {
  asset: "asset",
  description: "description",
  finding_count: "finding_count",
  finding_created: "finding_created",
  grouped_finding_created: "grouped_finding_created",
  grouping_key: "grouping_key",
  grouping_type: "grouping_type",
  model: "model",
  owner: "owner",
  progress: "progress",
  remediation_text: "remediation_text",
  remediation_url: "remediation_url",
  security_analyst: "security_analyst",
  severity: "severity",
  severityWeight: "severityWeight", // Added for sorting
  sla: "sla",
  source_collbartion_tool_name: "source_collbartion_tool_name",
  source_security_tool_id: "source_security_tool_id",
  source_security_tool_name: "source_security_tool_name",
  status: "status",
  statusProgress: "statusProgress",
  ticket_created: "ticket_created",
  workflow: "workflow",
};

export const apiActions = {
  filter: "filter",
  group: "group",
};

export const sortDirections = {
  asc: "asc",
  desc: "desc",
};

export const knownColumnTypes = {
  datetime: "datetime",
  findingCount: "findingCount",
  iconText: "iconText",
  link: "link",
  severity: "severity",
  status: "status",
  statusProgress: "statusProgress",
};

export const knownIconTypes = {
  avatar: "avatar",
  tool: "tool",
};

const knownColumnSettings = {
  [knownColumnNames.severity]: {
    name: knownColumnNames.severity,
    sortField: knownColumnNames.severityWeight,
    isSortEnabled: true,
    type: knownColumnTypes.severity,
  },
  [knownColumnNames.grouped_finding_created]: {
    name: knownColumnNames.grouped_finding_created,
    label: "Time",
    isSortEnabled: true,
    type: knownColumnTypes.datetime,
  },
  [knownColumnNames.finding_created]: {
    name: knownColumnNames.finding_created,
    label: "Time",
    isSortEnabled: true,
    type: knownColumnTypes.datetime,
  },
  [knownColumnNames.sla]: {
    name: knownColumnNames.sla,
    label: "SLA",
    isSortEnabled: true,
    type: knownColumnTypes.datetime,
  },
  [knownColumnNames.description]: {
    name: knownColumnNames.description,
  },
  [knownColumnNames.security_analyst]: {
    name: knownColumnNames.security_analyst,
    type: knownColumnTypes.iconText,
    props: {
      iconType: knownIconTypes.avatar,
    },
  },
  [knownColumnNames.owner]: {
    name: knownColumnNames.owner,
    type: knownColumnTypes.iconText,
    props: {
      iconType: knownIconTypes.avatar,
    },
  },
  [knownColumnNames.workflow]: {
    name: knownColumnNames.workflow,
  },
  [knownColumnNames.status]: {
    name: knownColumnNames.status,
    type: knownColumnTypes.status,
  },
  [knownColumnNames.statusProgress]: {
    name: knownColumnNames.status,
    type: knownColumnTypes.statusProgress,
  },
  [knownColumnNames.finding_count]: {
    name: knownColumnNames.finding_count,
    type: knownColumnTypes.findingCount,
    label: "# of Findings",
  },
  [knownColumnNames.source_security_tool_name]: {
    name: knownColumnNames.source_security_tool_name,
    label: "Source",
    type: knownColumnTypes.iconText,
    props: {
      iconType: knownIconTypes.tool,
    },
  },
  [knownColumnNames.source_security_tool_id]: {
    name: knownColumnNames.source_security_tool_id,
    label: "Asset",
  },
};

export const modelConstants = {
  [modelTypes.groupedFindings]: {
    columns: [
      knownColumnSettings[knownColumnNames.severity],
      knownColumnSettings[knownColumnNames.grouped_finding_created],
      knownColumnSettings[knownColumnNames.sla],
      knownColumnSettings[knownColumnNames.description],
      knownColumnSettings[knownColumnNames.security_analyst],
      knownColumnSettings[knownColumnNames.owner],
      knownColumnSettings[knownColumnNames.workflow],
      knownColumnSettings[knownColumnNames.statusProgress],
      knownColumnSettings[knownColumnNames.finding_count],
      // { name: "grouping_type", label: "Type" },
      // { name: "grouping_key", label: "Key" },
    ],
    defaultSort: {
      field: knownColumnNames.severity,
      direction: sortDirections.desc,
      sortField: knownColumnNames.severityWeight,
    },
  },
  [modelTypes.findings]: {
    columns: [
      knownColumnSettings[knownColumnNames.severity],
      knownColumnSettings[knownColumnNames.finding_created],
      knownColumnSettings[knownColumnNames.source_security_tool_name],
      knownColumnSettings[knownColumnNames.description],
      knownColumnSettings[knownColumnNames.source_security_tool_id],
      knownColumnSettings[knownColumnNames.status],
      // {
      //   name: "ticket_created",
      //   label: "Ticket Created At",
      //   type: "datetime",
      //   isSortEnabled: true,
      // },
      // {
      //   name: "source_collbartion_tool_name",
      //   label: "Collaboration Tool",
      // },
      // {
      //   name: "source_collbartion_tool_id",
      //   label: "Collaboration Tool ID",
      // },
      // { name: "asset" },
      // { name: "remediation_url", label: "Remediation URL" }, // TODO: make the text a hyperlink
      // { name: "remediation_text" },
    ],
    defaultSort: {
      field: knownColumnNames.severity,
      direction: sortDirections.desc,
      sortField: knownColumnNames.severityWeight,
    },
  },
};

export const chartColorsByField = {
  [knownColumnNames.severity]: {
    critical: "#E9694A",
    high: "#F3C02F",
    medium: "#96B5DE",
    low: "#99BE71",
  },
  [knownColumnNames.status]: {
    in_progress: "#2F85EC",
    open: "#2F85EC",
  },
  [knownColumnNames.finding_count]: {
    default: "#6e559d",
  },
};

export const knownSeverities = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
};

export const rankedSeverities = [
  knownSeverities.low,
  knownSeverities.medium,
  knownSeverities.high,
  knownSeverities.critical,
];

export const highToLowRankedSeverities = R.reverse(rankedSeverities);
