import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";

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

    if (!Validation.warehouseValidation(req.body, res)) return;

    const warehouse = await prisma.warehouse.create({
      data: {
        warehouseName: warehouseName.trim(),
        address:
          typeof address === "string" && address.trim() !== ""
            ? address.trim()
            : null,
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
    const id = Validation.idValidation(req.params.id, res, "depo");

    if (id === null) return;

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
    const id = Validation.idValidation(req.params.id, res, "depo");

    if (id === null) return;

    const { warehouseName, address } = req.body;

    if (!Validation.warehouseValidation(req.body, res)) return;

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
      warehouseName: warehouseName.trim(),
      address:
        typeof address === "string" && address.trim() !== ""
          ? address.trim()
          : null,
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
    const id = Validation.idValidation(req.params.id, res, "depo");

    if (id === null) return;

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