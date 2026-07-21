import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
    Avatar,
    Col,
    Flex,
    Form,
    Input,
    List,
    Radio,
    Row,
    Select,
    Spin,
    Switch,
} from "antd";
import { useGetPlatformsQuery } from "@/services/Games/games";
import { TournamentSchema } from "@/shared/validation/tournamentSchema";
import { TeamOutlined, TrophyOutlined } from "@ant-design/icons";
import { selectEntityAdapter } from "@/shared/lib/selectEntityAdapter";
import s from "./style.module.scss";
import { REGISTRATION_TYPES } from "@/shared/constants/tournament";
import { useGetCurrentUserQuery } from "@/services/User/user";
import { useGetCommunitiesQuery } from "@/services/Communities/community";
import { useEffect, useMemo } from "react";
import { userMock } from "@/shared/constants/userMock";
import { useSubscriptionLevel } from "@/shared/hooks/useSubscriptionLevel";
import { useAvailableTournamentCreationOptions } from "@/shared/hooks/useAvailableTournamentCreationOptions";
import { getDeclinations } from "@/shared/lib/getDiclinations";
import { getFormStatus } from "@/shared/lib/getFormStatus";

export const TournamentBaseSettings = () => {
    const { control } = useFormContext<TournamentSchema>();

    const { currentData: user } = useGetCurrentUserQuery();

    const { currentData: communities } = useGetCommunitiesQuery(
        {
            creator_id: user?.id,
        },
        { skip: !user?.id },
    );

    const { data: platforms, isLoading: isLoadingPlatforms } =
        useGetPlatformsQuery();

    const { isUnlimitedParticipantsAvailable, availableAmountOfParticipants } =
        useAvailableTournamentCreationOptions();

    const platformOptions = selectEntityAdapter(platforms ?? []);

    const isUnlimitedAmountOfParticipants = !useWatch({
        name: "should_limit_participants",
    });

    const form = useFormContext();

    useEffect(() => {
        form.setValue("should_limit_participants", true, {
            shouldValidate: true,
        });
        form.setValue("participants_number", null, {
            shouldValidate: true,
        });
    }, [isUnlimitedParticipantsAvailable]);

    useEffect(() => {
        if (user && communities) {
            form.setValue("community_id", "");
        }
    }, [user, communities]);

    const options = useMemo(() => {
        if (user && communities) {
            const userOption = [
                {
                    value: "",
                    label: (
                        <List>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={userMock.avatar} />}
                                    title={`${user.surname} ${user.name}`}
                                    description={"Персональный аккаунт"}
                                />
                            </List.Item>
                        </List>
                    ),
                },
            ];
            communities?.payload.forEach((option) => {
                userOption.push({
                    value: option.id,
                    label: (
                        <List>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar>🤝</Avatar>}
                                    title={`${option.title}`}
                                    description={"Пространство"}
                                />
                            </List.Item>
                        </List>
                    ),
                });
            });
            return userOption;
        }
        return [];
    }, [user, communities]);

    const textAlert = `На текущем уровне подписки максимальное количество участников турнира - ${availableAmountOfParticipants === Infinity ? "неограничено" : availableAmountOfParticipants}`;

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <Controller
                        control={control}
                        name={"name"}
                        render={({ field, fieldState }) => (
                            <Form.Item
                                label={"Название"}
                                layout={"vertical"}
                                validateStatus={getFormStatus(
                                    fieldState?.error?.message,
                                )}
                                help={fieldState?.error?.message}
                            >
                                <Input
                                    prefix={<TrophyOutlined />}
                                    placeholder="Название вашего турнира"
                                    size={"large"}
                                    {...field}
                                />
                            </Form.Item>
                        )}
                    />
                    <Controller
                        control={control}
                        rules={{ max: availableAmountOfParticipants }}
                        name={"participants_number"}
                        render={({ field, fieldState }) => (
                            <>
                                <Form.Item
                                    label={"Количество участников"}
                                    layout={"vertical"}
                                    extra={
                                        availableAmountOfParticipants !==
                                            Infinity && textAlert
                                    }
                                    validateStatus={getFormStatus(
                                        fieldState?.error?.message,
                                    )}
                                    help={fieldState?.error?.message}
                                >
                                    {/*
// @ts-ignore null is not appropriate value for input  */}
                                    <Input
                                        prefix={<TeamOutlined />}
                                        placeholder="Введите число"
                                        size={"large"}
                                        disabled={
                                            isUnlimitedAmountOfParticipants
                                        }
                                        type={"number"}
                                        max={availableAmountOfParticipants}
                                        min={3}
                                        style={{
                                            marginBottom:
                                                availableAmountOfParticipants ===
                                                Infinity
                                                    ? 12
                                                    : 0,
                                        }}
                                        {...field}
                                    />
                                    {isUnlimitedParticipantsAvailable && (
                                        <Controller
                                            control={control}
                                            name={"should_limit_participants"}
                                            render={({ field }) => (
                                                <Flex gap={8} align={"center"}>
                                                    <Switch
                                                        {...field}
                                                        disabled={
                                                            !isUnlimitedParticipantsAvailable
                                                        }
                                                        checked={!field.value}
                                                        onChange={(e) => {
                                                            e &&
                                                                form.clearErrors(
                                                                    "participants_number",
                                                                );
                                                            field.onChange(!e);
                                                        }}
                                                    />
                                                    Неограниченное количество
                                                    участников
                                                </Flex>
                                            )}
                                        />
                                    )}
                                </Form.Item>
                            </>
                        )}
                    />
                    <Controller
                        control={control}
                        name={"min_age"}
                        render={({ field, fieldState }) => (
                            <>
                                <Form.Item
                                    label={"Минимальный возраст участников"}
                                    layout={"vertical"}
                                    validateStatus={getFormStatus(
                                        fieldState?.error?.message,
                                    )}
                                    help={fieldState?.error?.message}
                                >
                                    <Input
                                        prefix={<TeamOutlined />}
                                        placeholder="Введите возраст"
                                        size={"large"}
                                        type={"number"}
                                        {...field}
                                    />
                                </Form.Item>
                            </>
                        )}
                    />

                    <Controller
                        control={control}
                        name={"platforms"}
                        render={({ field, fieldState }) => (
                            <Form.Item
                                label={"Список платформ"}
                                layout={"vertical"}
                                validateStatus={getFormStatus(
                                    fieldState?.error?.message,
                                )}
                                help={fieldState?.error?.message}
                            >
                                <Select
                                    style={{ minWidth: 200 }}
                                    loading={isLoadingPlatforms}
                                    size={"large"}
                                    placeholder={
                                        "Выберите доступные для игры платформы"
                                    }
                                    options={platformOptions}
                                    mode={"multiple"}
                                    {...field}
                                />
                            </Form.Item>
                        )}
                    />
                </Col>
                <Col xs={24}>
                    <Controller
                        control={control}
                        name="community_id"
                        render={({ field }) => (
                            <Form.Item
                                layout={"vertical"}
                                label="Организатор турнира"
                            >
                                {options ? (
                                    <Select
                                        {...field}
                                        style={{ height: "70px" }}
                                        size={"large"}
                                        options={options}
                                        placeholder={"Выберите из списка"}
                                    />
                                ) : (
                                    <Spin />
                                )}
                            </Form.Item>
                        )}
                    />
                </Col>

                <Col xs={24}>
                    <Controller
                        control={control}
                        name="registration_type"
                        render={({ field, fieldState }) => (
                            <Form.Item
                                layout={"vertical"}
                                label="Регистрация"
                                validateStatus={getFormStatus(
                                    fieldState?.error?.message,
                                )}
                                help={fieldState?.error?.message}
                            >
                                <Radio.Group
                                    optionType="button"
                                    buttonStyle="solid"
                                    size={"large"}
                                    {...field}
                                >
                                    <Radio
                                        className={s.radio}
                                        disabled={true}
                                        value={REGISTRATION_TYPES.MANUAL}
                                    >
                                        <p className={s.optionText}>
                                            Вручную {"\n"}
                                        </p>
                                        <span className={s.optionSubText}>
                                            загрузить список
                                        </span>
                                    </Radio>
                                    <Radio
                                        className={s.radio}
                                        value={REGISTRATION_TYPES.REGISTRATION}
                                    >
                                        <p className={s.optionText}>
                                            Автоматически {"\n"}
                                        </p>
                                        <span className={s.optionSubText}>
                                            открытая регистрация
                                        </span>
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                        )}
                    />
                </Col>
                <Col xs={24}>
                    <Controller
                        control={control}
                        name="teams_used"
                        render={({ field, fieldState }) => (
                            <Form.Item
                                layout={"vertical"}
                                label="Команды / персонажи"
                                validateStatus={getFormStatus(
                                    fieldState?.error?.message,
                                )}
                                help={fieldState?.error?.message}
                            >
                                <Switch {...field} checked={field.value} />{" "}
                                Добавить закрепление команд за участниками
                            </Form.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    );
};
