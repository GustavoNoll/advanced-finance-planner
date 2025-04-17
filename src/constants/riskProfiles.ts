export type RiskProfile = {
  value: string;
  label: string;
  return: string;
  bgColor: string;
  textColor: string;
};

export type RiskProfilesByCurrency = {
  [key: string]: RiskProfile[];
};

export const RISK_PROFILES: RiskProfilesByCurrency = {
  BRL: [
    {
      value: 'CONS',
      label: 'Conservador',
      return: '4.0',
      bgColor: 'bg-red-100',
      textColor: 'text-red-900'
    },
    {
      value: 'MOD',
      label: 'Moderado',
      return: '5.0',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-900'
    },
    {
      value: 'ARROJ',
      label: 'Arrojado',
      return: '6.0',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-900'
    }
  ],
  EUR: [
    {
      value: 'CONS',
      label: 'Conservador',
      return: '2.0',
      bgColor: 'bg-red-100',
      textColor: 'text-red-900'
    },
    {
      value: 'MOD',
      label: 'Moderado',
      return: '3.0',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-900'
    },
    {
      value: 'ARROJ',
      label: 'Agressivo',
      return: '5.0',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-900'
    }
  ],
  USD: [
    {
      value: 'CONS',
      label: 'Conservador',
      return: '2.0',
      bgColor: 'bg-red-100',
      textColor: 'text-red-900'
    },
    {
      value: 'MOD',
      label: 'Moderado',
      return: '3.0',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-900'
    },
    {
      value: 'ARROJ',
      label: 'Agressivo',
      return: '5.0',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-900'
    }
  ]
}; 