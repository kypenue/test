import type { ComponentType, SVGProps } from "react";
import DE from "../../../public/icons/de-icon.svg";
import SE from "../../../public/icons/se-icon.svg";
import Swiss from "../../../public/icons/swiss-icon.svg";
import Group from "../../../public/icons/group-icon.svg";

export type FormatIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type FormatCardItem = {
    key: string;
    Icon: FormatIcon;
    title: string;
    description: string;
    soon?: boolean;
};

export const FORMAT_CARDS: FormatCardItem[] = [
    {
        key: "double-elimination",
        Icon: DE,
        title: "Double Elimination",
        description:
            "Турнирная система с выбыванием после двух поражений - система проведения турниров, в которой участник выбывает из турнира после двух поражений",
    },
    {
        key: "single-elimination",
        Icon: SE,
        title: "Single Elimination",
        description:
            "Все участники стартуют в одной турнирной сетке, и каждый матч — это матч на вылет. Победитель проходит в следующий раунд, и так до самого гранд-финала",
    },
    {
        key: "swiss",
        Icon: Swiss,
        title: "Швейцарская система",
        description:
            "Турнир проходит без выбывания, в каждом туре, начиная со второго, пары соперников отбираются так, чтобы встречались между собой участники, набравшие равное количество очков",
    },
    {
        key: "groups",
        Icon: Group,
        title: "Групповая система",
        description:
            "Каждая команда играет с остальными. Задача группового этапа - отсеять слабых участников, которые либо покинут турнир, либо попадут в более сложные условия финального этапа",
        soon: true,
    },
];

export const FORMATS_TRY_HREF = "/organizers#stages";
