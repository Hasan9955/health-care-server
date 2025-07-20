-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "paymentMethod" DROP NOT NULL,
ALTER COLUMN "paymentMethod" DROP DEFAULT;
