import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";
import { ProductModel } from "../models/models.js";
import { ProductCatalogDTO } from "../dtos/dtos.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";

const router = Router();

// GET /products
router.get("/", authenticateToken, authorizeRole(1), async (req, res) => {
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

// POST /products
router.post("/", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const productModel = new ProductModel(req.body);

    if (!Validation.productValidation(productModel, res)) return;

    const product = await prisma.product.create({
      data: productModel,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ürün eklenirken bir hata oluştu.",
    });
  }
});

// GET /products/catalog
router.get("/catalog", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            categoryName: true
          }
        },
        stocks: {
          select: {
            quantity: true
          },
        },
      },
    });

    const productCatalog = [];

    for (const product of products) {
      const productDTO = new ProductCatalogDTO(product);
      productCatalog.push(productDTO);
    }

    res.status(200).json(productCatalog);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ürün kataloğu getirilirken bir hata oluştu.",
    });
  }
});

// GET /products/catalog/:id
router.get("/catalog/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "ürün");

    if (id === null) return;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            categoryName: true
          }
        },
        stocks: {
          select: {
            quantity: true
          },
        },
      },
    });
    if (!product) {
      return res.status(404).json({
        message: "Ürün bulunamadı.",
      });
    }

    res.status(200).json(new ProductCatalogDTO(product));
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ürün kataloğu getirilirken bir hata oluştu.",
    });
  }
});


// GET /products/:id
router.get("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
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

// PUT /products/:id
router.put("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "ürün");

    if (id === null) return;

    const productModel = new ProductModel(req.body);

    if (!Validation.productValidation(productModel, res)) return;

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
      data: productModel,
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Ürün güncellenirken bir hata oluştu.",
    });
  }
});

// DELETE /products/:id
router.delete("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
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