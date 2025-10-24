import { DateTime } from 'luxon';

export const formatDate = (dateString: string): string => {
  return DateTime.fromISO(dateString, { zone: 'Asia/Tokyo' }).toFormat('yyyy/MM/dd HH:mm:ss');
};