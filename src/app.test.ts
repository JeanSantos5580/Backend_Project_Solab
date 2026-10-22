import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("./services/sundataService", () => ({
  listStates: vi.fn().mockResolvedValue(["ACRE"]),
  listCitiesByState: vi.fn().mockResolvedValue(["Rio Branco"]),
  getCityData: vi.fn().mockResolvedValue({
    id: 1,
    lon: -67.81,
    lat: -9.97,
    city: "Rio Branco",
    class: "Capital",
    state: "ACRE",
    annual: 4620,
    jan: 4300,
    feb: 4200,
    mar: 4300,
    apr: 4200,
    may: 4100,
    jun: 4000,
    jul: 4100,
    aug: 4300,
    sep: 4600,
    oct: 4800,
    nov: 4800,
    dec: 4700
  }),
  listAllSolarData: vi.fn().mockResolvedValue([]),
  listSolarDataByState: vi.fn().mockResolvedValue([])
}));

import { app } from "./app";

describe("api", () => {
  it("returns the health status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("returns states with a cache header", async () => {
    const response = await request(app).get("/api/states");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(["ACRE"]);
    expect(response.headers["cache-control"]).toContain("max-age=86400");
  });

  it("returns cities of a state", async () => {
    const response = await request(app).get("/api/states/ACRE/cities");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(["Rio Branco"]);
  });

  it("rejects solar requests without state and city", async () => {
    const response = await request(app).get("/api/solar");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns the solar data of a city", async () => {
    const response = await request(app)
      .get("/api/solar")
      .query({ state: "ACRE", city: "Rio Branco" });

    expect(response.status).toBe(200);
    expect(response.body.city).toBe("Rio Branco");
    expect(response.body.annual).toBe(4620);
  });

  it("returns 404 for an unknown route", async () => {
    const response = await request(app).get("/api/unknown");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});
