import { ArrowLeft, LogOut, Share2, Key, Target, TrendingUp, BarChart, Menu } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Logo } from '@/shared/components/ui/logo'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import type { Profile } from '@/types/profiles'

type DashboardView = 'finances' | 'policies' | 'portfolio-performance'

interface DashboardHeaderProps {
  clientProfile: Profile | null
  brokerProfile: Profile | null
  clientId: string
  activeView: DashboardView
  onViewChange: (view: DashboardView) => void
  onLogout: () => void
  onShareClient: () => void
}

export function DashboardHeader({
  clientProfile,
  brokerProfile,
  clientId,
  activeView,
  onViewChange,
  onLogout,
  onShareClient,
}: DashboardHeaderProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            {brokerProfile && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-blue-50/50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-slate-400 transition-all duration-200"
                onClick={() => navigate('/broker-dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="relative">
              <Logo variant="minimal" />
            </div>
            {clientProfile && (
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {clientProfile.name}
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {t('dashboard.title') || 'Dashboard'}
                </p>
              </div>
            )}
          </div>

          {/* Tabs - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-1">
              <div className="flex space-x-1">
                {/* Política de Investimento - Azul/Roxo */}
                <div 
                  className="group flex items-center rounded-lg bg-transparent hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
                  onClick={() => onViewChange('policies')}
                >
                  <Button
                    variant="ghost"
                    className={`rounded-lg p-2.5 transition-all duration-200 pointer-events-none flex items-center justify-center ${
                      activeView === 'policies'
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-indigo-500 dark:text-indigo-400'
                    }`}
                  >
                    <Target className="h-5 w-5" />
                  </Button>
                  <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                    {t('dashboard.navigation.investmentPolicy')}
                  </span>
                </div>
                
                {/* Planejamento - Verde */}
                <div 
                  className="group flex items-center rounded-lg bg-transparent hover:bg-emerald-50/50 dark:hover:bg-emerald-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
                  onClick={() => onViewChange('finances')}
                >
                  <Button
                    variant="ghost"
                    className={`rounded-lg p-2.5 transition-all duration-200 pointer-events-none flex items-center justify-center ${
                      activeView === 'finances'
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-emerald-500 dark:text-emerald-400'
                    }`}
                  >
                    <TrendingUp className="h-5 w-5" />
                  </Button>
                  <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                    {t('dashboard.navigation.planning')}
                  </span>
                </div>
                
                {/* Performance - Laranja */}
                <div 
                  className="group flex items-center rounded-lg bg-transparent hover:bg-orange-50/50 dark:hover:bg-orange-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
                  onClick={() => onViewChange('portfolio-performance')}
                >
                  <Button
                    variant="ghost"
                    className={`rounded-lg p-2.5 transition-all duration-200 pointer-events-none flex items-center justify-center ${
                      activeView === 'portfolio-performance'
                        ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 shadow-sm'
                        : 'text-orange-500 dark:text-orange-400'
                    }`}
                  >
                    <BarChart className="h-5 w-5" />
                  </Button>
                  <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                    {t('dashboard.navigation.portfolioPerformance')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Nubank Style */}
          <div className="flex items-center gap-1">
            {brokerProfile && (
              <div 
                className="group flex items-center rounded-full bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
                onClick={onShareClient}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-transparent text-blue-600 dark:text-blue-400 transition-all duration-200 pointer-events-none"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                  {t('brokerDashboard.shareWithClient')}
                </span>
              </div>
            )}
            
            <div 
              className="group flex items-center rounded-full bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
              onClick={() => navigate(`/client-profile/${clientId}`)}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-transparent text-blue-600 dark:text-blue-400 transition-all duration-200 pointer-events-none"
              >
                <Key className="h-5 w-5" />
              </Button>
              <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                {t('clientProfile.buttons.changePassword')}
              </span>
            </div>

            <div 
              className="group flex items-center rounded-full bg-transparent hover:bg-red-50/50 dark:hover:bg-red-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer"
              onClick={onLogout}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-transparent text-red-600 dark:text-red-400 transition-all duration-200 pointer-events-none"
              >
                <LogOut className="h-5 w-5" />
              </Button>
              <span className="ml-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 ease-out transform translate-x-[-10px] group-hover:translate-x-0">
                {t('common.logout')}
              </span>
            </div>

            {/* Mobile menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="group flex items-center rounded-full bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-900/30 px-2 py-1 transition-all duration-300 ease-out cursor-pointer md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-transparent text-slate-600 dark:text-slate-400 transition-all duration-200 pointer-events-none"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => onViewChange('policies')}>
                  <Target className="h-4 w-4 mr-2" />
                  {t('dashboard.navigation.investmentPolicy')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewChange('finances')}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {t('dashboard.navigation.planning')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewChange('portfolio-performance')}>
                  <BarChart className="h-4 w-4 mr-2" />
                  {t('dashboard.navigation.portfolioPerformance')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
