import { DateTime, Duration, Interval } from "luxon";
import type { DateTimeFormatOptions, DateTimeUnit, DurationUnits } from "luxon";

import { coalesce } from "./coalesce";

export const jsDateToMilis = (date: Date) => {
  return DateTime.fromJSDate(date, { zone: getTimezone() }).toMillis();
};

export const jsDateFromMilis = (millis: number) => {
  return DateTime.fromMillis(millis, { zone: getTimezone() }).toJSDate();
};

export const formatDateFromMilis =
  (outputFormat: string | DateTimeFormatOptions) => (millis: number) =>
    format(outputFormat)(jsDateFromMilis(millis));

export const getTimezone = () =>
  typeof Intl !== "undefined"
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "America/Sao_Paulo";

// export const getLocale = () =>
// 	typeof Intl !== 'undefined'
// 		? Intl.DateTimeFormat().resolvedOptions().locale
// 		: 'pt-BR';
// use "pt-BR" as local always
export const getLocale = () => "pt-br";

const MONTH_FORMAT: DateTimeFormatOptions = { month: "short", year: "2-digit" };
const TIME_24_SIMPLE: DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
};
export const GQL_DATE_FORMAT = "yyyy-MM-dd";
export const DEFAULTDATEFORMAT = "dd/MM/yyyy";
export const DATEFORMAT = "dd MMM, yyyy";
export const DATEFORMATFULL = "dd MMMM yyyy";
export const TIMEFORMAT = "HH:mm";

/**
 * truncTo: unit of time: month, day, year, week, second
 */
export const truncDate = (
  dateString: string | Date | DateTime,
  truncTo: DateTimeUnit,
  timezone?: string
) => {
  // Luxon truncates DateTime object to utc if I parse it
  if (DateTime.isDateTime(dateString)) {
    return dateString.startOf(truncTo);
  }
  return (
    timezone
      ? parseDate(dateString, true, undefined, timezone)
      : parseDate(dateString)
  ).startOf(truncTo);
};
/**
 * Trim a date to the start of the day but timezone sensitive
 * TODO: write test
 */
export const trimDate = (
  dateString: string | Date | DateTime,
  timezone?: string
) => truncDate(dateString, "day", timezone);

/**
 * Process date and return weekday if date in same week else return date
 * eg Today, Yesterday, Tuesday or 05 Jan 2022
 */
export const weekdayDate = (dateString: string, format?: string) => {
  const date = parseDate(dateString, true, format);
  const moment = now();

  if (
    date.hasSame(moment, "week") &&
    date.hasSame(moment, "year") &&
    date.day === moment.day
  ) {
    return "Hoje";
  }
  if (
    date.hasSame(moment, "week") &&
    date.hasSame(moment, "year") &&
    date.day === moment.minus({ day: 1 }).day
  ) {
    return "Ontem";
  }
  if (date.hasSame(moment, "week") && date.hasSame(moment, "year")) {
    return date.weekdayLong;
  }
  return date.toFormat("dd LLL yyyy");
};

/**
 * truncTimezone
 * parses a date timezone insensitive
 * @param {string} dteStr
 * @param {string} dteFormat
 * @return {*}
 */
export const truncTimezone = (dteStr: string, dteFormat: string) => {
  // This doesn't work for an ISO datetime
  const isoDate = DateTime.isDateTime(dteStr) ? isoFormat(dteStr) : dteStr;
  if (!isoDate) {
    return;
  }
  return parseDate(
    isoDate,
    isoDate.includes && !isoDate.includes("000Z"),
    dteFormat
  );
};

/**
 * parses a date an sets the timezone to utc so you can format it relative to utc
 */
export const extractDateFromISO = (isoString: string) =>
  DateTime.fromISO(isoString).toUTC();

/**
 * now() return timezone based current date time
 *
 * @return Luxon.DateTime
 */
export const now = () =>
  DateTime.local().setZone(getTimezone()).setLocale(getLocale());

/**
 * Returns a Duration that represents the difference between the supplied date and now.
 * @param {*} dateString
 * @param {*} timeString
 */
export const diffNow = (
  dateString: string | Date | DateTime,
  unit: DurationUnits,
  useTimezone?: boolean,
  dteFormat?: string,
  timezone?: string,
  locale?: string
) =>
  parseDate(dateString, useTimezone, dteFormat, timezone, locale).diffNow(unit);

