import DecarbonisationItem from './decarbonisation.item';
import {
  useAchieveDecarbonisationAction,
  useDecarbonisations,
} from '../api/useDecarbonisation';
import { useDecarbonisationStore } from '../api/decarbonisation.store';
import { useUserStore } from '@/features/auth/api/user.store';
import DecarbonisationCompletedItem from './decarbonisation.completed.item';

/**
 * 脱炭素アクショングリッド
 */
function DecarbonisationGrid() {
  const { decarbonisations } = useDecarbonisations();
  const achieveDecarbonisationAction = useAchieveDecarbonisationAction();
  const { decarbonisations: selectedDecarbonisations } =
    useDecarbonisationStore();
  const { user } = useUserStore();

  const handleAchieve = () => {
    if (!user) {
      throw Error('ユーザー情報がありません');
    }

    selectedDecarbonisations.map((decarbonisation) => {
      achieveDecarbonisationAction.mutate({
        user_id: user.id,
        decarbonisation_id: decarbonisation.uuid,
      });
    });
  };

  return (
    <div className="container relative mx-auto px-4 py-8">
      <h2 className="text-center font-bold text-2xl md:text-5xl">
        地球にいいこと
      </h2>
      <div className="mt-20 grid gap-4 md:grid-cols-3">
        {decarbonisations.map((item) => (
          item.achievements.length > 0 ? (
            <DecarbonisationCompletedItem
              key={item.uuid}
              item={item}
            />
          ) : (
            <DecarbonisationItem
              key={item.uuid}
              item={item}
              onAchieve={() => handleAchieve()}
            />
          )
        ))}
      </div>
    </div>
  );
}

export default DecarbonisationGrid;
