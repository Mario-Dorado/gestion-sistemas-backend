-- CreateTable
CREATE TABLE "CostoFronterizo" (
    "id" SERIAL NOT NULL,
    "tipoCosto" TEXT NOT NULL,
    "costo" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CostoFronterizo_pkey" PRIMARY KEY ("id")
);
