-- CreateTable
CREATE TABLE "sundata" (
    "id" SERIAL NOT NULL,
    "lon" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "city" VARCHAR(512),
    "class" VARCHAR(512),
    "state" VARCHAR(512),
    "annual" INTEGER,
    "jan" INTEGER,
    "feb" INTEGER,
    "mar" INTEGER,
    "apr" INTEGER,
    "may" INTEGER,
    "jun" INTEGER,
    "jul" INTEGER,
    "aug" INTEGER,
    "sep" INTEGER,
    "oct" INTEGER,
    "nov" INTEGER,
    "dec" INTEGER,

    CONSTRAINT "sundata_pkey" PRIMARY KEY ("id")
);
