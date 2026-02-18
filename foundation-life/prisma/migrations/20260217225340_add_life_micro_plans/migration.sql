-- CreateTable
CREATE TABLE "LifeMicroPlan" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "monthlyIncome" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyExpenses" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyContribution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LifeMicroPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LifeMicroPlan" ADD CONSTRAINT "LifeMicroPlan_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "LifeScenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
