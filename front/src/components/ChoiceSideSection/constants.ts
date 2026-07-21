export const CHOICE_CARDS = [
    {
        key: "player",
        iconSrc: "/icons/joystick.svg",
        title: "Игрок",
        description:
            "Участие в турнирах от любимых блогеров, рейтинг в системе, призы за топ места, куча плюшек, многое другое",
        ctaLabel: "Выбрать турнир",
        href: "/tournaments",
    },
    {
        key: "organizer",
        iconSrc: "/icons/magic.svg",
        title: "Организатор турниров",
        description:
            "Удобно использовать со стримом, поддержка с OBS, активность, куча плюшек, создавай закрытые турниры для друзей",
        ctaLabel: "Создать турнир",
        href: "/organizers",
    },
] as const;

