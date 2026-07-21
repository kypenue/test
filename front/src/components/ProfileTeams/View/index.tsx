import { ProfileTeamsList } from "@/components/ProfileTeams/ProfileTeamsList";
import { Button, Col, Form, Row, Select, type SelectProps } from "antd";
import { ProfileTeamsForm } from "@/components/ProfileTeams/ProfileTeamsForm";
import { useToggle } from "usehooks-ts";
import { Controller, FormProvider, useForm } from "react-hook-form";
import s from "@/components/GameAccountsDropDown/GameAccountsDropDown.module.scss";
import { useMemo } from "react";
import { useGetCurrentUserGamerAccountsQuery } from "@/services/Games/games";

export const View = () => {
    const [isOpen, toggleIsOpen] = useToggle(false);

    const form = useForm({
        defaultValues: {
            gameId: "all",
        },
    });
    const { currentData: currentUserAccounts } =
        useGetCurrentUserGamerAccountsQuery({});

    const items: SelectProps["options"] = useMemo(
        () =>
            currentUserAccounts?.payload?.reduce(
                (acc, item) => {
                    acc.push({
                        key: item.id.toString(),
                        value: item.game.id.toString(),
                        label: item.game.name,
                    });
                    return acc;
                },
                [
                    {
                        key: "all",
                        value: "all",
                        label: "Все",
                    },
                ],
            ),
        [currentUserAccounts],
    );

    return (
        <FormProvider {...form}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Row gutter={[16, 16]}>
                        <Col md={12} xs={24}>
                            <Controller
                                name={"gameId"}
                                render={({ field }) => (
                                    <Form.Item
                                        label={"Игра"}
                                        htmlFor={field.name}
                                    >
                                        <Select
                                            options={items}
                                            placeholder={
                                                "Выберите игру из списка"
                                            }
                                            className={s.dropdown}
                                            rootClassName={s.root}
                                            size={"large"}
                                            {...field}
                                        />
                                    </Form.Item>
                                )}
                            />
                        </Col>
                        <Col md={12} xs={24}>
                            <Button onClick={toggleIsOpen} size={"large"}>
                                Добавить команду
                            </Button>
                            {isOpen && (
                                <ProfileTeamsForm onClose={toggleIsOpen} />
                            )}
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <ProfileTeamsList />
                </Col>
            </Row>
        </FormProvider>
    );
};
