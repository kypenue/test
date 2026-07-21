import PS5 from "../../../public/icons/ps5.svg";
import XBox from "../../../public/icons/xbox.svg";
import PC from "../../../public/icons/pc.svg";

export interface PlatformIconProps {
    size?: number;
    platformName: string;
    className?: string;
    style?: object;
    fill?: string;
}

export const PlatformIcon = ({
    size = 26,
    className,
    style,
    platformName,
    fill,
}: PlatformIconProps) => {
    return (
        <div className={className} style={{ width: size, ...style }}>
            {platformName === "PS5" && <PS5 fill={fill} alt={platformName} />}
            {platformName === "XBOX X|S" && (
                <XBox fill={fill} alt={platformName} />
            )}
            {platformName === "PC" && (
                <PC width={size * 0.75} fill={fill} alt={platformName} />
            )}
        </div>
    );
};
