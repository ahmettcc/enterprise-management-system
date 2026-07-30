import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";

const router = Router();

// Bütün kategorileri getir
router.get("/", async (req, res) => {
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

// Yeni kategori ekle
router.post("/", async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    if (!Validation.categoryValidation(req.body, res)) return;

    const category = await prisma.category.create({
      data: {
        categoryName: categoryName.trim(),
        description:
          typeof description === "string" && description.trim() !== ""
            ? description.trim()
            : null,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kategori eklenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre tek kategori getir
router.get("/:id", async (req, res) => {
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

// ID'ye göre kategori güncelle
router.put("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(
      req.params.id,
      res,
      "kategori"
    );
    
    if (id === null) return;

    const { categoryName, description } = req.body;

    if (!Validation.categoryValidation(req.body, res)) return;

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
      data: {
        categoryName: categoryName.trim(),
        description:
          typeof description === "string" && description.trim() !== ""
          ? description.trim()
            : null,
      },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kategori güncellenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre kategori sil
router.delete("/:id", async (req, res) => {
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