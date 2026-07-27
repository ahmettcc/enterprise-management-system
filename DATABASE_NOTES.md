# GÜVENLİ VERİ KAYIT SIRASI

1. Roles
2. Categories
3. Suppliers
4. Warehouses
5. Customers
6. Users
7. Products
8. Stock
9. Sales
10. SaleItems
11. AuditLogs


# MANTIK:

- Users içinde RoleID var
  → Önce Role oluşturulmalı.

- Products içinde CategoryID ve SupplierID var
  → Önce Category ve Supplier oluşturulmalı.

- Stock içinde ProductID ve WarehouseID var
  → Önce Product ve Warehouse oluşturulmalı.

- Sales içinde CustomerID ve UserID var
  → Önce Customer ve User oluşturulmalı.

- SaleItems içinde SaleID, ProductID ve WarehouseID var
  → Önce Sale, Product ve Warehouse oluşturulmalı.

- AuditLogs içinde UserID var
  → Önce User oluşturulmalı.


# STOCK KURALI:

Aynı ProductID + WarehouseID kombinasyonu
yalnızca bir kez bulunabilir.

# Örnek:

ProductID: 1 + WarehouseID: 1 → geçerli

Aynı kombinasyonu tekrar eklemek → hata


# ÖNEMLİ:

Bir tabloda başka bir tablonun ID'sini kullanıyorsam,
o kayıt önce veritabanında bulunmalıdır.