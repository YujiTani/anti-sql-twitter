import { useQuestPoint, useQuestPointByToday } from '../api/useQuestPoint';

/**
 * ユーザーの獲得しているポイント
 */
function QuestPoint() {
  const { questPoint: totalQuestPoint } = useQuestPoint();
  const { questPoint: todayQuestPoint } = useQuestPointByToday();

  return (
    <div className="flex items-center space-x-6">
      <div>
        <p className="text-xs text-gray-500">トータル</p>
        <p className="text-4xl font-semibold text-gray-900">
          {totalQuestPoint.toLocaleString()} pt
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500">今日</p>
        <p className="text-4xl font-semibold text-green-600">
          {todayQuestPoint.toLocaleString()} pt
        </p>
      </div>
    </div>
  );
}

export default QuestPoint;
