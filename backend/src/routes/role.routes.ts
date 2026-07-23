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

    if (!roleName) {
      res.status(400).json({
        message: "Rol adı zorunludur.",
      });

      return;
    }

    const role = await prisma.role.create({
      data: {
        roleName,
        description,
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

export default router;