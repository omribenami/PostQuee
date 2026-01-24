'use client';
import dayjs, { ConfigType } from 'dayjs';
import { FC, useEffect } from 'react';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(timezone);
dayjs.extend(utc);

const { utc: originalUtc } = dayjs;

export const getTimezone = () => {
  if (typeof window === 'undefined') {
    return dayjs.tz.guess();
  }
  try {
    return localStorage.getItem('timezone') || dayjs.tz.guess();
  } catch (e) {
    return dayjs.tz.guess();
  }
};

export const newDayjs = (config?: ConfigType) => {
  return dayjs(config);
};

const SetTimezone: FC = () => {
  useEffect(() => {
    dayjs.utc = (config?: ConfigType, format?: string, strict?: boolean) => {
      const result = originalUtc(config, format, strict);

      // Attach `.local()` method to the returned Dayjs object
      result.local = function () {
        return result.tz(getTimezone());
      };

      return result;
    };
    try {
      if (localStorage.getItem('timezone')) {
        dayjs.tz.setDefault(getTimezone());
      }
    } catch (e) {
      console.error('Failed to set timezone from localStorage', e);
    }
  }, []);
  return null;
};

export default SetTimezone;
