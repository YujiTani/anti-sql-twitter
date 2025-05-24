import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  achieveDecarbonisationAction,
  fetchDecarbonisations,
  insertQuestPointRequest,
} from './decarbonisation.repository';
import { useNotificationStore } from '@/components/ui/notifications/notification-store';

/**
 * decarbonisationの一覧を取得
 * @returns decarbonisations
 */
export function useDecarbonisations() {
  const decarbonisationsQuery = useSuspenseQuery({
    queryFn: fetchDecarbonisations,
    queryKey: ['decarbonisations'],
  });

  return {
    decarbonisations: decarbonisationsQuery.data,
  };
}

/**
 * decarbonisationのstateをcompletedに更新し、quest_pointsにinsertする
 * @returns insertレスポンス
 */
export function useAchieveDecarbonisationAction() {
  // QueryClientを取得（キャッシュ操作用）
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (payload: insertQuestPointRequest) =>
      achieveDecarbonisationAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decarbonisations'] });
      queryClient.invalidateQueries({ queryKey: ['questPoint'] });
      queryClient.invalidateQueries({ queryKey: ['questPoint', 'today'] });
      addNotification({ type: 'success', message: `正常に更新されました` });
    },
    onError: () => {
      addNotification({ type: 'error', message: `更新に失敗しました` });
    },
  });
}
