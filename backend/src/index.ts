import "dotenv/config";
import express from "express";
import roleRoutes from "./routes/role.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import warehouseRoutes from "./routes/warehouse.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import saleDetailRoutes from "./routes/sale-detail.routes.js";
import auditLogRoutes from "./routes/audit-log.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/roles", roleRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/sale-details", saleDetailRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend çalışıyor.");
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});