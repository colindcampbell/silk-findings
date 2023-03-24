import Typography from "@mui/material/Typography";
import "../styles/DefinitionList.css";
import * as R from "ramda";

export const DefinitionList = ({ items = [] }) => {
  return (
    <dl className="container">
      {R.map(({ label, value }) => {
        return (
          <>
            <dt className="d-f ai-c jc-fe">
              <Typography variant="h6" align="right">
                {label}
              </Typography>
            </dt>
            <dd className="d-f ai-c">
              <Typography variant="body1">{value}</Typography>
            </dd>
          </>
        );
      }, items)}
    </dl>
  );
};
