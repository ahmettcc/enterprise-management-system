import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";
import { RoleModel } from "../models/models.js";

const router = Router();

// GET /roles
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

// POST /roles
router.post("/", async (req, res) => {
  try {
    const roleModel = new RoleModel(req.body);

    if (!Validation.roleValidation(roleModel, res)) return;

    const role = await prisma.role.create({
      data: roleModel,
    });

    res.status(201).json(role);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Rol eklenirken bir hata oluştu.",
    });
  }
});

// GET /roles/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "rol");

    if (id === null) return;

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

// PUT /roles/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "rol");

    if (id === null) return;

    const roleModel = new RoleModel(req.body);

    if (!Validation.roleValidation(roleModel, res)) return;

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
      data: roleModel,
    });

    res.status(200).json(updatedRole);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Rol güncellenirken bir hata oluştu.",
    });
  }
});

// DELETE /roles/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "rol");

    if (id === null) return;

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