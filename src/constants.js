export const modelTypes = {
  groupedFindings: "groupedFindings",
  findings: "findings",
};

export const modelConstants = {
  [modelTypes.groupedFindings]: {
    columns: [
      {
        name: "grouped_finding_created",
        label: "Created At",
        type: "datetime",
        isSortEnabled: true,
      },
      {
        name: "severity",
        isSortEnabled: true,
        defaultSort: "asc",
        sortField: "severityWeight",
      },
      { name: "status" },
      { name: "description" },
      { name: "owner" },
      { name: "sla", label: "SLA", type: "datetime", isSortEnabled: true },
      { name: "progress", type: "percentage", isSortEnabled: true }, // show a percentage progress bar with color based on percentage
      { name: "security_analyst" },
      { name: "workflow" },
      { name: "grouping_type", label: "Type" },
      { name: "grouping_key", label: "Key" },
    ],
    defaultSort: {
      field: "grouped_finding_created",
      direction: "desc",
    },
  },
};
