import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";

const router = Router();

// Bütün satış kalemlerini getir
router.get("/", async (req, res) => {
  try {
    const saleDetails = await prisma.saleDetail.findMany({
      include: {
        sale: true,
        product: true,
        warehouse: true,
      },
    });

    res.status(200).json(saleDetails);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış kalemleri getirilirken bir hata oluştu.",
    });
  }
});

// Yeni satış detayı ekle
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

    if (!Validation.saleDetailValidation(req.body, res)) return;

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

    const saleDetail = await prisma.$transaction(async (tx) => {
      const createdsaleDetail = await tx.saleDetail.create({
        data: {
          quantity,
          unitPrice,
          totalPrice,
          saleId,
          productId,
          warehouseId,
        },
      });
    
      await tx.stock.update({
        where: {
          id: stock.id,
        },
        data: {
          quantity: stock.quantity - quantity,
        },
      });
  
      return createdsaleDetail;
    });

    res.status(201).json(saleDetail);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış detayı eklenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre tek satış detayı getir
router.get("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "satış detayı");

    if (id === null) return;

    const saleDetail = await prisma.saleDetail.findUnique({
      where: {
        id,
      },
      include: {
        sale: true,
        product: true,
        warehouse: true,
      },
    });

    if (!saleDetail) {
      return res.status(404).json({
        message: "Satış detayı bulunamadı.",
      });
    }

    res.status(200).json(saleDetail);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış detayı getirilirken bir hata oluştu.",
    });
  }
});

// ID'ye göre satış detayı güncelle
router.put("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "satış detayı");

    if (id === null) return;

    const {
      quantity,
      unitPrice,
      totalPrice,
      saleId,
      productId,
      warehouseId,
    } = req.body;

    if (!Validation.saleDetailValidation(req.body, res)) return;

    const existingsaleDetail = await prisma.saleDetail.findUnique({
      where: {
        id,
      },
    });

    if (!existingsaleDetail) {
      return res.status(404).json({
        message: "Güncellenecek satış detayı bulunamadı.",
      });
    }

    if (existingsaleDetail.productId !== productId || existingsaleDetail.warehouseId !== warehouseId){
      return res.status(400).json({
        message: "PUT işleminde ürün ve depo değiştirilemez.",
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
        message: "Satış detayına ait stok kaydı bulunamadı.",
      });
    }
    
    const quantityDifference = quantity - existingsaleDetail.quantity;
    
    if (quantityDifference > stock.quantity) {
      return res.status(400).json({
        message: "Seçilen depoda yeterli stok bulunmamaktadır.",
      });
    }
    const updatedsaleDetail = await prisma.$transaction(async (tx) => {
      await prisma.stock.update({
        where: {
          id: stock.id,
        },
        data: {
          quantity: stock.quantity - quantityDifference,
        },
      });

      const updatedsaleDetail = await prisma.saleDetail.update({
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
      
      return updatedsaleDetail;
    });

    res.status(200).json(updatedsaleDetail);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış detayı güncellenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre satış detayı sil
router.delete("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "satış detayı");

    if (id === null) return;

    const existingsaleDetail = await prisma.saleDetail.findUnique({
      where: {
        id,
      },
    });

    if (!existingsaleDetail) {
      return res.status(404).json({
        message: "Silinecek satış detayı bulunamadı.",
      });
    }

    const stock = await prisma.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId: existingsaleDetail.productId,
          warehouseId: existingsaleDetail.warehouseId,
        },
      },
    });

    if (!stock) {
      return res.status(404).json({
        message: "Satış detayına ait stok kaydı bulunamadı.",
      });
    }
    const deletedsaleDetail = await prisma.$transaction(async (tx) => {
      await prisma.stock.update({
        where: {
          id: stock.id,
        },
        data: {
          quantity: stock.quantity + existingsaleDetail.quantity,
        },
      });

      const deletedsaleDetail = await prisma.saleDetail.delete({
        where: {
          id,
        },
      });

      return deletedsaleDetail;
    });

    res.status(200).json({
      message: "Satış detayı başarıyla silindi.",
      deletedsaleDetail,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış detayı silinirken bir hata oluştu.",
    });
  }
});

export default router;