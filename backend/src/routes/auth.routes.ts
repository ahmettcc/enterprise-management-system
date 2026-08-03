import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { Validation } from "../validations/validations.js";
import { LoginModel } from "../models/models.js";

const router = Router();

// POST /login
router.post("/login", async (req, res) => {
    try {
        const loginModel = new LoginModel(req.body);

        if (!Validation.loginValidation(loginModel, res)) return;

        const { email, password } = loginModel;

        const user = await prisma.user.findUnique({
            where: {
                email,
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