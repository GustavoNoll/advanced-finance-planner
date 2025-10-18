import type { CurrencyCode } from '@/utils/currency';

export type SupportedLocale = 'pt-BR' | 'en-US';

/**
 * Detecta o idioma do navegador e mapeia para os idiomas suportados
 * @returns Código do idioma suportado ('pt-BR' ou 'en-US')
 */
export function detectLanguage(): SupportedLocale {
  const browserLang = navigator.language || 'pt-BR';
  
  // Mapeamento de locales do navegador para idiomas suportados
  if (browserLang.startsWith('pt')) return 'pt-BR'; // Português
  if (browserLang.startsWith('en')) return 'en-US'; // Inglês
  
  // Default para português brasileiro
  return 'pt-BR';
}

/**
 * Detecta a moeda automaticamente baseada no locale do navegador
 * @returns Código da moeda ('BRL', 'USD' ou 'EUR')
 */
export function detectCurrency(): CurrencyCode {
  const locale = navigator.language || 'pt-BR';
  
  // Mapeamento de locales para moedas
  if (locale.startsWith('pt-BR')) return 'BRL'; // Português (Brasil) -> Real
  if (locale.startsWith('pt')) return 'EUR'; // Português (Portugal/outros) -> Euro
  if (locale.startsWith('en-US')) return 'USD'; // Inglês (EUA) -> Dólar
  if (locale.startsWith('en-GB')) return 'EUR'; // Inglês (UK) -> Euro
  if (locale.startsWith('de')) return 'EUR'; // Alemão -> Euro
  if (locale.startsWith('fr')) return 'EUR'; // Francês -> Euro
  if (locale.startsWith('it')) return 'EUR'; // Italiano -> Euro
  if (locale.startsWith('nl')) return 'EUR'; // Holandês -> Euro
  
  // Default para Real
  return 'BRL';
}

/**
 * Detecta automaticamente o locale e a moeda do usuário
 * @returns Objeto com locale e currency
 */
export function detectUserPreferences() {
  return {
    locale: detectLanguage(),
    currency: detectCurrency()
  };
}

