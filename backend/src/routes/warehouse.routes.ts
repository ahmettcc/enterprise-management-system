import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// Bütün depoları getir
router.get("/", async (req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany();

    res.status(200).json(warehouses);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Depolar getirilirken bir hata oluştu.",
    });
  }
});

// Yeni depo ekle
router.post("/", async (req, res) => {
  try {
    const { warehouseName, address } = req.body;

    if (!warehouseName) {
      return res.status(400).json({
        message: "Depo adı zorunludur.",
      });
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        warehouseName,
        address: address ?? null,
      },
    });

    res.status(201).json(warehouse);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Depo eklenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre tek depo getir
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir depo ID'si girilmelidir.",
      });
    }

    const warehouse = await prisma.warehouse.findUnique({
      where: {
        id,
      },
    });

    if (!warehouse) {
      return res.status(404).json({
        message: "Depo bulunamadı.",
      });
    }

    res.status(200).json(warehouse);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Depo getirilirken bir hata oluştu.",
    });
  }
});

// ID'ye göre depo güncelle
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir depo ID'si girilmelidir.",
      });
    }

    const { warehouseName, address } = req.body;

    if (!warehouseName) {
      return res.status(400).json({
        message: "Depo adı zorunludur.",
      });
    }

    const existingWarehouse = await prisma.warehouse.findUnique({
      where: {
        id,
      },
    });

    if (!existingWarehouse) {
      return res.status(404).json({
        message: "Güncellenecek depo bulunamadı.",
      });
    }

    const updatedWarehouse = await prisma.warehouse.update({
      where: {
        id,
      },
      data: {
        warehouseName,
        address: address ?? null,
      },
    });

    res.status(200).json(updatedWarehouse);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Depo güncellenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre depo sil
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir depo ID'si girilmelidir.",
      });
    }

    const existingWarehouse = await prisma.warehouse.findUnique({
      where: {
        id,
      },
    });

    if (!existingWarehouse) {
      return res.status(404).json({
        message: "Silinecek depo bulunamadı.",
      });
    }

    const deletedWarehouse = await prisma.warehouse.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Depo başarıyla silindi.",
      deletedWarehouse,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Depo silinirken bir hata oluştu.",
    });
  }
});

export default router;