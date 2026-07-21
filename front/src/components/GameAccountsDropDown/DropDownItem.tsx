import { PlatformIcon } from "@/components/PlatformIcon";
import { Flex } from "antd";

interface Props {
    platform: string;
    name: string;
    login: string;
}

export const DropDownItem = ({ platform, login, name }: Props) => {
    return (
        <Flex align={"center"} gap={4} justify={"space-between"}>
            <Flex align={"center"} gap={4}>
                <span>{login}</span>
                <PlatformIcon platformName={platform} style={{ height: 26 }} />
            </Flex>
            <span>{name}</span>
        </Flex>
    );
};
