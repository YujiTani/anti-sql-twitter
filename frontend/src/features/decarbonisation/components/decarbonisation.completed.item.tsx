import { IconNames, ICONS, SIZE } from '../constants';
import { useRef } from 'react';
import { CircleCheck } from 'lucide-react';

export type Decarbonisation = {
  id: number;
  uuid: string;
  name: string;
  description: string;
  icon: IconNames;
  image?: string;
  state: string;
  achievements: Achievement[];
};

export type Achievement = {
  id?: number;
  user_id?: string;
  decarbonisation_id?: string;
}

type DecarbonisationCompletedItemProps = {
  item: Decarbonisation;
};

/**
 * 脱炭素アクション; 達成済みアイテム
 */
function DecarbonisationCompletedItem({ item }: DecarbonisationCompletedItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const icon = ICONS[item.icon] || ICONS.ToyBrick;

  return (
    <div
      ref={itemRef}
      key={item.id}
      className="border-7 relative rounded-lg border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
      data-id={item.uuid}
    >
        <CircleCheck
          className="rounded-4xl absolute -right-5 -top-5 z-10 h-14 w-14 bg-white text-green-600"
          size={SIZE}
        />
      <div className="flex h-60 items-center justify-center bg-gray-100">
        <img
          className="aspect-square h-full w-full object-cover grayscale-100"
          src={item.image}
          alt={item.name}
        />
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center">
          <div className="mr-3 rotate-12 transform rounded-full bg-white p-2 shadow-sm">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-green-700">{item.name}</h3>
        </div>
        <p className="text-sm text-gray-600">{item.description}</p>
      </div>
    </div>
  );
}

export default DecarbonisationCompletedItem;
