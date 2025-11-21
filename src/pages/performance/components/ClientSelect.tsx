import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import type { UserProfileInvestment } from "@/types/broker-dashboard"

interface ClientSelectProps {
  clients: UserProfileInvestment[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  error?: boolean
}

export function ClientSelect({ clients, value, onValueChange, placeholder, error }: ClientSelectProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const sortedClients = [...clients].sort((a, b) => {
    const nameA = (a.profile_name || a.email || a.id).toLowerCase()
    const nameB = (b.profile_name || b.email || b.id).toLowerCase()
    return nameA.localeCompare(nameB)
  })

  const selectedClient = sortedClients.find(client => client.id === value)
  const displayValue = selectedClient 
    ? (selectedClient.profile_name || selectedClient.email || selectedClient.id)
    : ""

  // Filtrar clientes baseado no termo de busca
  const filteredClients = sortedClients.filter((client) => {
    const clientName = (client.profile_name || client.email || client.id).toLowerCase()
    const email = (client.email || "").toLowerCase()
    const id = client.id.toLowerCase()
    const search = searchTerm.toLowerCase()
    return clientName.includes(search) || email.includes(search) || id.includes(search)
  })

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setSearchTerm("")
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      // Focar no input quando abrir
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const handleSelect = (clientId: string) => {
    onValueChange(clientId)
    setOpen(false)
    setSearchTerm("")
  }

  return (
    <div ref={containerRef} className="relative w-full" onClick={(e) => e.stopPropagation()}>
      {/* Input de exibição */}
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          error && "border-red-500",
          !displayValue && "text-muted-foreground"
        )}
      >
        <span className="truncate">
          {displayValue || placeholder || t('portfolioPerformance.dataManagement.importPDF.formPlaceholders.client')}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform", open && "rotate-180")} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-[100] mt-1 w-full rounded-md border bg-popover shadow-md">
          {/* Campo de busca */}
          <div className="border-b p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={t('portfolioPerformance.dataManagement.importPDF.searchClient') || "Buscar cliente..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="pl-8 h-9"
                autoFocus
              />
            </div>
          </div>

          {/* Lista de clientes */}
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredClients.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t('portfolioPerformance.dataManagement.importPDF.noClientFound') || "Nenhum cliente encontrado."}
              </div>
            ) : (
              filteredClients.map((client) => {
                const clientName = client.profile_name || client.email || client.id
                const isSelected = value === client.id
                return (
                  <div
                    key={client.id}
                    onClick={() => handleSelect(client.id)}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                      "hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {clientName}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

