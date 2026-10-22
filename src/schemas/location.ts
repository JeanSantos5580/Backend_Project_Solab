import { z } from "zod";

export const stateParamSchema = z
  .string({ required_error: "Estado é obrigatório." })
  .trim()
  .min(1, "Estado é obrigatório.")
  .max(100, "Estado inválido.");

export const cityQuerySchema = z.object({
  state: stateParamSchema,
  city: z
    .string({ required_error: "Município é obrigatório." })
    .trim()
    .min(1, "Município é obrigatório.")
    .max(200, "Município inválido.")
});
