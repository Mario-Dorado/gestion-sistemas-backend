-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_costoFronterizoId_fkey";

-- AlterTable
ALTER TABLE "Pedido" ALTER COLUMN "costoFronterizoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_costoFronterizoId_fkey" FOREIGN KEY ("costoFronterizoId") REFERENCES "CostoFronterizo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
