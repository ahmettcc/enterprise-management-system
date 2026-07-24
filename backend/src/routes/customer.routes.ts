import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// Bütün müşterileri getir
router.get("/", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();

    res.status(200).json(customers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Müşteriler getirilirken bir hata oluştu.",
    });
  }
});

// Yeni müşteri ekle
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, phone, email, address } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        message: "Müşteri adı ve soyadı zorunludur.",
      });
    }

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        phone: phone ?? null,
        email: email ?? null,
        address: address ?? null,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Müşteri eklenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre tek bir müşteri getir
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir müşteri ID'si girilmelidir.",
      });
    }

    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Müşteri bulunamadı.",
      });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Müşteri getirilirken bir hata oluştu.",
    });
  }
});

// ID'ye göre müşteri güncelle
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir müşteri ID'si girilmelidir.",
      });
    }

    const { firstName, lastName, phone, email, address } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        message: "Müşteri adı ve soyadı zorunludur.",
      });
    }

    const existingCustomer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!existingCustomer) {
      return res.status(404).json({
        message: "Güncellenecek müşteri bulunamadı.",
      });
    }

    const updatedCustomer = await prisma.customer.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        phone: phone ?? null,
        email: email ?? null,
        address: address ?? null,
      },
    });

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Müşteri güncellenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre müşteri sil
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir müşteri ID'si girilmelidir.",
      });
    }

    const existingCustomer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!existingCustomer) {
      return res.status(404).json({
        message: "Silinecek müşteri bulunamadı.",
      });
    }

    const deletedCustomer = await prisma.customer.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Müşteri başarıyla silindi.",
      deletedCustomer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Müşteri silinirken bir hata oluştu.",
    });
  }
});

export default router;