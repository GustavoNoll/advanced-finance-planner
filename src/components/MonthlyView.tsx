import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "./DashboardCard";
import { useTranslation } from "react-i18next";
import { BarChart } from "lucide-react";
import { YearlyProjectionData } from '@/lib/chart-projections';
import { FinancialRecord, InvestmentPlan, MicroInvestmentPlan, Goal, ProjectedEvent, Profile } from '@/types/financial';
import { ReturnChartTab, TableTab, FutureProjectionTab } from "./monthly-view";

export const MonthlyView = ({ 
  userId, 
  allFinancialRecords,
  investmentPlan, 
  activeMicroPlan,
  profile,
  projectionData
}: {
  userId: string;
  allFinancialRecords: FinancialRecord[];
  investmentPlan: InvestmentPlan;
  activeMicroPlan: MicroInvestmentPlan | null;
  profile: Profile;
  projectionData?: YearlyProjectionData[];
}) => {
  const { t } = useTranslation();
  return (
    <DashboardCard 
      title={t('monthlyView.title')}
      className="col-span-full"
      icon={BarChart}
    >
      <Tabs defaultValue={allFinancialRecords.length > 0 ? "returnChart" : "table"} className="w-full">
        <TabsList className={`grid w-full ${allFinancialRecords.length > 0 ? 'grid-cols-3' : 'grid-cols-2'} lg:w-[800px] gap-2 bg-gray-100 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg`}>
          {allFinancialRecords.length > 0 && (
            <TabsTrigger 
              value="returnChart"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-gray-700 dark:text-gray-300"
            >
              {t('monthlyView.tabs.returnChart')}
            </TabsTrigger>
          )}
          <TabsTrigger 
            value="table"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-gray-700 dark:text-gray-300"
          >
            {t('monthlyView.tabs.table')}
          </TabsTrigger>
          <TabsTrigger 
            value="futureProjection"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-gray-700 dark:text-gray-300"
          >
            {t('monthlyView.tabs.futureProjection')}
          </TabsTrigger>
        </TabsList>
        
        {allFinancialRecords.length > 0 && (
          <TabsContent value="returnChart" className="space-y-4">
            <ReturnChartTab
              allFinancialRecords={allFinancialRecords}
              investmentPlan={investmentPlan}
              activeMicroPlan={activeMicroPlan}
              profile={profile}
            />
          </TabsContent>
        )}

        <TabsContent value="table">
          <TableTab
            allFinancialRecords={allFinancialRecords}
            investmentPlan={investmentPlan}
            activeMicroPlan={activeMicroPlan}
            profile={profile}
          />
        </TabsContent>

        <TabsContent value="futureProjection">
          <FutureProjectionTab
            investmentPlan={investmentPlan}
            activeMicroPlan={activeMicroPlan}
            profile={profile}
            allFinancialRecords={allFinancialRecords}
            projectionData={projectionData}
            showGoalsEvents={true}
            showRealEvolution={true}
            isSimulation={false}
          />
        </TabsContent>
      </Tabs>
    </DashboardCard>
  );
};
