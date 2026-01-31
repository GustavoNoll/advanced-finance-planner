import { useState } from "react"
import { useLanguagePreference } from "@/hooks/useLanguagePreference"
import { useTranslation } from "react-i18next"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Languages } from "lucide-react"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
  const { language, isLoading, isUpdating, setLanguagePreference } = useLanguagePreference()
  const { t } = useTranslation()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isDisabled = isLoading || isUpdating || isSubmitting

  const handleToggle = async () => {
    const nextLocale = language === "pt-BR" ? "en-US" : "pt-BR"
    setIsSubmitting(true)
    try {
      await setLanguagePreference(nextLocale)
    } catch (error) {
      console.error("Error updating language preference:", error)
      toast({
        title: t("common.error"),
        description: t("common.language.updateError"),
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const abbreviation = language === "pt-BR" ? "PT" : "EN"

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            disabled={isDisabled}
            onClick={handleToggle}
            aria-label={t("common.language.tooltip")}
            className={cn(
              "group inline-flex items-center gap-2 rounded-full border bg-card/80 px-2 py-1 shadow transition-all backdrop-blur",
              "hover:px-3 disabled:cursor-not-allowed disabled:opacity-60",
              "dark:bg-gray-900/80 dark:border-gray-700"
            )}
          >
            <span
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors",
                "group-hover:bg-primary group-hover:text-primary-foreground"
              )}
            >
              <Languages className="h-4 w-4" />
            </span>
            <span
              className={cn(
                "flex-1 overflow-hidden text-xs font-semibold uppercase tracking-wider text-foreground transition-all",
                "max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100"
              )}
            >
              {abbreviation}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>{t("common.language.tooltip")}</TooltipContent>
      </Tooltip>
    </div>
  )
}

