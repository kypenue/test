import { App, Button, Col, Form, Input, Row, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
    useForgotPasswordMutation,
    useResetPasswordMutation,
} from "@/services/Auth/user";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { passwordSchema } from "@/shared/validation/passwordSchema";
import { getFormStatus } from "@/shared/lib/getFormStatus";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";

export const ResetPassword = () => {
    const { message } = App.useApp();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [email, setEmail] = useState("");

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(passwordSchema),
        reValidateMode: "onChange",
        mode: "onBlur",
    });

    const [
        forgotPassword,
        {
            isSuccess: isSuccessfullySentEmailPassword,
            isLoading: isForgotPasswordLoading,
        },
    ] = useForgotPasswordMutation();
    const [
        resetPassword,
        {
            isSuccess: isSuccessfullyResetPassword,
            isLoading: isResetPasswordLoading,
        },
    ] = useResetPasswordMutation();

    const handleForgotPassword = () => {
        forgotPassword({ email });
    };

    const handleResetPassword = ({ password }: { password: string }) => {
        if (token) {
            resetPassword({ password, token }).then((res) => {
                if ("error" in res && res.error) {
                    getErrorMessage(res.error, message);
                }
            });
        }
    };

    if (isSuccessfullyResetPassword) {
        return (
            <Row align={"middle"} justify={"center"} gutter={[16, 16]}>
                <Col span={24}>
                    <Typography.Text>
                        Новый пароль успешно установлен! Теперь вы можете
                        пользоваться платформой
                    </Typography.Text>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        size={"large"}
                        href={"/auth"}
                        style={{ marginTop: 36 }}
                    >
                        На страницу входа
                    </Button>
                </Col>
            </Row>
        );
    }

    if (isSuccessfullySentEmailPassword) {
        return (
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Typography.Text>
                        Ссылка отправлена на указаный email: {email} <br />
                        Проверьте почтовый ящик и перейдите по ссылке в письме
                    </Typography.Text>{" "}
                </Col>
                <Col span={24}>
                    <Button
                        type="primary"
                        href={"/auth"}
                        block
                        style={{ marginTop: 36 }}
                    >
                        На страницу входа
                    </Button>
                </Col>
            </Row>
        );
    }

    if (token) {
        return (
            <form onSubmit={handleSubmit(handleResetPassword, console.error)}>
                <Row>
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
                    <Col span={24}>
                        <Button
                            htmlType={"submit"}
                            loading={isResetPasswordLoading}
                            type={"primary"}
                            block
                        >
                            Сохранить пароль
                        </Button>
                    </Col>
                </Row>
            </form>
        );
    }

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Typography.Text>
                        Введите ваш email, указанный при регистрации. На него
                        будет отправлена ссылка для смены пароля.{" "}
                    </Typography.Text>
                </Col>
                <Col span={24}>
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete={"email"}
                    />
                </Col>
                <Col span={24}>
                    <Button
                        block
                        type={"primary"}
                        loading={isForgotPasswordLoading}
                        onClick={handleForgotPassword}
                    >
                        Сбросить пароль
                    </Button>
                </Col>
            </Row>
        </div>
    );
};