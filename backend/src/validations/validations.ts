import type { Response } from "express";

export class Validation {

    //Role Validation
    static roleValidation(data: any, res: Response): boolean {
        const { roleName } = data;

        if (typeof roleName !== "string" || roleName.trim().length === 0) {
            res.status(400).json({
              message: "Rol adı boş olamaz.",
            });

            return false;
        }

        return true;
    }

    //User Validation
    static userValidation(data: any, res: Response): boolean {
        const {
            firstName,
            lastName,
            email,
            passwordHash,
            roleId,
        } = data;
      
        if (typeof firstName !== "string" || firstName.trim().length === 0 || typeof lastName !== "string" || lastName.trim().length === 0) {
            res.status(400).json({
              message: "Ad ve soyad boş olamaz.",
            });
      
            return false;
        }
      
        if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            res.status(400).json({
              message: "Geçerli bir e-posta adresi girilmelidir.",
            });
      
            return false;
        }
      
        if (typeof passwordHash !== "string" || passwordHash.trim().length === 0) {
            res.status(400).json({
              message: "Şifre boş olamaz.",
            });
      
            return false;
        }
      
        if (!Number.isInteger(roleId) || roleId <= 0) {
            res.status(400).json({
              message: "Rol ID pozitif bir tam sayı olmalıdır.",
            });
      
            return false;
        }
      
