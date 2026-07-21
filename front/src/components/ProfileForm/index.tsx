"use client";
import {
    App,
    Button,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    Row,
} from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import {
    RegistrationSchema,
    registrationSchema,
} from "@/shared/validation/registrationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { dateFormat } from "@/shared/constants/dateFormat";
import { getFormStatus } from "@/shared/lib/getFormStatus";
import {
    useRegisterUserMutation,
    useVerifyEmailMutation,
} from "@/services/Auth/user";
import dayjs from "dayjs";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";

const ProfileForm = () => {
    const router = useRouter();
    const { message } = App.useApp();

    const formMethods = useForm<RegistrationSchema>({
        resolver: yupResolver(registrationSchema),
        reValidateMode: "onChange",
        mode: "onBlur",
    });

    const [regUser, { isLoading }] = useRegisterUserMutation();
    const [verifyEmail] = useVerifyEmailMutation();

    const { control, handleSubmit } = formMethods;

    const onSubmit = (data: RegistrationSchema) => {
        const { agreement, repeatPassword, ...body } = data;
        body.birth_date = dayjs(body.birth_date).format("YYYY-MM-DD");
        regUser(body).then((res) => {
            if ("data" in res) {
                verifyEmail({ email: data.email }).then((res) => {
                    if ("data" in res) {
                        router.replace("/auth/verify");
                    }
                });
            }
            if ("error" in res && res.error) {
                getErrorMessage(res.error, message);
            }
        });
    };
    return (
        <FormProvider {...formMethods}>
            <form
                onSubmit={handleSubmit(onSubmit, console.log)}
                id={"registration"}
            >
                <Row gutter={8}>
                    <Col span={12}>
                        <Controller
                            control={control}
                            name={"username"}
                            render={({ field, fieldState }) => (
                                <Form.Item
                                    layout="vertical"
                                    label={"Никнейм"}
                                    validateStatus={getFormStatus(
                                        fieldState?.error?.message,
                                    )}
                                    help={fieldState?.error?.message}
                                >
                                    <Input
                                        {...field}
                                        prefix={<UserOutlined />}
                                        autoComplete={"off"}
                                        placeholder="cuply_player"
                                        name={""}
                                        onChange={(e) => {
                                            const value = e.target.value.trim();
                                            field.onChange(value);
                                        }}
                                    />
                                </Form.Item>
                            )}
                        />
                    </Col>
                    <Col span={12}>
                        <Controller
                            control={control}
                            name={"email"}
                            render={({ field, fieldState }) => (
                                <Form.Item
                                    layout="vertical"
                                    label={"Email"}
                                    validateStatus={getFormStatus(
                                        fieldState?.error?.message,
                                    )}
                                    help={fieldState?.error?.message}
                                >
                                    <Input
                                        {...field}
                                        prefix={<MailOutlined />}
                                        autoComplete={"email"}
                                        type={"email"}
                                        placeholder="ivan@yandex.ru"
                                        onChange={(e) => {
                                            const value = e.target.value.trim();
                                            field.onChange(value);
                                        }}
                                    />
                                </Form.Item>
                            )}
                        />
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col md={8} xs={12}>
                        <Controller
                            control={control}
                            name={"name"}
                            render={({ field, fieldState }) => (
                                <Form.Item
                                    layout="vertical"
                                    label={"Имя"}
                                    validateStatus={getFormStatus(
                                        fieldState?.error?.message,
                                    )}
                                    help={fieldState?.error?.message}
                                >
                                    <Input
                                        autoComplete={"off"}
                                        {...field}
                                        placeholder="Имя"
                                    />
                                </Form.Item>
                            )}
                        />
                    </Col>
                    <Col md={8} xs={12}>
                        <Controller
                            control={control}
                            name={"surname"}
                            render={({ field, fieldState }) => (
                                <Form.Item
                                    layout="vertical"
                                    label={"Фамилия"}
                                    validateStatus={getFormStatus(
                                        fieldState?.error?.message,
                                    )}
                                    help={fieldState?.error?.message}
                                >
                                    <Input
                                        autoComplete={"off"}
                                        {...field}
                                        placeholder="Фамилия"
                                    />
                                </Form.Item>
                            )}
                        />
                    </Col>
                    <Col md={8} xs={12}>
                        <Controller
                            control={control}
                            name={"birth_date"}
                            render={({ field, fieldState }) => (
                                <Form.Item
                                    layout="vertical"
                                    label={"Дата рождения"}
                                    style={{ width: "100%" }}
                                    validateStatus={getFormStatus(
                                        fieldState?.error?.message,
                                    )}
                                    help={fieldState?.error?.message}
                                >
                                    <DatePicker
                                        format={dateFormat}
                                        style={{ width: "100%" }}
                                        placeholder={"Выберите дату"}
                                        lang={"ru_Ru"}
                                        {...field}
                                    />
                                </Form.Item>
                            )}
                        />
                    </Col>
                </Row>
                <Divider>Безопасность</Divider>
                <Controller
                    control={control}
                    name={"password"}
                    render={({ field, fieldState }) => (
                        <Form.Item
                            layout="vertical"
                            label={"Пароль"}
                            validateStatus={getFormStatus(
                                fieldState?.error?.message,
                            )}
                            help={fieldState?.error?.message}
                        >
                            <Input.Password
                                prefix={
                                    <LockOutlined className="site-form-item-icon" />
                                }
                                {...field}
                                type="password"
                                placeholder="Введите пароль"
                                autoComplete={"off"}
                            />
                        </Form.Item>
                    )}
                />
                <Controller
                    control={control}
                    name={"repeatPassword"}
                    render={({ field, fieldState }) => (
                        <Form.Item
                            layout="vertical"
                            label={"Повторите пароль"}
                            validateStatus={getFormStatus(
                                fieldState?.error?.message,
                            )}
                            help={fieldState?.error?.message}
                        >
                            <Input.Password
                                {...field}
                                prefix={
                                    <LockOutlined className="site-form-item-icon" />
                                }
                                autoComplete={"off"}
                                type="password"
                                placeholder="Введите пароль повторно"
                            />
                        </Form.Item>
                    )}
                />
                <Controller
                    control={control}
                    name={"agreement"}
                    render={({ field, fieldState }) => (
                        <Form.Item
                            layout="vertical"
                            validateStatus={getFormStatus(
                                fieldState?.error?.message,
                            )}
                            help={fieldState?.error?.message}
                        >
                            <Checkbox
                                {...field}
                                onChange={field.onChange}
                                checked={field.value}
                            >
                                Согласие с правилами обработки&nbsp;<Link target={"_blank"} href={"/personal-policy"}>ПД</Link>
                            </Checkbox>
                        </Form.Item>
                    )}
                />
                <Button
                    block
                    type="primary"
                    form="registration"
                    htmlType="submit"
                    loading={isLoading}
                >
                    Зарегистрироваться
                </Button>
            </form>
        </FormProvider>
    );
};

export { ProfileForm };
