import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";
import { SaleDetailModel } from "../models/models.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";

const router = Router();

// GET /sales-details
router.get("/", authenticateToken, authorizeRole(1), async (req, res) => {
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
      message: "Satış detayları getirilirken bir hata oluştu.",
    });
  }
});

// POST /sales-details
router.post("/", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const saleDetailModel = new SaleDetailModel(req.body);

    if (!Validation.saleDetailValidation(saleDetailModel, res)) return;

    const { quantity, productId, warehouseId } = saleDetailModel;

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
        data: saleDetailModel,
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

// GET /sales-details/:id
router.get("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
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

// PUT /sales-details/:id
router.put("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "satış detayı");

    if (id === null) return;

    const saleDetailModel = new SaleDetailModel(req.body);

    if (!Validation.saleDetailValidation(saleDetailModel, res)) return;

    const { quantity, productId, warehouseId } = saleDetailModel;

    const existingSaleDetail = await prisma.saleDetail.findUnique({
      where: {
        id,
      },
    });

    if (!existingSaleDetail) {
      return res.status(404).json({
        message: "Güncellenecek satış detayı bulunamadı.",
      });
    }

    if (existingSaleDetail.productId !== productId || existingSaleDetail.warehouseId !== warehouseId){
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
    
    const quantityDifference = quantity - existingSaleDetail.quantity;
    
    if (quantityDifference > stock.quantity) {
      return res.status(400).json({
        message: "Seçilen depoda yeterli stok bulunmamaktadır.",
      });
    }
    const updatedSaleDetail = await prisma.$transaction(async (tx) => {
      await tx.stock.update({
        where: {
          id: stock.id,
        },
        data: {
          quantity: stock.quantity - quantityDifference,
        },
      });

      const updatedSaleDetail = await tx.saleDetail.update({
        where: {
          id,
        },
        data: saleDetailModel,
      });
      
      return updatedSaleDetail;
    });

    res.status(200).json(updatedSaleDetail);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Satış detayı güncellenirken bir hata oluştu.",
    });
  }
});

// DELETE /sales-details/:id
router.delete("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "satış detayı");

    if (id === null) return;

    const existingSaleDetail = await prisma.saleDetail.findUnique({
      where: {
        id,
      },
    });

    if (!existingSaleDetail) {
      return res.status(404).json({
        message: "Silinecek satış detayı bulunamadı.",
      });
    }

    const stock = await prisma.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId: existingSaleDetail.productId,
          warehouseId: existingSaleDetail.warehouseId,
        },
      },
    });

    if (!stock) {
      return res.status(404).json({
        message: "Satış detayına ait stok kaydı bulunamadı.",
      });
    }
    const deletedsaleDetail = await prisma.$transaction(async (tx) => {
      await tx.stock.update({
        where: {
          id: stock.id,
        },
        data: {
          quantity: stock.quantity + existingSaleDetail.quantity,
        },
      });

      const deletedsaleDetail = await tx.saleDetail.delete({
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