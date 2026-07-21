import Link from "next/link";
import { Alert, Col } from "antd";
import { useGetCurrentUserQuery } from "@/services/User/user";

export const ProfileUnverifiedEmailAlert = () => {
    const { currentData } = useGetCurrentUserQuery();

    return (
        <>
            {currentData && !currentData?.is_verified && (
                <Col span={24}>
                    <Alert
                        type={"error"}
                        message={"Подтвердите email"}
                        description={
                            <>
                                Чтобы участвовать в турнирах и пользоваться
                                сайтом, необходимо&nbsp;
                                <Link href={"/auth/verify"}>
                                    подтвердить email
                                </Link>
                            </>
                        }
                    />
                </Col>
            )}
        </>
    );
};
