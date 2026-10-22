import { prismaClient } from "../prisma/client";

/**
 * Returns only the distinct state names.
 * The frontend needs this to populate the first select.
 */
export async function listStates(): Promise<string[]> {
  const rows = await prismaClient.sundata.findMany({
    distinct: ["state"],
    select: { state: true },
    orderBy: { state: "asc" }
  });

  return rows
    .map((row) => row.state)
    .filter((state): state is string => Boolean(state));
}

/**
 * Returns only the city names of a state.
 */
export async function listCitiesByState(state: string): Promise<string[]> {
  const rows = await prismaClient.sundata.findMany({
    where: { state },
    distinct: ["city"],
    select: { city: true },
    orderBy: { city: "asc" }
  });

  return rows
    .map((row) => row.city)
    .filter((city): city is string => Boolean(city));
}

/**
 * Returns the solarimetric data of one city.
 * findFirst is used because the schema does not enforce a unique
 * constraint on (state, city).
 */
export async function getCityData(state: string, city: string) {
  return prismaClient.sundata.findFirst({
    where: { state, city }
  });
}

/**
 * Legacy helpers kept temporarily so the previous API contract
 * continues to work during the frontend migration.
 */
export async function listAllSolarData() {
  return prismaClient.sundata.findMany();
}

export async function listSolarDataByState(state: string) {
  return prismaClient.sundata.findMany({ where: { state } });
}
