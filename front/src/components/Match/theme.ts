import { createTheme } from "@g-loot/react-tournament-brackets/dist/esm";

const GlootTheme = createTheme({
    textColor: { main: "#000000", highlighted: "#F4F2FE", dark: "#707582" },
    matchBackground: { wonColor: "#2D2D59", lostColor: "#2e2e2e" },
    score: {
        background: {
            wonColor: `#10131C`,
            lostColor: "#10131C",
        },
        text: {
            highlightedWonColor: "#7BF59D",
            highlightedLostColor: "#FB7E94",
        },
    },
    border: {
        color: "#292B43",
        highlightedColor: "rgb(79,242,42)",
    },
    roundHeader: { backgroundColor: "#3B3F73", fontColor: "#F4F2FE" },
    connectorColor: "#3B3F73",
    connectorColorHighlight: "rgb(79,242,42)",
    svgBackground: "#0F121C",
    canvasBackground: "0F121C",
});

export default GlootTheme;