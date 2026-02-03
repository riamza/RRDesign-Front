import { 
  Monitor, 
  Smartphone, 
  Server, 
  Palette, 
  Cloud, 
  Users,
  Code,
  Database,
  Globe,
  Lock,
  ShoppingCart,
  Briefcase,
  Wrench,
  Cpu,
  Zap,
  Shield,
  Search,
  BarChart,
  Target,
  Rocket
} from 'lucide-react';

export const iconMap = {
  monitor: Monitor,
  smartphone: Smartphone,
  server: Server,
  palette: Palette,
  cloud: Cloud,
  users: Users,
  code: Code,
  database: Database,
  globe: Globe,
  lock: Lock,
  shoppingCart: ShoppingCart,
  briefcase: Briefcase,
  wrench: Wrench,
  cpu: Cpu,
  zap: Zap,
  shield: Shield,
  search: Search,
  barChart: BarChart,
  target: Target,
  rocket: Rocket
};

export const getIcon = (iconName, size = 24) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent size={size} /> : null;
};
