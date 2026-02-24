'use client'

import { useTranslation } from 'react-i18next'
import { Logo } from '@/components/logo'

const foundationHubUrl = process.env.NEXT_PUBLIC_FOUNDATION_HUB_URL ?? 'https://foundationhub.vercel.app/'

export default function MarketingHomePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo variant="minimal" />
          <span className="hidden text-sm text-slate-400 sm:inline">
            {t('nav.forIndividuals')}
          </span>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 sm:flex">
          <a href={foundationHubUrl} className="hover:text-white">
            {t('nav.forAdvisors')}
          </a>
        </nav>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <section className="flex flex-1 flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Beta para consumidores finais</span>
          </div>

          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {t('hero.title')}
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
              {t('hero.subtitle')}
            </p>
          </div>

            <div className="flex flex-wrap items-center gap-3">
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500"
            >
              {t('hero.ctaPrimary')}
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-600 px-5 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900/60"
            >
              {t('hero.ctaSecondary')}
            </a>
              <p className="mt-2 text-xs text-slate-500">
                Não precisa conectar contas bancárias. Você controla os dados e os cenários.
              </p>
            </div>
          </div>

          <section className="flex-1 space-y-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>{t('sections.timeline.title')}</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                Preview
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t('sections.timeline.description')}
            </p>
            <div className="mt-4 h-48 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40" />
          </section>
        </section>

        <section className="grid gap-8 border-t border-slate-800 pt-10 lg:grid-cols-[1.3fr,1.2fr]">
          <div>
            <h2 className="text-lg font-semibold text-slate-50">
              {t('sections.howItWorks.title')}
            </h2>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div>
                <p className="font-medium text-slate-100">
                  {t('sections.howItWorks.step1Title')}
                </p>
                <p className="text-xs text-slate-400">
                  {t('sections.howItWorks.step1Desc')}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-100">
                  {t('sections.howItWorks.step2Title')}
                </p>
                <p className="text-xs text-slate-400">
                  {t('sections.howItWorks.step2Desc')}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-100">
                  {t('sections.howItWorks.step3Title')}
                </p>
                <p className="text-xs text-slate-400">
                  {t('sections.howItWorks.step3Desc')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <h2 className="text-lg font-semibold text-slate-50">
              {t('sections.whoFor.title')}
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>• {t('sections.whoFor.item1')}</li>
              <li>• {t('sections.whoFor.item2')}</li>
              <li>• {t('sections.whoFor.item3')}</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

