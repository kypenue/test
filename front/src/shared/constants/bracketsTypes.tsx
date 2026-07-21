import DE from "../../../public/icons/de-icon.svg";
import SE from "../../../public/icons/se-icon.svg";
import Swiss from "../../../public/icons/swiss-icon.svg";
import Group from "../../../public/icons/group-icon.svg";

import { CSSProperties } from "react";
import { FilterOutlined } from "@ant-design/icons";

export const STAGE_DEFAULT_SCHEMA = {
    de_stage: null,
    se_stage: null,
    league_stage: null,
    stage_type: "" as BRACKETS_TYPE,
    swiss_stage: null,
    wildcard_stage: null,
};

export const BRACKETS_TYPES = {
    SWISS: "SWISS",
    DOUBLE_ELIMINATION: "DOUBLE_ELIMINATION",
    SINGLE_ELIMINATION: "SINGLE_ELIMINATION",
    GROUPS: "GROUPS",
    WILDCARD: "WILDCARD",
} as const;

export type BRACKETS_TYPE = keyof typeof BRACKETS_TYPES;

export const BRACKETS_TYPES_TEXT: Record<BRACKETS_TYPE, string> = {
    SWISS: "Швейцарка",
    DOUBLE_ELIMINATION: "Double Elimination",
    SINGLE_ELIMINATION: "Single Elimination",
    GROUPS: "Групповой турнир",
    WILDCARD: "Wildcard",
} as const;

export const SWISS_TYPES = {
    SWISS_CLASSIC: "SWISS_CLASSIC",
    SWISS_50_50: "SWISS_50_50",
    SWISS_MANUAL: "SWISS_MANUAL",
} as const;

export const SWISS_STAGE_DEFAULT_SCHEMA = {
    add_intermediate: false,
    intermediate_type: "WILDCARD",
    stage_type: SWISS_TYPES.SWISS_MANUAL,
};

export const WILDCARD_STAGE_DEFAULT_SCHEMA = {
    game_number: 1,
};

export const DE_STAGE_DEFAULT_SCHEMA = {
    game_number: 3,
    final_game_number: 5,
    winner_bracket_advantage: true,
};

export const SE_STAGE_DEFAULT_SCHEMA = {
    game_number: 3,
    final_game_number: 5,
    winner_bracket_advantage: true,
};

export const BRACKETS_OPTIONS = [
    {
        id: BRACKETS_TYPES.SWISS,
        name: "Swiss",
        description:
            "Игроки в каждом раунде играют с соперниками с похожими результатами",
        icon: (style?: CSSProperties) => <Swiss {...style} />,
        disabled: false,
    },
    {
        id: BRACKETS_TYPES.DOUBLE_ELIMINATION,
        name: "Double Elimination",
        description: "Игра до двух поражений",
        icon: (style?: CSSProperties) => <DE {...style} />,
        disabled: false,
    },
    {
        id: BRACKETS_TYPES.SINGLE_ELIMINATION,
        name: "Single Elimination",
        description: "Половина игроков выбывает после каждого раунда",
        icon: (style?: CSSProperties) => <SE {...style} />,
        disabled: false,
    },
    {
        id: BRACKETS_TYPES.GROUPS,
        name: "Группы",
        description: "Формат «по кругу»",
        icon: (style?: CSSProperties) => <Group {...style} />,
        disabled: true,
    },
    {
        id: BRACKETS_TYPES.WILDCARD,
        name: "Wildcard",
        description:
            "Промежуточный этап перед DE и SE для отбора нужного количества игроков",
        icon: (style?: CSSProperties) => (
            <FilterOutlined
                style={{ ...style, fontSize: `calc(${style?.width} * 0.75` }}
            />
        ),
        disabled: false,
    },
];

export const STAGES_TYPES = {
    STAGE_NOT_STARTED: "STAGE_NOT_STARTED",
    STAGE_STARTED: "STAGE_STARTED",
    STAGE_ENDED: "STAGE_ENDED",
} as const;

export type STAGES_TYPE = keyof typeof STAGES_TYPES;

export const STAGES_TYPES_TEXT: Record<STAGES_TYPE, string> = {
    STAGE_NOT_STARTED: "Этап не начат 🕒",
    STAGE_STARTED: "Этап начат ⚡",
    STAGE_ENDED: "Этап завершен 🏁",
} as const;
