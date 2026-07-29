import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

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

    if (typeof barcode !== "string" || barcode.trim().length === 0 || typeof productName !== "string" || productName.trim().length === 0) {
      return res.status(400).json({
        message: "Barkod ve ürün adı boş olamaz.",
      });
    }

    if (
      !barcode ||
      !productName ||
      purchasePrice === undefined ||
      salePrice === undefined ||
      categoryId === undefined ||
      supplierId === undefined
    ) {
      return res.status(400).json({
        message: "Zorunlu ürün bilgileri eksiktir.",
      });
    }

    if (!Number.isFinite(purchasePrice) || purchasePrice <= 0 || !Number.isFinite(salePrice) || salePrice <= 0) {
      return res.status(400).json({
        message: "Alış ve satış fiyatı pozitif bir sayı olmalıdır.",
      });
    }

    if (!Number.isInteger(categoryId) || categoryId <= 0 || !Number.isInteger(supplierId) || supplierId <= 0) {
      return res.status(400).json({
        message: "Kategori ve tedarikçi ID değerleri pozitif tam sayı olmalıdır.",
      });
    }

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

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir ürün ID'si girilmelidir.",
      });
    }

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

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir ürün ID'si girilmelidir.",
      });
    }

    const {
      barcode,
      productName,
      description,
      purchasePrice,
      salePrice,
      categoryId,
      supplierId,
    } = req.body;

    if (typeof barcode !== "string" || barcode.trim().length === 0 || typeof productName !== "string" || productName.trim().length === 0) {
      return res.status(400).json({
        message: "Barkod ve ürün adı boş olamaz.",
      });
    }

    if (
      !barcode ||
      !productName ||
      purchasePrice === undefined ||
      salePrice === undefined ||
      categoryId === undefined ||
      supplierId === undefined
    ) {
      return res.status(400).json({
        message: "Zorunlu ürün bilgileri eksiktir.",
      });
    }

    if (!Number.isFinite(purchasePrice) || purchasePrice <= 0 || !Number.isFinite(salePrice) || salePrice <= 0) {
      return res.status(400).json({
        message: "Alış ve satış fiyatı pozitif bir sayı olmalıdır.",
      });
    }

    if (!Number.isInteger(categoryId) || categoryId <= 0 || !Number.isInteger(supplierId) || supplierId <= 0) {
      return res.status(400).json({
        message: "Kategori ve tedarikçi ID değerleri pozitif tam sayı olmalıdır.",
      });
    }

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

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir ürün ID'si girilmelidir.",
      });
    }

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