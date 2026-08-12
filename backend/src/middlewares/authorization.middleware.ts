import { Response, NextFunction } from "express";
import type {AuthRequest} from "./auth.middleware.js";

const authorizeRole = (...allowedRoleIds: number[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        
        if (!req.user) {
            return res.status(401).json({
                message: "Kullanıcı doğrulanamadı.",
            });
        }

        if (!allowedRoleIds.includes(req.user.roleId)) {
            return res.status(403).json({
                message: "Bu işlem için yetkiniz bulunmamaktadır.",
            });
        }

        next();
    };
}

export { authorizeRole };