import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";
import { SaleModel } from "../models/models.js";

const router = Router();

// GET /sales
router.get("/", async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        customer: true,
        user: true,
      },
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satışlar getirilirken bir hata oluştu.",
    });
  }
});

// POST /sales
router.post("/", async (req, res) => {
  try {
    const saleModel = new SaleModel(req.body);

    if (!Validation.saleValidation(saleModel, res)) return;

    const sale = await prisma.sale.create({
      data: saleModel,
    });

    res.status(201).json(sale);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış eklenirken bir hata oluştu.",
    });
  }
});

// GET /sales/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "satış");

    if (id === null) return;

    const sale = await prisma.sale.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        user: true,
      },
    });

    if (!sale) {
      return res.status(404).json({
        message: "Satış bulunamadı.",
      });
    }

    res.status(200).json(sale);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış getirilirken bir hata oluştu.",
    });
  }
});

// PUT /sales/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "satış");

    if (id === null) return;

    const saleModel = new SaleModel(req.body);

    if (!Validation.saleValidation(saleModel, res)) return;

    const existingSale = await prisma.sale.findUnique({
      where: {
        id,
      },
    });

    if (!existingSale) {
      return res.status(404).json({
        message: "Güncellenecek satış bulunamadı.",
      });
    }

    const updatedSale = await prisma.sale.update({
      where: {
        id,
      },
      data: saleModel,
    });

    res.status(200).json(updatedSale);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış güncellenirken bir hata oluştu.",
    });
  }
});

// DELETE /sales/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "satış");

    if (id === null) return;

    const existingSale = await prisma.sale.findUnique({
      where: {
        id,
      },
    });

    if (!existingSale) {
      return res.status(404).json({
        message: "Silinecek satış bulunamadı.",
      });
    }

    const deletedSale = await prisma.sale.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Satış başarıyla silindi.",
      deletedSale,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış silinirken bir hata oluştu.",
    });
  }
});

export default router;