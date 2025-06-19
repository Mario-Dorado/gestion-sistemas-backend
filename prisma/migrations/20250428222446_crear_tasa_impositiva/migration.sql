-- CreateTable
CREATE TABLE "TasaImpositiva" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TasaImpositiva_pkey" PRIMARY KEY ("id")
);
