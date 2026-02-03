import { useAuth } from "@/features/auth/components/AuthProvider";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import { FinancialRecord } from "@/types/financial/financial-records";
import { SuccessAnimation } from "@/shared/components/ui/success-animation";
import { AddRecordForm } from "@/features/financial-records/components/AddRecordForm";
import { 
  FinancialRecordsHeader, 
  ActionButtons, 
  RecordsList 
} from "@/features/financial-records/components";
import { useFinancialRecords, useFinancialRecordsMutations } from "@/hooks/useFinancialRecordsManagement";
import { useInvestmentPlanByUserId } from "@/hooks/useInvestmentPlan";
import { useMicroInvestmentPlans } from "@/hooks/useMicroInvestmentPlans";
import { CSVRecord } from "@/features/financial-records/services/financial-records-management.service";
import { supabase } from "@/lib/supabase";

interface LocationState {
  records?: FinancialRecord[];
}

const FinancialRecords = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();
  const clientId = params.id || user?.id;
  const location = useLocation();
  const state = location.state as LocationState;
  const initialRecords = state?.records || [];
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [animationPosition, setAnimationPosition] = useState<{ top: number; left: number } | null>(null);
  const [updatedRecordIds, setUpdatedRecordIds] = useState<string[]>([]);
  const [brokerProfile, setBrokerProfile] = useState<{ is_broker: boolean; id: string } | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [isValidating, setIsValidating] = useState<boolean>(true);

  // Hooks para dados
  const { records, isLoading: recordsLoading } = useFinancialRecords(clientId || '', initialRecords);
  const { plan: investmentPlan, isLoading: planLoading } = useInvestmentPlanByUserId(clientId || '');
  const { activeMicroPlan } = useMicroInvestmentPlans(investmentPlan?.id || '');
  const { 
    createRecord, 
    updateRecord, 
    deleteRecord, 
    deleteAllRecords, 
    importRecords, 
    syncInflationRates 
  } = useFinancialRecordsMutations(clientId || '');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_broker, id')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        setBrokerProfile(data);
        
        // Se o usuário é um broker e está tentando acessar dados de um cliente (não os próprios)
        if (data.is_broker && clientId !== user.id) {
          // Buscar perfil do cliente para verificar broker_id
          const { data: clientProfile, error: clientError } = await supabase
            .from('profiles')
            .select('broker_id')
            .eq('id', clientId)
            .single();
            
          if (clientError) {
            console.error('Error fetching client profile:', clientError);
            // Lidar com cliente não encontrado
            if (clientError.code === 'PGRST116') {
              setIsAuthorized(false);
              navigate('/broker-dashboard');
            }
            return;
          }
          
          // Verificar se o cliente pertence a este broker
          if (clientProfile.broker_id !== user.id) {
            setIsAuthorized(false);
            navigate('/broker-dashboard');
            return;
          }
        }
        
        setIsValidating(false);
      } catch (error) {
        console.error('Error in authorization check:', error);
        setIsValidating(false);
      }
    };

    fetchProfile();
  }, [user?.id, clientId, navigate]);

  const handleDelete = (recordId: string) => {
    if (window.confirm(t('financialRecords.confirmDelete'))) {
      deleteRecord.mutate(recordId);
    }
  };

  const handleReset = async () => {
    if (window.confirm(t('financialRecords.confirmReset'))) {
      await deleteAllRecords.mutate();
    }
  };

  const handleSyncIPCA = async () => {
    if (window.confirm(t('financialRecords.confirmIPCASync'))) {
      await syncInflationRates.mutate({ records, investmentPlan, activeMicroPlan });
    }
  };

  const handleImportRecords = (csvRecords: CSVRecord[]) => {
    importRecords.mutate({ records: csvRecords, investmentPlan });
  };

  const handleEdit = (recordId: number) => {
    setEditingRecordId(editingRecordId === recordId ? null : recordId);
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
        <p className="ml-3 text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Já redirecionado no useEffect
  }

  if (recordsLoading || planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SuccessAnimation 
        show={showSuccessAnimation} 
        onComplete={() => {
          setShowSuccessAnimation(false);
          setAnimationPosition(null);
          setUpdatedRecordIds([]);
        }}
        position={animationPosition}
      />
      
      <FinancialRecordsHeader t={t} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ActionButtons
          isBroker={brokerProfile?.is_broker || false}
          showAddForm={showAddForm}
          onToggleAddForm={() => setShowAddForm(!showAddForm)}
          onReset={handleReset}
          onSyncIPCA={handleSyncIPCA}
          onImportRecords={handleImportRecords}
          t={t}
        />

        {showAddForm && (
          <AddRecordForm 
            clientId={clientId!} 
            onSuccess={() => setShowAddForm(false)} 
            investmentPlan={investmentPlan}
          />
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecordsList
          records={records}
          investmentPlan={investmentPlan}
          activeMicroPlan={activeMicroPlan}
          isBroker={brokerProfile?.is_broker || false}
          editingRecordId={editingRecordId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          clientId={clientId || ''}
          t={t}
        />
      </main>
    </div>
  );
};

export default FinancialRecords; 