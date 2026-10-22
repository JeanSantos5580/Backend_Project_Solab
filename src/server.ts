import { app } from "./app";
import { prismaClient } from "./prisma/client";

const port = Number(process.env.PORT) || 3001;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

async function shutdown(signal: string) {
  console.log(`[api] received ${signal}. Shutting down...`);

  server.close(async () => {
    await prismaClient.$disconnect();
    process.exit(0);
  });

  // Do not hang forever if a connection refuses to close.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
