// src/services/SaleService.ts
import { Prisma } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";

export class SaleService {
  static async create(
    saleData: Prisma.SaleUncheckedCreateInput,
    products: Prisma.SaleProductUncheckedCreateInput[]
  ) {
    await prismaClient.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: { ...saleData },
      });

      const saleProducts: Prisma.SaleProductUncheckedCreateInput[] = [];

      if (products && products.length > 0) {
        for (const product of products) {
          saleProducts.push({ ...product, saleId: sale.id });
        }
      }

      if (saleData.scheduleId) {
        const scheduleProducts = await tx.scheduleProduct.findMany({
          where: { scheduleId: saleData.scheduleId },
        });

        for (const product of scheduleProducts) {
          saleProducts.push({
            saleId: sale.id,
            productId: product.productId,
            quantity: product.quantity,
            discount: product.discount,
          });
        }
      }

      if (saleProducts.length > 0) {
        await tx.saleProduct.createMany({
          data: saleProducts,
          skipDuplicates: true,
        });
      }
    });
  }
}
