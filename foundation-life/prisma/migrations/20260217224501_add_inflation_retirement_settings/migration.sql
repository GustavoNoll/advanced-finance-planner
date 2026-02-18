-- AlterTable
ALTER TABLE "LifeSettings" ADD COLUMN     "inflateExpenses" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "inflateIncome" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "inflateRetirementIncome" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "retirementAge" INTEGER NOT NULL DEFAULT 65,
ADD COLUMN     "retirementMonthlyIncome" DOUBLE PRECISION NOT NULL DEFAULT 0;