        return true;
      }
  
    //Customer Validation
    static customerValidation(data: any, res: Response): boolean {
        const { firstName, lastName, phone, email } = data;

        if (typeof firstName !== "string" || firstName.trim().length === 0 || typeof lastName !== "string" || lastName.trim().length === 0) {
            res.status(400).json({
                message: "Müşteri adı ve soyadı boş olamaz.",
            });

            return false;
        }

        if (email !== undefined && email !== null && (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
            res.status(400).json({
                message: "Geçerli bir e-posta adresi girilmelidir.",
            });

            return false;
        }

        if (phone !== undefined && phone !== null && typeof phone !== "string") {
            res.status(400).json({
                message: "Telefon bilgisi metin olmalıdır.",
            });

            return false;
        }

        return true;
    }

    //Category Validation
    static categoryValidation(data: any, res: Response): boolean {
        const { categoryName } = data;
        
        if (
            typeof categoryName !== "string" ||
            categoryName.trim().length === 0
        ) {
        res.status(400).json({
            message: "Kategori adı boş olamaz.",
        });
    
        return false;
      }
    
      return true;
    }

    //Supplier Validation
    static supplierValidation(data: any, res: Response): boolean {
        const {
            companyName,
            phone,
            email,
        } = data;

        if (typeof companyName !== "string" || companyName.trim().length === 0) {
            res.status(400).json({
                message: "Şirket adı boş olamaz.",
            });
  
            return false;
        }
  
        if (email !== undefined && email !== null &&(typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
            res.status(400).json({
                message: "Geçerli bir e-posta adresi girilmelidir.",
            });
  
            return false;
        }
  
        if (phone !== undefined && phone !== null && typeof phone !== "string") {
            res.status(400).json({
                message: "Telefon bilgisi metin olmalıdır.",
            });
  
            return false;
        }
  
        return true;
    }

    //Warehouse Validation
    static warehouseValidation(data: any, res: Response): boolean {
        const { warehouseName } = data;

        if (typeof warehouseName !== "string" || warehouseName.trim().length === 0) {
            res.status(400).json({
                message: "Depo adı boş olamaz.",
            });

            return false;
        }

        return true;
    }

    //Product Validation
    static productValidation(data: any, res: Response): boolean {
        const {
            barcode,
            productName,
            purchasePrice,
            salePrice,
            categoryId,
            supplierId,
        } = data;

        if (typeof barcode !== "string" || barcode.trim().length === 0 || typeof productName !== "string" || productName.trim().length === 0) {
            res.status(400).json({
                message: "Barkod ve ürün adı boş olamaz.",
            });

            return false;
        }

        if (purchasePrice === undefined || salePrice === undefined || categoryId === undefined || supplierId === undefined) {
            res.status(400).json({
                message: "Zorunlu ürün bilgileri eksiktir.",
            });

            return false;
        }

        if (!Number.isFinite(purchasePrice) || purchasePrice <= 0 || !Number.isFinite(salePrice) || salePrice <= 0) {
            res.status(400).json({
                message: "Alış ve satış fiyatı pozitif bir sayı olmalıdır.",
            });

            return false;
        }

        if (!Number.isInteger(categoryId) || categoryId <= 0 || !Number.isInteger(supplierId) || supplierId <= 0) {
            res.status(400).json({
                message: "Kategori ve tedarikçi ID değerleri pozitif tam sayı olmalıdır.",
            });

            return false;
        }

        return true;
    }

    //Stock Validation
    static stockValidation(data: any, res: Response): boolean {
        const { quantity, minimumQuantity, productId, warehouseId } = data;

        if (quantity === undefined || minimumQuantity === undefined || productId === undefined || warehouseId === undefined) {
            res.status(400).json({
                message: "Tüm stok bilgileri zorunludur.",
            });

            return false;
        }

        if (!Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(minimumQuantity) || minimumQuantity < 0) {
            res.status(400).json({
                message: "Stok miktarları sıfır veya pozitif tam sayı olmalıdır.",
            });

            return false;
        }

        if (!Number.isInteger(productId) || productId <= 0 || !Number.isInteger(warehouseId) || warehouseId <= 0) {
            res.status(400).json({
                message: "Ürün ve depo ID değerleri pozitif tam sayı olmalıdır.",
            });

            return false;
        }

        return true;
    }
  
    //Sale Validation
    static saleValidation(data: any, res: Response): boolean {
        const { totalAmount, paymentMethod, customerId, userId } = data;

        if (totalAmount === undefined || paymentMethod === undefined || customerId === undefined || userId === undefined) {
            res.status(400).json({
                message: "Zorunlu satış bilgileri eksiktir.",
            });

            return false;
        }

        if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
            res.status(400).json({
                message: "Toplam tutar pozitif bir sayı olmalıdır.",
            });

            return false;
        }

        if (typeof paymentMethod !== "string" || paymentMethod.trim().length === 0) {
            res.status(400).json({
                message: "Ödeme yöntemi boş olamaz.",
            });
        
            return false;
        }

        if (!Number.isInteger(customerId) || customerId <= 0 || !Number.isInteger(userId) || userId <= 0) {
            res.status(400).json({
                message: "Müşteri ve kullanıcı ID değerleri pozitif tam sayı olmalıdır.",
            });

            return false;
        }

        return true;
    }
  
    //Sale Detail Validation
    static saleDetailValidation(data: any, res: Response): boolean {
        const { quantity, unitPrice, totalPrice, saleId, productId, warehouseId } = data;

        if (quantity === undefined || unitPrice === undefined || totalPrice === undefined || saleId === undefined || productId === undefined || warehouseId === undefined) {
            res.status(400).json({
                message: "Tüm satış detayı bilgileri zorunludur.",
            });

            return false;
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            res.status(400).json({
                message: "Satış miktarı pozitif bir tam sayı olmalıdır.",
            });

            return false;
        }

        if (!Number.isFinite(unitPrice) || unitPrice <= 0 || !Number.isFinite(totalPrice) || totalPrice <= 0) {
            res.status(400).json({
                message: "Birim fiyat ve toplam fiyat pozitif bir sayı olmalıdır.",
            });

            return false;
        }

        if (!Number.isInteger(saleId) || saleId <= 0 || !Number.isInteger(productId) || productId <= 0 || !Number.isInteger(warehouseId) || warehouseId <= 0) {
            res.status(400).json({
                message: "Satış, ürün ve depo ID değerleri pozitif tam sayı olmalıdır.",
            });

            return false;
        }

        return true;
    }
  
    //Audit Log Validation
    static auditLogValidation(data: any, res: Response): boolean {
        const { action, tableName, recordId, userId } = data;

        if (action === undefined || tableName === undefined || recordId === undefined || userId === undefined) {
            res.status(400).json({
                message: "Tüm audit log bilgileri zorunludur.",
            });

            return false;
        }

        if (typeof action !== "string" || action.trim().length === 0 || typeof tableName !== "string" || tableName.trim().length === 0) {
            res.status(400).json({
                message: "İşlem ve tablo adı boş olamaz.",
            });

            return false;
        }

        if (!Number.isInteger(recordId) || recordId <= 0 || !Number.isInteger(userId) || userId <= 0) {
            res.status(400).json({
                message: "Kayıt ve kullanıcı ID değerleri pozitif tam sayı olmalıdır.",
            });

            return false;
        }

        return true;
    }

    // ID Validation
    static idValidation(idValue: unknown, res: Response, tableName: string): number | null {
        const id = Number(idValue);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
            message: `Geçerli bir ${tableName} ID'si girilmelidir.`,
            });

            return null;
        }

        return id;
    }
}