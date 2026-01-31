import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { HelpCircle } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { CurrencyInput } from "@/components/ui/currency-input";
import { InvestmentPlan, MicroInvestmentPlan } from "@/types/financial";
import { CurrencyCode } from "@/utils/currency";

interface ChartAdvancedOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investmentPlan: InvestmentPlan;
  activeMicroPlan: MicroInvestmentPlan | null;
  
  // Value type options
  showRealValues: boolean;
  setShowRealValues: (value: boolean) => void;
  showNegativeValues: boolean;
  setShowNegativeValues: (value: boolean) => void;
  showOldPortfolio: boolean;
  setShowOldPortfolio: (value: boolean) => void;
  
  // Line visibility options
  showProjectedLine: boolean;
  setShowProjectedLine: (value: boolean) => void;
  showPlannedLine: boolean;
  setShowPlannedLine: (value: boolean) => void;
  
  // Chart options
  changeMonthlyDeposit: {
    enabled: boolean;
    value: number;
    date: string;
  };
  setChangeMonthlyDeposit: (value: {
    enabled: boolean;
    value: number;
    date: string;
  }) => void;
  
  changeMonthlyWithdraw: {
    enabled: boolean;
    value: number;
    date: string;
  };
  setChangeMonthlyWithdraw: (value: {
    enabled: boolean;
    value: number;
    date: string;
  }) => void;
}

export const ChartAdvancedOptionsModal = ({
  open,
  onOpenChange,
  investmentPlan,
  activeMicroPlan,
  showRealValues,
  setShowRealValues,
  showNegativeValues,
  setShowNegativeValues,
  showOldPortfolio,
  setShowOldPortfolio,
  showProjectedLine,
  setShowProjectedLine,
  showPlannedLine,
  setShowPlannedLine,
  changeMonthlyDeposit,
  setChangeMonthlyDeposit,
  changeMonthlyWithdraw,
  setChangeMonthlyWithdraw
}: ChartAdvancedOptionsModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('expenseChart.advancedOptions')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('expenseChart.valueType')}</div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors" tabIndex={-1} type="button">
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="max-w-xs bg-white dark:bg-gray-900">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('expenseChart.advancedOptionsHelp')}
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{showRealValues ? t('expenseChart.realValues') : t('expenseChart.nominalValues')}</span>
              <Switch
                checked={showRealValues}
                onCheckedChange={setShowRealValues}
              />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-2 uppercase tracking-wider">{t('expenseChart.display')}</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('expenseChart.noNegativeValues')}</span>
                <Switch
                  checked={!showNegativeValues}
                  onCheckedChange={v => setShowNegativeValues(!v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('expenseChart.showOldPortfolio')}</span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors" tabIndex={-1} type="button">
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="max-w-xs bg-white dark:bg-gray-900">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('expenseChart.showOldPortfolioHelp')}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Switch
                  checked={showOldPortfolio}
                  onCheckedChange={setShowOldPortfolio}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('expenseChart.showProjectedLine')}</span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors" tabIndex={-1} type="button">
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="max-w-xs bg-white dark:bg-gray-900">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('expenseChart.showProjectedLineHelp')}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Switch
                  checked={showProjectedLine}
                  onCheckedChange={setShowProjectedLine}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('expenseChart.showPlannedLine')}</span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors" tabIndex={-1} type="button">
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="max-w-xs bg-white dark:bg-gray-900">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('expenseChart.showPlannedLineHelp')}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Switch
                  checked={showPlannedLine}
                  onCheckedChange={setShowPlannedLine}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('expenseChart.chartOptionsSection')}</div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors" tabIndex={-1} type="button">
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="max-w-xs bg-white dark:bg-gray-900">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('expenseChart.chartOptionsHelp')}
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('expenseChart.changeMonthlyDeposit')}</span>
                <Switch
                  checked={changeMonthlyDeposit.enabled}
                  onCheckedChange={(enabled) => setChangeMonthlyDeposit({ ...changeMonthlyDeposit, enabled })}
                />
              </div>
              
              {changeMonthlyDeposit.enabled && (
                <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                  <div>
                    <Label htmlFor="monthly-deposit" className="text-xs text-gray-600 dark:text-gray-300">
                      {t('expenseChart.newDepositValue', { value: formatCurrency(activeMicroPlan?.monthly_deposit || 0, investmentPlan.currency) })}
                    </Label>
                    <CurrencyInput
                      id="monthly-deposit"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      currency={investmentPlan.currency as CurrencyCode}
                      placeholder="Ex: 5.000,00"
                      defaultValue={changeMonthlyDeposit.value}
                      onValueChange={(value, _name, values) => {
                        const numValue = values?.float ?? 0;
                        setChangeMonthlyDeposit({ 
                          ...changeMonthlyDeposit, 
                          value: numValue
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deposit-date" className="text-xs text-gray-600 dark:text-gray-300">{t('expenseChart.changeDate')}</Label>
                    <Input
                      id="deposit-date"
                      type="month"
                      value={changeMonthlyDeposit.date}
                      onChange={(e) => setChangeMonthlyDeposit({ 
                        ...changeMonthlyDeposit, 
                        date: e.target.value 
                      })}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('expenseChart.changeMonthlyWithdraw')}</span>
                <Switch
                  checked={changeMonthlyWithdraw.enabled}
                  onCheckedChange={(enabled) => setChangeMonthlyWithdraw({ ...changeMonthlyWithdraw, enabled })}
                />
              </div>
              
              {changeMonthlyWithdraw.enabled && (
                <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                  <div>
                    <Label htmlFor="monthly-withdraw" className="text-xs text-gray-600 dark:text-gray-300">
                      {t('expenseChart.newWithdrawValue', { value: formatCurrency(activeMicroPlan?.desired_income || 0, investmentPlan.currency) })}
                    </Label>
                    <CurrencyInput
                      id="monthly-withdraw"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      currency={investmentPlan.currency as CurrencyCode}
                      placeholder="Ex: 3.000,00"
                      defaultValue={changeMonthlyWithdraw.value}
                      onValueChange={(value, _name, values) => {
                        const numValue = values?.float ?? 0;
                        setChangeMonthlyWithdraw({ 
                          ...changeMonthlyWithdraw, 
                          value: numValue
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="withdraw-date" className="text-xs text-gray-600 dark:text-gray-300">{t('expenseChart.changeDate')}</Label>
                    <Input
                      id="withdraw-date"
                      type="month"
                      value={changeMonthlyWithdraw.date}
                      onChange={(e) => setChangeMonthlyWithdraw({ 
                        ...changeMonthlyWithdraw, 
                        date: e.target.value 
                      })}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 