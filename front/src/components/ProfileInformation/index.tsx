import {
    Alert,
    Col,
    Descriptions,
    Divider,
    Empty,
    Flex,
    Row,
    Skeleton,
    Typography,
} from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    useGetCurrentUserQuery,
    useGetUserByIdQuery,
} from "@/services/User/user";
import { useIsCurrentUser } from "@/shared/hooks/useIsCurrentUser";
import { ContentCard } from "@/components/ContentCard";
import { useGetProfileGames } from "@/shared/hooks/useGetProfileGames";
import { ProfileGameAccounts } from "@/components/ProfileGameAccountsWrapper/ProfileGameAccounts";
import s from "./style.module.scss";
import { ProfileSectionTitle } from "@/components/ProfileSectionTitle";
import { useGetUserSeriesQuery } from "@/services/Tournament/tournament";
import { SeriesCard } from "@/components/SeriesCard";
import { EmptyList } from "@/components/TournamentsList/EmptyList";
import { calculateAge } from "@/shared/lib/calculateAge";

export const ProfileInformation = () => {
    const { userId } = useParams<{ userId: string }>();

    const { currentData, isLoading } = useGetUserByIdQuery(userId);

    const { currentData: currentUser } = useGetCurrentUserQuery();

    const isCurrentUser = useIsCurrentUser(userId);

    const { gamesData, isLoading: isGameAccountsLoading } =
        useGetProfileGames();

    const { currentData: userSeries } = useGetUserSeriesQuery(
        {
            userId: !isCurrentUser ? userId : (currentUser?.id ?? ""),
            order_by: "updated_at",
            page: 1,
            per_page: 3,
        },
        { skip: !currentUser?.id },
    );

    return (
        <Row gutter={[16, 16]}>
            <Col sm={24} md={18}>
                <section>
                    <ProfileSectionTitle
                        link={`/account/${userId}/?account_tab=game_accounts`}
                        title={"Игровые аккаунты"}
                    />
                    {gamesData?.length === 0 && (
                        <Empty
                            imageStyle={{ height: "fit-content" }}
                            image={<Typography.Title>👾</Typography.Title>}
                            description={"Игровые аккаунты еще не добавлены"}
                        />
                    )}
                    <ProfileGameAccounts
                        userId={userId}
                        data={gamesData?.slice(0, 2)}
                        isLoading={isGameAccountsLoading}
                    />
                </section>
                <section className={s.section}>
                    <ProfileSectionTitle
                        link={`/account/${userId}/?account_tab=series`}
                        title={"Последние серии"}
                    />
                    {userSeries?.payload?.length === 0 && (
                        <Empty
                            imageStyle={{
                                height: "fit-content",
                            }}
                            image={<Typography.Title>🍃</Typography.Title>}
                            description={"Нет сыгранных серий"}
                        />
                    )}
                    <Row gutter={[16, 16]}>
                        {userSeries?.payload?.map((data) => (
                            <Col xs={24} key={data.id}>
                                <Link
                                    href={`/tournaments/${data?.tournament_id}/series/${data?.id}`}
                                >
                                    <SeriesCard
                                        href={`/tournaments/${data?.tournament_id}/series/${data?.id}`}
                                        homePlayerAccount={data.gamer1}
                                        tournamentId={data?.tournament_id}
                                        guestPlayerAccount={data.gamer2}
                                        homeTeam={null}
                                        guestTeam={null}
                                        homePlayerMatchResult={
                                            data.gamer1_score
                                        }
                                        guestPlayerMatchResult={
                                            data.gamer2_score
                                        }
                                        matches={data.matches}
                                        type={"series"}
                                    />
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </section>
            </Col>
            <Col sm={24} md={6}>
                <ContentCard>
                    {!currentData && isLoading && <Skeleton active />}
                    {currentData && (
                        <Flex vertical={true} gap={12}>
                            <Descriptions layout={"vertical"}>
                                <Descriptions.Item
                                    className={s.description}
                                    label="Имя и Фамилия"
                                >
                                    {currentData.name} {currentData.surname}
                                </Descriptions.Item>
                            </Descriptions>
                            <Descriptions layout={"vertical"}>
                                <Descriptions.Item
                                    className={s.description}
                                    label="Дата рождения"
                                >
                                    {currentData.birth_date
                                        .split("-")
                                        .reverse()
                                        .join(".")} ({calculateAge(currentData.birth_date)})
                                </Descriptions.Item>
                            </Descriptions>
                            <Descriptions layout={"vertical"}>
                                {currentData.country && currentData.city && (
                                    <Descriptions.Item
                                        className={s.description}
                                        label="Местоположение"
                                    >
                                        {currentData.country},{" "}
                                        {currentData.city}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                            {!currentData.country &&
                                !currentData.city &&
                                isCurrentUser && (
                                    <Alert
                                        message={"Укажите страну и город"}
                                        description={
                                            <>
                                                Для участия в турнирах
                                                необходимо заполнить страну и
                                                город{" "}
                                                <Link href={"/panel"}>
                                                    в настройках
                                                </Link>
                                            </>
                                        }
                                    />
                                )}
                            <Divider className={s.divider} />
                            {isCurrentUser && (
                                <>
                                    <Descriptions
                                        layout={"vertical"}
                                        title="Для связи"
                                    >
                                        <Descriptions.Item
                                            className={s.description}
                                            label="Telegram"
                                        >
                                            {currentData?.tg_login ? (
                                                <Link
                                                    href={`https://t.me/${currentData.tg_login}`}
                                                >
                                                    {currentData.tg_login}
                                                </Link>
                                            ) : (
                                                "Не прикреплен"
                                            )}
                                        </Descriptions.Item>
                                    </Descriptions>
                                    {!currentData.tg_login && isCurrentUser && (
                                        <Alert
                                            message={"Укажите Telegram"}
                                            description={
                                                <>
                                                    Для участия в турнирах
                                                    необходимо указать Telegram
                                                    для связи{" "}
                                                    <Link
                                                        href={"/panel/telegram"}
                                                    >
                                                        в настройках
                                                    </Link>
                                                </>
                                            }
                                        />
                                    )}
                                </>
                            )}
                        </Flex>
                    )}
                </ContentCard>
            </Col>
        </Row>
    );
};
