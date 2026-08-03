// RoleModel
export class RoleModel {
    roleName: string;
    description: string | null;

    constructor(data: any) {
        this.roleName = typeof data.roleName === "string" ? data.roleName.trim() : data.roleName;
        this.description = typeof data.description === "string" && data.description.trim() !== "" ? data.description.trim() : null;
    }
}

// UserModel
export class UserModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: number;

    constructor(data: any) {
        this.firstName = typeof data.firstName === "string" ? data.firstName.trim() : data.firstName;
        this.lastName = typeof data.lastName === "string" ? data.lastName.trim() : data.lastName;
        this.email = typeof data.email === "string" ? data.email.trim().toLowerCase() : data.email;
        this.password = data.password;
        this.roleId = data.roleId;
    }
}

// CustomerModel
export class CustomerModel {
    firstName: string;
    lastName: string;
    phone: string | null;
    email: string | null;
    address: string | null;

    constructor(data: any) {
        this.firstName = typeof data.firstName === "string" ? data.firstName.trim() : data.firstName;
        this.lastName = typeof data.lastName === "string" ? data.lastName.trim() : data.lastName;
        this.phone = typeof data.phone === "string" && data.phone.trim() !== "" ? data.phone.trim() : data.phone ?? null;
        this.email = typeof data.email === "string" && data.email.trim() !== "" ? data.email.trim() : data.email ?? null;
        this.address = typeof data.address === "string" && data.address.trim() !== "" ? data.address.trim() : data.address ?? null;
    }
}

// CategoryModel
export class CategoryModel {
    categoryName: string;
    description: string | null;

    constructor(data: any) {
        this.categoryName = typeof data.categoryName === "string" ? data.categoryName.trim() : data.categoryName;
        this.description = typeof data.description === "string" && data.description.trim() !== "" ? data.description.trim() : null;
    }
}

// SupplierModel
export class SupplierModel {
    companyName: string;
    contactPerson: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;

    constructor(data: any) {
        this.companyName = typeof data.companyName === "string" ? data.companyName.trim() : data.companyName;
        this.contactPerson = typeof data.contactPerson === "string" && data.contactPerson.trim() !== "" ? data.contactPerson.trim() : data.contactPerson ?? null;
        this.phone = typeof data.phone === "string" && data.phone.trim() !== "" ? data.phone.trim() : data.phone ?? null;
        this.email = typeof data.email === "string" && data.email.trim() !== "" ? data.email.trim() : data.email ?? null;
        this.address = typeof data.address === "string" && data.address.trim() !== "" ? data.address.trim() : data.address ?? null;
    }
}

// WarehouseModel
export class WarehouseModel {
    warehouseName: string;
    address: string | null;

    constructor(data: any) {
        this.warehouseName = typeof data.warehouseName === "string" ? data.warehouseName.trim() : data.warehouseName;
        this.address = typeof data.address === "string" && data.address.trim() !== "" ? data.address.trim() : data.address ?? null;
    }
}

// ProductModel
export class ProductModel {
    barcode: string;
    productName: string;
    description: string | null;
    purchasePrice: number;
    salePrice: number;
    categoryId: number;
    supplierId: number;

    constructor(data: any) {
        this.barcode = typeof data.barcode === "string" ? data.barcode.trim() : data.barcode;
        this.productName = typeof data.productName === "string" ? data.productName.trim() : data.productName;
        this.description = typeof data.description === "string" && data.description.trim() !== "" ? data.description.trim() : data.description ?? null;
        this.purchasePrice = data.purchasePrice;
        this.salePrice = data.salePrice;
        this.categoryId = data.categoryId;
        this.supplierId = data.supplierId;
    }
}

// StockModel
export class StockModel {
    quantity: number;
    minimumQuantity: number;
    productId: number;
    warehouseId: number;

    constructor(data: any) {
        this.quantity = data.quantity;
        this.minimumQuantity = data.minimumQuantity;
        this.productId = data.productId;
        this.warehouseId = data.warehouseId;
    }
}

// SaleModel
export class SaleModel {
    totalAmount: number;
    paymentMethod: string;
    customerId: number;
    userId: number;

    constructor(data: any) {
        this.totalAmount = data.totalAmount;
        this.paymentMethod = typeof data.paymentMethod === "string" ? data.paymentMethod.trim() : data.paymentMethod;
        this.customerId = data.customerId;
        this.userId = data.userId;
    }
}

// SaleDetailModel
export class SaleDetailModel {
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    saleId: number;
    productId: number;
    warehouseId: number;

    constructor(data: any) {
        this.quantity = data.quantity;
        this.unitPrice = data.unitPrice;
        this.totalPrice = data.totalPrice;
        this.saleId = data.saleId;
        this.productId = data.productId;
        this.warehouseId = data.warehouseId;
    }
}

// AuditLogModel
export class AuditLogModel {
    action: string;
    tableName: string;
    recordId: number;
    userId: number;

    constructor(data: any) {
        this.action = typeof data.action === "string" ? data.action.trim() : data.action;
        this.tableName = typeof data.tableName === "string" ? data.tableName.trim() : data.tableName;
        this.recordId = data.recordId;
        this.userId = data.userId;
    }
}

// LoginModel
export class LoginModel {
    email: string;
    password: string;

    constructor(data: any) {
        this.email = typeof data.email === "string" ? data.email.trim().toLowerCase() : data.email;
        this.password = data.password;
    }
}