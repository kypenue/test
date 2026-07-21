"use client";

import { useGetCurrentUserQuery } from "@/services/User/user";
import {
    Alert,
    App,
    Button,
    Checkbox,
    Col,
    Descriptions,
    Divider,
    Row,
    Select,
    Skeleton,
    Space,
    Tooltip,
    Typography,
} from "antd";
import {
    useGetCurrentUserGamerAccountsQuery,
    useGetGamerAccountsQuery,
} from "@/services/Games/games";
import Link from "next/link";
import { ReloadOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { STORAGE } from "@/services/Storage";
import { useRouter } from "next/navigation";
import {
    useGetTournamentByIdQuery,
    useRegisterForTournamentMutation,
} from "@/services/Tournament/tournament";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import { ProfileUnverifiedEmailAlert } from "@/components/ProfileUnverifiedEmailAlert";

const RegisterPage = ({
    params: { tournamentId },
}: {
    params: { tournamentId: string };
}) => {
    const { message } = App.useApp();
    const isLoggedIn = !!STORAGE.getToken();
    const router = useRouter();
    const { currentData: user, isLoading, refetch } = useGetCurrentUserQuery();
    const [selectedGameAccount, setSelectedGameAccount] = useState("");
    const [agreement, setAgreement] = useState(false);

    const { currentData: tournament } = useGetTournamentByIdQuery({
        id: tournamentId,
    });
    const {
        isLoading: isAllGamerAccountsLoading,
        refetch: allGamerAccountsRefetch,
    } = useGetCurrentUserGamerAccountsQuery({});

    const {
        currentData: gamers,
        isLoading: isGamersLoading,
        refetch: gamersRefetch,
    } = useGetCurrentUserGamerAccountsQuery(
        {
            game_id: tournament?.game?.id,
        },
        { skip: !tournament?.game?.id },
    );

    const isDataLoading =
        isLoading || isGamersLoading || isAllGamerAccountsLoading;
    const isCityFilled = user?.country && user?.city;
    const isTelegramFilled = !!user?.tg_login;

    const [register, { isLoading: isRegisterLoading }] =
        useRegisterForTournamentMutation();

    const isSubmitDisabled =
        !isTelegramFilled ||
        !isCityFilled ||
        !agreement ||
        !selectedGameAccount;

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/auth");
        }
    }, [isLoggedIn]);

    const gameAccounts = useMemo(() => {
        if (gamers?.payload) {
            return gamers.payload.map((item) => ({
                label: (
                    <>
                        {item.login}{" "}
                        <Typography.Text type={"secondary"}>
                            {item.game.name}, {item.platform.name}
                        </Typography.Text>
                    </>
                ),
                value: item.id,
            }));
        }
        return [];
    }, [gamers]);

    const handleRegister = () => {
        register({ account_id: selectedGameAccount, id: tournamentId }).then(
            (res) => {
                if ("data" in res) {
                    message.success("Вы успешно зарегистрировались на турнир");
                    router.replace(`/tournaments/${tournamentId}`);
                }

                if ("error" in res && res.error) {
                    getErrorMessage(res.error, message);
                }
            },
        );
    };

    const handleRefetchAccounts = () => {
        gamersRefetch();
        allGamerAccountsRefetch();
    };
    return (
        <div>
            {isDataLoading && <Skeleton active />}
            {user && gamers?.payload && (
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <ProfileUnverifiedEmailAlert />
                    </Col>
                    <Col>
                        <Descriptions layout={"vertical"} colon={true}>
                            <Descriptions.Item span={24} label="Дата рождения">
                                {user.birth_date}
                            </Descriptions.Item>
                            <Descriptions.Item
                                span={24}
                                label={<>Страна и город </>}
                            >
                                {isCityFilled ? (
                                    `${user.country}, ${user.city}`
                                ) : (
                                    <>
                                        <Alert
                                            message={`⚠️ В профиле не указаны страна и город`}
                                            description={
                                                <>
                                                    Укажите в&nbsp;
                                                    <Link
                                                        target={"_blank"}
                                                        href={"/panel"}
                                                    >
                                                        {" "}
                                                        настройках профиля
                                                    </Link>
                                                </>
                                            }
                                            type={"error"}
                                        />
                                        <Divider type={"vertical"} />
                                        <Tooltip
                                            title={
                                                "Обновить данные о местоположении"
                                            }
                                        >
                                            <Button
                                                size={"small"}
                                                type={"link"}
                                                onClick={refetch}
                                                loading={isLoading}
                                            >
                                                <ReloadOutlined />{" "}
                                                &nbsp;обновить
                                            </Button>
                                        </Tooltip>
                                    </>
                                )}
                            </Descriptions.Item>

                            <Descriptions.Item span={24} label={<>Telegram</>}>
                                {isTelegramFilled ? (
                                    `${user.tg_login}`
                                ) : (
                                    <>
                                        <Alert
                                            message={`⚠️ В профиле не указан Telegram`}
                                            description={
                                                <>
                                                    {" "}
                                                    Укажите в&nbsp;
                                                    <Link
                                                        target={"_blank"}
                                                        href={"/panel/telegram"}
                                                    >
                                                        {" "}
                                                        настройках профиля
                                                    </Link>
                                                </>
                                            }
                                            type={"error"}
                                        />

                                        <Divider type={"vertical"} />
                                        <Tooltip
                                            title={"Обновить данные о Telegram"}
                                        >
                                            <Button
                                                size={"small"}
                                                type={"link"}
                                                onClick={refetch}
                                                loading={isLoading}
                                            >
                                                <ReloadOutlined />{" "}
                                                &nbsp;обновить
                                            </Button>
                                        </Tooltip>
                                    </>
                                )}
                            </Descriptions.Item>

                            <Descriptions.Item
                                span={24}
                                label={<>Игровой аккаунт</>}
                            >
                                {gamers.payload.length ? (
                                    <Space>
                                        <Select
                                            style={{ width: 200 }}
                                            onChange={setSelectedGameAccount}
                                            value={selectedGameAccount}
                                            options={gameAccounts}
                                        />
                                        <div>
                                            <Link href={"/panel/games"}>
                                                Нет нужного аккаунта?
                                            </Link>
                                            <Divider type={"vertical"} />
                                            <Tooltip
                                                title={
                                                    "Обновить список аккаунтов"
                                                }
                                            >
                                                <Button
                                                    size={"small"}
                                                    type={"link"}
                                                    onClick={gamersRefetch}
                                                    loading={isLoading}
                                                >
                                                    <ReloadOutlined />{" "}
                                                    &nbsp;обновить
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </Space>
                                ) : (
                                    <>
                                        <Alert
                                            message={`⚠️ Не найдены игровые аккаунты для ${tournament?.game?.name ?? ""}`}
                                            description={
                                                <span>
                                                    Добавьте игровые аккаунты
                                                    в&nbsp;
                                                    <Link
                                                        style={{
                                                            display: "inline",
                                                        }}
                                                        href={"/panel/games"}
                                                    >
                                                        настройках профиля
                                                    </Link>
                                                </span>
                                            }
                                            type={"error"}
                                        />
                                        <Divider type={"vertical"} />
                                        <Button
                                            size={"small"}
                                            onClick={gamersRefetch}
                                            loading={isGamersLoading}
                                            type={"link"}
                                        >
                                            <ReloadOutlined /> &nbsp;обновить
                                        </Button>
                                    </>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item span={24}>
                                <Checkbox
                                    onChange={(e) =>
                                        setAgreement(e.target.checked)
                                    }
                                    checked={agreement}
                                >
                                    Согласие с{" "}
                                    <Link href={"./reglament"}>
                                        {" "}
                                        регламентом
                                    </Link>{" "}
                                    турнира
                                </Checkbox>
                            </Descriptions.Item>
                        </Descriptions>

                        <Button
                            style={{ marginTop: 16 }}
                            disabled={isSubmitDisabled}
                            block
                            onClick={handleRegister}
                            loading={isRegisterLoading}
                            type={"primary"}
                        >
                            Зарегистрироваться на турнир
                        </Button>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default RegisterPage;
