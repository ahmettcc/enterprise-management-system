import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";
import { AuditLogModel } from "../models/models.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorization.middleware.js";

const router = Router();

// GET /audit-logs
router.get("/", authenticateToken, authorizeRole(1), async (req, res) => {
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

// POST /audit-logs
router.post("/", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const auditLogModel = new AuditLogModel(req.body);

    if (!Validation.auditLogValidation(auditLogModel, res)) return;

    const auditLog = await prisma.auditLog.create({
      data: auditLogModel,
    });

    res.status(201).json(auditLog);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Audit log kaydı eklenirken bir hata oluştu.",
    });
  }
});

// GET /audit-logs/:id
router.get("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
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

// PUT /audit-logs/:id
router.put("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
  try {
    const id = Validation.idValidation(req.params.id, res, "audit log");

    if (id === null) return;

    const auditLogModel = new AuditLogModel(req.body);

    if (!Validation.auditLogValidation(auditLogModel, res)) return;

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
      data: auditLogModel,
    });

    res.status(200).json(updatedAuditLog);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Audit log kaydı güncellenirken bir hata oluştu.",
    });
  }
});

// DELETE /audit-logs/:id
router.delete("/:id", authenticateToken, authorizeRole(1), async (req, res) => {
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