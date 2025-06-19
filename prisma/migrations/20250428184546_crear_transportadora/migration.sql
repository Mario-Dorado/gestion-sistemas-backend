-- CreateTable
CREATE TABLE "Transportadora" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "costoBase" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Transportadora_pkey" PRIMARY KEY ("id")
);
