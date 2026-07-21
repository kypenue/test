"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "antd";
import { useState, useEffect } from "react";
import { BiLogoTelegram } from "react-icons/bi";
import "@/components/OrganizersLanding/styles/footer.scss";
import "@/components/OrganizersLanding/styles/common.scss";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    return (
        <footer
            style={{
                backgroundColor: "var(--background)",
                paddingTop: "3rem",
                paddingBottom: "2rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
        >
            <div
                style={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    padding: "0 1rem",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isMobile
                            ? "1fr"
                            : "repeat(3, 1fr)",
                        gap: "2rem",
                        marginBottom: "3rem",
                    }}
                >
                    <div>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <Image
                                src="/logo.svg"
                                alt="CUPLY Logo"
                                width={120}
                                height={40}
                            />
                        </div>
                        <p
                            style={{
                                color: "var(--text-secondary)",
                                marginBottom: "1rem",
                            }}
                        >
                            Современная платформа для проведения любительских
                            киберспортивных турниров
                        </p>
                    </div>
                    <div></div>

                    <div>
                        <h4
                            style={{
                                fontSize: "1.25rem",
                                fontWeight: "bold",
                                marginBottom: "1.5rem",
                            }}
                        >
                            Социальные сети
                        </h4>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.75rem",
                            }}
                        >
                            <Button
                                type="default"
                                size="large"
                                style={{
                                    backgroundColor: "rgba(85, 32, 193, 0.1)",
                                    borderColor: "rgba(85, 32, 193, 0.2)",
                                    color: "#ffffff",
                                    padding: "0.75rem 1.5rem",
                                    height: "auto",
                                    fontWeight: 500,
                                    borderRadius: "0.375rem",
                                    transition: "all 0.3s",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                }}
                                href="https://t.me/cuplypro"
                                icon={<BiLogoTelegram />}
                            >
                                Наш канал в Telegram
                            </Button>
                        </div>
                        <p
                            style={{
                                color: "var(--text-secondary)",
                                marginTop: "1rem",
                                fontSize: "0.875rem",
                            }}
                        >
                            Будьте в курсе новых возможностей CUPLY
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        paddingTop: "1.5rem",
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        justifyContent: "space-between",
                        alignItems: isMobile ? "center" : "flex-start",
                        gap: isMobile ? "1rem" : "0",
                        textAlign: isMobile ? "center" : "left",
                        color: "var(--text-secondary)",
                        fontSize: "0.875rem",
                    }}
                >
                    <div>© {currentYear} CUPLY. Все права защищены.</div>
                    <div style={{ display: "flex", gap: "1.5rem" }}>
                        <Link
                            href="/cookies-policy"
                            style={{
                                color: "var(--text-secondary)",
                                transition: "color 0.3s",
                                textDecoration: "none",
                            }}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.color = "var(--accent)")
                            }
                            onMouseOut={(e) =>
                                (e.currentTarget.style.color =
                                    "var(--text-secondary)")
                            }
                        >
                            Политика обработки файлов Cookie
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 