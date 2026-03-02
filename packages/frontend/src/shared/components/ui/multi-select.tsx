import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Badge } from "@/shared/components/ui/badge"

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options?: Option[]
  value?: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
  placeholder?: string
}

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  disabled,
  placeholder = "Select options...",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const safeOptions = options ?? []

  const selectedLabels = React.useMemo(() => {
    return value
      .map((v) => safeOptions.find((opt) => opt.value === v)?.label)
      .filter((label): label is string => label !== undefined)
  }, [value, safeOptions])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {safeOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    const newValue = value.includes(option.value)
                      ? value.filter((v) => v !== option.value)
                      : [...value, option.value]
                    onChange(newValue)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 
