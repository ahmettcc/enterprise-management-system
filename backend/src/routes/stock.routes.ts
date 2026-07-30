import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";

const router = Router();

// Bütün stok kayıtlarını getir
router.get("/", async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany({
      include: {
        product: true,
        warehouse: true,
      },
    });

    res.status(200).json(stocks);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Stok kayıtları getirilirken bir hata oluştu.",
    });
  }
});

// Yeni stok kaydı ekle
router.post("/", async (req, res) => {
  try {
    const { quantity, minimumQuantity, productId, warehouseId } = req.body;

    if (!Validation.stockValidation(req.body, res)) return;

    const stock = await prisma.stock.create({
      data: {
        quantity,
        minimumQuantity,
        productId,
        warehouseId,
      },
    });

    res.status(201).json(stock);
  } catch (error) {
    console.error(error);

    const prismaError = error as { code?: string };

    if (prismaError.code === "P2002") {
      return res.status(409).json({
        message: "Bu ürün için bu depoda zaten stok kaydı bulunmaktadır.",
      });
    }

    res.status(500).json({
      message: "Stok kaydı eklenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre tek stok kaydı getir
router.get("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "stok");

    if (id === null) return;

    const stock = await prisma.stock.findUnique({
      where: {
        id,
      },
      include: {
        product: true,
        warehouse: true,
      },
    });

    if (!stock) {
      return res.status(404).json({
        message: "Stok kaydı bulunamadı.",
      });
    }

    res.status(200).json(stock);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Stok kaydı getirilirken bir hata oluştu.",
    });
  }
});

// ID'ye göre stok kaydı güncelle
router.put("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "stok");

    if (id === null) return;

    const { quantity, minimumQuantity, productId, warehouseId } = req.body;

    if (!Validation.stockValidation(req.body, res)) return;

    const existingStock = await prisma.stock.findUnique({
      where: {
        id,
      },
    });

    if (!existingStock) {
      return res.status(404).json({
        message: "Güncellenecek stok kaydı bulunamadı.",
      });
    }

    const updatedStock = await prisma.stock.update({
      where: {
        id,
      },
      data: {
        quantity,
        minimumQuantity,
        productId,
        warehouseId,
      },
    });

    res.status(200).json(updatedStock);
  } catch (error) {
    console.error(error);

    const prismaError = error as { code?: string };

    if (prismaError.code === "P2002") {
      return res.status(409).json({
        message: "Bu ürün için bu depoda zaten stok kaydı bulunmaktadır.",
      });
    }


    res.status(500).json({
      message: "Stok kaydı güncellenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre stok kaydı sil
router.delete("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "stok");

    if (id === null) return;

    const existingStock = await prisma.stock.findUnique({
      where: {
        id,
      },
    });

    if (!existingStock) {
      return res.status(404).json({
        message: "Silinecek stok kaydı bulunamadı.",
      });
    }

    const deletedStock = await prisma.stock.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Stok kaydı başarıyla silindi.",
      deletedStock,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Stok kaydı silinirken bir hata oluştu.",
    });
  }
});

export default router;