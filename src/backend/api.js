import { setupWorker, rest } from "msw";
import { apiActions, modelTypes } from "../constants";
import { handleListResponse, handleGroupedResponse } from "./db";

export const worker = setupWorker(
  rest.get(
    `/${modelTypes.findings}/${apiActions.filter}`,
    async (req, res, ctx) => {
      const response = await handleListResponse(modelTypes.findings, req);
      return res(ctx.status(200), ctx.json(response));
    }
  ),
  rest.get(
    `/${modelTypes.groupedFindings}/${apiActions.filter}`,
    async (req, res, ctx) => {
      const response = await handleListResponse(
        modelTypes.groupedFindings,
        req
      );
      return res(ctx.status(200), ctx.json(response));
    }
  ),
  rest.get(
    `/${modelTypes.groupedFindings}/${apiActions.group}`,
    async (req, res, ctx) => {
      const response = await handleGroupedResponse(
        modelTypes.groupedFindings,
        req
      );
      return res(ctx.status(200), ctx.json(response));
    }
  ),
  rest.get(
    `/${modelTypes.findings}/${apiActions.group}`,
    async (req, res, ctx) => {
      const response = await handleGroupedResponse(modelTypes.findings, req);
      return res(ctx.status(200), ctx.json(response));
    }
  )
);
