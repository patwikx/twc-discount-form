-- CreateTable
CREATE TABLE "DiscountApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "availmentDate" DATETIME NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "hotel" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approverEmail" TEXT NOT NULL,
    "qrToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "usedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscountApplication_qrToken_key" ON "DiscountApplication"("qrToken");
