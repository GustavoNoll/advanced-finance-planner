export const ptBR = {
  investmentPlan: {
    details: {
      title: "Detalhes do Plano de Investimento",
      clientInfo: {
        title: "Informações do Cliente",
        name: "Nome",
        initialAge: "Idade Inicial",
        finalAge: "Idade Final"
      },
      planOverview: {
        title: "Visão Geral do Plano",
        initialAmount: "Valor Inicial",
        monthlyDeposit: "Depósito Mensal",
        requiredMonthlyDeposit: "Depósito Mensal Necessário"
      },
      financialGoals: {
        title: "Objetivos Financeiros",
        desiredMonthlyIncome: "Renda Mensal Desejada",
        inflationAdjustedIncome: "Renda Ajustada pela Inflação",
        futureValue: "Valor Futuro"
      },
      investmentParams: {
        title: "Parâmetros do Investimento",
        expectedReturn: "Retorno Esperado",
        inflationRate: "Taxa de Inflação",
        planType: "Tipo do Plano",
        status: "Status",
        types: {
          "1": "Encerrar aos 100 anos",
          "2": "Deixar 1M de herança",
          "3": "Não tocar no principal"
        }
      }
    },
    create: {
      title: "Criar Plano de Investimento",
      form: {
        initialAmount: "Valor Inicial",
        initialAge: "Idade Inicial",
        finalAge: "Idade Final",
        monthlyDeposit: "Depósito Mensal",
        desiredIncome: "Renda Mensal Desejada",
        riskProfile: "Perfil de Risco / Retorno IPCA+",
        inflationRate: "Taxa de Inflação Anual (%)",
        planType: "Tipo do Plano",
        createButton: "Criar Plano",
        creating: "Criando..."
      },
      calculations: {
        title: "Valores Calculados",
        inflationAdjustedIncome: "Renda Ajustada pela Inflação",
        requiredFutureValue: "Valor Futuro Necessário",
        monthlyRealReturn: "Retorno Mensal Real",
        monthlyInflationReturn: "Retorno Mensal da Inflação",
        totalMonthlyReturn: "Retorno Mensal Total",
        requiredMonthlyDeposit: "Depósito Mensal Necessário",
        fillRequired: "Preencha todos os campos obrigatórios para ver os cálculos"
      },
      planTypes: {
        endAt100: "Encerrar aos 100 anos",
        leave1M: "Deixar 1M de herança",
        keepPrincipal: "Não tocar no principal"
      },
      riskProfiles: {
        conservative: "Conservador",
        moderate: "Moderado",
        aggressive: "Arrojado"
      }
    }
  },
  dashboard: {
    title: "Portfólio de Investimentos",
    cards: {
      portfolioValue: {
        title: "Valor Total do Portfólio",
        ytd: "No ano"
      },
      monthlyContributions: {
        title: "Contribuições Mensais",
        subtitle: "Depósitos regulares"
      },
      totalReturns: {
        title: "Retorno Total",
        subtitle: "Retorno Anual"
      }
    },
    charts: {
      portfolioPerformance: "Desempenho do Portfólio vs. Inflação"
    },
    nextSteps: {
      title: "Próximos Passos",
      items: {
        reviewStrategy: "Revisar sua estratégia de investimento",
        increaseContributions: "Considerar aumentar contribuições mensais",
        scheduleReview: "Agendar reunião de revisão do portfólio"
      }
    },
    buttons: {
      settings: "Configurações",
      logout: "Sair",
      back: "Voltar"
    },
    messages: {
      logoutSuccess: "Desconectado com sucesso",
      logoutError: "Erro ao desconectar",
      noPlan: {
        title: "Sem Plano de Investimento",
        description: "Por favor, crie um plano de investimento para continuar."
      }
    }
  }
}; 