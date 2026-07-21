// @ts-nocheck
import { MatchType } from "@g-loot/react-tournament-brackets/dist/esm";
import dayjs from "dayjs";
import { MatchesModel } from "@/shared/types/models/Tournament";

interface Matches {
    upper: MatchType[];
    lower: MatchType[];
}

export const Tournament = {
    id: 1,
    name: "ЛЕТНИЙ КУБОК ВЕТЕРАНОВ",
    creator_id: 1,
    game_id: 1,
    min_age: 33,
    description: `<details><summary>Спойлер</summary>Тык</details>`,
    registration_start: dayjs(),
    registration_end: dayjs(),
    tournament_start: dayjs(),
    tournament_end: dayjs(),
    tournament_format: "Double Elimination",
    participants_number: 256,
};

export const matches: MatchesModel = {
    upper: [
        {
            id: 478,
            name: "WB R-9 M-478",
            nextMatchId: null,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 82,
            name: "WB R-1 M-82",
            nextMatchId: 143,
            nextLooserMatchId: 382,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 111,
            name: "WB R-1 M-111",
            nextMatchId: 114,
            nextLooserMatchId: 353,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 112,
            name: "WB R-1 M-112",
            nextMatchId: 113,
            nextLooserMatchId: 352,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 17,
            name: "WB R-1 M-17",
            nextMatchId: 145,
            nextLooserMatchId: 255,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 49,
                    name: "slavik98688",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 193,
                    name: "Alexferginson",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 5,
            name: "WB R-1 M-5",
            nextMatchId: 133,
            nextLooserMatchId: 267,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 106,
                    name: "Fhinart",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 31,
                    name: "Nimarama85 ",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 64,
            name: "WB R-1 M-64",
            nextMatchId: 161,
            nextLooserMatchId: 367,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 40,
                    name: "Betllle",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 81,
                    name: "Mansamussa77",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: -1,
            name: "WB R-1 M+-1",
            nextMatchId: 122,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: [
                {
                    id: 156,
                    name: "crypto_rich10",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 122,
            name: "WB R-2 M-122",
            nextMatchId: 186,
            nextLooserMatchId: 249,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 156,
                    name: "crypto_rich10",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 94,
            name: "WB R-1 M-94",
            nextMatchId: 131,
            nextLooserMatchId: 370,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 259,
                    name: "Gattaca_SPB",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 269,
                    name: "RUSH_SLADER",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 12,
            name: "WB R-1 M-12",
            nextMatchId: 140,
            nextLooserMatchId: 260,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 270,
                    name: "AleksejB2911",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 161,
                    name: "slamdunk191188",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 3,
            name: "WB R-1 M-3",
            nextMatchId: 131,
            nextLooserMatchId: 269,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 6,
            name: "WB R-1 M-6",
            nextMatchId: 134,
            nextLooserMatchId: 266,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 8,
            name: "WB R-1 M-8",
            nextMatchId: 136,
            nextLooserMatchId: 264,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 9,
            name: "WB R-1 M-9",
            nextMatchId: 137,
            nextLooserMatchId: 263,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 10,
            name: "WB R-1 M-10",
            nextMatchId: 138,
            nextLooserMatchId: 262,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 11,
            name: "WB R-1 M-11",
            nextMatchId: 139,
            nextLooserMatchId: 261,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 14,
            name: "WB R-1 M-14",
            nextMatchId: 142,
            nextLooserMatchId: 258,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 4,
            name: "WB R-1 M-4",
            nextMatchId: 132,
            nextLooserMatchId: 268,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 257,
                    name: "ta11er",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 195,
                    name: "YanniTheTsar",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 7,
            name: "WB R-1 M-7",
            nextMatchId: 135,
            nextLooserMatchId: 265,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 72,
                    name: "Andronovv_01",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 121,
                    name: "Leshiy_40KLG",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 1,
            name: "WB R-1 M-1",
            nextMatchId: 129,
            nextLooserMatchId: 271,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 163,
                    name: "alexartsm",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 164,
                    name: "Chg_koss",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 13,
            name: "WB R-1 M-13",
            nextMatchId: 141,
            nextLooserMatchId: 259,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 89,
                    name: "fifa38turkfifa38",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 153,
                    name: "M303oa59",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 15,
            name: "WB R-1 M-15",
            nextMatchId: 143,
            nextLooserMatchId: 257,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 117,
                    name: "zuev222",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 19,
                    name: "olexplay",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 2,
            name: "WB R-1 M-2",
            nextMatchId: 130,
            nextLooserMatchId: 270,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 127,
                    name: "zeklik",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 66,
                    name: "SLON_37RS",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 16,
            name: "WB R-1 M-16",
            nextMatchId: 144,
            nextLooserMatchId: 256,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 18,
            name: "WB R-1 M-18",
            nextMatchId: 146,
            nextLooserMatchId: 254,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 19,
            name: "WB R-1 M-19",
            nextMatchId: 147,
            nextLooserMatchId: 253,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 21,
            name: "WB R-1 M-21",
            nextMatchId: 149,
            nextLooserMatchId: 251,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 22,
            name: "WB R-1 M-22",
            nextMatchId: 150,
            nextLooserMatchId: 250,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 23,
            name: "WB R-1 M-23",
            nextMatchId: 151,
            nextLooserMatchId: 249,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 24,
            name: "WB R-1 M-24",
            nextMatchId: 152,
            nextLooserMatchId: 248,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 25,
            name: "WB R-1 M-25",
            nextMatchId: 153,
            nextLooserMatchId: 247,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 26,
            name: "WB R-1 M-26",
            nextMatchId: 154,
            nextLooserMatchId: 246,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 27,
            name: "WB R-1 M-27",
            nextMatchId: 155,
            nextLooserMatchId: 245,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 29,
            name: "WB R-1 M-29",
            nextMatchId: 157,
            nextLooserMatchId: 243,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 32,
            name: "WB R-1 M-32",
            nextMatchId: 160,
            nextLooserMatchId: 240,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 35,
            name: "WB R-1 M-35",
            nextMatchId: 163,
            nextLooserMatchId: 301,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 36,
            name: "WB R-1 M-36",
            nextMatchId: 164,
            nextLooserMatchId: 300,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 37,
            name: "WB R-1 M-37",
            nextMatchId: 165,
            nextLooserMatchId: 299,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 38,
            name: "WB R-1 M-38",
            nextMatchId: 166,
            nextLooserMatchId: 298,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 39,
            name: "WB R-1 M-39",
            nextMatchId: 167,
            nextLooserMatchId: 297,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 40,
            name: "WB R-1 M-40",
            nextMatchId: 168,
            nextLooserMatchId: 296,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 41,
            name: "WB R-1 M-41",
            nextMatchId: 169,
            nextLooserMatchId: 295,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 42,
            name: "WB R-1 M-42",
            nextMatchId: 170,
            nextLooserMatchId: 294,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 43,
            name: "WB R-1 M-43",
            nextMatchId: 171,
            nextLooserMatchId: 293,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 44,
            name: "WB R-1 M-44",
            nextMatchId: 172,
            nextLooserMatchId: 292,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 46,
            name: "WB R-1 M-46",
            nextMatchId: 174,
            nextLooserMatchId: 290,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 47,
            name: "WB R-1 M-47",
            nextMatchId: 175,
            nextLooserMatchId: 289,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 48,
            name: "WB R-1 M-48",
            nextMatchId: 176,
            nextLooserMatchId: 288,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 49,
            name: "WB R-1 M-49",
            nextMatchId: 176,
            nextLooserMatchId: 352,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 51,
            name: "WB R-1 M-51",
            nextMatchId: 174,
            nextLooserMatchId: 354,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 52,
            name: "WB R-1 M-52",
            nextMatchId: 173,
            nextLooserMatchId: 355,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 53,
            name: "WB R-1 M-53",
            nextMatchId: 172,
            nextLooserMatchId: 356,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 54,
            name: "WB R-1 M-54",
            nextMatchId: 171,
            nextLooserMatchId: 357,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 57,
            name: "WB R-1 M-57",
            nextMatchId: 168,
            nextLooserMatchId: 360,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 59,
            name: "WB R-1 M-59",
            nextMatchId: 166,
            nextLooserMatchId: 362,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 62,
            name: "WB R-1 M-62",
            nextMatchId: 163,
            nextLooserMatchId: 365,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 63,
            name: "WB R-1 M-63",
            nextMatchId: 162,
            nextLooserMatchId: 366,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 65,
            name: "WB R-1 M-65",
            nextMatchId: 160,
            nextLooserMatchId: 368,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 67,
            name: "WB R-1 M-67",
            nextMatchId: 158,
            nextLooserMatchId: 370,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 69,
            name: "WB R-1 M-69",
            nextMatchId: 156,
            nextLooserMatchId: 372,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 70,
            name: "WB R-1 M-70",
            nextMatchId: 155,
            nextLooserMatchId: 373,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 61,
            name: "WB R-1 M-61",
            nextMatchId: 164,
            nextLooserMatchId: 364,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 100,
                    name: "Trubadur18",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 264,
                    name: "mrFiF_",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 30,
            name: "WB R-1 M-30",
            nextMatchId: 158,
            nextLooserMatchId: 242,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 42,
                    name: "White_P_43",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 43,
                    name: "MaximusElf ",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 56,
            name: "WB R-1 M-56",
            nextMatchId: 169,
            nextLooserMatchId: 359,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 250,
                    name: "mini_flash777",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 32,
                    name: "Ramilkagitara",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 58,
            name: "WB R-1 M-58",
            nextMatchId: 167,
            nextLooserMatchId: 361,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 172,
                    name: "Maxkyka ",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 216,
                    name: "Electroden72",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 66,
            name: "WB R-1 M-66",
            nextMatchId: 159,
            nextLooserMatchId: 369,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 260,
                    name: "sensory_ledger65",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 207,
                    name: "vasste_spb",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 34,
            name: "WB R-1 M-34",
            nextMatchId: 162,
            nextLooserMatchId: 302,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 65,
                    name: "dimateo08 ",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 86,
                    name: "BVG-GOAT",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 45,
            name: "WB R-1 M-45",
            nextMatchId: 173,
            nextLooserMatchId: 291,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 151,
                    name: "plotva tm",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 157,
                    name: "Permunited ",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 33,
            name: "WB R-1 M-33",
            nextMatchId: 161,
            nextLooserMatchId: 303,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 235,
                    name: "FCSMHA3aP",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 76,
                    name: "Sixer_major ",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 60,
            name: "WB R-1 M-60",
            nextMatchId: 165,
            nextLooserMatchId: 363,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 281,
                    name: "iIMoReMaNIi",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 173,
                    name: "kaban1051",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 20,
            name: "WB R-1 M-20",
            nextMatchId: 148,
            nextLooserMatchId: 252,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 185,
                    name: "efimrakhim ",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 201,
                    name: "Pacan1337",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 31,
            name: "WB R-1 M-31",
            nextMatchId: 159,
            nextLooserMatchId: 241,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 271,
                    name: "Fenerbahce2022",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 297,
                    name: "madeinukhta11",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 55,
            name: "WB R-1 M-55",
            nextMatchId: 170,
            nextLooserMatchId: 358,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 27,
                    name: "Keen-2408",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 124,
                    name: "Maaatros",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 50,
            name: "WB R-1 M-50",
            nextMatchId: 175,
            nextLooserMatchId: 353,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 58,
                    name: "Rkovac15",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 97,
                    name: "Karman54rus",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 68,
            name: "WB R-1 M-68",
            nextMatchId: 157,
            nextLooserMatchId: 371,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 88,
                    name: "Sanchezzz_555",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 176,
                    name: "eL_DavaTwitch",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 72,
            name: "WB R-1 M-72",
            nextMatchId: 153,
            nextLooserMatchId: 375,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 73,
            name: "WB R-1 M-73",
            nextMatchId: 152,
            nextLooserMatchId: 376,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 77,
            name: "WB R-1 M-77",
            nextMatchId: 148,
            nextLooserMatchId: 380,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 78,
            name: "WB R-1 M-78",
            nextMatchId: 147,
            nextLooserMatchId: 381,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 79,
            name: "WB R-1 M-79",
            nextMatchId: 146,
            nextLooserMatchId: 382,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 80,
            name: "WB R-1 M-80",
            nextMatchId: 145,
            nextLooserMatchId: 383,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 81,
            name: "WB R-1 M-81",
            nextMatchId: 144,
            nextLooserMatchId: 383,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 83,
            name: "WB R-1 M-83",
            nextMatchId: 142,
            nextLooserMatchId: 381,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 84,
            name: "WB R-1 M-84",
            nextMatchId: 141,
            nextLooserMatchId: 380,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 85,
            name: "WB R-1 M-85",
            nextMatchId: 140,
            nextLooserMatchId: 379,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 86,
            name: "WB R-1 M-86",
            nextMatchId: 139,
            nextLooserMatchId: 378,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 87,
            name: "WB R-1 M-87",
            nextMatchId: 138,
            nextLooserMatchId: 377,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 88,
            name: "WB R-1 M-88",
            nextMatchId: 137,
            nextLooserMatchId: 376,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 89,
            name: "WB R-1 M-89",
            nextMatchId: 136,
            nextLooserMatchId: 375,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 91,
            name: "WB R-1 M-91",
            nextMatchId: 134,
            nextLooserMatchId: 373,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 93,
            name: "WB R-1 M-93",
            nextMatchId: 132,
            nextLooserMatchId: 371,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 95,
            name: "WB R-1 M-95",
            nextMatchId: 130,
            nextLooserMatchId: 369,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 96,
            name: "WB R-1 M-96",
            nextMatchId: 129,
            nextLooserMatchId: 368,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 97,
            name: "WB R-1 M-97",
            nextMatchId: 128,
            nextLooserMatchId: 367,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 99,
            name: "WB R-1 M-99",
            nextMatchId: 126,
            nextLooserMatchId: 365,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 101,
            name: "WB R-1 M-101",
            nextMatchId: 124,
            nextLooserMatchId: 363,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 102,
            name: "WB R-1 M-102",
            nextMatchId: 123,
            nextLooserMatchId: 362,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 103,
            name: "WB R-1 M-103",
            nextMatchId: 122,
            nextLooserMatchId: 361,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 105,
            name: "WB R-1 M-105",
            nextMatchId: 120,
            nextLooserMatchId: 359,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 106,
            name: "WB R-1 M-106",
            nextMatchId: 119,
            nextLooserMatchId: 358,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 107,
            name: "WB R-1 M-107",
            nextMatchId: 118,
            nextLooserMatchId: 357,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 108,
            name: "WB R-1 M-108",
            nextMatchId: 117,
            nextLooserMatchId: 356,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 110,
            name: "WB R-1 M-110",
            nextMatchId: 115,
            nextLooserMatchId: 354,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: -2,
            name: "WB R-1 M+-2",
            nextMatchId: 113,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: []
        },
        {
            id: 113,
            name: "WB R-2 M-113",
            nextMatchId: 177,
            nextLooserMatchId: 240,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: -3,
            name: "WB R-1 M+-3",
            nextMatchId: 116,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: []
        },
        {
            id: 116,
            name: "WB R-2 M-116",
            nextMatchId: 180,
            nextLooserMatchId: 243,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: -4,
            name: "WB R-1 M+-4",
            nextMatchId: 118,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: []
        },
        {
            id: 118,
            name: "WB R-2 M-118",
            nextMatchId: 182,
            nextLooserMatchId: 245,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: -5,
            name: "WB R-1 M+-5",
            nextMatchId: 119,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: []
        },
        {
            id: 119,
            name: "WB R-2 M-119",
            nextMatchId: 183,
            nextLooserMatchId: 246,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: -6,
            name: "WB R-1 M+-6",
            nextMatchId: 121,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: []
        },
        {
            id: 121,
            name: "WB R-2 M-121",
            nextMatchId: 185,
            nextLooserMatchId: 248,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: -7,
            name: "WB R-1 M+-7",
            nextMatchId: 123,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: []
        },
        {
            id: 123,
            name: "WB R-2 M-123",
            nextMatchId: 187,
            nextLooserMatchId: 250,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: -8,
            name: "WB R-1 M+-8",
            nextMatchId: 124,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: []
        },
        {
            id: 124,
            name: "WB R-2 M-124",
            nextMatchId: 188,
            nextLooserMatchId: 251,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: -9,
            name: "WB R-1 M+-9",
            nextMatchId: 125,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: []
        },
        {
            id: 125,
            name: "WB R-2 M-125",
            nextMatchId: 189,
            nextLooserMatchId: 252,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: -10,
            name: "WB R-1 M+-10",
            nextMatchId: 115,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: [
                {
                    id: 174,
                    name: "tequilla_boom93",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 115,
            name: "WB R-2 M-115",
            nextMatchId: 179,
            nextLooserMatchId: 242,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 174,
                    name: "tequilla_boom93",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 71,
            name: "WB R-1 M-71",
            nextMatchId: 154,
            nextLooserMatchId: 374,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 105,
                    name: "Leonrid",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 34,
                    name: "kuzya_1089",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 109,
            name: "WB R-1 M-109",
            nextMatchId: 116,
            nextLooserMatchId: 355,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 221,
                    name: "YuretsKoss",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 274,
                    name: "solo_kerzhner",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: -11,
            name: "WB R-1 M+-11",
            nextMatchId: 114,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: [
                {
                    id: 111,
                    name: "ssh204p",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 114,
            name: "WB R-2 M-114",
            nextMatchId: 178,
            nextLooserMatchId: 241,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 111,
                    name: "ssh204p",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 76,
            name: "WB R-1 M-76",
            nextMatchId: 149,
            nextLooserMatchId: 379,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 230,
                    name: "forgamesonly90",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 137,
                    name: "Southerner111",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 75,
            name: "WB R-1 M-75",
            nextMatchId: 150,
            nextLooserMatchId: 378,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 229,
                    name: "JUVE SAMARA",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 299,
                    name: "SeGa130MsQ",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 90,
            name: "WB R-1 M-90",
            nextMatchId: 135,
            nextLooserMatchId: 374,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 52,
                    name: "Shon_Polewoi",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 287,
                    name: "TonyPizzaleto",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 74,
            name: "WB R-1 M-74",
            nextMatchId: 151,
            nextLooserMatchId: 377,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 248,
                    name: "Evgen89_EKB",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 211,
                    name: "aPimen",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 100,
            name: "WB R-1 M-100",
            nextMatchId: 125,
            nextLooserMatchId: 364,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 294,
                    name: "HaHaxFc",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 217,
                    name: "Kornil_37",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 104,
            name: "WB R-1 M-104",
            nextMatchId: 121,
            nextLooserMatchId: 360,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 300,
                    name: "thehappyperson16",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 265,
                    name: "xSanSanychx",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: -12,
            name: "WB R-1 M+-12",
            nextMatchId: 120,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: [
                {
                    id: 140,
                    name: "olegabarinov",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 120,
            name: "WB R-2 M-120",
            nextMatchId: 184,
            nextLooserMatchId: 247,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 140,
                    name: "olegabarinov",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 92,
            name: "WB R-1 M-92",
            nextMatchId: 133,
            nextLooserMatchId: 372,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 64,
                    name: "Plzv_alex",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 169,
                    name: "Victor_Igrich",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: -13,
            name: "WB R-1 M+-13",
            nextMatchId: 117,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: [
                {
                    id: 129,
                    name: "tallish-standby9",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 117,
            name: "WB R-2 M-117",
            nextMatchId: 181,
            nextLooserMatchId: 244,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 129,
                    name: "tallish-standby9",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: 98,
            name: "WB R-1 M-98",
            nextMatchId: 127,
            nextLooserMatchId: 366,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 78,
                    name: "Alkobanda ",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 146,
                    name: "Prizrak_uz",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        },
        {
            id: -14,
            name: "WB R-1 M+-14",
            nextMatchId: 126,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: []
        },
        {
            id: 126,
            name: "WB R-2 M-126",
            nextMatchId: 190,
            nextLooserMatchId: 253,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: -15,
            name: "WB R-1 M+-15",
            nextMatchId: 127,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: []
        },
        {
            id: 127,
            name: "WB R-2 M-127",
            nextMatchId: 191,
            nextLooserMatchId: 254,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: -16,
            name: "WB R-1 M+-16",
            nextMatchId: 128,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "WALK_OVER",
            participants: []
        },
        {
            id: 128,
            name: "WB R-2 M-128",
            nextMatchId: 192,
            nextLooserMatchId: 255,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 129,
            name: "WB R-2 M-129",
            nextMatchId: 193,
            nextLooserMatchId: 256,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 130,
            name: "WB R-2 M-130",
            nextMatchId: 194,
            nextLooserMatchId: 257,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 131,
            name: "WB R-2 M-131",
            nextMatchId: 195,
            nextLooserMatchId: 258,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 132,
            name: "WB R-2 M-132",
            nextMatchId: 196,
            nextLooserMatchId: 259,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 133,
            name: "WB R-2 M-133",
            nextMatchId: 197,
            nextLooserMatchId: 260,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 134,
            name: "WB R-2 M-134",
            nextMatchId: 198,
            nextLooserMatchId: 261,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 135,
            name: "WB R-2 M-135",
            nextMatchId: 199,
            nextLooserMatchId: 262,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 136,
            name: "WB R-2 M-136",
            nextMatchId: 200,
            nextLooserMatchId: 263,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 137,
            name: "WB R-2 M-137",
            nextMatchId: 201,
            nextLooserMatchId: 264,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 138,
            name: "WB R-2 M-138",
            nextMatchId: 202,
            nextLooserMatchId: 265,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 139,
            name: "WB R-2 M-139",
            nextMatchId: 203,
            nextLooserMatchId: 266,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 140,
            name: "WB R-2 M-140",
            nextMatchId: 204,
            nextLooserMatchId: 267,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 141,
            name: "WB R-2 M-141",
            nextMatchId: 205,
            nextLooserMatchId: 268,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 142,
            name: "WB R-2 M-142",
            nextMatchId: 206,
            nextLooserMatchId: 269,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 143,
            name: "WB R-2 M-143",
            nextMatchId: 207,
            nextLooserMatchId: 270,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 144,
            name: "WB R-2 M-144",
            nextMatchId: 208,
            nextLooserMatchId: 271,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 145,
            name: "WB R-2 M-145",
            nextMatchId: 208,
            nextLooserMatchId: 272,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 146,
            name: "WB R-2 M-146",
            nextMatchId: 207,
            nextLooserMatchId: 273,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 147,
            name: "WB R-2 M-147",
            nextMatchId: 206,
            nextLooserMatchId: 274,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 148,
            name: "WB R-2 M-148",
            nextMatchId: 205,
            nextLooserMatchId: 275,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 149,
            name: "WB R-2 M-149",
            nextMatchId: 204,
            nextLooserMatchId: 276,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 150,
            name: "WB R-2 M-150",
            nextMatchId: 203,
            nextLooserMatchId: 277,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 151,
            name: "WB R-2 M-151",
            nextMatchId: 202,
            nextLooserMatchId: 278,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 152,
            name: "WB R-2 M-152",
            nextMatchId: 201,
            nextLooserMatchId: 279,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 153,
            name: "WB R-2 M-153",
            nextMatchId: 200,
            nextLooserMatchId: 280,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 154,
            name: "WB R-2 M-154",
            nextMatchId: 199,
            nextLooserMatchId: 281,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 155,
            name: "WB R-2 M-155",
            nextMatchId: 198,
            nextLooserMatchId: 282,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 156,
            name: "WB R-2 M-156",
            nextMatchId: 197,
            nextLooserMatchId: 283,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 157,
            name: "WB R-2 M-157",
            nextMatchId: 196,
            nextLooserMatchId: 284,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 158,
            name: "WB R-2 M-158",
            nextMatchId: 195,
            nextLooserMatchId: 285,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 159,
            name: "WB R-2 M-159",
            nextMatchId: 194,
            nextLooserMatchId: 286,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 160,
            name: "WB R-2 M-160",
            nextMatchId: 193,
            nextLooserMatchId: 287,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 161,
            name: "WB R-2 M-161",
            nextMatchId: 192,
            nextLooserMatchId: 287,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 162,
            name: "WB R-2 M-162",
            nextMatchId: 191,
            nextLooserMatchId: 286,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 163,
            name: "WB R-2 M-163",
            nextMatchId: 190,
            nextLooserMatchId: 285,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 164,
            name: "WB R-2 M-164",
            nextMatchId: 189,
            nextLooserMatchId: 284,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 165,
            name: "WB R-2 M-165",
            nextMatchId: 188,
            nextLooserMatchId: 283,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 166,
            name: "WB R-2 M-166",
            nextMatchId: 187,
            nextLooserMatchId: 282,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 167,
            name: "WB R-2 M-167",
            nextMatchId: 186,
            nextLooserMatchId: 281,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 168,
            name: "WB R-2 M-168",
            nextMatchId: 185,
            nextLooserMatchId: 280,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 169,
            name: "WB R-2 M-169",
            nextMatchId: 184,
            nextLooserMatchId: 279,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 170,
            name: "WB R-2 M-170",
            nextMatchId: 183,
            nextLooserMatchId: 278,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 171,
            name: "WB R-2 M-171",
            nextMatchId: 182,
            nextLooserMatchId: 277,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 172,
            name: "WB R-2 M-172",
            nextMatchId: 181,
            nextLooserMatchId: 276,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 173,
            name: "WB R-2 M-173",
            nextMatchId: 180,
            nextLooserMatchId: 275,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 174,
            name: "WB R-2 M-174",
            nextMatchId: 179,
            nextLooserMatchId: 274,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 175,
            name: "WB R-2 M-175",
            nextMatchId: 178,
            nextLooserMatchId: 273,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 176,
            name: "WB R-2 M-176",
            nextMatchId: 177,
            nextLooserMatchId: 272,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 177,
            name: "WB R-3 M-177",
            nextMatchId: 209,
            nextLooserMatchId: 320,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 178,
            name: "WB R-3 M-178",
            nextMatchId: 210,
            nextLooserMatchId: 321,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 179,
            name: "WB R-3 M-179",
            nextMatchId: 211,
            nextLooserMatchId: 322,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 180,
            name: "WB R-3 M-180",
            nextMatchId: 212,
            nextLooserMatchId: 323,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 181,
            name: "WB R-3 M-181",
            nextMatchId: 213,
            nextLooserMatchId: 324,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 182,
            name: "WB R-3 M-182",
            nextMatchId: 214,
            nextLooserMatchId: 325,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 183,
            name: "WB R-3 M-183",
            nextMatchId: 215,
            nextLooserMatchId: 326,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 184,
            name: "WB R-3 M-184",
            nextMatchId: 216,
            nextLooserMatchId: 327,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 185,
            name: "WB R-3 M-185",
            nextMatchId: 217,
            nextLooserMatchId: 328,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 186,
            name: "WB R-3 M-186",
            nextMatchId: 218,
            nextLooserMatchId: 329,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 187,
            name: "WB R-3 M-187",
            nextMatchId: 219,
            nextLooserMatchId: 330,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 188,
            name: "WB R-3 M-188",
            nextMatchId: 220,
            nextLooserMatchId: 331,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 189,
            name: "WB R-3 M-189",
            nextMatchId: 221,
            nextLooserMatchId: 332,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 190,
            name: "WB R-3 M-190",
            nextMatchId: 222,
            nextLooserMatchId: 333,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 191,
            name: "WB R-3 M-191",
            nextMatchId: 223,
            nextLooserMatchId: 334,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 192,
            name: "WB R-3 M-192",
            nextMatchId: 224,
            nextLooserMatchId: 335,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 193,
            name: "WB R-3 M-193",
            nextMatchId: 224,
            nextLooserMatchId: 336,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 194,
            name: "WB R-3 M-194",
            nextMatchId: 223,
            nextLooserMatchId: 337,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 195,
            name: "WB R-3 M-195",
            nextMatchId: 222,
            nextLooserMatchId: 338,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 196,
            name: "WB R-3 M-196",
            nextMatchId: 221,
            nextLooserMatchId: 339,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 197,
            name: "WB R-3 M-197",
            nextMatchId: 220,
            nextLooserMatchId: 340,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 198,
            name: "WB R-3 M-198",
            nextMatchId: 219,
            nextLooserMatchId: 341,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 199,
            name: "WB R-3 M-199",
            nextMatchId: 218,
            nextLooserMatchId: 342,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 200,
            name: "WB R-3 M-200",
            nextMatchId: 217,
            nextLooserMatchId: 343,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 201,
            name: "WB R-3 M-201",
            nextMatchId: 216,
            nextLooserMatchId: 344,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 202,
            name: "WB R-3 M-202",
            nextMatchId: 215,
            nextLooserMatchId: 345,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 203,
            name: "WB R-3 M-203",
            nextMatchId: 214,
            nextLooserMatchId: 346,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 204,
            name: "WB R-3 M-204",
            nextMatchId: 213,
            nextLooserMatchId: 347,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 205,
            name: "WB R-3 M-205",
            nextMatchId: 212,
            nextLooserMatchId: 348,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 206,
            name: "WB R-3 M-206",
            nextMatchId: 211,
            nextLooserMatchId: 349,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 207,
            name: "WB R-3 M-207",
            nextMatchId: 210,
            nextLooserMatchId: 350,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 208,
            name: "WB R-3 M-208",
            nextMatchId: 209,
            nextLooserMatchId: 351,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 209,
            name: "WB R-4 M-209",
            nextMatchId: 225,
            nextLooserMatchId: 400,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 210,
            name: "WB R-4 M-210",
            nextMatchId: 226,
            nextLooserMatchId: 401,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 211,
            name: "WB R-4 M-211",
            nextMatchId: 227,
            nextLooserMatchId: 402,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 212,
            name: "WB R-4 M-212",
            nextMatchId: 228,
            nextLooserMatchId: 403,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 213,
            name: "WB R-4 M-213",
            nextMatchId: 229,
            nextLooserMatchId: 404,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 214,
            name: "WB R-4 M-214",
            nextMatchId: 230,
            nextLooserMatchId: 405,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 215,
            name: "WB R-4 M-215",
            nextMatchId: 231,
            nextLooserMatchId: 406,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 216,
            name: "WB R-4 M-216",
            nextMatchId: 232,
            nextLooserMatchId: 407,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 217,
            name: "WB R-4 M-217",
            nextMatchId: 232,
            nextLooserMatchId: 408,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 218,
            name: "WB R-4 M-218",
            nextMatchId: 231,
            nextLooserMatchId: 409,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 219,
            name: "WB R-4 M-219",
            nextMatchId: 230,
            nextLooserMatchId: 410,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 220,
            name: "WB R-4 M-220",
            nextMatchId: 229,
            nextLooserMatchId: 411,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 221,
            name: "WB R-4 M-221",
            nextMatchId: 228,
            nextLooserMatchId: 412,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 222,
            name: "WB R-4 M-222",
            nextMatchId: 227,
            nextLooserMatchId: 413,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 223,
            name: "WB R-4 M-223",
            nextMatchId: 226,
            nextLooserMatchId: 414,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 224,
            name: "WB R-4 M-224",
            nextMatchId: 225,
            nextLooserMatchId: 415,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 225,
            name: "WB R-5 M-225",
            nextMatchId: 233,
            nextLooserMatchId: 440,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 226,
            name: "WB R-5 M-226",
            nextMatchId: 234,
            nextLooserMatchId: 441,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 227,
            name: "WB R-5 M-227",
            nextMatchId: 235,
            nextLooserMatchId: 442,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 228,
            name: "WB R-5 M-228",
            nextMatchId: 236,
            nextLooserMatchId: 443,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 229,
            name: "WB R-5 M-229",
            nextMatchId: 236,
            nextLooserMatchId: 444,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 230,
            name: "WB R-5 M-230",
            nextMatchId: 235,
            nextLooserMatchId: 445,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 231,
            name: "WB R-5 M-231",
            nextMatchId: 234,
            nextLooserMatchId: 446,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 232,
            name: "WB R-5 M-232",
            nextMatchId: 233,
            nextLooserMatchId: 447,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 233,
            name: "WB R-6 M-233",
            nextMatchId: 237,
            nextLooserMatchId: 460,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 234,
            name: "WB R-6 M-234",
            nextMatchId: 238,
            nextLooserMatchId: 461,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 235,
            name: "WB R-6 M-235",
            nextMatchId: 238,
            nextLooserMatchId: 462,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 236,
            name: "WB R-6 M-236",
            nextMatchId: 237,
            nextLooserMatchId: 463,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 237,
            name: "WB R-7 M-237",
            nextMatchId: 239,
            nextLooserMatchId: 470,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 238,
            name: "WB R-7 M-238",
            nextMatchId: 239,
            nextLooserMatchId: 471,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 239,
            name: "WB R-8 M-239",
            nextMatchId: 478,
            nextLooserMatchId: 475,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 28,
            name: "WB R-1 M-28",
            nextMatchId: 156,
            nextLooserMatchId: 244,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: [
                {
                    id: 113,
                    name: "bazanchik10",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                },
                {
                    id: 284,
                    name: "Potrero-91",
                    isWinner: false,
                    status: "NO_PARTY",
                    resultText: "0:0"
                }
            ]
        }
    ],
    lower: [
        {
            id: 240,
            name: "LB R-1 M-240",
            nextMatchId: 304,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 241,
            name: "LB R-1 M-241",
            nextMatchId: 305,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 242,
            name: "LB R-1 M-242",
            nextMatchId: 306,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 243,
            name: "LB R-1 M-243",
            nextMatchId: 307,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 244,
            name: "LB R-1 M-244",
            nextMatchId: 308,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 245,
            name: "LB R-1 M-245",
            nextMatchId: 309,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 246,
            name: "LB R-1 M-246",
            nextMatchId: 310,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 247,
            name: "LB R-1 M-247",
            nextMatchId: 311,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 248,
            name: "LB R-1 M-248",
            nextMatchId: 312,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 249,
            name: "LB R-1 M-249",
            nextMatchId: 313,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 250,
            name: "LB R-1 M-250",
            nextMatchId: 314,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 251,
            name: "LB R-1 M-251",
            nextMatchId: 315,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 252,
            name: "LB R-1 M-252",
            nextMatchId: 316,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 253,
            name: "LB R-1 M-253",
            nextMatchId: 317,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 254,
            name: "LB R-1 M-254",
            nextMatchId: 318,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 255,
            name: "LB R-1 M-255",
            nextMatchId: 319,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 256,
            name: "LB R-1 M-256",
            nextMatchId: 319,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 257,
            name: "LB R-1 M-257",
            nextMatchId: 318,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 258,
            name: "LB R-1 M-258",
            nextMatchId: 317,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 259,
            name: "LB R-1 M-259",
            nextMatchId: 316,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 260,
            name: "LB R-1 M-260",
            nextMatchId: 315,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 261,
            name: "LB R-1 M-261",
            nextMatchId: 314,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 262,
            name: "LB R-1 M-262",
            nextMatchId: 313,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 263,
            name: "LB R-1 M-263",
            nextMatchId: 312,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 264,
            name: "LB R-1 M-264",
            nextMatchId: 311,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 265,
            name: "LB R-1 M-265",
            nextMatchId: 310,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 266,
            name: "LB R-1 M-266",
            nextMatchId: 309,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 267,
            name: "LB R-1 M-267",
            nextMatchId: 308,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 268,
            name: "LB R-1 M-268",
            nextMatchId: 307,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 269,
            name: "LB R-1 M-269",
            nextMatchId: 306,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 270,
            name: "LB R-1 M-270",
            nextMatchId: 305,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 271,
            name: "LB R-1 M-271",
            nextMatchId: 304,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 272,
            name: "LB R-1 M-272",
            nextMatchId: 303,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 273,
            name: "LB R-1 M-273",
            nextMatchId: 302,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 274,
            name: "LB R-1 M-274",
            nextMatchId: 301,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 275,
            name: "LB R-1 M-275",
            nextMatchId: 300,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 276,
            name: "LB R-1 M-276",
            nextMatchId: 299,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 277,
            name: "LB R-1 M-277",
            nextMatchId: 298,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 278,
            name: "LB R-1 M-278",
            nextMatchId: 297,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 279,
            name: "LB R-1 M-279",
            nextMatchId: 296,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 280,
            name: "LB R-1 M-280",
            nextMatchId: 295,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 281,
            name: "LB R-1 M-281",
            nextMatchId: 294,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 282,
            name: "LB R-1 M-282",
            nextMatchId: 293,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 283,
            name: "LB R-1 M-283",
            nextMatchId: 292,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 284,
            name: "LB R-1 M-284",
            nextMatchId: 291,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 285,
            name: "LB R-1 M-285",
            nextMatchId: 290,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 286,
            name: "LB R-1 M-286",
            nextMatchId: 289,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 287,
            name: "LB R-1 M-287",
            nextMatchId: 288,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 288,
            name: "LB R-2 M-288",
            nextMatchId: 351,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 289,
            name: "LB R-2 M-289",
            nextMatchId: 350,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 290,
            name: "LB R-2 M-290",
            nextMatchId: 349,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 291,
            name: "LB R-2 M-291",
            nextMatchId: 348,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 292,
            name: "LB R-2 M-292",
            nextMatchId: 347,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 293,
            name: "LB R-2 M-293",
            nextMatchId: 346,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 294,
            name: "LB R-2 M-294",
            nextMatchId: 345,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 295,
            name: "LB R-2 M-295",
            nextMatchId: 344,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 296,
            name: "LB R-2 M-296",
            nextMatchId: 343,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 297,
            name: "LB R-2 M-297",
            nextMatchId: 342,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 298,
            name: "LB R-2 M-298",
            nextMatchId: 341,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 299,
            name: "LB R-2 M-299",
            nextMatchId: 340,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 300,
            name: "LB R-2 M-300",
            nextMatchId: 339,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 301,
            name: "LB R-2 M-301",
            nextMatchId: 338,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 302,
            name: "LB R-2 M-302",
            nextMatchId: 337,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 303,
            name: "LB R-2 M-303",
            nextMatchId: 336,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 304,
            name: "LB R-2 M-304",
            nextMatchId: 335,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 305,
            name: "LB R-2 M-305",
            nextMatchId: 334,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 306,
            name: "LB R-2 M-306",
            nextMatchId: 333,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 307,
            name: "LB R-2 M-307",
            nextMatchId: 332,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 308,
            name: "LB R-2 M-308",
            nextMatchId: 331,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 309,
            name: "LB R-2 M-309",
            nextMatchId: 330,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 310,
            name: "LB R-2 M-310",
            nextMatchId: 329,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 311,
            name: "LB R-2 M-311",
            nextMatchId: 328,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 312,
            name: "LB R-2 M-312",
            nextMatchId: 327,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 313,
            name: "LB R-2 M-313",
            nextMatchId: 326,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 314,
            name: "LB R-2 M-314",
            nextMatchId: 325,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 315,
            name: "LB R-2 M-315",
            nextMatchId: 324,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 316,
            name: "LB R-2 M-316",
            nextMatchId: 323,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 317,
            name: "LB R-2 M-317",
            nextMatchId: 322,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 318,
            name: "LB R-2 M-318",
            nextMatchId: 321,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 319,
            name: "LB R-2 M-319",
            nextMatchId: 320,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 320,
            name: "LB R-3 M-320",
            nextMatchId: 416,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 321,
            name: "LB R-3 M-321",
            nextMatchId: 417,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 322,
            name: "LB R-3 M-322",
            nextMatchId: 418,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 323,
            name: "LB R-3 M-323",
            nextMatchId: 419,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 324,
            name: "LB R-3 M-324",
            nextMatchId: 420,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 325,
            name: "LB R-3 M-325",
            nextMatchId: 421,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 326,
            name: "LB R-3 M-326",
            nextMatchId: 422,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 327,
            name: "LB R-3 M-327",
            nextMatchId: 423,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 328,
            name: "LB R-3 M-328",
            nextMatchId: 424,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 329,
            name: "LB R-3 M-329",
            nextMatchId: 425,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 330,
            name: "LB R-3 M-330",
            nextMatchId: 426,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 331,
            name: "LB R-3 M-331",
            nextMatchId: 427,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 332,
            name: "LB R-3 M-332",
            nextMatchId: 428,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 333,
            name: "LB R-3 M-333",
            nextMatchId: 429,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 334,
            name: "LB R-3 M-334",
            nextMatchId: 430,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 335,
            name: "LB R-3 M-335",
            nextMatchId: 431,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 336,
            name: "LB R-3 M-336",
            nextMatchId: 431,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 337,
            name: "LB R-3 M-337",
            nextMatchId: 430,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 338,
            name: "LB R-3 M-338",
            nextMatchId: 429,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 339,
            name: "LB R-3 M-339",
            nextMatchId: 428,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 340,
            name: "LB R-3 M-340",
            nextMatchId: 427,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 341,
            name: "LB R-3 M-341",
            nextMatchId: 426,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 342,
            name: "LB R-3 M-342",
            nextMatchId: 425,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 343,
            name: "LB R-3 M-343",
            nextMatchId: 424,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 344,
            name: "LB R-3 M-344",
            nextMatchId: 423,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 345,
            name: "LB R-3 M-345",
            nextMatchId: 422,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 346,
            name: "LB R-3 M-346",
            nextMatchId: 421,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 347,
            name: "LB R-3 M-347",
            nextMatchId: 420,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 348,
            name: "LB R-3 M-348",
            nextMatchId: 419,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 349,
            name: "LB R-3 M-349",
            nextMatchId: 418,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 350,
            name: "LB R-3 M-350",
            nextMatchId: 417,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 351,
            name: "LB R-3 M-351",
            nextMatchId: 416,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 352,
            name: "LB R-3 M-352",
            nextMatchId: 384,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 353,
            name: "LB R-3 M-353",
            nextMatchId: 385,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 354,
            name: "LB R-3 M-354",
            nextMatchId: 386,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 355,
            name: "LB R-3 M-355",
            nextMatchId: 387,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 356,
            name: "LB R-3 M-356",
            nextMatchId: 388,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 357,
            name: "LB R-3 M-357",
            nextMatchId: 389,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 358,
            name: "LB R-3 M-358",
            nextMatchId: 390,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 359,
            name: "LB R-3 M-359",
            nextMatchId: 391,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 360,
            name: "LB R-3 M-360",
            nextMatchId: 392,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 361,
            name: "LB R-3 M-361",
            nextMatchId: 393,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 362,
            name: "LB R-3 M-362",
            nextMatchId: 394,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 363,
            name: "LB R-3 M-363",
            nextMatchId: 395,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 364,
            name: "LB R-3 M-364",
            nextMatchId: 396,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 365,
            name: "LB R-3 M-365",
            nextMatchId: 397,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 366,
            name: "LB R-3 M-366",
            nextMatchId: 398,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 367,
            name: "LB R-3 M-367",
            nextMatchId: 399,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 368,
            name: "LB R-3 M-368",
            nextMatchId: 399,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 369,
            name: "LB R-3 M-369",
            nextMatchId: 398,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 370,
            name: "LB R-3 M-370",
            nextMatchId: 397,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 371,
            name: "LB R-3 M-371",
            nextMatchId: 396,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 372,
            name: "LB R-3 M-372",
            nextMatchId: 395,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 373,
            name: "LB R-3 M-373",
            nextMatchId: 394,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 374,
            name: "LB R-3 M-374",
            nextMatchId: 393,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 375,
            name: "LB R-3 M-375",
            nextMatchId: 392,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 376,
            name: "LB R-3 M-376",
            nextMatchId: 391,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 377,
            name: "LB R-3 M-377",
            nextMatchId: 390,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 378,
            name: "LB R-3 M-378",
            nextMatchId: 389,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 379,
            name: "LB R-3 M-379",
            nextMatchId: 388,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 380,
            name: "LB R-3 M-380",
            nextMatchId: 387,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 381,
            name: "LB R-3 M-381",
            nextMatchId: 386,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 382,
            name: "LB R-3 M-382",
            nextMatchId: 385,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 383,
            name: "LB R-3 M-383",
            nextMatchId: 384,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 384,
            name: "LB R-4 M-384",
            nextMatchId: 415,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 385,
            name: "LB R-4 M-385",
            nextMatchId: 414,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 386,
            name: "LB R-4 M-386",
            nextMatchId: 413,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 387,
            name: "LB R-4 M-387",
            nextMatchId: 412,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 388,
            name: "LB R-4 M-388",
            nextMatchId: 411,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 389,
            name: "LB R-4 M-389",
            nextMatchId: 410,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 390,
            name: "LB R-4 M-390",
            nextMatchId: 409,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 391,
            name: "LB R-4 M-391",
            nextMatchId: 408,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 392,
            name: "LB R-4 M-392",
            nextMatchId: 407,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 393,
            name: "LB R-4 M-393",
            nextMatchId: 406,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 394,
            name: "LB R-4 M-394",
            nextMatchId: 405,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 395,
            name: "LB R-4 M-395",
            nextMatchId: 404,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 396,
            name: "LB R-4 M-396",
            nextMatchId: 403,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 397,
            name: "LB R-4 M-397",
            nextMatchId: 402,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 398,
            name: "LB R-4 M-398",
            nextMatchId: 401,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 399,
            name: "LB R-4 M-399",
            nextMatchId: 400,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 400,
            name: "LB R-5 M-400",
            nextMatchId: 448,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 401,
            name: "LB R-5 M-401",
            nextMatchId: 449,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 402,
            name: "LB R-5 M-402",
            nextMatchId: 450,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 403,
            name: "LB R-5 M-403",
            nextMatchId: 451,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 404,
            name: "LB R-5 M-404",
            nextMatchId: 452,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 405,
            name: "LB R-5 M-405",
            nextMatchId: 453,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 406,
            name: "LB R-5 M-406",
            nextMatchId: 454,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 407,
            name: "LB R-5 M-407",
            nextMatchId: 455,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 408,
            name: "LB R-5 M-408",
            nextMatchId: 455,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 409,
            name: "LB R-5 M-409",
            nextMatchId: 454,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 410,
            name: "LB R-5 M-410",
            nextMatchId: 453,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 411,
            name: "LB R-5 M-411",
            nextMatchId: 452,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 412,
            name: "LB R-5 M-412",
            nextMatchId: 451,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 413,
            name: "LB R-5 M-413",
            nextMatchId: 450,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 414,
            name: "LB R-5 M-414",
            nextMatchId: 449,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 415,
            name: "LB R-5 M-415",
            nextMatchId: 448,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 416,
            name: "LB R-5 M-416",
            nextMatchId: 432,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 417,
            name: "LB R-5 M-417",
            nextMatchId: 433,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 418,
            name: "LB R-5 M-418",
            nextMatchId: 434,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 419,
            name: "LB R-5 M-419",
            nextMatchId: 435,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 420,
            name: "LB R-5 M-420",
            nextMatchId: 436,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 421,
            name: "LB R-5 M-421",
            nextMatchId: 437,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 422,
            name: "LB R-5 M-422",
            nextMatchId: 438,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 423,
            name: "LB R-5 M-423",
            nextMatchId: 439,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 424,
            name: "LB R-5 M-424",
            nextMatchId: 439,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 425,
            name: "LB R-5 M-425",
            nextMatchId: 438,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 426,
            name: "LB R-5 M-426",
            nextMatchId: 437,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 427,
            name: "LB R-5 M-427",
            nextMatchId: 436,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 428,
            name: "LB R-5 M-428",
            nextMatchId: 435,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 429,
            name: "LB R-5 M-429",
            nextMatchId: 434,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 430,
            name: "LB R-5 M-430",
            nextMatchId: 433,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 431,
            name: "LB R-5 M-431",
            nextMatchId: 432,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 432,
            name: "LB R-6 M-432",
            nextMatchId: 447,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 433,
            name: "LB R-6 M-433",
            nextMatchId: 446,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 434,
            name: "LB R-6 M-434",
            nextMatchId: 445,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 435,
            name: "LB R-6 M-435",
            nextMatchId: 444,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 436,
            name: "LB R-6 M-436",
            nextMatchId: 443,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 437,
            name: "LB R-6 M-437",
            nextMatchId: 442,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 438,
            name: "LB R-6 M-438",
            nextMatchId: 441,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 439,
            name: "LB R-6 M-439",
            nextMatchId: 440,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 440,
            name: "LB R-7 M-440",
            nextMatchId: 464,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 441,
            name: "LB R-7 M-441",
            nextMatchId: 465,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 442,
            name: "LB R-7 M-442",
            nextMatchId: 466,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 443,
            name: "LB R-7 M-443",
            nextMatchId: 467,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 444,
            name: "LB R-7 M-444",
            nextMatchId: 467,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 445,
            name: "LB R-7 M-445",
            nextMatchId: 466,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 446,
            name: "LB R-7 M-446",
            nextMatchId: 465,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 447,
            name: "LB R-7 M-447",
            nextMatchId: 464,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 448,
            name: "LB R-7 M-448",
            nextMatchId: 456,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 449,
            name: "LB R-7 M-449",
            nextMatchId: 457,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 450,
            name: "LB R-7 M-450",
            nextMatchId: 458,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 451,
            name: "LB R-7 M-451",
            nextMatchId: 459,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 452,
            name: "LB R-7 M-452",
            nextMatchId: 459,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 453,
            name: "LB R-7 M-453",
            nextMatchId: 458,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 454,
            name: "LB R-7 M-454",
            nextMatchId: 457,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 455,
            name: "LB R-7 M-455",
            nextMatchId: 456,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 456,
            name: "LB R-8 M-456",
            nextMatchId: 463,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 457,
            name: "LB R-8 M-457",
            nextMatchId: 462,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 458,
            name: "LB R-8 M-458",
            nextMatchId: 461,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 459,
            name: "LB R-8 M-459",
            nextMatchId: 460,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 460,
            name: "LB R-9 M-460",
            nextMatchId: 472,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 461,
            name: "LB R-9 M-461",
            nextMatchId: 473,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 462,
            name: "LB R-9 M-462",
            nextMatchId: 473,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 463,
            name: "LB R-9 M-463",
            nextMatchId: 472,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 464,
            name: "LB R-9 M-464",
            nextMatchId: 468,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 465,
            name: "LB R-9 M-465",
            nextMatchId: 469,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 466,
            name: "LB R-9 M-466",
            nextMatchId: 469,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 467,
            name: "LB R-9 M-467",
            nextMatchId: 468,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 468,
            name: "LB R-10 M-468",
            nextMatchId: 471,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 469,
            name: "LB R-10 M-469",
            nextMatchId: 470,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 470,
            name: "LB R-11 M-470",
            nextMatchId: 476,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 471,
            name: "LB R-11 M-471",
            nextMatchId: 476,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 472,
            name: "LB R-11 M-472",
            nextMatchId: 474,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 473,
            name: "LB R-11 M-473",
            nextMatchId: 474,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 474,
            name: "LB R-12 M-474",
            nextMatchId: 475,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 475,
            name: "LB R-13 M-475",
            nextMatchId: 477,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 476,
            name: "LB R-13 M-476",
            nextMatchId: 477,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        },
        {
            id: 477,
            name: "LB R-14 M-477",
            nextMatchId: 478,
            nextLooserMatchId: null,
            startTime: "",
            tournamentRoundText: null,
            href: null,
            state: "NO_PARTY",
            participants: []
        }
    ]
};
