import { Typography } from "antd";
import Link from "next/link";
import { ParticipantAccountUser } from "@/shared/types/models/Tournament";

interface UserCellProps {
    user: ParticipantAccountUser;
}

export const UserCell = ({ user }: UserCellProps) => {
    return (
        <>
            <Link href={`/account/${user.id}`}>
                {user?.name}&nbsp;{user?.surname}
            </Link>
            <br />
            <Link href={`https://t.me/${user.tg_login}`}>
                <Typography.Text type={"secondary"}>
                    @{user.tg_login}
                </Typography.Text>
            </Link>
        </>
    );
};
