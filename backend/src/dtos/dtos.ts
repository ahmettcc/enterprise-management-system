export class ProductCatalogDTO {
    id: number;
    productName: string;
    description: string | null;
    salePrice: number;
    categoryName: string;
    available: boolean;

    constructor(product: any) {
        this.id = product.id;
        this.productName = product.productName;
        this.description = product.description;
        this.salePrice = Number(product.salePrice);
        this.categoryName = product.category.categoryName;
        this.available = product.stocks.some((stocks: any) => stocks.quantity > 0);
    }
}