import { Pencil } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export const InvestmentPlanShow = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: plan, isLoading } = useQuery({
    queryKey: ['investmentPlan', id],
    queryFn: async () => {
      // Primeira consulta: buscar o investment plan
      const { data: investmentPlan, error: planError } = await supabase
        .from('investment_plans')
        .select(`
          *,
          profiles:user_id (
            name,
            broker_id
          )
        `)
        .eq('id', id)
        .single();

      if (planError) {
        console.error('Error fetching investment plan:', planError);
        return null;
      }

      return investmentPlan;
    },
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to={`/client/${plan.user_id}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {ptBR.investmentPlan.details.title}
              </h1>
            </div>
            {/* Add edit button for brokers */}
            {user?.id && plan?.profiles?.broker_id === user.id && (
              <Link to={`/edit-plan/${plan.id}`}>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  {t('dashboard.buttons.editPlan')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ... rest of the component ... */}
    </div>
  );
}; 