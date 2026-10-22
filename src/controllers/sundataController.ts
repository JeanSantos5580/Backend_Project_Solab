import { Request, Response } from "express";
import { cityQuerySchema, stateParamSchema } from "../schemas/location";
import {
  getCityData,
  listAllSolarData,
  listCitiesByState,
  listSolarDataByState,
  listStates
} from "../services/sundataService";

const CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800";

function sendValidationError(res: Response, message: string) {
  return res.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message
    }
  });
}

function sendNotFound(res: Response) {
  return res.status(404).json({
    error: {
      code: "LOCATION_NOT_FOUND",
      message: "Localidade não encontrada."
    }
  });
}

export async function getStates(_req: Request, res: Response) {
  const states = await listStates();

  res.set("Cache-Control", CACHE_CONTROL).json(states);
}

export async function getCities(req: Request, res: Response) {
  const parsedState = stateParamSchema.safeParse(req.params.state);

  if (!parsedState.success) {
    return sendValidationError(
      res,
      parsedState.error.issues[0]?.message ?? "Estado inválido."
    );
  }

  const cities = await listCitiesByState(parsedState.data);

  if (cities.length === 0) {
    return sendNotFound(res);
  }

  res.set("Cache-Control", CACHE_CONTROL).json(cities);
}

export async function getSolarData(req: Request, res: Response) {
  const parsedQuery = cityQuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    return sendValidationError(
      res,
      parsedQuery.error.issues[0]?.message ?? "Parâmetros inválidos."
    );
  }

  const data = await getCityData(parsedQuery.data.state, parsedQuery.data.city);

  if (!data) {
    return sendNotFound(res);
  }

  res.set("Cache-Control", CACHE_CONTROL).json(data);
}

/**
 * Legacy handlers. They keep the old contract alive while the
 * frontend is migrated and can be removed afterwards.
 */
export async function getLegacyAll(_req: Request, res: Response) {
  const data = await listAllSolarData();

  res.set("Deprecation", "true").json(data);
}

export async function getLegacyByState(req: Request, res: Response) {
  const parsedState = stateParamSchema.safeParse(req.params.state);

  if (!parsedState.success) {
    return sendValidationError(
      res,
      parsedState.error.issues[0]?.message ?? "Estado inválido."
    );
  }

  const data = await listSolarDataByState(parsedState.data);

  res.set("Deprecation", "true").json(data);
}

export async function getLegacyByCity(req: Request, res: Response) {
  const parsedState = stateParamSchema.safeParse(req.params.state);
  const parsedCity = cityQuerySchema.shape.city.safeParse(req.params.city);

  if (!parsedState.success || !parsedCity.success) {
    return sendValidationError(res, "Estado ou município inválido.");
  }

  const data = await getCityData(parsedState.data, parsedCity.data);

  if (!data) {
    return sendNotFound(res);
  }

  res.set("Deprecation", "true").json([data]);
}
