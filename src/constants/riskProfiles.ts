export type RiskProfile = {
  value: string;
  label: string;
  return: string;
  bgColor: string;
  textColor: string;
};

export const RISK_PROFILES: RiskProfile[] = [
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
]; 