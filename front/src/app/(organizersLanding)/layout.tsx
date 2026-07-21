import type { Metadata } from "next";
import "./globals.scss";
import { ConfigProvider } from "antd";
import { YandexMetricaProvider } from "next-yandex-metrica";
import { MetrikaCounter } from "react-metrika";
import Script from "next/script";

export const metadata: Metadata = {
    title: "CUPLY - Современная платформа для киберспортивных турниров",
    description:
        "Создавайте и управляйте любительскими киберспортивными турнирами легко и просто с CUPLY. Интеграция с Telegram, настраиваемые турнирные сетки и многое другое.",
    icons: {
        icon: [
            {
                media: "(prefers-color-scheme: light)",
                url: "/favicon-light.svg",
            },
            {
                media: "(prefers-color-scheme: dark)",
                url: "/favicon-dark.svg",
            },
        ],
    },
};

const theme = {
    token: {
        colorPrimary: "#5520c1",
        colorLink: "#5520c1",
    },
    components: {
        Button: {
            colorPrimary: "#5520c1",
            algorithm: true,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const isDev = process.env.NEXT_PUBLIC_APP_URL === "https://stage.cuply.pro";

    return (
        <html lang="ru">
            <head>
                {!isDev && (
                    <>
                        <Script
                            id="yandex-metrika"
                            strategy="afterInteractive"
                            dangerouslySetInnerHTML={{
                                __html: `
                                        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                               m[i].l=1*new Date();
                               for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                               k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                               (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                            
                               ym(97871523, "init", {
                                    clickmap:true,
                                    trackLinks:true,
                                    accurateTrackBounce:true,
                                    webvisor:true
                               });
                            `,
                            }}
                        />
                        <Script
                            id="yandex-metrika-noscript"
                            strategy="afterInteractive"
                            dangerouslySetInnerHTML={{
                                __html: `
                                (function(){
                                  var noscript = document.createElement('noscript');
                                  noscript.innerHTML = '<div><img src="https://mc.yandex.ru/watch/97871523" style="position:absolute; left:-9999px;" alt="" /></div>';
                                  document.body.appendChild(noscript);
                                })();
                          `,
                            }}
                        />
                    </>
                )}
            </head>
            <body className="site-body">
                <ConfigProvider theme={theme}>{children}</ConfigProvider>
            </body>
        </html>
    );
}
