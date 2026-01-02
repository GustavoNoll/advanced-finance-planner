import { createContext } from "react"
import { SupportedLocale } from "@/lib/locale-detection"

export interface LanguageContextValue {
  language: SupportedLocale
  isLoading: boolean
  isUpdating: boolean
  setLanguagePreference: (locale: SupportedLocale) => Promise<void>
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

