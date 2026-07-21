import styled, { css } from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    height: 100%;
    font-family: ${({ theme }) => theme.fontFamily};
`;
export const TopText = styled.p`
    color: ${({ theme }) => theme.textColor.dark};
    font-size: 10px !important;
`;
export const BottomText = styled.p`
    color: ${({ theme }) => theme.textColor.dark};
    font-size: 10px !important;
    flex: 0 0 0;
    text-align: center;
    margin-top: 0.2rem;
    min-height: 1.25rem;
`;
export const StyledMatch = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    justify-content: space-between;
    border: none;
`;

export const Team = styled.div``;

interface ScoreProps {
    won?: boolean;
}

export const Score = styled.div<ScoreProps>`
    display: flex;
    height: 100%;
    padding: 0 0.2rem;
    align-items: center;
    width: 10%;
    justify-content: center;
    background: ${({ theme, won }: any) =>
        won
            ? theme.score.background.wonColor
            : theme.score.background.lostColor};
    color: ${({ theme, won }: any) =>
        won ? theme.textColor.highlighted : theme.textColor.dark};
`;

interface SideProps {
    won?: boolean;
    hovered?: boolean;
}

export const Side = styled.div<SideProps>`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 0 0.5rem;
    background: ${({ theme, won }: any) =>
        won ? theme.matchBackground.wonColor : theme.matchBackground.lostColor};

    :first-of-type {
        // border-top-right-radius: 3px;
        // border-top-left-radius: 3px;
        // border-top-width: 2px;
    }

    :last-of-type {
        // border-bottom-right-radius: 3px;
        // border-bottom-left-radius: 3px;
        // border-bottom-width: 2px;
    }

    // border-right: 4px solid ${({ theme }) => theme.border.color};
    // border-left: 4px solid ${({ theme }) => theme.border.color};
    // border-top: 1px solid ${({ theme }) => theme.border.color};
    // border-bottom: 1px solid ${({ theme }) => theme.border.color};

    transition: border-color 0.5s
        ${({ theme }) => theme.transitionTimingFunction};

    ${Team} {
        color: ${({ theme, won }: any) =>
            won ? theme.textColor.highlighted : "#e6dada"};
    }

    ${Score} {
        color: ${({ theme, won }: any) =>
            won ? theme.textColor.highlighted : "#e6dada"};
    }

    ${({ hovered, theme, won }: any) =>
        hovered &&
        css`
            border-color: ${theme.border.highlightedColor};

            ${Team} {
                color: ${theme.textColor.highlighted};
            }

            ${Score} {
                color: ${won
                    ? theme.score.text.highlightedWonColor
                    : theme.score.text.highlightedLostColor};
            }
        `}
`;

interface LineProps {
    highlighted?: boolean;
}

export const Line = styled.div<LineProps>`
    height: 1px;
    transition: border-color 0.5s ${({ theme }) => theme.smooth};

    border-width: 1px;
    border-style: solid;
    border-color: ${({ highlighted, theme }: any) =>
        highlighted ? theme.border.highlightedColor : "rgba(255,255,255, 0.4)"};
`;

export const Anchor = styled.a`
    text-decoration: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    justify-content: space-between;

    &:hover {
        text-decoration: none;
    }
`;