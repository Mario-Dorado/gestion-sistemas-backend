-- CreateTable
CREATE TABLE "Seguro" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipoCobertura" TEXT NOT NULL,
    "costo" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Seguro_pkey" PRIMARY KEY ("id")
);
