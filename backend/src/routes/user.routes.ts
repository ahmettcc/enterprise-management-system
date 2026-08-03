import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";
import { UserModel } from "../models/models.js";
import bcrypt from "bcryptjs";

const router = Router();

// GET /users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kullanıcılar getirilirken bir hata oluştu.",
    });
  }
});

// POST /users
router.post("/", async (req, res) => {
  try {
    const userModel = new UserModel(req.body);

    if (!Validation.userValidation(userModel, res)) return;

    const { password, ...userData} = userModel;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        ...userData,
        passwordHash,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kullanıcı eklenirken bir hata oluştu.",
    });
  }
});

// GET /users/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(
      req.params.id, 
      res, 
      "kullanıcı"
    );

    if (id === null) return;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı.",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kullanıcı getirilirken bir hata oluştu.",
    });
  }
});

// PUT /users/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(
      req.params.id,
      res,
      "kullanıcı"
    );

    if (id === null) return;

    const userModel = new UserModel(req.body);

    if (!Validation.userValidation(userModel, res)) return;

    const { password, ...userData } = userModel;

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "Güncellenecek kullanıcı bulunamadı.",
      });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...userData,
        passwordHash,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kullanıcı güncellenirken bir hata oluştu.",
    });
  }
});

// DELETE /users/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Validation.idValidation(
      req.params.id,
      res,
      "kullanıcı"
    );

    if (id === null) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "Silinecek kullanıcı bulunamadı.",
      });
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Kullanıcı başarıyla silindi.",
      deletedUser,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Kullanıcı silinirken bir hata oluştu.",
    });
  }
});

export default router;