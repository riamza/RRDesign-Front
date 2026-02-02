import { 
  Monitor, 
  Smartphone, 
  Server, 
  Palette, 
  Cloud, 
  Users 
} from 'lucide-react';

export const iconMap = {
  monitor: Monitor,
  smartphone: Smartphone,
  server: Server,
  palette: Palette,
  cloud: Cloud,
  users: Users
};

export const getIcon = (iconName, size = 24) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent size={size} /> : null;
};
