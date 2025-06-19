/*
  Warnings:

  - You are about to drop the column `cantidad` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `productoId` on the `Pedido` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_productoId_fkey";

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "cantidad",
DROP COLUMN "productoId";

-- CreateTable
CREATE TABLE "ProductoPedido" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "pesoKg" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProductoPedido_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductoPedido" ADD CONSTRAINT "ProductoPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoPedido" ADD CONSTRAINT "ProductoPedido_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
