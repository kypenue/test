export const formatPercentage = (value: number, locale = "ru-RU") => {
    return Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
    }).format(value);
};
