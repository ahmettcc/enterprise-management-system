import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";
import { SupplierModel } from "../models/models.js";

const router = Router();

// GET /suppliers
router.get("/", async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();

    res.status(200).json(suppliers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Tedarikçiler getirilirken bir hata oluştu.",
    });
  }
});

// POST /suppliers
router.post("/", async (req, res) => {
  try {
    const supplierModel = new SupplierModel(req.body);

    if (!Validation.supplierValidation(supplierModel, res)) return;

    const supplier = await prisma.supplier.create({
    data: supplierModel,
  });

    res.status(201).json(supplier);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Tedarikçi eklenirken bir hata oluştu.",
    });
  }
});

// GET /suppliers/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(
      req.params.id,
      res,
      "tedarikçi"
    );
    
    if (id === null) return;

    const supplier = await prisma.supplier.findUnique({
      where: {
        id,
      },
    });

    if (!supplier) {
      return res.status(404).json({
        message: "Tedarikçi bulunamadı.",
      });
    }

    res.status(200).json(supplier);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Tedarikçi getirilirken bir hata oluştu.",
    });
  }
});

// PUT /suppliers/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(
      req.params.id,
      res,
      "tedarikçi"
    );
    
    if (id === null) return;

    const supplierModel = new SupplierModel(req.body);

    if (!Validation.supplierValidation(supplierModel, res)) return;

    const existingSupplier = await prisma.supplier.findUnique({
      where: {
        id,
      },
    });

    if (!existingSupplier) {
      return res.status(404).json({
        message: "Güncellenecek tedarikçi bulunamadı.",
      });
    }

    const updatedSupplier = await prisma.supplier.update({
      where: {
        id,
      },
      data: supplierModel,
    });

    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Tedarikçi güncellenirken bir hata oluştu.",
    });
  }
});

// DELETE /suppliers/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(
      req.params.id,
      res,
      "tedarikçi"
    );
    
    if (id === null) return;

    const existingSupplier = await prisma.supplier.findUnique({
      where: {
        id,
      },
    });

    if (!existingSupplier) {
      return res.status(404).json({
        message: "Silinecek tedarikçi bulunamadı.",
      });
    }

    const deletedSupplier = await prisma.supplier.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Tedarikçi başarıyla silindi.",
      deletedSupplier,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Tedarikçi silinirken bir hata oluştu.",
    });
  }
});

export default router;