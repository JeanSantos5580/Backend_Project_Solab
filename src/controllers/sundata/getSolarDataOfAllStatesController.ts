import { Request, Response } from "express";
import { prismaClient } from "../../prisma/client";

export async function GetSolarDataOfAllStatesController(
  req: Request,
  res: Response
) {
  try {
    const sundata = await prismaClient.sundata.findMany();
    return res.json(sundata);
  } catch (error) {
    console.log("Error when trying to get sun data:", error);
    return res
      .status(500)
      .json({ error: "Error when trying to get sun data." });
  }
}
