import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";
import { WarehouseModel } from "../models/models.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";

const router = Router();

// GET /warehouses
router.get("/", authenticateToken, authorizeRole(1), async (req, res) => {
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

// POST /warehouses
router.post("/", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const warehouseModel = new WarehouseModel(req.body);

    if (!Validation.warehouseValidation(warehouseModel, res)) return;

    const warehouse = await prisma.warehouse.create({
      data: warehouseModel,
    });

    res.status(201).json(warehouse);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Depo eklenirken bir hata oluştu.",
    });
  }
});

// GET /warehouses/:id
router.get("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
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

// PUT /warehouses/:id
router.put("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "depo");

    if (id === null) return;

    const warehouseModel = new WarehouseModel(req.body);

    if (!Validation.warehouseValidation(warehouseModel, res)) return;

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
      data: warehouseModel,
    });

    res.status(200).json(updatedWarehouse);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Depo güncellenirken bir hata oluştu.",
    });
  }
});

// DELETE /warehouses/:id
router.delete("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
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