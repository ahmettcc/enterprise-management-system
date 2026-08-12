import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";
import { CustomerModel } from "../models/models.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";

const router = Router();

// GET /customers
router.get("/", authenticateToken, authorizeRole(1), async (req, res) => {
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

// POST /customers
router.post("/", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const customerModel = new CustomerModel(req.body);

    if (!Validation.customerValidation(customerModel, res)) return;

    const customer = await prisma.customer.create({
      data: customerModel,
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Müşteri eklenirken bir hata oluştu.",
    });
  }
});

// GET /customers/:id
router.get("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
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

// PUT /customers/:id
router.put("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "müşteri");

    if (id === null) return;

    const customerModel = new CustomerModel(req.body);

    if (!Validation.customerValidation(customerModel, res)) return;

    const updatedCustomer = await prisma.customer.update({
      where: {
        id,
      },
      data: customerModel,
    });

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Müşteri güncellenirken bir hata oluştu.",
    });
  }
});

// DELETE /customers/:id
router.delete("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
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