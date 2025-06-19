/*
  Warnings:

  - Added the required column `costoFronterizoId` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "costoFronterizoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_costoFronterizoId_fkey" FOREIGN KEY ("costoFronterizoId") REFERENCES "CostoFronterizo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
