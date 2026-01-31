import { 
  Target,
  TrendingUp,
  Calendar,
  Car,
  Plane,
  Home,
  Ambulance,
  Hammer,
} from 'lucide-react';

export const eventIcons = {
  goal: Target,
  contribution: TrendingUp,
  car: Car,
  house: Home,
  travel: Plane,
  accident: Ambulance,
  renovation: Hammer,
  other: Calendar,
} as const;