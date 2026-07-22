import { Button, Skeleton, Typography } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import {
    useVerifyEmailMutation,
    useVerifyTokenMutation,
} from "@/services/Auth/user";

import Logo from "../../../public/logo_small.svg";

import s from "./style.module.scss";
import { useGetCurrentUserQuery } from "@/services/User/user";
import { useLocalStorage } from "usehooks-ts";

export const VerifyEmail = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [userToken] = useLocalStorage("token", "", {
        deserializer: (v) => v,
    });

    const { currentData, isLoading: isUserLoading } = useGetCurrentUserQuery(
        null,
        {
            skip: !userToken || !!token,
        },
    );

    const [verifyToken, verifyResponse] = useVerifyTokenMutation();

    const [verifyEmail, verifyEmailResponse] = useVerifyEmailMutation();

    const isLoading =
        verifyEmailResponse.isLoading ||
        verifyResponse.isLoading ||
        isUserLoading;

    useEffect(() => {
        if (token) {
            verifyToken({ token });
        }
    }, [token]);

    const handleVerifyEmailRequest = (email: string) => {
        verifyEmail({ email });
    };

    const isSuccessfullyVerifiedEmail = token && verifyResponse.isSuccess;

    const isErrorWhiteVerifyingEmail = token && verifyResponse.isError;

    const isLoggedInButNotVerifiedEmail =
        currentData &&
        !currentData.is_verified &&
        verifyEmailResponse.isUninitialized;

    if (isLoading) {
        return <Skeleton active />;
    }

    if (isSuccessfullyVerifiedEmail) {
        return (
            <div className={s.container}>
                <Typography.Title level={2}>
                    Успешное подтверждение аккаунта{" "}
                    <Logo alt={"Лого"} height={28} />
                </Typography.Title>
                <Typography.Paragraph>
                    Поздравляю! Ваша учетная запись успешно подтверждена. Теперь
                    у вас есть доступ ко всем функциям и возможностям,
                    предоставляемым этим аккаунтом.
                </Typography.Paragraph>
                {userToken && currentData?.id ? (
                    <Button
                        type="primary"
                        size={"large"}
                        href={"/account/current"}
                        style={{ marginTop: 36 }}
                    >
                        Мой аккаунт
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        size={"large"}
                        href={"/auth"}
                        style={{ marginTop: 36 }}
                    >
                        Войти
                    </Button>
                )}
            </div>
        );
    }

    if (isErrorWhiteVerifyingEmail) {
        return (
            <div className={s.container}>
                <Typography.Title level={5}>
                    При подтверждении аккаунта произошла ошибка
                </Typography.Title>
                <Typography.Paragraph>
                    Попробуйте войти в аккаунт и запросить подтверждение почты
                    снова
                </Typography.Paragraph>
                <Button
                    type="primary"
                    size={"large"}
                    href={"/auth"}
                    style={{ marginTop: 36 }}
                >
                    На страницу входа
                </Button>
            </div>
        );
    }

    if (isLoggedInButNotVerifiedEmail) {
        return (
            <div className={s.container}>
                <Typography.Title level={5}>
                    Подтверждение почты
                </Typography.Title>
                <Typography.Paragraph>
                    Чтобы полностью пользоваться всеми функциями портала, вам
                    необходимо подтвердить свою почту. Обратите внимание, что
                    письмо подтверждения может попасть в спам. <br />
                    <br />
                    Письмо придет на адрес <strong>{currentData.email}</strong>
                </Typography.Paragraph>
                <Button
                    type="primary"
                    size={"large"}
                    onClick={() => handleVerifyEmailRequest(currentData.email)}
                    style={{ marginTop: 36 }}
                >
                    Подтвердить адрес
                </Button>
            </div>
        );
    }

    return (
        <div className={s.container}>
            <Typography.Title level={5}>
                Для подтверждения аккаунта вам было выслано письмо на почтовый
                ящик
            </Typography.Title>
            <Typography.Paragraph>
                Если вы не получили письмо, рекомендуется проверить правильность
                введенного адреса электронной почты на странице регистрации, а
                также убедиться, что письмо не было заблокировано вашим почтовым
                провайдером или не попало в спам
            </Typography.Paragraph>
            <Button
                type="primary"
                size={"large"}
                href={"/auth"}
                style={{ marginTop: 36 }}
            >
                На страницу регистрации
            </Button>
        </div>
    );
};