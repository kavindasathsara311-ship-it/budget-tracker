import React from 'react';
import { Category } from '../types';
import { 
  Utensils, 
  Bus, 
  ShoppingBag, 
  HeartPulse, 
  Gamepad2, 
  GraduationCap, 
  Home, 
  Zap, 
  MoreHorizontal 
} from 'lucide-react';

const iconMap: Record<Category, React.ReactNode> = {
  [Category.FOOD]: <Utensils className="w-5 h-5" />,
  [Category.TRANSPORT]: <Bus className="w-5 h-5" />,
  [Category.SHOPPING]: <ShoppingBag className="w-5 h-5" />,
  [Category.HEALTH]: <HeartPulse className="w-5 h-5" />,
  [Category.ENTERTAINMENT]: <Gamepad2 className="w-5 h-5" />,
  [Category.EDUCATION]: <GraduationCap className="w-5 h-5" />,
  [Category.HOUSING]: <Home className="w-5 h-5" />,
  [Category.UTILITIES]: <Zap className="w-5 h-5" />,
  [Category.OTHER]: <MoreHorizontal className="w-5 h-5" />,
};

interface Props {
  category: Category;
  className?: string;
}

export const CategoryIcon: React.FC<Props> = ({ category, className }) => {
  return (
    <div className={`p-2 rounded-full bg-teal-100 text-teal-600 ${className}`}>
      {iconMap[category] || iconMap[Category.OTHER]}
    </div>
  );
};
