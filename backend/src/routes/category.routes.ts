import { Router } from "express";
import { prisma } from "../lib/prisma.js";

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

    if (typeof categoryName !== "string" || categoryName.trim().length === 0) {
      return res.status(400).json({
        message: "Kategori adı boş olamaz.",
      });
    }

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
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir kategori ID'si girilmelidir.",
      });
    }

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
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Geçerli bir kategori ID'si girilmelidir.",
      });
    }

    const { categoryName, description } = req.body;

    if (typeof categoryName !== "string" || categoryName.trim().length === 0) {
      return res.status(400).json({
        message: "Kategori adı boş olamaz.",
      });
    }

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
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir kategori ID'si girilmelidir.",
      });
    }

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