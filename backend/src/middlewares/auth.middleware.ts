import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET .env dosyasında tanımlı değil.");
}

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        roleId: number;
    };
}  

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Yetkilendirme hatası. Token bulunamadı.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET) as {
            userId: number;
            roleId: number;
        }; 
        req.user = {
            userId: decodedToken.userId,
            roleId: decodedToken.roleId,
        };
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Geçersiz veya süresi dolmuş token.",
        });
    }
}

export { authenticateToken };