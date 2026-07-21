import { App, Button, Form, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema, loginSchema } from "@/shared/validation/loginSchema";
import { useAuthUserMutation } from "@/services/Auth/user";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import Link from "next/link";

const LoginForm = () => {
    const [_token, setToken] = useLocalStorage("token", "", {
        serializer: (v) => v,
        deserializer: (v) => v,
    });
    const router = useRouter();
    const { message } = App.useApp();
    const { control, handleSubmit } = useForm<LoginSchema>({
        resolver: yupResolver(loginSchema),
    });

    const [authUser, { isLoading }] = useAuthUserMutation();
    const onSubmit = (data: LoginSchema) => {
        const body = { username: data.email, password: data.password };
        const loginData = new URLSearchParams(body).toString();
        authUser(loginData).then((res) => {
            if ("data" in res && res.data) {
                setToken(res.data.access_token);
                router.replace("/account/current");
            }
            if ("error" in res && res.error) {
                getErrorMessage(res.error, message);
            }
        });
    };
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit, console.log)}>
                <Controller
                    control={control}
                    name={"email"}
                    render={({ field, fieldState }) => (
                        <Form.Item
                            layout="vertical"
                            label={"Ваш Email"}
                            {...field}
                            rules={[{ message: fieldState.error?.message }]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Email"
                                {...field}
                                autoComplete={"email"}
                                type={"email"}
                            />
                        </Form.Item>
                    )}
                />

                <Controller
                    control={control}
                    name={"password"}
                    render={({ field, fieldState }) => (
                        <Form.Item
                            layout="vertical"
                            extra={
                                <Link
                                    className="login-form-forgot"
                                    href="/auth/reset-password"
                                >
                                    Забыли пароль?
                                </Link>
                            }
                            {...field}
                            label={"Пароль"}
                            rules={[{ message: fieldState.error?.message }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Пароль"
                                type="password"
                                {...field}
                                autoComplete={"off"}
                            />
                        </Form.Item>
                    )}
                />
                <Form.Item layout="vertical">
                    <Button
                        loading={isLoading}
                        type="primary"
                        htmlType="submit"
                        block
                    >
                        Войти
                    </Button>
                </Form.Item>
            </form>
        </>
    );
};

export { LoginForm };
