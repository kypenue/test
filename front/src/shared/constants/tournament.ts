export const REGISTRATION_TYPES = {
    MANUAL: "MANUAL",
    REGISTRATION: "REGISTRATION",
} as const;

export const TOURNAMENT_LIFECYCLE_MAP: Record<number, string> = {
    1: "Турнир создан",
    2: "Регистрация открыта",
    3: "Регистрация окончена",
    4: "Турнир начат",
    5: "Турнир завершен",
    6: "Турнир в архиве",
    7: "Жеребьевка команд",
    8: "Жеребьевка команд завершена",
} as const;

export const TOURNAMENT_NEXT_LIFECYCLE_ACTION_TEXT_MAP: Record<number, string> =
    {
        2: "Начать регистрацию",
        3: "Завершить регистрацию",
        4: "Начать турнир",
        5: "Завершить турнир",
        7: "Начать жеребьевку команд",
        8: "Завершить жеребьевку команд",
    } as const;
