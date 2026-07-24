import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// Bütün satışları getir
router.get("/", async (req, res) => {
  try {
    const sales = await prisma.sale.findMany();

    res.status(200).json(sales);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satışlar getirilirken bir hata oluştu.",
    });
  }
});

// Yeni satış ekle
router.post("/", async (req, res) => {
  try {
    const { totalAmount, paymentMethod, customerId, userId } = req.body;

    if (
      totalAmount === undefined ||
      !paymentMethod ||
      customerId === undefined ||
      userId === undefined
    ) {
      return res.status(400).json({
        message: "Zorunlu satış bilgileri eksiktir.",
      });
    }

    const sale = await prisma.sale.create({
      data: {
        totalAmount,
        paymentMethod,
        customerId,
        userId,
      },
    });

    res.status(201).json(sale);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış eklenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre tek satış getir
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir satış ID'si girilmelidir.",
      });
    }

    const sale = await prisma.sale.findUnique({
      where: {
        id,
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

// ID'ye göre satış güncelle
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir satış ID'si girilmelidir.",
      });
    }

    const { totalAmount, paymentMethod, customerId, userId } = req.body;

    if (
      totalAmount === undefined ||
      !paymentMethod ||
      customerId === undefined ||
      userId === undefined
    ) {
      return res.status(400).json({
        message: "Zorunlu satış bilgileri eksiktir.",
      });
    }

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
      data: {
        totalAmount,
        paymentMethod,
        customerId,
        userId,
      },
    });

    res.status(200).json(updatedSale);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış güncellenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre satış sil
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir satış ID'si girilmelidir.",
      });
    }

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