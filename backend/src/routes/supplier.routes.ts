import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// Bütün tedarikçileri getir
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

// Yeni tedarikçi ekle
router.post("/", async (req, res) => {
  try {
    const { companyName, contactPerson, phone, email, address } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Şirket adı zorunludur.",
      });
    }

    const supplier = await prisma.supplier.create({
      data: {
        companyName,
        contactPerson: contactPerson ?? null,
        phone: phone ?? null,
        email: email ?? null,
        address: address ?? null,
      },
    });

    res.status(201).json(supplier);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Tedarikçi eklenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre tek tedarikçi getir
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir tedarikçi ID'si girilmelidir.",
      });
    }

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

// ID'ye göre tedarikçi güncelle
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir tedarikçi ID'si girilmelidir.",
      });
    }

    const { companyName, contactPerson, phone, email, address } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Şirket adı zorunludur.",
      });
    }

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
      data: {
        companyName,
        contactPerson: contactPerson ?? null,
        phone: phone ?? null,
        email: email ?? null,
        address: address ?? null,
      },
    });

    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Tedarikçi güncellenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre tedarikçi sil
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir tedarikçi ID'si girilmelidir.",
      });
    }

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