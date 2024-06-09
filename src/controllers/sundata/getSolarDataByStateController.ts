import { Request, Response } from "express";
import { prismaClient } from "../../prisma/client";

export async function GetSolarDataByStateController(
  req: Request,
  res: Response
) {
  try {
    const { state } = req.params;
    const sundata = await prismaClient.sundata.findMany({ where: { state } });
    return res.json(sundata);
  } catch (error) {
    console.log("Error when trying to get sun data from this state:", error);
    return res
      .status(500)
      .json({ error: "Error when trying to get sun data from this state." });
  }
}
