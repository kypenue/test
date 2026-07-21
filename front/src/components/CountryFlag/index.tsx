import { countriesList } from "@/shared/constants/countries";

export const CountryFlag = ({
    country,
    width,
    height,
    borderRadius,
    style,
}: {
    country: string;
    width?: number;
    height?: number;
    borderRadius?: number;
    style?: React.CSSProperties;
}) => {
    const flag = countriesList.filter((item) => item?.value === country);

    return (
        <img
            style={{ width, height, borderRadius, ...style }}
            alt={country}
            src={flag[0]?.flag}
        />
    );
};