import { OptionsType } from "@g-loot/react-tournament-brackets/dist/esm";

const roundTextGenerator = (columnIndex: number, numOfRounds: number) => {
    if (columnIndex === numOfRounds) {
        return "Финал";
    }
    if (columnIndex === numOfRounds - 1) {
        return "Полуфинал";
    }
    if (columnIndex < numOfRounds - 1) {
        return `Раунд ${columnIndex}`;
    }
};
export const DOUBLE_ELIMINATION_OPTIONS: { style: OptionsType } = {
    style: {
        boxHeight: 150,
        spaceBetweenColumns: 35,
        spaceBetweenRows: 20,
        canvasPadding: 0,
        width: 170,
        connectorColor: "rgba(255,255,255, 0.4)",
        connectorColorHighlight: "rgb(79,242,42)",
        roundHeader: {
            backgroundColor: "rgba(185,190,236,0.6)",
            roundTextGenerator: roundTextGenerator,
        },
    },
};
