import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { ClientManagementService, CreateClientData, ClientProfile } from '@/services/client-management.service'

export function useCurrentUserProfile() {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: () => ClientManagementService.getCurrentUserProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  return {
    profile,
    isLoading,
    error
  }
}

export function useClientMutations() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createClient = useMutation({
    mutationFn: ({ clientData, brokerId }: { clientData: CreateClientData; brokerId: string }) =>
      ClientManagementService.createClient(clientData, brokerId),
    onSuccess: (newClient) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      
      toast({
        title: 'Cliente criado com sucesso',
        description: 'Redirecionando para criação do plano...',
      })
    },
    onError: (error) => {
      console.error('Error creating client:', error)
      toast({
        title: 'Erro ao criar cliente',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const updateClient = useMutation({
    mutationFn: ({ clientId, clientData }: { clientId: string; clientData: Partial<ClientProfile> }) =>
      ClientManagementService.updateClient(clientId, clientData),
    onSuccess: (updatedClient) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['client', updatedClient.id] })
      
      toast({
        title: 'Cliente atualizado com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error updating client:', error)
      toast({
        title: 'Erro ao atualizar cliente',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  const deleteClient = useMutation({
    mutationFn: (clientId: string) => ClientManagementService.deleteClient(clientId),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      
      toast({
        title: 'Cliente removido com sucesso',
      })
    },
    onError: (error) => {
      console.error('Error deleting client:', error)
      toast({
        title: 'Erro ao remover cliente',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    },
  })

  return {
    createClient,
    updateClient,
    deleteClient,
  }
}

export function useClientsByBroker(brokerId: string) {
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients', 'broker', brokerId],
    queryFn: () => ClientManagementService.getClientsByBrokerId(brokerId),
    enabled: !!brokerId,
  })

  return {
    clients: clients || [],
    isLoading,
    error
  }
}

export function useClientById(clientId: string) {
  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => ClientManagementService.getClientById(clientId),
    enabled: !!clientId,
  })

  return {
    client,
    isLoading,
    error
  }
}

export function useBrokerAccess(brokerId: string, clientId: string) {
  const { data: hasAccess, isLoading, error } = useQuery({
    queryKey: ['brokerAccess', brokerId, clientId],
    queryFn: () => ClientManagementService.checkBrokerAccess(brokerId, clientId),
    enabled: !!brokerId && !!clientId,
  })

  return {
    hasAccess: hasAccess || false,
    isLoading,
    error
  }
}
