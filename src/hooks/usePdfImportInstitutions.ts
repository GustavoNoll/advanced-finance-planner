import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface PdfImportInstitution {
  id: string
  name: string
  default_currency: 'BRL' | 'USD' | 'EUR'
  requires_additional_file: boolean
  created_at: string
  updated_at: string
}

export interface PdfImportInstitutionInput {
  name: string
  default_currency: 'BRL' | 'USD' | 'EUR'
  requires_additional_file: boolean
}

/**
 * Hook to fetch PDF import institutions from database
 */
export function usePdfImportInstitutions() {
  return useQuery({
    queryKey: ['pdfImportInstitutions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pdf_import_institutions')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return (data || []) as PdfImportInstitution[]
    }
  })
}

/**
 * Hook to create a new PDF import institution
 */
export function useCreatePdfImportInstitution() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (institution: PdfImportInstitutionInput) => {
      const { data, error } = await supabase
        .from('pdf_import_institutions')
        .insert(institution)
        .select()
        .single()

      if (error) throw error
      return data as PdfImportInstitution
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfImportInstitutions'] })
    }
  })
}

/**
 * Hook to update a PDF import institution
 */
export function useUpdatePdfImportInstitution() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PdfImportInstitutionInput> & { id: string }) => {
      const { data, error } = await supabase
        .from('pdf_import_institutions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as PdfImportInstitution
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfImportInstitutions'] })
    }
  })
}

/**
 * Hook to delete a PDF import institution
 */
export function useDeletePdfImportInstitution() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pdf_import_institutions')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfImportInstitutions'] })
    }
  })
}

