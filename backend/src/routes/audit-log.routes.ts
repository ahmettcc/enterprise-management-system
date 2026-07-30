import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";

const router = Router();

// Bütün audit log kayıtlarını getir
router.get("/", async (req, res) => {
  try {
    const auditLogs = await prisma.auditLog.findMany({
      include: {
        user: true,
      },
    });

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

    if (!Validation.auditLogValidation(req.body, res)) return;

    const auditLog = await prisma.auditLog.create({
      data: {
        action: action.trim(),
        tableName: tableName.trim(),
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
    const id = Validation.idValidation(req.params.id, res, "audit log");

    if (id === null) return;

    const auditLog = await prisma.auditLog.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
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
    const id = Validation.idValidation(req.params.id, res, "audit log");

    if (id === null) return;

    const { action, tableName, recordId, userId } = req.body;

    if (!Validation.auditLogValidation(req.body, res)) return;

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
        action: action.trim(),
        tableName: tableName.trim(),
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
    const id = Validation.idValidation(req.params.id, res, "audit log");

    if (id === null) return;

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