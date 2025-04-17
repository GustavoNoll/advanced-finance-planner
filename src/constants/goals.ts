import { 
  Home, 
  Car, 
  Plane, 
  GraduationCap, 
  Users, 
  Laptop, 
  BookOpen, 
  Briefcase, 
  Heart, 
  Target 
} from 'lucide-react';

export const goalIcons = {
  house: Home,
  car: Car,
  travel: Plane,
  family: Users,
  electronic: Laptop,
  education: GraduationCap,
  hobby: BookOpen,
  professional: Briefcase,
  health: Heart,
  other: Target,
} as const;
