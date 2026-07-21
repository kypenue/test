import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// Extend Day.js with the isBetween plugin
/**
 * Checks if today is between the registration start and end dates.
 * @param {string} registration_start - The start date of registration (in a valid date format).
 * @param {string} registration_end - The end date of registration (in a valid date format).
 * @returns {boolean} - Returns true if today is within the registration period, false otherwise.
 */
export const isTodayBetween = (
    registration_start: string,
    registration_end: string,
): boolean => {
    dayjs.extend(isBetween);

    const start = dayjs(registration_start);
    const end = dayjs(registration_end);
    const today = dayjs();

    return today.isBetween(start, end, null, "[]"); // '[]' includes the start and end dates
};
