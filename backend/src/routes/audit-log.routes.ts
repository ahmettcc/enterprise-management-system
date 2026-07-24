import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// Bütün audit log kayıtlarını getir
router.get("/", async (req, res) => {
  try {
    const auditLogs = await prisma.auditLog.findMany();

    res.status(200).json(auditLogs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Audit log kayıtları getirilirken bir hata oluştu.",
    });
  }
});

// Yeni audit log kaydı ekle
router.post("/", async (req, res) => {
  try {
    const { action, tableName, recordId, userId } = req.body;

    if (
      !action ||
      !tableName ||
      recordId === undefined ||
      userId === undefined
    ) {
      return res.status(400).json({
        message: "Tüm audit log bilgileri zorunludur.",
      });
    }

    const auditLog = await prisma.auditLog.create({
      data: {
        action,
        tableName,
        recordId,
        userId,
      },
    });

    res.status(201).json(auditLog);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Audit log kaydı eklenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre tek audit log kaydı getir
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir audit log ID'si girilmelidir.",
      });
    }

    const auditLog = await prisma.auditLog.findUnique({
      where: {
        id,
      },
    });

    if (!auditLog) {
      return res.status(404).json({
        message: "Audit log kaydı bulunamadı.",
      });
    }

    res.status(200).json(auditLog);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Audit log kaydı getirilirken bir hata oluştu.",
    });
  }
});

// ID'ye göre audit log kaydı güncelle
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir audit log ID'si girilmelidir.",
      });
    }

    const { action, tableName, recordId, userId } = req.body;

    if (
      !action ||
      !tableName ||
      recordId === undefined ||
      userId === undefined
    ) {
      return res.status(400).json({
        message: "Tüm audit log bilgileri zorunludur.",
      });
    }

    const existingAuditLog = await prisma.auditLog.findUnique({
      where: {
        id,
      },
    });

    if (!existingAuditLog) {
      return res.status(404).json({
        message: "Güncellenecek audit log kaydı bulunamadı.",
      });
    }

    const updatedAuditLog = await prisma.auditLog.update({
      where: {
        id,
      },
      data: {
        action,
        tableName,
        recordId,
        userId,
      },
    });

    res.status(200).json(updatedAuditLog);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Audit log kaydı güncellenirken bir hata oluştu.",
    });
  }
});

// ID'ye göre audit log kaydı sil
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Geçerli bir audit log ID'si girilmelidir.",
      });
    }

    const existingAuditLog = await prisma.auditLog.findUnique({
      where: {
        id,
      },
    });

    if (!existingAuditLog) {
      return res.status(404).json({
        message: "Silinecek audit log kaydı bulunamadı.",
      });
    }

    const deletedAuditLog = await prisma.auditLog.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Audit log kaydı başarıyla silindi.",
      deletedAuditLog,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Audit log kaydı silinirken bir hata oluştu.",
    });
  }
});

export default router;