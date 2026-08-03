import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";
import { StockModel } from "../models/models.js";

const router = Router();

// GET /stocks
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

// POST /stocks
router.post("/", async (req, res) => {
  try {
    const stockModel = new StockModel(req.body);

    if (!Validation.stockValidation(stockModel, res)) return;

    const stock = await prisma.stock.create({
      data: stockModel,
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

// GET /stocks/:id
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

// PUT /stocks/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "stok");

    if (id === null) return;

    const stockModel = new StockModel(req.body);

    if (!Validation.stockValidation(stockModel, res)) return;

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
      data: stockModel,
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

// DELETE /stocks/:id
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