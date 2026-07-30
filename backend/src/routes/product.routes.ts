import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";

const router = Router();

// Bütün ürünleri getir
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        supplier: true,
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ürünler getirilirken bir hata oluştu.",
    });
  }
});

// Yeni ürün ekle
router.post("/", async (req, res) => {
  try {
    const {
      barcode,
      productName,
      description,
      purchasePrice,
      salePrice,
      categoryId,
      supplierId,
    } = req.body;

    if (!Validation.productValidation(req.body, res)) return;

    const product = await prisma.product.create({
      data: {
        barcode,
        productName,
        description: description ?? null,
        purchasePrice,
        salePrice,
        categoryId,
        supplierId,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ürün eklenirken bir hata oluştu.",
    });
  }
});

// ID ile ürün getir
router.get("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "ürün");

    if (id === null) return;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        supplier: true,
        },
      });

    if (!product) {
      return res.status(404).json({
        message: "Ürün bulunamadı.",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ürün getirilirken bir hata oluştu.",
    });
  }
});

// ID ile ürün güncelle
router.put("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "ürün");

    if (id === null) return;

    const {
      barcode,
      productName,
      description,
      purchasePrice,
      salePrice,
      categoryId,
      supplierId,
    } = req.body;

    if (!Validation.productValidation(req.body, res)) return;

    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Güncellenecek ürün bulunamadı.",
      });
    }
    
    const updatedProduct = await prisma.product.update({
      where: {
        id,
      },
      data: {
        barcode,
        productName,
        description: description ?? null,
        purchasePrice,
        salePrice,
        categoryId,
        supplierId,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ürün güncellenirken bir hata oluştu.",
    });
  }
});

// ID ile ürün sil
router.delete("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "ürün");

    if (id === null) return;

    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Silinecek ürün bulunamadı.",
      });
    }

    const deletedProduct = await prisma.product.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Ürün başarıyla silindi.",
      deletedProduct,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ürün silinirken bir hata oluştu.",
    });
  }
});

export default router;