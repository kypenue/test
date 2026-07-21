import Link from "next/link";

export const Notification = () => {
    return (
        <div>
            Это чтобы сайт работал лучше. Оставаясь с нами, вы соглашаетесь на использование&nbsp;
            <Link target="_blank" href="/cookies-policy">файлов куки</Link>.
        </div>
    );
};
