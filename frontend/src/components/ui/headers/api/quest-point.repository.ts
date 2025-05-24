import supabase from '@/utils/supabase';

const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

export async function fetchQuestPoint() {
  const currentDate = new Date();
  const toDateISO = currentDate.toISOString();

  const { data, error } = await supabase
    .from('quest_points')
    .select(
      `
        id,
        created_at,
        decarbonisations (
        point
        )
    `,
    )
    .lte('created_at', toDateISO)
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchQuestPointByLastWeek() {
  const currentDate = new Date();
  const nowMilliseconds = currentDate.getTime();

  const fromDateISO = new Date(nowMilliseconds - oneWeekMs).toISOString();
  const toDateISO = currentDate.toISOString();

  const { data: quest_points, error } = await supabase
    .from('quest_points')
    .select(
      `
        id,
        created_at,
        decarbonisations (
        point
        )
    `,
    )
    .gte('created_at', fromDateISO)
    .lte('created_at', toDateISO)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return quest_points;
}

export async function fetchQuestPointByToday() {
  const currentDate = new Date();
  const startDateTime = new Date(currentDate);
  startDateTime.setUTCHours(0, 0, 0, 1);
  const startDateTimeISO = startDateTime.toISOString();

  const endDateTime = new Date(currentDate);
  endDateTime.setUTCHours(23, 59, 59, 999);
  const endDateTimeISO = endDateTime.toISOString();

  const { data: quest_points, error } = await supabase
    .from('quest_points')
    .select(
      `
        id,
        created_at,
        decarbonisations (
        point
        )
    `,
    )
    .gte('created_at', startDateTimeISO)
    .lte('created_at', endDateTimeISO)
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) {
    throw error;
  }

  return quest_points;
}

export async function fetchQueryPointByUserUuid(uuid: string) {
  const { data: quest_points, error } = await supabase
    .from('quest_points')
    .select('*')
    .eq('user_id', uuid);

  if (error) {
    throw error;
  }

  return quest_points;
}
