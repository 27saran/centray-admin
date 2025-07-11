import { DateTime } from 'luxon';

export const formatDate = (dateString: string): string => {
  return DateTime.fromISO(dateString, { zone: 'utc' }).toFormat('yyyy/MM/dd HH:mm:ss');
};