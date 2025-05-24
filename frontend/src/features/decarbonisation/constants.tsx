import {
  Lightbulb,
  Droplet,
  Utensils,
  Bike,
  ShoppingBag,
  Recycle,
  ToyBrick,
  MessageCircle,
  TreeDeciduous,
} from 'lucide-react';
export const SIZE = '48';

// 子ども向け脱炭素アクション
export const ICONS = {
  Lightbulb: <Lightbulb className="h-12 w-12 text-yellow-400" size={SIZE} />,
  Droplet: <Droplet className="h-12 w-12 text-blue-400" size={SIZE} />,
  Utensils: <Utensils className="h-12 w-12 text-orange-400" size={SIZE} />,
  TreeDeciduous: (
    <TreeDeciduous className="h-12 w-12 text-green-500" size={SIZE} />
  ),
  Bike: <Bike className="h-12 w-12 text-purple-500" size={SIZE} />,
  ShoppingBag: <ShoppingBag className="h-12 w-12 text-pink-400" size={SIZE} />,
  Recycle: <Recycle className="h-12 w-12 text-green-600" size={SIZE} />,
  ToyBrick: <ToyBrick className="h-12 w-12 text-gray-600" size={SIZE} />,
  MessageCircle: (
    <MessageCircle className="h-12 w-12 text-blue-500" size={SIZE} />
  ),
} as const;
export type IconNames = keyof typeof ICONS;
