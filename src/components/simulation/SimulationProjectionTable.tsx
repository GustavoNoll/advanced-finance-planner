import { FutureProjectionTab } from "../monthly-view/FutureProjectionTab";
import { InvestmentPlan, Profile, FinancialRecord } from '@/types/financial';
import { YearlyProjectionData } from '@/lib/chart-projections';

interface SimulationProjectionTableProps {
  investmentPlan: InvestmentPlan;
  profile: Profile;
  allFinancialRecords: FinancialRecord[];
  projectionData?: YearlyProjectionData[];
}

export function SimulationProjectionTable({
  investmentPlan,
  profile,
  allFinancialRecords,
  projectionData
}: SimulationProjectionTableProps) {
  return (
    <FutureProjectionTab
      investmentPlan={investmentPlan}
      profile={profile}
      allFinancialRecords={allFinancialRecords}
      projectionData={projectionData}
      showGoalsEvents={false}
      showRealEvolution={false}
      isSimulation={true}
    />
  );
}
