import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    panelPasswordSchema,
    PanelPasswordSchema,
} from "@/shared/validation/passwordSchema";
import { Button, Col, Form, Input, Row } from "antd";
import { getFormStatus } from "@/shared/lib/getFormStatus";

export const PanelSecurityForm = () => {
    const formMethods = useForm<PanelPasswordSchema>({
        resolver: yupResolver(panelPasswordSchema),
        reValidateMode: "onChange",
        mode: "onBlur",
    });

    const { control, handleSubmit, reset } = formMethods;
    const onSubmit = (data: PanelPasswordSchema) => {
        console.log(data);
    };

    return (
        <FormProvider {...formMethods}>
            <form
                onSubmit={handleSubmit(onSubmit, console.log)}
                id={"password"}
            >
                <Row gutter={[16, 8]}>
                    <Col span={24}>
                        <Controller
                            control={control}
                            name={"oldPassword"}
                            render={({ field, fieldState }) => (
                                <Form.Item
                                    layout="vertical"
                                    label={"Текущий пароль"}
                                    validateStatus={getFormStatus(
                                        fieldState?.error?.message,
                                    )}
                                    help={fieldState?.error?.message}
                                >
                                    <Input.Password
                                        {...field}
                                        size={"large"}
                                        autoComplete={"off"}
                                        type="password"
                                        placeholder="Введите текущий пароль"
                                    />
                                </Form.Item>
                            )}
                        />
                    </Col>
                    <Col span={24}>
                        <Controller
                            control={control}
                            name={"password"}
                            render={({ field, fieldState }) => (
                                <Form.Item
                                    layout="vertical"
                                    label={"Новый пароль"}
                                    validateStatus={getFormStatus(
                                        fieldState?.error?.message,
                                    )}
                                    help={fieldState?.error?.message}
                                >
                                    <Input.Password
                                        {...field}
                                        size={"large"}
                                        autoComplete={"off"}
                                        type="password"
                                        placeholder="Введите новый пароль"
                                    />
                                </Form.Item>
                            )}
                        />
                    </Col>
                    <Col span={24}>
                        <Controller
                            control={control}
                            name={"repeatPassword"}
                            render={({ field, fieldState }) => (
                                <Form.Item
                                    layout="vertical"
                                    label={"Повторите новый пароль"}
                                    validateStatus={getFormStatus(
                                        fieldState?.error?.message,
                                    )}
                                    help={fieldState?.error?.message}
                                >
                                    <Input.Password
                                        {...field}
                                        size={"large"}
                                        autoComplete={"off"}
                                        type="password"
                                        placeholder="Введите пароль повторно"
                                    />
                                </Form.Item>
                            )}
                        />
                    </Col>
                </Row>
            </form>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col sm={12} xs={24}>
                    <Button
                        size={"large"}
                        type="primary"
                        block
                        htmlType={"submit"}
                        form={"profile"}
                    >
                        Сохранить изменения
                    </Button>
                </Col>
                <Col sm={12} xs={24}>
                    <Button size={"large"} onClick={() => reset()} block>
                        Отменить изменения
                    </Button>
                </Col>
            </Row>
        </FormProvider>
    );
};