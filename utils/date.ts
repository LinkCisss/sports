import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(isToday);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 格式化比赛时间
 * @param dateString ISO 时间字符串 (如 "2026-06-11T19:00:00Z")
 * @param isZh 是否是中文环境
 * @returns 格式化后的时间，例如 "今天 19:00" 或 "06-11 19:00"
 */
export const formatMatchTime = (dateString: string, isZh: boolean = true) => {
  if (!dateString) return '';
  
  // 转换为本地时间
  const date = dayjs.utc(dateString).local();
  
  if (date.isToday()) {
    return isZh ? `今天 ${date.format('HH:mm')}` : `Today ${date.format('HH:mm')}`;
  }
  
  return date.format('MM-DD HH:mm');
};
