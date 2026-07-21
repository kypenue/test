"use client";
import {
    App,
    Button,
    Col,
    Form,
    Input,
    Row,
} from "antd";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
    ComplaintsSchema,
    complaintsSchema,
} from "@/shared/validation/complaintsSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { getFormStatus } from "@/shared/lib/getFormStatus";
import { useCreateMatchComplaintsMutation } from "@/services/Complaints/complaints";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";

import s from "../style.module.scss";

export interface ComplaintsFormProps {
    params: { tournamentId: string; seriesId: string; matchId: string };
}

const ComplaintsForm = ({ params }: ComplaintsFormProps) => {
    const { message } = App.useApp();

    const formMethods = useForm<ComplaintsSchema>({
        resolver: yupResolver(complaintsSchema),
        reValidateMode: "onChange",
        mode: "onBlur",
    });

    const [create] = useCreateMatchComplaintsMutation();

    const { control, handleSubmit, reset } = formMethods;

    const onSubmit = (data: ComplaintsSchema) => {
        create({ ...params, ...data }).then((res) => {
            if ("data" in res) {
                reset();
            }
            if ("error" in res && res.error) {
                getErrorMessage(res.error, message);
            }
        });
    };
    return (
        <FormProvider {...formMethods}>
            <form
                className={s.card}
                onSubmit={handleSubmit(onSubmit, console.log)}
                id={"complaints"}
            >
                <Row gutter={8}>
                    <Col span={24}>
                        <Controller
                            control={control}
                            name={"comment"}
                            render={({ field, fieldState }) => (
                                <Form.Item
                                    layout="vertical"
                                    label={"Оставить жалобу:"}
                                    validateStatus={getFormStatus(
                                        fieldState?.error?.message,
                                    )}
                                    help={fieldState?.error?.message}
                                >
                                    <Input.TextArea
                                        {...field}
                                        autoComplete={"off"}
                                        placeholder="Текст жалобы"
                                        onChange={field.onChange}
                                    />
                                </Form.Item>
                            )}
                        />
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={24}>
                        <Button
                            block
                            type="primary"
                            form="complaints"
                            htmlType="submit"
                        >
                            Отправить
                        </Button>
                    </Col>
                </Row>
            </form>
        </FormProvider>
    );
};

export { ComplaintsForm };