const convertUnit = (unit: DurationUnits | keyof DateTime): keyof Duration => {
  switch (unit) {
    case "year":
    case "years":
      return "years";
    case "quarter":
    case "quarters":
      return "quarters";
    case "month":
    case "months":
      return "months";
    case "week":
    case "weeks":
      return "weeks";
    case "day":
    case "days":
      return "days";
    case "hour":
    case "hours":
      return "hours";
    case "minute":
    case "minutes":
      return "minutes";
    case "second":
    case "seconds":
      return "seconds";
    case "millisecond":
    case "milliseconds":
      return "milliseconds";
    default:
      throw new Error("Unknow duration unit");
  }
};

const convertUnitDuration = (
  unit: DurationUnits | keyof DateTime
): DateTimeUnit => {
  const keys = [
    "year",
    "years",
    "quarter",
    "quarters",
    "month",
    "months",
    "week",
    "weeks",
    "day",
    "days",
    "hour",
    "hours",
    "minute",
    "minutes",
    "second",
    "seconds",
    "millisecond",
    "milliseconds",
  ];
  if (keys.includes(unit as string)) {
    return unit as DateTimeUnit;
  }
  throw new Error("Unknow duration unit");
};

/**
 * Returns a time is passed or not. default check unit is minutes.
 * @param {*} dateString
 * @param {} unit
 */
export const isTimePassed = (
  dateString: string | Date | DateTime,
  unit: DurationUnits = "minutes",
  useTimezone?: boolean,
  dteFormat?: string,
  timezone?: string,
  locale?: string
) => {
  const dif = diffNow(
    dateString,
    unit,
    useTimezone,
    dteFormat,
    timezone,
    locale
  )[convertUnit(unit)];
  return dif ? parseFloat(`${dif}`) < 0 : -1 < 0;
};

/**
 * Returns a is time is within interval or not.
 * @param {*} start
 * @param {*} end
 * @param {} date
 */
export const isWithinInterval = (
  start: string | Date | DateTime,
  end: string | Date | DateTime,
  date: string | Date | DateTime = now()
) => {
  const interval = Interval.fromDateTimes(parseDate(start), parseDate(end));
  return interval.contains(parseDate(date));
};

/**
 * Returns a Duration that represents the difference between the two supplied dates.
 * @param {*} dateString
 * @param {*} timeString
 */
export const diff = (
  startDate: string | Date | DateTime,
  endDate: string | Date | DateTime,
  unit: DurationUnits
) => parseDate(startDate).diff(parseDate(endDate), unit);

/**
 *
 * @param {*} dateString
 * @param {*} unit: what to add / substract: days, minutes, hours
 * @param {*} value: the amount of time to add. positive values will be added, negative values substracted
 */
export const addTime = (
  dateString: string | Date | DateTime,
  unit: keyof Duration,
  value: number
) =>
  value > 0
    ? parseDate(dateString).plus({
        [unit]: value,
      })
    : parseDate(dateString).minus({
        [unit]: Math.abs(value),
      });

export const timeInterval = (
  date: string | Date | DateTime,
  interval: number,
  unit: keyof DateTime = "minute"
) => {
  let prev = addTime(date, convertUnit(unit), interval);
  prev = truncDate(
    prev.set({
      [unit]: Math.floor(prev.get(unit) / interval) * interval,
    }),
    convertUnitDuration(unit)
  );
  return prev;
};

/**
 * format :: outputFormat -> (dateString, useTimezone) -> string
 *
 * format receive desired output format and return another function
 * receiving date iso string and use timezone variables finally returning
 * the string formatted with "outputFormat" using luxon library
 *
 * @return string
 */
export const format =
  (outputFormat: string | DateTimeFormatOptions) =>
  (
    dateString: string | Date | DateTime | null | undefined,
    useTimezone?: boolean,
    timezone?: string,
    locale?: string
  ) => {
    if (!dateString) {
      return dateString;
    }
    if (DateTime.isDateTime(dateString)) {
      if (typeof outputFormat === "string") {
        return dateString.toFormat(outputFormat, {
          locale: locale || getLocale(),
        });
      }
      return dateString.toLocaleString(
        {
          ...outputFormat,
        },
        {
          locale: locale || getLocale(),
        }
      );
    }

    const date = useTimezone
      ? parseDate(
          dateString,
          useTimezone,
          undefined,
          coalesce(timezone, getTimezone())
        )
      : parseDate(dateString);
    if (typeof outputFormat === "string") {
      return date.toFormat(outputFormat, {
        locale: locale || getLocale(),
      });
    }
    return date.toLocaleString(
      {
        ...outputFormat,
      },
      {
        locale: locale || getLocale(),
      }
    );
  };

