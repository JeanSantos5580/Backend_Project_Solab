import { Request, Response } from "express";
import { prismaClient } from "../../prisma/client";

export async function GetSolarDataByCityController(
  req: Request,
  res: Response
) {
  try {
    const { state, city } = req.params;
    const sundataState = await prismaClient.sundata.findMany({
      where: { state, city }
    });
    
    return res.json(sundataState);
  } catch (error) {
    console.log("Error when trying to get sun data from this city:", error);
    return res
      .status(500)
      .json({ error: "Error when trying to get sun data from this city.." });
  }
}
