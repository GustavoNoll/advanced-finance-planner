export const ptBR = { 
  investmentPlan: {
    messages: {
      notFound: {
        title: "Plano de investimento não encontrado",
        description: "O plano que você está procurando não existe ou foi removido."
      }
    },
    details: {
      title: "Detalhes do Plano de Investimento",
      clientInfo: {
        title: "Informações do Cliente",
        name: "Nome",
        initialAge: "Idade Inicial",
        finalAge: "Idade Final",
        years: "anos"
      },
      planOverview: {
        title: "Visão Geral do Plano",
        initialAmount: "Valor Inicial",
        monthlyDeposit: "Depósito Mensal",
        requiredMonthlyDeposit: "Depósito Mensal Necessário",
        adjustContributionForInflation: "Aporte ajustado pela inflação anualmente",
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
          "1": "Encerrar",
          "2": "Deixar Herança",
          "3": "Não tocar no principal"
        },
        adjustContributionForInflation: "Ajuste do Aporte pela Inflação",
        enabled: "Ativado",
        disabled: "Desativado"
      }
    },
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
      creating: "Criando...",
      adjustContributionForInflation: "Ajustar aporte pela inflação anualmente",
      advancedSettings: "Configurações Avançadas",
      endAge: "Idade de Encerramento",
      legacyAge: "Idade para Deixar Herança",
      legacyAmount: "Valor da Herança"
    },
    planTypes: {
      endAt120: "Encerrar",
      leave1M: "Deixar Herança",
      keepPrincipal: "Não tocar no principal"
    },
    riskProfiles: {
      conservative: "Conservador",
      moderate: "Moderado",
      aggressive: "Arrojado"
    },
    create: {
      title: "Criar Plano de Investimento",
      calculations: {
        title: "Valores Calculados",
        inflationAdjustedIncome: "Renda Ajustada pela Inflação",
        requiredFutureValue: "Valor Futuro",
        monthlyRealReturn: "Retorno Mensal Real",
        monthlyInflationReturn: "Retorno Mensal da Inflação",
        totalMonthlyReturn: "Retorno Mensal Total",
        requiredMonthlyDeposit: "Depósito Mensal Necessário para o Valor Futuro",
        necessaryFutureValue: "Necessário para renda desejada",
        fillRequired: "Preencha todos os campos obrigatórios para ver os cálculos",
        necessaryMonthlyDeposit: "Necessário para renda desejada"
      },
    },
    edit: {
      title: "Editar Plano de Investimento",
    }
  },
  dashboard: {
    title: "Portfólio de Investimentos",
    highlights: {
      startToInvest: "Você já deveria estar investindo!",
      title: "Destaques",
      tooltip: "Suas principais conquistas e marcos no plano de investimento",
      contributionStreak: "Sequência atual: {{months}} meses de aportes consistentes!",
      goalProgress: "Já conquistou {{progress}}% do objetivo (R$ {{amount}})",
      returnOnContributions: "Seus investimentos já renderam {{percentage}}% sobre os aportes",
      bestReturn: "Seu melhor mês teve retorno de {{return}}%",
      patrimonyGrowth: "Seu patrimônio cresceu {{growth}}% desde o início",
      planAge: "Seu plano completa {{months}} meses de jornada!"
    },
    cards: {
      portfolioValue: {
        title: "Valor Total do Portfólio",
        ytd: "No ano",
        amount: "R$ {{value}}",
        monthlyReturn: "de aumento no último mês",
        tooltip: "Valor baseado no ultimo registro financeiro."
      },
      monthlyContributions: {
        title: "Contribuições Mensais",
        subtitle: "Depósitos regulares",
        target: "Acordado",
        amount: "R$ {{value}}",
        required: "Necessário",
        tooltip: "Contribuição mensal no mês."
      },
      totalReturns: {
        title: "Rendimento",
        subtitle: "",
        amount: "R$ {{value}}",
        percentage: "+{{value}}%",
        tooltip: "Rendimentos do portfólio."
      }
    },
    charts: {
      portfolioPerformance: "Projeção Patrimonial"
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
      clientInfo: "Informações do Cliente",
      settings: "Configurações",
      logout: "Sair",
      back: "Voltar",
      financialRecords: "Registros Financeiros",
      investmentPlan: "Plano de Investimento",
      clientProfile: "Informações do Cliente",
      editPlan: "Editar Plano",
      financialGoals: "Objetivos Financeiros",
      events: 'Eventos',
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
    loading: "Carregando...",
    buttonGroups: {
      main: "Principal",
      planning: "Planejamento",
      management: "Gerenciamento",
    },
  },
  brokerDashboard: {
    title: "Painel do Corretor",
    search: {
      title: "Buscar Clientes",
      placeholder: "Buscar por nome ou email...",
      button: "Buscar",
      searching: "Buscando...",
      results: "Clientes",
      noResults: "Nenhum cliente encontrado"
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
      email: "Email",
      outdatedRecord: "Registro Desatualizado",
      monthlyReturn: "Retorno Mensal"
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
    allTime: "Todos os Tempos",
    last6Months: "Últimos 6 Meses",
    last12Months: "Últimos 12 Meses",
    last24Months: "Últimos 24 Meses",
    error: "Erro",
    errors: {
      tryAgain: "Por favor, tente novamente."
    },
    no: "Não",
    yes: "Sim",
    notAvailable: "N/A",
    loading: "Carregando...",
    back: "Voltar",
    cancel: "Cancelar",
    save: "Salvar",
    delete: "Excluir",
    edit: "Editar",
    create: "Criar",
    reset: "Resetar",
    logout: "Sair",
    update: "Atualizar",
    add: "Adicionar",
    select: "Selecione",
    confirmDelete: "Tem certeza que deseja excluir este item?"
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
      },
      birthDate: {
        label: "Data de Nascimento",
        placeholder: "Digite a data de nascimento do cliente"
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
    loadMore: "Carregar Mais",
    downloadCSV: "Baixar CSV",
    noData: "Nenhum dado disponível",
    timeWindows: {
      allTime: "Todos os Tempos",
      last6Months: "Últimos 6 Meses",
      last12Months: "Últimos 12 Meses",
      last24Months: "Últimos 24 Meses"
    },
    title: "Desempenho Mensal",
    tabs: {
      chart: "Visualização em Gráfico",
      table: "Histórico",
      returnChart: "Comparação de Retorno",
      balanceChart: "Comparação de Saldo",
      futureProjection: "Projeção Futura",
    },
    chart: {
      accumulatedReturn: "Retorno Acumulado",
      accumulatedCDIReturn: "Retorno CDI Acumulado",
      accumulatedIPCAReturn: "Retorno IPC-A Acumulado",
      accumulatedTargetReturn: "Rentabilidade Alvo Acumulada",
      endBalance: "Saldo Final",
      contribution: "Contribuição",
      monthlyReturn: "Retorno Mensal",
      targetRentability: "Rentabilidade Alvo"
    },
    table: {
      headers: {
        month: "Mês",
        initialBalance: "Saldo Inicial",
        contribution: "Contribuição", 
        returns: "Rendimento",
        returnPercentage: "Rendimento %",
        endBalance: "Saldo Final",
        targetRentability: "Rentabilidade Alvo"
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
    },
    futureProjection: {
      age: "Idade",
      year: "Ano",
      contribution: "Aporte",
      withdrawal: "Retirada",
      balance: "Saldo",
      expandYear: "Expandir detalhes mensais",
      collapseYear: "Recolher detalhes mensais",
      monthlyDetails: "Mês",
      cashFlow: "Fluxo de Caixa",
      historical: 'Histórico',
      strategies: {
        fixed: "Renda Desejada",
        preservation: "Preservação",
        legacy: "Herança",
        spendAll: "Gastar Tudo"
      }
    }
  },
  expenseChart: {
    portfolioValue: "Valor do Portfólio",
    inflationAdjusted: "Ajustado pela Inflação",
    actualValue: "Valor Real",
    projectedValue: "Valor Projetado",
    years: "anos",
    goalAchievement: "Meta atingida"
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
    ageNotAvailable: "Idade projetada não disponível",
    title: "Meta de Investimento",
    currentValue: "R$ {{value}}",
    returnRate: "{{value}}% a.a.",
    goal: {
      label: "Meta: R$ {{value}}",
      targetAge: "Idade Alvo: {{age}}"
    },
    projectedAge:{
      label: "Idade Projetada:",
      years: " anos",
      months: " meses",
      aheadOfSchedule: "Avançado em {{years}} anos",
      behindSchedule: "Atrasado em {{years}} anos"
    },
  },
  financialRecords: {
    editTitle: "Editar Registro Financeiro",  
    updateSuccess: "Registro atualizado com sucesso",
    partialImport: "Importação Parcial",
    importErrors: "Erros de Importação",
    monthlyContribution: "Contribuição Mensal",
    title: "Registros Financeiros",
    addNew: "Adicionar Novo",
    startingBalance: "Saldo Inicial",
    endingBalance: "Saldo Final",
    growth: "Rendimento",
    noRecords: "Nenhum registro financeiro encontrado",
    new: {
      title: "Novo Registro Financeiro"
    },
    form: {
      year: "Ano",
      month: "Mês",
      startingBalance: "Saldo Inicial",
      monthlyContribution: "Contribuição Mensal",
      monthlyReturn: "Rendimento Mensal",
      monthlyReturnRate: "Taxa de Rendimento Mensal (%)",
      endingBalance: "Saldo Final",
      targetRentability: "Rentabilidade Alvo (%)",
      submit: "Salvar Registro"
    },
    importTitle: "Importar Registros",
    importInstructions: "Selecione um arquivo CSV ou TXT com os registros financeiros. O arquivo deve seguir o formato abaixo:",
    importSuccess: "Registros importados com sucesso",
    confirmDelete: "Tem certeza que deseja excluir este registro?",
    deleteSuccess: "Registro excluído com sucesso",
    confirmReset: "Tem certeza que deseja resetar todos os registros? Esta ação não pode ser desfeita.",
    resetSuccess: "Registros resetados com sucesso",
    errors: {
      fetchFailed: "Erro ao buscar registros financeiros",
      createFailed: "Erro ao criar registro financeiro",
      duplicateRecord: "Registro Duplicado",
      recordExists: "Já existe um registro para {{month}} de {{year}}",
      dataFetchFailed: "Erro ao buscar dados iniciais",
      futureDate: "Data Inválida",
      futureDateDescription: "Não é possível adicionar registros para datas futuras",
      deleteFailed: "Erro ao excluir registro",
      importFailed: "Erro ao importar registros",
      resetFailed: "Erro ao resetar registros",
      invalidFormat: "Formato de arquivo inválido",
      emptyFields: "Por favor, preencha todos os campos obrigatórios" 
    },
    success: {
      updated: "Registro financeiro atualizado com sucesso",
      created: "Registro financeiro criado com sucesso"
    },
    importButton: "Importar CSV",
    chooseFile: 'Escolher arquivo CSV',
    resetRecords: 'Resetar Registros'
  },
  clientProfile: {
    title: 'Informações do Cliente',
    loading: 'Carregando...',
    backToDashboard: 'Voltar ao Dashboard',
    profileSection: 'Dados Pessoais',
    passwordSection: 'Alterar Senha',
    email: 'E-mail',
    fullName: 'Nome Completo',
    birthDate: 'Data de Nascimento',
    newPassword: 'Nova Senha',
    confirmPassword: 'Confirmar Nova Senha',
    buttons: {
      edit: 'Editar',
      save: 'Salvar',
      cancel: 'Cancelar',
      changePassword: 'Alterar Senha'
    },
    messages: {
      profileUpdateSuccess: 'Dados atualizados com sucesso',
      profileUpdateError: 'Erro ao atualizar dados',
      passwordUpdateSuccess: 'Senha alterada com sucesso',
      passwordUpdateError: 'Erro ao alterar senha',
      passwordMismatch: 'As senhas não coincidem'
    }
  },
  settings: {
    title: 'Configurações',
    loading: 'Carregando...',
    backToDashboard: 'Voltar ao Dashboard',
    profileSection: 'Informações do Perfil',
    passwordSection: 'Alterar Senha',
    email: 'E-mail',
    fullName: 'Nome Completo',
    birthDate: 'Data de Nascimento',
    currentPassword: 'Senha Atual',
    newPassword: 'Nova Senha',
    confirmPassword: 'Confirmar Nova Senha',
    buttons: {
      edit: 'Editar',
      save: 'Salvar',
      cancel: 'Cancelar',
      changePassword: 'Alterar Senha'
    },
    messages: {
      profileUpdateSuccess: 'Perfil atualizado com sucesso',
      profileUpdateError: 'Erro ao atualizar perfil',
      passwordUpdateSuccess: 'Senha alterada com sucesso',
      passwordUpdateError: 'Erro ao alterar senha',
      passwordMismatch: 'As senhas não coincidem'
    }
  },
  financialGoals: {
    title: "Objetivos Financeiros",
    addNew: "Novo Objetivo",
    newGoal: "Novo Objetivo Financeiro",
    messages: {
      createSuccess: "Objetivo criado com sucesso",
      createError: "Erro ao criar objetivo",
      deleteSuccess: "Objetivo removido com sucesso",
      deleteError: "Erro ao remover objetivo",
      priorityUpdateError: "Erro ao atualizar prioridades",
    },
    form: {
      icon: "Ícone",
      assetValue: "Valor do bem",
      goalMonth: "Mês do objetivo",
      goalYear: "Ano do objetivo",
      isInstallment: "Parcelado?",
      isInstallmentHelp: "Marque esta opção se o objetivo será pago em parcelas",
      installmentCount: "Número de parcelas"
    },
    labels: {
      assetValue: "Valor do bem",
      targetAmount: "Valor necessário"
    },
    icons: {
      house: "Casa",
      car: "Carro",
      education: "Educação",
      retirement: "Aposentadoria",
      travel: "Viagem",
      emergency: "Emergência",
      other: "Outro",
    },
  },
  events: {
    title: 'Eventos',
    addNew: 'Adicionar Novo Evento',
    projected: 'Eventos Projetados',
    showCompleted: 'Mostrar Eventos Concluídos',
    hideCompleted: 'Ocultar Eventos Concluídos',
    complete: 'Concluir',
    reopen: 'Reabrir',
    form: {
      name: 'Nome do Evento',
      amount: 'Valor',
      month: 'Mês',
      year: 'Ano',
    },
    messages: {
      createSuccess: 'Evento criado com sucesso',
      createError: 'Erro ao criar evento',
      deleteSuccess: 'Evento excluído com sucesso',
      deleteError: 'Erro ao excluir evento',
    },
  },
};
