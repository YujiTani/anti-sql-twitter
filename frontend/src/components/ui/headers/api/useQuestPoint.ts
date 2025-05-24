import { useSuspenseQuery } from '@tanstack/react-query';
import {
  fetchQueryPointByUserUuid,
  fetchQuestPoint,
  fetchQuestPointByLastWeek,
  fetchQuestPointByToday,
} from './quest-point.repository';

export type useQuestPointResponse = {
  id: number;
  created_at: string;
  decarbonisations: {
    point: number;
  };
};

/**
 * ユーザーの獲得クエストポイントを取得
 * @returns クエストポイント
 */
export function useQuestPoint() {
  const questPointQuery = useSuspenseQuery({
    queryKey: ['questPoint'],
    queryFn: () => fetchQuestPoint(),
  });

  let totalPoint = 0;
  if (questPointQuery.data.length > 0) {
    totalPoint = questPointQuery.data.reduce((sum, item) => {
      // FIXME: 型推論を修正できないため、仕方なくチェックを外す
      // eslint-disable-next-line
      // @ts-ignore
      return sum + (item.decarbonisations?.point || 0);
    }, 0);
  }

  return {
    questPoint: totalPoint,
  };
}

/**
 * ユーザーの直近1週間の獲得クエストポイントを取得
 * @returns クエストポイント
 */
export function useQuestPointByLastWeek() {
  const questPointQuery = useSuspenseQuery({
    queryKey: ['questPoint', 'lastweek'],
    queryFn: () => fetchQuestPointByLastWeek(),
  });

  let totalPoint = 0;
  if (questPointQuery.data.length > 0) {
    totalPoint = questPointQuery.data.reduce((sum, item) => {
      // FIXME: 型推論を修正できないため、仕方なくチェックを外す
      // eslint-disable-next-line
      // @ts-ignore
      return sum + (item.decarbonisations?.point || 0);
    }, 0);
  }

  return {
    questPoint: totalPoint,
  };
}

/**
 * ユーザーの今日の獲得クエストポイントを取得
 * @returns クエストポイント
 */
export function useQuestPointByToday() {
  const questPointQuery = useSuspenseQuery({
    queryKey: ['questPoint', 'today'],
    queryFn: () => fetchQuestPointByToday(),
  });

  let totalPoint = 0;
  if (questPointQuery.data.length > 0) {
    totalPoint = questPointQuery.data.reduce((sum, item) => {
      // FIXME: 型推論を修正できないため、仕方なくチェックを外す
      // eslint-disable-next-line
      // @ts-ignore
      return sum + (item.decarbonisations?.point || 0);
    }, 0);
  }

  return {
    questPoint: totalPoint,
  };
}

/**
 * ユーザーの獲得クエストポイントをUuidで取得
 * @param options.from 取得開始日 Date
 * @param options.to 取得終了日 Date
 * @returns クエストポイント
 */
export function useQuestPointByUserUuid(uuid: string) {
  const questPointQuery = useSuspenseQuery({
    queryKey: ['questPoint', uuid],
    queryFn: () => fetchQueryPointByUserUuid(uuid),
  });

  return {
    questPoint: questPointQuery.data,
  };
}
