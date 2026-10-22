import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_CSV = resolve(
  process.cwd(),
  "..",
  "Data",
  "sundata-cloud-database.csv"
);

const EXPECTED_HEADER = [
  "lon",
  "lat",
  "city",
  "class",
  "state",
  "annual",
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec"
];

type SundataSeed = Prisma.SundataCreateManyInput;

function toNumber(value: string, field: string, line: number): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Valor numérico inválido em ${field}, linha ${line}: "${value}"`);
  }

  return parsed;
}

function parseLine(line: string, lineNumber: number): SundataSeed | null {
  if (!line.trim()) {
    return null;
  }

  const fields = line.split(";");

  if (fields.length !== EXPECTED_HEADER.length) {
    throw new Error(
      `Linha ${lineNumber} possui ${fields.length} campos; esperado ${EXPECTED_HEADER.length}.`
    );
  }

  const [
    lon,
    lat,
    city,
    klass,
    state,
    annual,
    jan,
    feb,
    mar,
    apr,
    may,
    jun,
    jul,
    aug,
    sep,
    oct,
    nov,
    dec
  ] = fields;

  return {
    lon: toNumber(lon, "lon", lineNumber),
    lat: toNumber(lat, "lat", lineNumber),
    city,
    class: klass,
    state,
    annual: toNumber(annual, "annual", lineNumber),
    jan: toNumber(jan, "jan", lineNumber),
    feb: toNumber(feb, "feb", lineNumber),
    mar: toNumber(mar, "mar", lineNumber),
    apr: toNumber(apr, "apr", lineNumber),
    may: toNumber(may, "may", lineNumber),
    jun: toNumber(jun, "jun", lineNumber),
    jul: toNumber(jul, "jul", lineNumber),
    aug: toNumber(aug, "aug", lineNumber),
    sep: toNumber(sep, "sep", lineNumber),
    oct: toNumber(oct, "oct", lineNumber),
    nov: toNumber(nov, "nov", lineNumber),
    dec: toNumber(dec, "dec", lineNumber)
  };
}

async function readCsv(path: string): Promise<SundataSeed[]> {
  const rows: SundataSeed[] = [];
  const stream = createReadStream(path, { encoding: "utf8" });
  const lines = createInterface({ input: stream, crlfDelay: Infinity });

  let lineNumber = 0;
  let headerChecked = false;

  for await (const line of lines) {
    lineNumber += 1;

    if (!headerChecked) {
      const header = line.split(";").map((column) => column.trim().toLowerCase());

      if (header.join(",") !== EXPECTED_HEADER.join(",")) {
        throw new Error(
          `Cabeçalho inesperado em ${path}. Esperado: ${EXPECTED_HEADER.join(";")}`
        );
      }

      headerChecked = true;
      continue;
    }

    const row = parseLine(line, lineNumber);

    if (row) {
      rows.push(row);
    }
  }

  if (!headerChecked) {
    throw new Error(`Arquivo CSV vazio: ${path}`);
  }

  return rows;
}

async function main() {
  const csvPath = process.env.SEED_CSV ?? DEFAULT_CSV;
  const force = process.env.SEED_FORCE === "1";
  const dryRun = process.env.SEED_DRY_RUN === "1";

  const rows = await readCsv(csvPath);

  if (rows.length === 0) {
    throw new Error(`Nenhum registro encontrado em ${csvPath}.`);
  }

  if (dryRun) {
    console.log(`${rows.length} registros válidos encontrados em ${csvPath}.`);
    return;
  }

  const existing = await prisma.sundata.count();

  if (existing > 0 && !force) {
    console.log(
      `A tabela sundata já possui ${existing} registros. ` +
        "Nada foi alterado. Use SEED_FORCE=1 apenas após um backup para recarregar."
    );
    return;
  }

  if (force) {
    console.warn("SEED_FORCE=1: removendo os registros existentes.");
    await prisma.sundata.deleteMany();
  }

  const chunkSize = 500;

  for (let index = 0; index < rows.length; index += chunkSize) {
    await prisma.sundata.createMany({
      data: rows.slice(index, index + chunkSize)
    });
  }

  console.log(`${rows.length} registros importados de ${csvPath}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
