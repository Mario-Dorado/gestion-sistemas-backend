/*
  Warnings:

  - Added the required column `seguroId` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tasaImpositivaId` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportadoraId` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "seguroId" INTEGER NOT NULL,
ADD COLUMN     "tasaImpositivaId" INTEGER NOT NULL,
ADD COLUMN     "transportadoraId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_seguroId_fkey" FOREIGN KEY ("seguroId") REFERENCES "Seguro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_transportadoraId_fkey" FOREIGN KEY ("transportadoraId") REFERENCES "Transportadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_tasaImpositivaId_fkey" FOREIGN KEY ("tasaImpositivaId") REFERENCES "TasaImpositiva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
