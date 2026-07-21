"use client";
import { useEffect } from "react";
import {
    App,
    Button,
    Col,
    Form,
    Input,
    notification,
    Row,
    Skeleton,
    Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ContentCard } from "@/components/ContentCard";
import { SeriesCard } from "@/components/SeriesCard";
import { Controller, useForm } from "react-hook-form";
import { getFormStatus } from "@/shared/lib/getFormStatus";
import { yupResolver } from "@hookform/resolvers/yup";
import { MatchSchema, matchSchema } from "@/shared/validation/matchSchema";
import {
    useGetMatchByIdQuery,
    useSetMatchResultMutation,
} from "@/services/Series/series";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import { isAllowedToWriteScore } from "@/shared/lib/isAllowedToWriteScore";
import { useRoleInMatch } from "@/shared/hooks/useRoleInSeries";
import { ComplaintsForm } from "@/components/Complaints/ComplaintsForm";
import { ComplaintsMatchList } from "@/components/Complaints/ComplaintsMatchList";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";
import { useRouter } from "next/navigation";

export interface MatchPageProps {
    params: { tournamentId: string; seriesId: string; matchId: string };
}

const MatchPage = ({ params }: MatchPageProps) => {
    const router = useRouter();
    const { message } = App.useApp();
    const [api, contextHolder] = notification.useNotification();
    const { currentData: tournament } = useGetTournamentByIdQuery({
        id: params.tournamentId,
    });
    const form = useForm({
        resolver: yupResolver(matchSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
    });
    const { control, handleSubmit } = form;

    const [setScore, { isLoading }] = useSetMatchResultMutation();

    const { currentData: match, isLoading: isLoadingMatch } =
        useGetMatchByIdQuery({ ...params });

    const { isGuestPlayer, isHomePlayer, isTournamentManagementAvailable } =
        useRoleInMatch({
            homePlayerId: match?.home_player_account?.user?.id,
            guestPlayerId: match?.guest_player_account?.user?.id,
        });

    const openNotification = () => {
        api.open({
            message: "Обратите внимание",
            description:
                "Игра автоматически подтверждается спустя 1 час после внесения результатов одним из игроков.",
            duration: 0,
        });
    };

    const onSubmit = (data: MatchSchema) => {
        const { video_link, score } = data;
        const scoreObj = { home_score: score[0]!, guest_score: score[1]! };
        //
        // if (!isTournamentManagementAvailable) {
        //     if (!video_link) {
        //         return form.setError("video_link", {
        //             message: "Введите ссылку на видео",
        //             type: "required",
        //         });
        //     }
        // }

        setScore({
            ...params,
            ...scoreObj,
            video_link: video_link ?? null,
        }).then((res) => {
            if ("data" in res) {
                message.success("Счет сохранен");
            }
            if ("error" in res && res.error) {
                getErrorMessage(res.error, message);
            }
        });
    };

    useEffect(() => {
        if (!isLoadingMatch) {
            openNotification();
        }
    }, [isLoadingMatch]);

    const handleScoreChange = (
        homeScore: number | undefined,
        guestScore: number | undefined,
    ) => form.setValue("score", [homeScore, guestScore], { shouldDirty: true });

    if (isLoadingMatch) {
        return <Skeleton active />;
    }

    const handleBack = () => {
        router.back();
    };

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Row justify={"space-between"}>
                    <Col>
                        <Button
                            type={"link"}
                            onClick={handleBack}
                            icon={<ArrowLeftOutlined />}
                        >
                            Назад
                        </Button>
                    </Col>
                    <Col>
                        <Typography.Title level={3}>
                            {tournament?.name}
                        </Typography.Title>
                    </Col>
                    <Col>&nbsp;</Col>
                </Row>
            </Col>
            <Col xs={24} md={16}>
                <form onSubmit={handleSubmit(onSubmit, console.log)}>
                    <ContentCard
                        title={
                            isTournamentManagementAvailable ||
                            isHomePlayer ||
                            isGuestPlayer
                                ? "Внесите результаты игры"
                                : "Результат игры"
                        }
                    >
                        <Row gutter={[32, 32]} justify={"center"}>
                            <Col span={24}>
                                {match && (
                                    <SeriesCard
                                        type={"match"}
                                        disabled={false}
                                        isScoreEditable={
                                            isAllowedToWriteScore(
                                                match.status,
                                            ) || isTournamentManagementAvailable
                                        }
                                        status={match.status}
                                        homePlayerAccount={
                                            match.home_player_account
                                        }
                                        guestPlayerAccount={
                                            match.guest_player_account
                                        }
                                        homeTeam={match.home_player_team}
                                        guestTeam={match.guest_player_team}
                                        homePlayerMatchResult={
                                            match.home_player_match_result
                                        }
                                        guestPlayerMatchResult={
                                            match.guest_player_match_result
                                        }
                                        onChange={handleScoreChange}
                                    />
                                )}
                            </Col>
                            <Col span={24} style={{ alignSelf: "center" }}>
                                <Row justify={"center"}>
                                    {(isHomePlayer || isGuestPlayer) && (
                                        <>
                                            <Col span={24}>
                                                <Typography.Title
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                    level={4}
                                                >
                                                    Как прошла игра?
                                                </Typography.Title>
                                            </Col>
                                            <Col xs={24} md={16}>
                                                <Controller
                                                    control={control}
                                                    name={"video_link"}
                                                    render={({
                                                        field,
                                                        fieldState,
                                                    }) => (
                                                        <Form.Item
                                                            layout="vertical"
                                                            label={
                                                                "Ссылка на трансляцию"
                                                            }
                                                            validateStatus={getFormStatus(
                                                                fieldState
                                                                    ?.error
                                                                    ?.message,
                                                            )}
                                                            help={
                                                                fieldState
                                                                    ?.error
                                                                    ?.message
                                                            }
                                                        >
                                                            <Input
                                                                {...field}
                                                                size={"large"}
                                                                autoComplete={
                                                                    "off"
                                                                }
                                                                placeholder="Введите ссылку на YouTube, Twitch или другие платформы"
                                                            />
                                                        </Form.Item>
                                                    )}
                                                />
                                            </Col>
                                        </>
                                    )}
                                    {(isTournamentManagementAvailable ||
                                        isHomePlayer ||
                                        isGuestPlayer) && (
                                        <Col xs={24} md={16}>
                                            <Button
                                                size={"large"}
                                                block
                                                type={"primary"}
                                                htmlType={"submit"}
                                                loading={isLoading}
                                            >
                                                Сохранить результат
                                            </Button>
                                        </Col>
                                    )}
                                </Row>
                            </Col>
                        </Row>
                    </ContentCard>
                </form>
            </Col>
            <Col xs={24} md={8}>
                <Row gutter={[8, 24]}>
                    <Col span={24}>
                        <ComplaintsMatchList
                            params={params}
                            isAdmin={isTournamentManagementAvailable}
                        />
                    </Col>
                    {!isTournamentManagementAvailable && (
                        <Col span={24}>
                            <ComplaintsForm params={params} />
                        </Col>
                    )}
                </Row>
            </Col>
            {contextHolder}
        </Row>
    );
};

export default MatchPage;
