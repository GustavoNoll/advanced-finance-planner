// 1. Imports externos
import { useTranslation } from 'react-i18next'
import { BarChart } from 'lucide-react'

// 2. Imports internos (shared)
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { DashboardCard } from '@/shared/components/dashboard/dashboard-card'
import { YearlyProjectionData } from '@/lib/chart-projections'
import { tabTriggerActiveGreen } from '@/lib/gradient-classes'

// 3. Imports internos (feature)
import { FinancialRecord, InvestmentPlan, MicroInvestmentPlan, Goal, ProjectedEvent, Profile } from '@/types/financial'
import { ReturnChartTab, TableTab, FutureProjectionTab } from './index'

// 4. Types
interface MonthlyViewProps {
  userId: string
  allFinancialRecords: FinancialRecord[]
  investmentPlan: InvestmentPlan
  activeMicroPlan: MicroInvestmentPlan | null
  profile: Profile
  projectionData?: YearlyProjectionData[]
  goals?: Goal[]
  events?: ProjectedEvent[]
  microPlans?: MicroInvestmentPlan[]
}

// 5. Component
export function MonthlyView({ 
  userId,
  allFinancialRecords,
  investmentPlan,
  activeMicroPlan,
  profile,
  projectionData,
  goals,
  events,
  microPlans
}: MonthlyViewProps) {
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
              className={`${tabTriggerActiveGreen} text-gray-700 dark:text-gray-300 rounded-full transition-all`}
            >
              {t('monthlyView.tabs.returnChart')}
            </TabsTrigger>
          )}
          <TabsTrigger 
            value="table"
            className={`${tabTriggerActiveGreen} text-gray-700 dark:text-gray-300 rounded-full transition-all`}
          >
            {t('monthlyView.tabs.table')}
          </TabsTrigger>
          <TabsTrigger 
            value="futureProjection"
            className={`${tabTriggerActiveGreen} text-gray-700 dark:text-gray-300 rounded-full transition-all`}
          >
            {t('monthlyView.tabs.futureProjection')}
          </TabsTrigger>
        </TabsList>
        
        {allFinancialRecords.length > 0 && (
          <TabsContent value="returnChart" className="space-y-4">
            <ReturnChartTab
              allFinancialRecords={allFinancialRecords}
              investmentPlan={investmentPlan}
              profile={profile}
            />
          </TabsContent>
        )}

        <TabsContent value="table">
          <TableTab
            allFinancialRecords={allFinancialRecords}
            investmentPlan={investmentPlan}
            profile={profile}
          />
        </TabsContent>

        <TabsContent value="futureProjection">
          <FutureProjectionTab
            investmentPlan={investmentPlan}
            microPlans={microPlans}
            activeMicroPlan={activeMicroPlan}
            profile={profile}
            allFinancialRecords={allFinancialRecords}
            projectionData={projectionData}
            showGoalsEvents={true}
            showRealEvolution={true}
            isSimulation={false}
            goals={goals}
            events={events}
          />
        </TabsContent>
      </Tabs>
    </DashboardCard>
  )
}
