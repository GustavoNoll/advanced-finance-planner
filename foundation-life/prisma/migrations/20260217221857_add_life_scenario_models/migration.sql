-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "baseCurrency" TEXT NOT NULL DEFAULT 'BRL',
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "lifeExpectancyYears" INTEGER NOT NULL DEFAULT 90,
ADD COLUMN     "riskProfile" TEXT;

-- CreateTable
CREATE TABLE "LifeScenario" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LifeScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifeSettings" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "baseNetWorth" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "baseMonthlyIncome" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "baseMonthlyExpenses" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyContribution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expectedReturnYearly" DOUBLE PRECISION NOT NULL DEFAULT 8,
    "inflationYearly" DOUBLE PRECISION NOT NULL DEFAULT 4,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LifeSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifeEvent" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "amount" DOUBLE PRECISION NOT NULL,
    "frequency" TEXT NOT NULL DEFAULT 'once',
    "durationMonths" INTEGER,
    "inflationIndexed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LifeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LifeSettings_scenarioId_key" ON "LifeSettings"("scenarioId");

-- AddForeignKey
ALTER TABLE "LifeScenario" ADD CONSTRAINT "LifeScenario_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifeSettings" ADD CONSTRAINT "LifeSettings_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "LifeScenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifeEvent" ADD CONSTRAINT "LifeEvent_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "LifeScenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
