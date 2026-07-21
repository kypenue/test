import { Col, Row, Typography } from "antd";
import Link from "next/link";
import { PlatformIcon } from "@/components/PlatformIcon";
import { SwissRatingModel } from "@/shared/types/models/Tournament";
import s from "./SwissRating.module.scss";

interface GamerAccountProps {
    playerAccount: SwissRatingModel["account"];
}

export const GamerAccount = ({ playerAccount }: GamerAccountProps) => {
    return (
        <Row gutter={[8, 8]} align={"top"} className={s.account}>
            <div
                className={s.anchor}
                id={`user-${playerAccount.user.id?.toString()}`}
            />
            <Col>
                <Link href={`/account/${playerAccount.user.id}`}>
                    <Typography.Title level={4}>
                        {playerAccount.login}
                    </Typography.Title>
                    <Typography.Text>
                        {`${playerAccount.user.surname} ${playerAccount.user.name}`}
                    </Typography.Text>
                </Link>
            </Col>
            <Col>
                <PlatformIcon
                    fill={"white"}
                    size={20}
                    platformName={playerAccount.platform.name}
                />
            </Col>
        </Row>
    );
};
