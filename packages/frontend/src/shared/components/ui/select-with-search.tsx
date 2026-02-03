import { useState, useRef, useEffect } from "react"
import { Input } from "@/shared/components/ui/input"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

export interface SelectOption {
  id: string
  label: string
  searchTerms?: string[]
}

interface SelectWithSearchProps {
  options: SelectOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  error?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  maxHeight?: string
  sortOptions?: boolean
}

export function SelectWithSearch({
  options,
  value,
  onValueChange,
  placeholder,
  error,
  searchPlaceholder,
  emptyMessage,
  disabled = false,
  className,
  triggerClassName,
  maxHeight = "300px",
  sortOptions = true
}: SelectWithSearchProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const resolvedPlaceholder = placeholder || t('common.selectOption')
  const resolvedSearchPlaceholder = searchPlaceholder || t('common.search')
  const resolvedEmptyMessage = emptyMessage || t('common.noResults')

  const processedOptions = options.map(option => ({
    ...option,
    searchTerms: option.searchTerms && option.searchTerms.length > 0
      ? option.searchTerms
      : [option.label]
  }))

  const sortedOptions = sortOptions
    ? [...processedOptions].sort((a, b) => {
        const labelA = a.label.toLowerCase()
        const labelB = b.label.toLowerCase()
        return labelA.localeCompare(labelB)
      })
    : processedOptions

  const selectedOption = sortedOptions.find(option => option.id === value)
  const displayValue = selectedOption ? selectedOption.label : ""

  const filteredOptions = sortedOptions.filter(option => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return option.searchTerms?.some(term => 
      term.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(search)
    )
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

  const handleSelect = (optionId: string) => {
    onValueChange(optionId)
    setOpen(false)
    setSearchTerm("")
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)} onClick={(e) => e.stopPropagation()}>
      {/* Input de exibição */}
      <div
        onClick={() => {
          if (disabled) return
          setOpen(!open)
        }}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          disabled && "cursor-not-allowed bg-muted",
          !disabled && "cursor-pointer",
          error && "border-red-500",
          !displayValue && "text-muted-foreground",
          triggerClassName
        )}
        aria-disabled={disabled}
      >
        <span className="truncate">
          {displayValue || resolvedPlaceholder}
        </span>
        {!disabled && (
          <ChevronDown className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform", open && "rotate-180")} />
        )}
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute z-[100] mt-1 w-full rounded-md border bg-popover shadow-md">
          {/* Campo de busca */}
          <div className="border-b p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={resolvedSearchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="pl-8 h-9"
                autoFocus
              />
            </div>
          </div>

          {/* Lista de opções */}
          <div className={cn("overflow-y-auto p-1")} style={{ maxHeight }}>
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {resolvedEmptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value === option.id
                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
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
                    {option.label}
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

