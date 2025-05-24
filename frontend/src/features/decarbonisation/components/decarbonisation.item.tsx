import { useLongPress } from '@/hooks/useLongClick';
import { IconNames, ICONS } from '../constants';
import { useRef, useState } from 'react';
import ConfirmDialog from '@/components/ui/dialogs/confirmDialog';
import { useDecarbonisationStore } from '../api/decarbonisation.store';
import CircleLoader from '@/components/ui/circles/circleLoader';

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

type DecarbonisationProps = {
  item: Decarbonisation;
  onAchieve?: (uuid: string) => void;
};

/**
 * 脱炭素アクションアイテム
 */
function DecarbonisationItem({ item, onAchieve }: DecarbonisationProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const icon = ICONS[item.icon] || ICONS.ToyBrick;
  const [OpenDialog, setOpenDialog] = useState(false);
  const { hasDecarbonisation, addDecarbonisation, removeDecarbonisation } =
    useDecarbonisationStore();
  const pressMilliseconds = 800;
  const isSelected = hasDecarbonisation(item.uuid);

  function showDialog() {
    const itemElement = itemRef.current;
    if (!itemElement) {
      return;
    }
    setOpenDialog(true);
  }

  function handleClick() {
    const itemElement = itemRef.current;
    const uuid = itemElement?.getAttribute('data-id');

    if (!itemElement || !uuid) {
      return;
    }

    if (!hasDecarbonisation(uuid)) {
      addDecarbonisation(item);
    } else {
      removeDecarbonisation(uuid);
    }
  }

  const handleLongPress = useLongPress(showDialog, pressMilliseconds);

  function handleConfirm() {
    if (onAchieve) {
      onAchieve(item.uuid);
    }
  }

  const borderStyle = isSelected ? 'border-blue-400' : 'border-gray-200';

  return (
    <div
      ref={itemRef}
      key={item.id}
      className={`border-7 relative rounded-lg ${borderStyle} bg-white shadow-sm transition-shadow duration-200 hover:shadow-md`}
      data-id={item.uuid}
      onClick={handleClick}
      {...handleLongPress}
    >
      <div className="flex h-60 items-center justify-center bg-gray-100">
        <img
          className="aspect-square h-full w-full object-cover"
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
      <div>
        <CircleLoader
          width={50}
          height={50}
          milliseconds={pressMilliseconds}
          infinite={false}
          followCursor={true}
          isPressed={handleLongPress.isPress}
        />
      </div>
      <ConfirmDialog
        isOpen={OpenDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
        title="アクション達成の確認"
        message="このアクションを達成しましたか？達成するとポイントが加算されます。"
        item={item}
      />
    </div>
  );
}

export default DecarbonisationItem;
