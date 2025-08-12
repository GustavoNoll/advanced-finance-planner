import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'

export function LogoDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-900 dark:via-gray-950 dark:to-slate-900/50">
      {/* Header */}
      <header className="bg-white/95 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo variant="full" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Foundation Logo Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            O logo se adapta automaticamente ao modo dark/light
          </p>
        </div>

        {/* Logo variations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Full logo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Logo Completo
            </h2>
            <div className="flex justify-center">
              <Logo variant="full" />
            </div>
          </div>

          {/* Minimal logo */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Logo Minimal
            </h2>
            <div className="flex justify-center">
              <Logo variant="minimal" />
            </div>
          </div>
        </div>

        {/* Theme information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Modo Light</h3>
              <ul className="space-y-1">
                <li>• Símbolo: Roxo/lavanda (#B794F4)</li>
                <li>• Texto: Cinza escuro (#1F2937)</li>
                <li>• Fundo: Branco</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Modo Dark</h3>
              <ul className="space-y-1">
                <li>• Símbolo: Roxo/lavanda (#B794F4)</li>
                <li>• Texto: Cinza claro (#E2E8F0)</li>
                <li>• Fundo: Cinza escuro</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
