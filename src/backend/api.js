import { setupWorker, rest } from "msw";
import { modelTypes } from "../constants";
import { handleListResponse, handleGroupedResponse } from "./db";

export const worker = setupWorker(
  rest.get(`/${modelTypes.findings}/filter`, async (req, res, ctx) => {
    const response = await handleListResponse(modelTypes.findings, req);
    return res(ctx.status(200), ctx.json(response));
  }),
  rest.get(`/${modelTypes.groupedFindings}/filter`, async (req, res, ctx) => {
    const response = await handleListResponse(modelTypes.groupedFindings, req);
    return res(ctx.status(200), ctx.json(response));
  }),
  rest.get(`/${modelTypes.groupedFindings}/grouped`, async (req, res, ctx) => {
    const response = await handleGroupedResponse(
      modelTypes.groupedFindings,
      req
    );
    return res(ctx.status(200), ctx.json(response));
  }),
  rest.get(`/${modelTypes.findings}/grouped`, async (req, res, ctx) => {
    const response = await handleGroupedResponse(modelTypes.findings, req);
    return res(ctx.status(200), ctx.json(response));
  })
);
