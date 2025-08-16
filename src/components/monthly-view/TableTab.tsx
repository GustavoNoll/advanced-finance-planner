import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { FinancialRecord, InvestmentPlan, Profile } from '@/types/financial';
import { formatCurrency, CurrencyCode } from "@/utils/currency";
import { toast } from "@/components/ui/use-toast";

interface TableTabProps {
  allFinancialRecords: FinancialRecord[];
  investmentPlan: InvestmentPlan;
  profile: Profile;
}

export function TableTab({ 
  allFinancialRecords, 
  investmentPlan, 
  profile 
}: TableTabProps) {
  const { t } = useTranslation();
  const RECORDS_PER_PAGE = 12;
  const [page, setPage] = useState(1);

  const paginatedRecords = useMemo(() => {
    const startIndex = 0;
    const endIndex = page * RECORDS_PER_PAGE;
    return allFinancialRecords
      .sort((a, b) => {
        if (b.record_year !== a.record_year) {
          return b.record_year - a.record_year;
        }
        return b.record_month - a.record_month;
      })
      .slice(startIndex, endIndex);
  }, [allFinancialRecords, page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const downloadCSV = async (data: typeof localizedData, filename: string) => {
    try {
      const headers = [
        t('monthlyView.table.headers.month'),
        t('monthlyView.table.headers.initialBalance'),
        t('monthlyView.table.headers.contribution'),
        t('monthlyView.table.headers.returns'),
        t('monthlyView.table.headers.returnPercentage'),
        t('monthlyView.table.headers.endBalance'),
        t('monthlyView.table.headers.targetRentability')
      ];
      
      const rows = data.map(record => [
        record.month,
        Number(record.balance).toFixed(2),
        Number(record.contribution).toFixed(2),
        Number(record.return).toFixed(4),
        `${Number(record.percentage).toFixed(2)}%`,
        Number(record.endBalance).toFixed(2),
        `${Number(record.targetRentability).toFixed(4)}%`
      ]);

      const clientName = profile?.name ? profile.name.replace(/\s+/g, '_').toLowerCase() : filename;
      const dateStr = new Date().toISOString().split('T')[0];
      const csvFileName = `${clientName}_${dateStr}.csv`;
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', csvFileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        title: t('monthlyView.downloadError'),
        variant: "destructive",
      });
    }
  };

  const sortedRecords = paginatedRecords.sort((a, b) => {
    if (a.record_year !== b.record_year) {
      return b.record_year - a.record_year;
    }
    return b.record_month - a.record_month;
  });

  const monthlyData = sortedRecords.map(record => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'];
      
    return {
      month: `${monthNames[record.record_month - 1]}/${record.record_year}`,
      balance: record.starting_balance,
      contribution: record.monthly_contribution,
      percentage: record.monthly_return_rate,
      return: record.monthly_return,
      endBalance: record.ending_balance,
      targetRentability: record.target_rentability
    };
  });

  const localizedData = monthlyData.map(data => ({
    ...data,
    month: `${t(`monthlyView.table.months.${data.month.split('/')[0].toLowerCase()}`)}/${data.month.split('/')[1]}`
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 mb-4">
        <Button
          onClick={() => downloadCSV(localizedData, 'financial_records')}
          variant="default"
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          {t('monthlyView.downloadCSV')}
        </Button>
      </div>
      
      {localizedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <p>{t('monthlyView.noData')}</p>
        </div>
      ) : (
        <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b dark:border-gray-800">
                <th className="p-3 text-left font-medium text-muted-foreground">{t('monthlyView.table.headers.month')}</th>
                <th className="p-3 text-right font-medium text-muted-foreground">{t('monthlyView.table.headers.initialBalance')}</th>
                <th className="p-3 text-right font-medium text-muted-foreground">{t('monthlyView.table.headers.contribution')}</th>
                <th className="p-3 text-right font-medium text-muted-foreground">{t('monthlyView.table.headers.returns')}</th>
                <th className="p-3 text-right font-medium text-muted-foreground">{t('monthlyView.table.headers.returnPercentage')}</th>
                <th className="p-3 text-right font-medium text-muted-foreground">{t('monthlyView.table.headers.endBalance')}</th>
                <th className="p-3 text-right font-medium text-muted-foreground">{t('monthlyView.table.headers.targetRentability')}</th>
              </tr>
            </thead>
            <tbody>
              {localizedData.map((data, index) => (
                <tr 
                  key={`${data.month}-${data.balance}-${data.contribution}-${data.return}-${data.endBalance}-${data.targetRentability}`} 
                  className={`border-b dark:border-gray-800 transition-colors hover:bg-muted/50 dark:hover:bg-gray-800/60 ${
                    index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-muted/10 dark:bg-gray-800/40'
                  }`}
                >
                  <td className="p-3 font-medium">{data.month}</td>
                  <td className="p-3 text-right">{formatCurrency(data.balance, investmentPlan?.currency as CurrencyCode)}</td>
                  <td className="p-3 text-right">{formatCurrency(data.contribution, investmentPlan?.currency as CurrencyCode)}</td>
                  <td className={`p-3 text-right font-medium ${
                    data.return >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.return >= 0 ? '+' : ''}{formatCurrency(data.return, investmentPlan?.currency as CurrencyCode)}
                  </td>
                  <td className={`p-3 text-right font-medium ${
                    data.percentage === null ? 'text-gray-600' : data.percentage >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.percentage && data.percentage >= 0 ? '+' : ''}{data.percentage?.toFixed(2) || 0}%
                  </td>
                  <td className="p-3 text-right font-semibold">{formatCurrency(data.endBalance, investmentPlan?.currency as CurrencyCode)}</td>
                  <td className="p-3 text-right font-medium">{data.targetRentability?.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {allFinancialRecords.length > page * RECORDS_PER_PAGE && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/10"
          >
            {t('monthlyView.loadMore')}
          </button>
        </div>
      )}
    </div>
  );
}
