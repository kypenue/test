"use client";

import type { ReactNode } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import s from "./style.module.scss";

type HomeSectionProps = {
    title: string;
    children?: ReactNode;
    className?: string;
    actionHref?: string;
    actionLabel?: string;
};

export const HomeSection = ({
    title,
    children,
    className,
    actionHref,
    actionLabel,
}: HomeSectionProps) => {
    return (
        <section className={clsx(s.section, className)}>
            <div className={s.inner}>
                <div className={s.headRow}>
                    <h2 className={s.heading}>{title}</h2>
                    {actionHref && actionLabel && (
                        <Link href={actionHref} className={s.actionLink}>
                            {actionLabel}
                        </Link>
                    )}
                </div>
                {children}
            </div>
        </section>
    );
};

