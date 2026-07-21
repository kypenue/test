import { Col, DatePicker, Form, Row } from "antd";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { TournamentSchema } from "@/shared/validation/tournamentSchema";
import { getFormStatus } from "@/shared/lib/getFormStatus";
import { useEffect } from "react";

export const TournamentDatesSettings = () => {
    const { control, trigger } = useFormContext<TournamentSchema>();
    const { registration_dates, tournament_dates } =
        useWatch<TournamentSchema>();

    useEffect(() => {
        if (registration_dates) {
            trigger("registration_dates");
        }
    }, [registration_dates]);

    useEffect(() => {
        if (tournament_dates) {
            trigger("tournament_dates");
        }
    }, [tournament_dates]);
    return (
        <Row gutter={[16, 16]}>
            <Col xs={24}>
                <Controller
                    control={control}
                    name={"registration_dates"}
                    render={({ field, fieldState }) => (
                        <Form.Item
                            label={"Даты регистрации"}
                            layout={"vertical"}
                            validateStatus={getFormStatus(
                                fieldState?.error?.message,
                            )}
                            help={fieldState?.error?.message}
                        >
                            <DatePicker.RangePicker
                                showTime
                                needConfirm={false}
                                size={"large"}
                                {...field}
                                value={
                                    field.value
                                        ? [field.value[0], field.value[1]]
                                        : null
                                }
                                format={"D MMMM YYYY HH:mm:ss"}
                            />
                        </Form.Item>
                    )}
                />
            </Col>
            <Col xs={24}>
                <Controller
                    control={control}
                    name={"tournament_dates"}
                    render={({ field, fieldState }) => (
                        <Form.Item
                            label={"Даты проведения турнира"}
                            layout={"vertical"}
                            validateStatus={getFormStatus(
                                fieldState?.error?.message,
                            )}
                            help={fieldState?.error?.message}
                        >
                            <DatePicker.RangePicker
                                showTime
                                size={"large"}
                                needConfirm={false}
                                {...field}
                                value={
                                    field.value
                                        ? [field.value[0], field.value[1]]
                                        : null
                                }
                                format={"D MMMM YYYY HH:mm:ss"}
                            />
                        </Form.Item>
                    )}
                />
            </Col>
        </Row>
    );
};
