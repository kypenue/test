import { Typography } from "antd";
import { Participant } from '@/shared/types/models/Tournament';

interface AccountCellProps {
    account: Participant;
}

export const AccountCell = ({ account }: AccountCellProps) => {
    return (
        <>
            {account?.login}
            <br />
            <Typography.Text type={"secondary"}>
                {account?.game.name} - {account?.platform.name}
            </Typography.Text>
        </>
    );
};