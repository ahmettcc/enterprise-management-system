import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!Validation.loginValidation(req.body, res)) return;

        const user = await prisma.user.findUnique({
            where: {
                email: email.trim().toLowerCase(),
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                passwordHash: true,
                roleId: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                message: "E-posta veya şifre hatalı.",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "E-posta veya şifre hatalı.",
            });
        }

        const { passwordHash, ...safeUser } = user;

        res.status(200).json({
            message: "Giriş başarılı.",
            user: safeUser,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Giriş yapılırken bir hata oluştu.",
        });
    }
});

export default router;