import "dotenv/config";
import express from "express";
import roleRoutes from "./routes/role.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/roles", roleRoutes);

app.get("/", (req, res) => {
  res.send("Backend çalışıyor.");
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});