export const customFormat =
  (outputFormat: string) =>
  (
    dateString: string | Date | DateTime,
    useTimezone?: boolean,
    timezone?: string,
    locale?: string
  ) => {
    if (!dateString) {
      return dateString;
    }
    const tz = useTimezone ? coalesce(timezone, getTimezone()) : undefined;
    const localeT = locale || getLocale();

    return parseDate(dateString, useTimezone, undefined, tz, localeT).toFormat(
      outputFormat
    );
  };

export const parseAndFormatDate = (
  dateString: string | Date | DateTime,
  useTimezone?: boolean,
  timezone?: string,
  locale?: string,
  toClientDefaultFormat?: boolean
) => {
  if (toClientDefaultFormat) {
    return parseDate(
      dateString,
      useTimezone,
      undefined,
      timezone,
      locale
    ).toFormat(DEFAULTDATEFORMAT);
  }

  return parseDate(
    dateString,
    useTimezone,
    undefined,
    timezone,
    locale
  ).toISODate();
};

export const dateStringTimeString = (
  dateString: string,
  timeString: string,
  useTimezone?: boolean,
  timezone?: string
) =>
  parseDate(`${dateString}T${timeString}Z`, useTimezone, undefined, timezone);

/**
 * Receive date ISO string and convert to locale format
 *
 * @param  {string|Date} dateString - Date ISO String (YYYY-MM-DD) or Date Object
 * @param  {boolean} useTimezone=true - if you want to use timezone (check getTimezone function) or use local
 * @param  {string} timezone - IANA timezone (prefer to use system internal omitting this parameter)
 * @param  {string} locale - localization string
 *
 * @return string format like 'Oct 14, 1983'
 */
export const dateFormat = format(DateTime.DATE_MED);

export const defaultDateFormat = customFormat("yyyy-MM-dd");

/**
 * Receive date ISO string and convert to month short with 2 digits year (YY-MM)
 *
 * @param  {string|Date} dateString - Date ISO String (YYYY-MM-DD) or Date Object
 * @param  {boolean} useTimezone=true - if you want to use timezone (check getTimezone function) or use local
 * @param  {string} timezone - IANA timezone (prefer to use system internal omitting this parameter)
 * @param  {string} locale - localization string
 *
 * @return string format like ''
 */
export const monthFormat = format(MONTH_FORMAT);

/**
 * Receive date time ISO string and convert to simple time format (09:30)
 *
 * @param  {string|Date} dateString - Date time ISO String or Date Object
 * @param  {boolean} useTimezone=true - if you want to use timezone (check getTimezone function) or use local
 * @param  {string} timezone - IANA timezone (prefer to use system internal omitting this parameter)
 * @param  {string} locale - localization string
 *
 * @return string format like '09:30'
 */
export const timeFormat = format(TIME_24_SIMPLE);

export const isoFormat = (
  date: string | Date | DateTime,
  useTimezone?: boolean
) => date && parseDate(date, useTimezone).toISO();

/**
 * Parse date and time strings into timezone based date time
 * Keep in mind that by default Luxon creates browser timezones as local and node timezones as utc
 * The challenge is that front end components may convert to ISO time already, making the time display off.
 * E.g. a Brazilian date of 2019-11-22 and time of 23:15 is 02:15 ISO, if you then combine 2019-11-22 and 02:15, you're off by a day
 *
 * @param  {string|Date} dateString - Date ISO String (YYYY-MM-DD) or Date Object
 * @param  {string} timeString - Time String (HH:mm)
 *
 * @return Luxon.DateTime
 */
export const parseToTimezoneDate = (
  dateString: string | Date | DateTime,
  timeString?: string
) => {
  const time = timeString || "00:00"; // null based timeString makes default impossible
  return DateTime.fromISO(`${dateString}T${time}:00.000`)
    .setLocale(getLocale())
    .setZone(getTimezone());
};

/**
 * Parse date time iso string into Luxon.DateTime
 *
 * @param {string} dteString - Date time ISO String
 * @param  {boolean} useTimezone=true - if you want to use timezone (check getTimezone function) or use local
 * @param  {string} timezone - IANA timezone (prefer to use system internal omitting this parameter)
 * @param  {string} locale - localization string
 *
 * @return Luxon.DateTime
 */
