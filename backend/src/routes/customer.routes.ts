import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";

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

    if (!Validation.customerValidation(req.body, res)) return;

    const customer = await prisma.customer.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: typeof phone === "string" && phone.trim() !== ""
          ? phone.trim()
          : null,
        email: typeof email === "string" && email.trim() !== ""
          ? email.trim()
          : null,
        address: typeof address === "string" && address.trim() !== ""
          ? address.trim()
          : null,
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
    const id = Validation.idValidation(req.params.id, res, "müşteri");

    if (id === null) return;

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
    const id = Validation.idValidation(req.params.id, res, "müşteri");

    if (id === null) return;

    const { firstName, lastName, phone, email, address } = req.body;

    if (!Validation.customerValidation(req.body, res)) return;

    const updatedCustomer = await prisma.customer.update({
      where: {
        id,
      },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: typeof phone === "string" && phone.trim() !== ""
          ? phone.trim()
          : null,
        email: typeof email === "string" && email.trim() !== ""
          ? email.trim()
          : null,
        address: typeof address === "string" && address.trim() !== ""
          ? address.trim()
          : null,
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
    const id = Validation.idValidation(req.params.id, res, "müşteri");

    if (id === null) return;

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