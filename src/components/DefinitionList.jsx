import Typography from "@mui/material/Typography";
import "../styles/DefinitionList.css";
import * as R from "ramda";
import { getCellRenderer } from "./CellRenderers";
import { Fragment } from "react";
import { calcLabelFromName, isString } from "../utils";

export const DefinitionList = ({ items = [] }) => {
  return (
    <dl className="container">
      {R.map(({ label, value, type, name, props = {}, ...rest }) => {
        const Renderer = getCellRenderer(type, DefaultDD);
        return (
          <Fragment key={R.toString({ label, value })}>
            <dt className="d-f ai-c jc-fe">
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="body1"
                align="right"
              >
                {label}
              </Typography>
            </dt>
            <dd className="d-f ai-c">
              <Renderer value={value} field={name} {...rest} {...props} />
            </dd>
          </Fragment>
        );
      }, items)}
    </dl>
  );
};

const DefaultDD = ({ value }) => (
  <Typography variant="body1">
    {isString(value) ? calcLabelFromName(value) : value}
  </Typography>
);