export const parseISODate = (
  dteString: string,
  useTimezone?: boolean,
  timezone?: string,
  locale?: string
) => {
  const date = DateTime.fromISO(dteString, {
    locale,
  });
  if (useTimezone) {
    date.setZone(timezone || getTimezone());
  }
  return date;
};

/**
 *
 * Parses a Unix timestamp
 * @param {*} timestamp
 */
export const parseTimestampInSeconds = (timestamp: number) =>
  DateTime.fromSeconds(timestamp);

/**
 * Parse date time iso string or Date object into Luxon.DateTime
 *
 * @param {string|Date} dteString - Date time ISO String or Date object
 *
 * @return Luxon.DateTime
 */
export const parseDate = (
  dteString: string | Date | DateTime,
  useTimezone?: boolean,
  dteFormat?: string,
  timezone?: string,
  locale?: string
): DateTime => {
  let dte;
  const tz = useTimezone ? coalesce(timezone, getTimezone()) : undefined;
  const loc = coalesce(locale, getLocale());
  if (dteString instanceof Date) {
    dte = DateTime.fromJSDate(dteString);
  } else if (DateTime.isDateTime(dteString)) {
    dte = dteString;
  } else if (dteFormat) {
    dte = DateTime.fromFormat(dteString, dteFormat, {
      zone: useTimezone ? tz : undefined,
      locale: loc,
    });
  } else if (typeof dteString === "string" && dteString.includes("T")) {
    dte = parseISODate(dteString, useTimezone, tz, loc);
  } else {
    const date = new Date(dteString);
    dte = DateTime.fromJSDate(date);
  }

  if (useTimezone === false) {
    dte = dte.toUTC();
  } else if (tz) {
    dte = dte.setZone(tz);
  }

  if (loc) {
    dte = dte.setLocale(loc);
  }

  return dte;
};

/**
 * Parse date time iso string into Luxon.DateTime
 *
 * @param {object} dateObject - Date JS Object
 * @param {bool} useTimezone - To use timezone, default is set to true
 * @param {string} locale - localization string
 * @param {string} toDateFormat - If set, returns a string from given format
 *
 * @return Luxon.DateTime // String if toDateFormat if set
 */
export const parseJSDate = (
  dateObject: Date,
  useTimezone?: boolean,
  locale?: string,
  toDateFormat?: string,
  timezone?: string
) => {
  const tz = useTimezone ? timezone || getTimezone() : null;
  const lc = locale || getLocale();

  const date = DateTime.fromJSDate(dateObject).setLocale(lc);
  if (useTimezone && tz) {
    date.setZone(tz);
  }

  if (toDateFormat) {
    return date.toFormat(toDateFormat);
  }

  return date;
};

export const parseTime = (
  timeString: string | Date,
  useTimezone?: boolean,
  timezone?: string
) => {
  if (timeString instanceof Date) {
    return DateTime.fromJSDate(timeString);
  }
  const date = DateTime.fromFormat(timeString, TIMEFORMAT);
  const tz = coalesce(timezone, getTimezone());
  return useTimezone && tz ? date.setZone(tz) : date;
};

export const verifyDate = (dteString: string | Date | DateTime) =>
  parseDate(dteString).isValid;

export const toRelative = (dateString: string | Date | DateTime) => {
  let dte = dateString;
  if (!(dte instanceof DateTime)) {
    dte = parseDate(dateString);
  }
  return dte.toRelative();
};

export const parseAndFormatTime = (
  timeString: string | Date | DateTime,
  useTimezone?: boolean,
  timezone?: string,
  locale?: string
) =>
  parseDate(timeString, useTimezone, undefined, timezone, locale).toISOTime({
    includeOffset: false,
    extendedZone: false,
  });

export const mergeDateWithTime = (dateString: string, timeString: string) => {
  return DateTime.fromISO(`${dateString}T${timeString}:00.000`).setZone(
    getTimezone()
  );
};

export const parseTimeToZone = (timeString: string) => {
  return DateTime.fromISO(`${timeString}:00.000`)
    .setZone(getTimezone())
    .toFormat(TIMEFORMAT);
};

export const isDateNewer = (date1: string, date2: string) => {
  const initDate = parseISODate(date1).toMillis();
  const endDate = parseISODate(date2).toMillis();

  return initDate > endDate;
};
