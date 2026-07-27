import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// Bütün satış kalemlerini getir
router.get("/", async (req, res) => {
  try {
    const saleItems = await prisma.saleItem.findMany({
      include: {
        sale: true,
        product: true,
        warehouse: true,
      },
    });

    res.status(200).json(saleItems);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış kalemleri getirilirken bir hata oluştu.",
    });
  }
});

// Yeni satış kalemi ekle
router.post("/", async (req, res) => {
  try {
    const {
      quantity,
      unitPrice,
      totalPrice,
      saleId,
      productId,
      warehouseId,
    } = req.body;

    if (
      quantity === undefined ||
      unitPrice === undefined ||
      totalPrice === undefined ||
      saleId === undefined ||
      productId === undefined ||
      warehouseId === undefined
    ) {
      return res.status(400).json({
        message: "Tüm satış kalemi bilgileri zorunludur.",
      });
    }

      const stock = await prisma.stock.findUnique({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId,
          },
        },
      });
    
      if (!stock) {
        return res.status(404).json({
          message: "Bu ürün seçilen depoda bulunamadı.",
        });
      }

      if (stock.quantity < quantity) {
        return res.status(400).json({
          message: "Seçilen depoda yeterli stok bulunmamaktadır.",
        });
      }

    const saleItem = await prisma.saleItem.create({
      data: {
        quantity,
        unitPrice,
        totalPrice,
        saleId,
        productId,
        warehouseId,
      },
    });

    await prisma.stock.update({
      where: {
        id: stock.id,
      },
      data: {
        quantity: stock.quantity - quantity,
      },
    });

    res.status(201).json(saleItem);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış kalemi eklenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre tek satış kalemi getir
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir satış kalemi ID'si girilmelidir.",
      });
    }

    const saleItem = await prisma.saleItem.findUnique({
      where: {
        id,
      },
      include: {
        sale: true,
        product: true,
        warehouse: true,
      },
    });

    if (!saleItem) {
      return res.status(404).json({
        message: "Satış kalemi bulunamadı.",
      });
    }

    res.status(200).json(saleItem);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış kalemi getirilirken bir hata oluştu.",
    });
  }
});

// ID'ye göre satış kalemi güncelle
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir satış kalemi ID'si girilmelidir.",
      });
    }

    const {
      quantity,
      unitPrice,
      totalPrice,
      saleId,
      productId,
      warehouseId,
    } = req.body;

    if (
      quantity === undefined ||
      unitPrice === undefined ||
      totalPrice === undefined ||
      saleId === undefined ||
      productId === undefined ||
      warehouseId === undefined
    ) {
      return res.status(400).json({
        message: "Tüm satış kalemi bilgileri zorunludur.",
      });
    }

    const existingSaleItem = await prisma.saleItem.findUnique({
      where: {
        id,
      },
    });

    if (!existingSaleItem) {
      return res.status(404).json({
        message: "Güncellenecek satış kalemi bulunamadı.",
      });
    }

    const updatedSaleItem = await prisma.saleItem.update({
      where: {
        id,
      },
      data: {
        quantity,
        unitPrice,
        totalPrice,
        saleId,
        productId,
        warehouseId,
      },
    });

    res.status(200).json(updatedSaleItem);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış kalemi güncellenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre satış kalemi sil
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir satış kalemi ID'si girilmelidir.",
      });
    }

    const existingSaleItem = await prisma.saleItem.findUnique({
      where: {
        id,
      },
    });

    if (!existingSaleItem) {
      return res.status(404).json({
        message: "Silinecek satış kalemi bulunamadı.",
      });
    }

    const deletedSaleItem = await prisma.saleItem.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Satış kalemi başarıyla silindi.",
      deletedSaleItem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış kalemi silinirken bir hata oluştu.",
    });
  }
});

export default router;