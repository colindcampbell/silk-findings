export const modelTypes = {
  groupedFindings: "groupedFindings",
  findings: "findings",
};

export const modelConstants = {
  [modelTypes.groupedFindings]: {
    columns: [
      {
        name: "severity",
        isSortEnabled: true,
        defaultSort: "asc",
        sortField: "severityWeight",
      },
      {
        name: "grouped_finding_created",
        label: "Time",
        type: "datetime",
        isSortEnabled: true,
      },
      { name: "sla", label: "SLA", type: "datetime", isSortEnabled: true },
      { name: "description" },
      { name: "security_analyst" },
      { name: "owner" },
      { name: "workflow" },
      { name: "status" },
      { name: "progress", type: "percentage", isSortEnabled: true }, // show a percentage progress bar with color based on percentage
      // { name: "grouping_type", label: "Type" },
      // { name: "grouping_key", label: "Key" },
    ],
    defaultSort: {
      field: "severity",
      direction: "asc",
      sortField: "severityWeight",
    },
  },
  [modelTypes.findings]: {
    columns: [
      {
        name: "severity",
        defaultSort: "asc",
        sortField: "severityWeight",
        isSortEnabled: true,
      },
      {
        name: "finding_created",
        label: "Time",
        type: "datetime",
        isSortEnabled: true,
      },
      {
        name: "source_security_tool_name",
        label: "Source",
      },
      { name: "description" },
      {
        name: "source_security_tool_id",
        label: "Asset",
      },
      { name: "status" },
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
      field: "severity",
      direction: "asc",
      sortField: "severityWeight",
    },
  },
};

export const chartColorsByField = {
  severity: {
    critical: "#ED8269",
    high: "#F5C94E",
    medium: "#B6CBE8",
    low: "#AAC988",
  },
};

export const rankedSeverities = ["critical", "high", "medium", "low"];
