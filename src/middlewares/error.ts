import { ErrorRequestHandler, RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Recurso não encontrado."
    }
  });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  console.error("[api] unexpected error:", error);

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Não foi possível concluir a operação."
    }
  });
};
