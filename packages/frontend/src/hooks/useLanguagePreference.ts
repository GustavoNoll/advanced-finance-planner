import { useContext } from "react"
import { LanguageContext } from "@/contexts/LanguageContext.types"

export function useLanguagePreference() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguagePreference must be used within a LanguageProvider")
  return context
}

