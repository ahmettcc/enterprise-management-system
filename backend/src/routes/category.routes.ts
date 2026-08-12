import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";
import { CategoryModel } from "../models/models.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";

const router = Router();

// GET /categories
router.get("/", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const categories = await prisma.category.findMany();

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kategoriler getirilirken bir hata oluştu.",
    });
  }
});

// POST /categories
router.post("/", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const categoryModel = new CategoryModel(req.body);

    if (!Validation.categoryValidation(categoryModel, res)) return;

    const category = await prisma.category.create({
      data: categoryModel,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kategori eklenirken bir hata oluştu.",
    });
  }
});

// GET /categories/:id
router.get("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const id = Validation.idValidation(
      req.params.id,
      res,
      "kategori"
    );
    
    if (id === null) return;

    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Kategori bulunamadı.",
      });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kategori getirilirken bir hata oluştu.",
    });
  }
});

// PUT /categories/:id
router.put("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const id = Validation.idValidation(
      req.params.id,
      res,
      "kategori"
    );
    
    if (id === null) return;

    const categoryModel = new CategoryModel(req.body);

    if (!Validation.categoryValidation(categoryModel, res)) return;

    const existingCategory = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Güncellenecek kategori bulunamadı.",
      });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id,
      },
      data: categoryModel,
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kategori güncellenirken bir hata oluştu.",
    });
  }
});

// DELETE /categories/:id
router.delete("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const id = Validation.idValidation(
      req.params.id,
      res,
      "kategori"
    );
    
    if (id === null) return;

    const existingCategory = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Silinecek kategori bulunamadı.",
      });
    }

    const deletedCategory = await prisma.category.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Kategori başarıyla silindi.",
      deletedCategory,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kategori silinirken bir hata oluştu.",
    });
  }
});

export default router;