import supabase from '@/utils/supabase';

export type insertQuestPointRequest = {
  user_id: string;
  decarbonisation_id: string;
};

export async function fetchDecarbonisations() {
  const { data, error } = await supabase
  .from('decarbonisations')
  .select(
    `
      *,
      achievements (
      id,
      decarbonisation_id
    )
    `,);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * quest_pointsテーブルへのinsertとdecarbonisationのstate更新
 * supabaseのDatabase Functionsを使ってトランザクションしている
 * @returns response
 */
export async function achieveDecarbonisationAction(
  payload: insertQuestPointRequest,
) {
  const { data: response, error } = await supabase.rpc(
    'achieve_decarbonisation_action',
    {
      p_user_uuid: payload.user_id,
      p_decarbonisation_uuid: payload.decarbonisation_id,
    },
  );

  if (error) {
    console.error(error);
  }

  return response;
}
