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
  [modelTypes.findings]: {
    columns: [
      {
        name: "finding_created",
        label: "Created At",
        type: "datetime",
        isSortEnabled: true,
      },
      {
        name: "severity",
        defaultSort: "asc",
        sortField: "severityWeight",
        isSortEnabled: true,
      },
      { name: "status" },
      { name: "description" },
      {
        name: "ticket_created",
        label: "Ticket Created At",
        type: "datetime",
        isSortEnabled: true,
      },
      {
        name: "source_collbartion_tool_name",
        label: "Collaboration Tool",
      },
      // {
      //   name: "source_collbartion_tool_id",
      //   label: "Collaboration Tool ID",
      // },
      {
        name: "source_security_tool_name",
        label: "Security Tool",
      },
      {
        name: "source_security_tool_id",
        label: "Security Tool ID",
      },
      // { name: "asset" },
      // { name: "remediation_url", label: "Remediation URL" }, // TODO: make the text a hyperlink
      { name: "remediation_text" },
    ],
    defaultSort: {
      field: "finding_created",
      direction: "desc",
    },
  },
};
