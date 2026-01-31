import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import { detectLanguage, SupportedLocale } from "@/lib/locale-detection"
import i18n from "@/lib/i18n"
import { useAuth } from "@/components/auth/AuthProvider"
import { LanguageContext } from "./LanguageContext.types"

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [language, setLanguage] = useState<SupportedLocale>(() => detectLanguage())
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const readStoredLocale = useCallback((): SupportedLocale | null => {
    if (typeof window === "undefined") return null
    const stored = window.localStorage.getItem("afp:locale")
    if (stored === "pt-BR" || stored === "en-US") return stored
    return null
  }, [])

  const persistLocale = useCallback((locale: SupportedLocale) => {
    if (typeof window === "undefined") return
    window.localStorage.setItem("afp:locale", locale)
  }, [])

  const applyLanguage = useCallback(
    (locale: SupportedLocale) => {
      setLanguage(locale)
      i18n.changeLanguage(locale)
      if (typeof document !== "undefined") document.documentElement.lang = locale === "en-US" ? "en" : "pt-BR"
      persistLocale(locale)
    },
    [persistLocale]
  )

  useEffect(() => {
    let mounted = true

    const loadPreference = async () => {
      setIsLoading(true)
      const storedLocale = readStoredLocale()

      if (!user?.id) {
        applyLanguage(storedLocale ?? detectLanguage())
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("language_preference")
        .eq("id", user.id)
        .single()

      if (!mounted) return

      if (error) {
        console.error("Error loading language preference:", error)
        applyLanguage(storedLocale ?? detectLanguage())
      } else {
        const dbLocale = data?.language_preference
        if (dbLocale === "pt-BR" || dbLocale === "en-US") {
          applyLanguage(dbLocale)
        } else {
          applyLanguage(storedLocale ?? detectLanguage())
        }
      }

      setIsLoading(false)
    }

    loadPreference()

    return () => {
      mounted = false
    }
  }, [user?.id, applyLanguage, readStoredLocale])

  const setLanguagePreference = useCallback(
    async (locale: SupportedLocale) => {
      applyLanguage(locale)
      if (!user?.id) return

      setIsUpdating(true)
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ language_preference: locale })
          .eq("id", user.id)

        if (error) throw error
      } finally {
        setIsUpdating(false)
      }
    },
    [applyLanguage, user?.id]
  )

  const value = useMemo(
    () => ({
      language,
      isLoading,
      isUpdating,
      setLanguagePreference
    }),
    [language, isLoading, isUpdating, setLanguagePreference]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export { LanguageProvider }


