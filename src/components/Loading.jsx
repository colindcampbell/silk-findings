import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export const Loading = ({ isLoading, children }) => {
  return isLoading ? (
    <Box className="d-f ai-c jc-c h-100">
      <CircularProgress />
    </Box>
  ) : (
    children
  );
};
