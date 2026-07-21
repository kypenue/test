import djs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

require("dayjs/locale/ru");

const dayjs = djs.locale("ru");

// Load the plugins
djs.extend(customParseFormat);
djs.extend(localizedFormat);
djs.extend(utc);
djs.extend(timezone);

export const TODAY = djs().unix();

export { dayjs, djs };
