import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// Bütün rolleri getir
router.get("/", async (req, res) => {
  try {
    const roles = await prisma.role.findMany();

    res.status(200).json(roles);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Roller getirilirken bir hata oluştu.",
    });
  }
});

// Yeni rol ekle
router.post("/", async (req, res) => {
  try {
    const { roleName, description } = req.body;

    if (typeof roleName !== "string" || roleName.trim().length === 0) {
      return res.status(400).json({
        message: "Rol adı boş olamaz.",
      });
    }

    const role = await prisma.role.create({
      data: {
        roleName: roleName.trim(),
        description:
          typeof description === "string" && description.trim() !== ""
            ? description.trim()
            : null,
      },
    });

    res.status(201).json(role);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Rol eklenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre tek bir rol getir
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir rol ID'si girilmelidir.",
      });
    }

    const role = await prisma.role.findUnique({
      where: {
        id,
      },
    });

    if (!role) {
      return res.status(404).json({
        message: "Rol bulunamadı.",
      });
    }

    res.status(200).json(role);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Rol getirilirken bir hata oluştu.",
    });
  }
});

// ID'ye göre rol güncelle
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Geçerli bir rol ID'si girilmelidir.",
      });
    }

    const { roleName, description } = req.body;

    if (
      typeof roleName !== "string" ||
      roleName.trim().length === 0
    ) {
      return res.status(400).json({
        message: "Rol adı boş olamaz.",
      });
    }

    const existingRole = await prisma.role.findUnique({
      where: {
        id,
      },
    });

    if (!existingRole) {
      return res.status(404).json({
        message: "Güncellenecek rol bulunamadı.",
      });
    }

    const updatedRole = await prisma.role.update({
      where: {
        id,
      },
      data: {
        roleName: roleName.trim(),
        description:
          typeof description === "string" && description.trim() !== ""
            ? description.trim()
            : null,
      },
    });

    res.status(200).json(updatedRole);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Rol güncellenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre rol sil
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir rol ID'si girilmelidir.",
      });
    }

    const existingRole = await prisma.role.findUnique({
      where: {
        id,
      },
    });

    if (!existingRole) {
      return res.status(404).json({
        message: "Silinecek rol bulunamadı.",
      });
    }

    const deletedRole = await prisma.role.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Rol başarıyla silindi.",
      deletedRole,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Rol silinirken bir hata oluştu.",
    });
  }
  
});
export default router;