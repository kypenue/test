"use client";
import { App, Button, Col, Flex, Layout, Row, Steps } from "antd";
import s from "./style.module.scss";
import { useCallback, useState } from "react";
import { GamesSearch } from "@/components/GamesSearch";
import { TournamentBaseSettings } from "@/components/TournamentBaseSettings";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
    tournamentSchema,
    TournamentSchema,
} from "@/shared/validation/tournamentSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { TournamentFormatSettings } from "@/components/TournamentFormatSettings";
import { STAGE_DEFAULT_SCHEMA } from "@/shared/constants/bracketsTypes";
import { TournamentDatesSettings } from "@/components/TournamentDatesSettings";
import { useCreateTournamentMutation } from "@/services/Tournament/tournament";
import { TournamentCreationModel } from "@/shared/types/models/Tournament";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import { useRouter } from "next/navigation";
import { useAvailableTournamentCreationOptions } from "@/shared/hooks/useAvailableTournamentCreationOptions";

const steps = [
    {
        title: "Выбор игры",
        content: <GamesSearch />,
    },
    {
        title: "Общие настройки",
        content: <TournamentBaseSettings />,
    },
    {
        title: "Формат",
        content: <TournamentFormatSettings />,
    },
    {
        title: "Даты",
        content: <TournamentDatesSettings />,
    },
];

const TournamentCreationPage = () => {
    const { message } = App.useApp();
    const [current, setCurrent] = useState(0);
    const router = useRouter();

    const form = useForm<TournamentSchema>({
        resolver: yupResolver(tournamentSchema),
        reValidateMode: "onChange",
        mode: "onBlur",
        defaultValues: {
            stages: [STAGE_DEFAULT_SCHEMA],
            should_limit_participants: false,
        },
    });
    const { handleSubmit, control, trigger } = form;

    const [createTournament] = useCreateTournamentMutation();

    const { availableAmountOfParticipants } =
        useAvailableTournamentCreationOptions();

    const currentGame = useWatch<TournamentSchema>({
        name: "game_id",
        control: control,
    });

    const validation = async (fields: Array<keyof TournamentSchema>) => {
        return await trigger(fields);
    };

    const isNextButtonActive = useCallback(async () => {
        if (current === 0) {
            if (await validation(["game_id"])) {
                next();
            }
        }
        if (current === 1) {
            const validationResult = await validation([
                "name",
                "participants_number",
                "min_age",
                "platforms",
                "community_id",
                "registration_type",
            ]);

            if (availableAmountOfParticipants !== Infinity) {
                if (!form.getValues("participants_number")) {
                    return form.setError("participants_number", {
                        type: "custom",
                        message: "Введите количество участников",
                    });
                } else if (
                    Number(form.getValues("participants_number") ?? 0) >
                    availableAmountOfParticipants
                ) {
                    return form.setError("participants_number", {
                        type: "custom",
                        message: `Максимальное количество участников - ${availableAmountOfParticipants}`,
                    });
                }
            } else {
                if (
                    !form.getValues("participants_number") &&
                    form.getValues("should_limit_participants")
                ) {
                    return form.setError("participants_number", {
                        type: "custom",
                        message: "Введите количество участников",
                    });
                }
            }
            if (validationResult) {
                next();
            }
        }
        if (current === 2) {
            if (await validation(["stages"])) {
                next();
            }
        }
    }, [current, currentGame]);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const onSubmit: Parameters<typeof handleSubmit>[0] = async (
        data: TournamentSchema,
    ) => {
        if (!(await validation(["registration_dates", "tournament_dates"]))) {
            return;
        }

        const { tournament_dates, registration_dates, community_id, ...body } =
            data;
        let payload = {
            ...body,
            game_id: +data.game_id,
            tournament_format: "",
            rules_info: "",
            regulation: "",
            contacts_info: "",
            participants_number: data?.participants_number ?? null,
            cover_image_id: null,
            header_image_id: null,
            stages:
                (data &&
                    "stages" in data &&
                    data?.stages?.length &&
                    data?.stages.map((stage, index) => ({
                        ...stage,
                        order_number: index + 1,
                    }))) ??
                [],
        } as TournamentCreationModel;
        if (community_id) {
            payload.community_id = community_id;
        }
        if (tournament_dates) {
            payload.tournament_start = tournament_dates[0].toISOString();
            payload.tournament_end = tournament_dates[1].toISOString();
        }
        if (registration_dates) {
            payload.registration_start = registration_dates[0].toISOString();
            payload.registration_end = registration_dates[1].toISOString();
        }

        createTournament(payload).then((res) => {
            if ("data" in res && res.data) {
                message.success("Турнир создан");
                router.push(`/tournaments/${res.data.id}/settings`);
            }
            if ("error" in res && res.error) {
                getErrorMessage(res.error, message);
            }
        });
    };

    const onErrorSubmit: Parameters<typeof handleSubmit>[1] = (data) => {
        console.error(data);
    };
    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit, onErrorSubmit)}>
                <Layout.Content className={s.body}>
                    <Flex gap={32} vertical={true}>
                        <div>
                            <Steps current={current} items={steps} />
                        </div>
                        <div>
                            <div>{steps[current].content}</div>
                        </div>
                        <div>
                            <Row justify={"center"} gutter={[16, 16]}>
                                <Col xs={12} sm={6}>
                                    <Button
                                        size={"large"}
                                        onClick={prev}
                                        type={"dashed"}
                                        className={s.backButton}
                                        block={true}
                                        disabled={current === 0}
                                    >
                                        Назад
                                    </Button>
                                </Col>

                                {current === steps.length - 1 && (
                                    <Col xs={12} sm={6}>
                                        <Button
                                            type="primary"
                                            size={"large"}
                                            block={true}
                                            htmlType={"submit"}
                                        >
                                            Создать турнир
                                        </Button>{" "}
                                    </Col>
                                )}

                                {current < steps.length - 1 && (
                                    <Col xs={12} sm={6}>
                                        <Button
                                            type="primary"
                                            size={"large"}
                                            block={true}
                                            onClick={isNextButtonActive}
                                            // disabled={!isNextButtonActive}
                                        >
                                            Далее
                                        </Button>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    </Flex>
                </Layout.Content>
            </form>
        </FormProvider>
    );
};

export default TournamentCreationPage;
