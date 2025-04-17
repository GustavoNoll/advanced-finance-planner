import { 
  Target,
  TrendingUp,
  Calendar,
  Home,
  Car,
  Plane,
  GraduationCap,
  Users,
  Laptop,
  BookOpen,
  Briefcase,
  Heart
} from 'lucide-react';

export const eventIcons = {
  goal: Target,
  contribution: TrendingUp,
  other: Calendar,
  house: Home,
  car: Car,
  travel: Plane,
  family: Users,
  electronic: Laptop,
  education: GraduationCap,
  hobby: BookOpen,
  professional: Briefcase,
  health: Heart,
} as const;

export const eventNames = {
  goal: "Meta",
  contribution: "Contribuição",
  other: "Outro",
  house: "Casa",
  car: "Carro",
  travel: "Viagem",
  family: "Família",
  electronic: "Eletrônico",
  education: "Educação",
  hobby: "Hobby",
  professional: "Profissional",
  health: "Saúde",
} as const; 