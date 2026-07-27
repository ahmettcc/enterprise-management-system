import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// Bütün kullanıcıları getir
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

// Yeni kullanıcı ekle
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, passwordHash, roleId } = req.body;

    if (!firstName || !lastName || !email || !passwordHash || roleId === undefined) {
      return res.status(400).json({
        message: "Ad, soyad, e-posta, şifre ve rol ID zorunludur.",
      });
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        roleId,
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

// ID'ye göre tek kullanıcı getir
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir kullanıcı ID'si girilmelidir.",
      });
    }

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

// ID'ye göre kullanıcı güncelle
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir kullanıcı ID'si girilmelidir.",
      });
    }

    const { firstName, lastName, email, passwordHash, roleId } = req.body;

    if (!firstName || !lastName || !email || !passwordHash || roleId === undefined) {
      return res.status(400).json({
        message: "Ad, soyad, e-posta, şifre ve rol ID zorunludur.",
      });
    }

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

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        roleId,
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

// ID'ye göre kullanıcı sil
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir kullanıcı ID'si girilmelidir.",
      });
    }

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