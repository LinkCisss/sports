import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MatchOdds } from './oddsApi';

const DEVICE_ID_KEY = 'SPORTS_DEVICE_ID_V2';

// 生成标准的 UUID v4 格式，以兼容 Supabase 的 uuid 列类型
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const getDeviceId = async () => {
  let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = generateUUID();
    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

export const addFavorite = async (match: MatchOdds) => {
  const deviceId = await getDeviceId();
  const { error } = await supabase.from('favorites').insert({
    match_id: match.id,
    user_id: deviceId, // Keep track of whose favorite this is
    match_data: match,
  });
  if (error) {
    console.error('Error adding favorite:', error);
  }
};

export const removeFavorite = async (matchId: string) => {
  const deviceId = await getDeviceId();
  const { error } = await supabase.from('favorites').delete().match({ match_id: matchId, user_id: deviceId });
  if (error) {
    console.error('Error removing favorite:', error);
  }
};

export const getFavorites = async (): Promise<MatchOdds[]> => {
  const deviceId = await getDeviceId();
  const { data, error } = await supabase
    .from('favorites')
    .select('match_data')
    .eq('user_id', deviceId);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
  
  return data.map(row => row.match_data as MatchOdds);
};

export const checkIsFavorite = async (matchId: string): Promise<boolean> => {
  const deviceId = await getDeviceId();
  const { data, error } = await supabase
    .from('favorites')
    .select('match_id')
    .eq('match_id', matchId)
    .eq('user_id', deviceId)
    .maybeSingle();
    
  return !!data;
};
