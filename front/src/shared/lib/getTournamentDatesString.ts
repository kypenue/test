import dayjs from "dayjs";

export const getTournamentDatesString = (start: string, end: string) => {
    return `${dayjs(start).locale("ru").format("D MMMM")} 
- ${dayjs(end).locale("ru").format("D MMMM")}`;
};
