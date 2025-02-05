import { DashboardCard } from "@/components/DashboardCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { BudgetCategories } from "@/components/BudgetCategories";
import { SavingsGoal } from "@/components/SavingsGoal";
import { WalletCards } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <WalletCards className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Financial Planner</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard title="Total Balance">
            <p className="stat-value positive-amount">$12,750.00</p>
            <p className="stat-label">+2.5% from last month</p>
          </DashboardCard>
          
          <DashboardCard title="Monthly Income">
            <p className="stat-value positive-amount">$5,200.00</p>
            <p className="stat-label">Regular salary + Freelance</p>
          </DashboardCard>
          
          <DashboardCard title="Monthly Expenses">
            <p className="stat-value negative-amount">$3,850.00</p>
            <p className="stat-label">15 transactions</p>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardCard title="Expense Trends">
              <ExpenseChart />
            </DashboardCard>
          </div>
          
          <div className="space-y-6">
            <DashboardCard title="Budget Categories">
              <BudgetCategories />
            </DashboardCard>
            
            <SavingsGoal />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;