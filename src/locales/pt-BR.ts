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
        ytd: "No ano",
        amount: "R$ {{value}}"
      },
      monthlyContributions: {
        title: "Contribuições Mensais",
        subtitle: "Depósitos regulares",
        amount: "R$ {{value}}"
      },
      totalReturns: {
        title: "Retorno Total",
        subtitle: "Retorno Anual",
        amount: "R$ {{value}}",
        percentage: "+{{value}}%"
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
      contactBroker: {
        title: "Plano não encontrado",
        description: "Por favor, entre em contato com seu corretor para criar um plano de investimento."
      },
      logoutSuccess: "Desconectado com sucesso",
      logoutError: "Erro ao desconectar",
      noPlan: {
        title: "Sem Plano de Investimento",
        description: "Por favor, crie um plano de investimento para continuar."
      },
      errors: {
        fetchPlan: "Erro ao buscar plano de investimento",
        fetchProfile: "Erro ao buscar perfil do corretor"
      }
    },
    loading: "Carregando..."
  },
  brokerDashboard: {
    title: "Painel do Corretor",
    search: {
      title: "Buscar Clientes",
      placeholder: "Buscar por nome ou email...",
      button: "Buscar",
      searching: "Buscando...",
      results: "Resultados da Busca",
      noResults: "Nenhum resultado encontrado"
    },
    buttons: {
      newClient: "Novo Cliente",
      logout: "Sair",
      search: "Buscar"
    },
    client: {
      pendingPlan: "Plano Pendente",
      id: "ID",
      name: "Nome",
      email: "Email"
    },
    messages: {
      error: {
        title: "Erro",
        fetchClients: "Erro ao buscar clientes",
        search: "Erro ao realizar busca"
      }
    }
  },
  common: {
    error: "Erro",
    notAvailable: "N/A"
  },
  createClient: {
    title: "Criar Novo Cliente",
    form: {
      name: {
        label: "Nome",
        placeholder: "Digite o nome do cliente"
      },
      email: {
        label: "Email",
        placeholder: "Digite o email do cliente"
      },
      password: {
        label: "Senha",
        placeholder: "Digite a senha"
      }
    },
    buttons: {
      cancel: "Cancelar",
      create: "Criar Cliente",
      creating: "Criando..."
    },
    messages: {
      success: {
        title: "Sucesso",
        description: "Cliente criado com sucesso"
      },
      error: {
        title: "Erro",
        description: "Erro ao criar cliente"
      }
    }
  },
  monthlyView: {
    title: "Desempenho Mensal",
    tabs: {
      chart: "Visualização em Gráfico",
      table: "Visualização em Tabela"
    },
    chart: {
      endBalance: "Saldo Final",
      contribution: "Contribuição"
    },
    table: {
      headers: {
        month: "Mês",
        initialBalance: "Saldo Inicial",
        contribution: "Contribuição",
        returns: "Retornos",
        returnPercentage: "Retorno %",
        endBalance: "Saldo Final"
      },
      months: {
        January: "Janeiro",
        February: "Fevereiro",
        March: "Março",
        April: "Abril",
        May: "Maio",
        June: "Junho",
        July: "Julho",
        August: "Agosto",
        September: "Setembro",
        October: "Outubro",
        November: "Novembro",
        December: "Dezembro"
      }
    }
  },
  expenseChart: {
    portfolioValue: "Valor do Portfólio",
    inflationAdjusted: "Ajustado pela Inflação"
  },
  budgetCategories: {
    categories: {
      Housing: "Moradia",
      Food: "Alimentação",
      Transportation: "Transporte",
      Entertainment: "Entretenimento"
    }
  },
  savingsGoal: {
    title: "Meta de Investimento",
    currentValue: "R$ {{value}}",
    returnRate: "{{value}}% a.a.",
    goal: {
      label: "Meta: R$ {{value}}",
      targetDate: "Data Alvo: {{date}}"
    }
  }
}; 