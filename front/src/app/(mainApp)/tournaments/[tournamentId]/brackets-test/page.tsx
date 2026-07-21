"use client";
import { Col, Input, Row } from "antd";
import { useState } from "react";
import { DoubleEliminationBracket } from "@g-loot/react-tournament-brackets/dist/esm";
import GlootTheme from "@/components/Match/theme";
import { TournamentBrackets } from "@/components/TournamentBrackets";

const BracketsPage = () => {
    return (
        <Row style={{ overflow: "scroll", backgroundColor: '#1C173A' }}>
            {/* <TournamentBrackets /> */}
        </Row>
    );
};

export default BracketsPage;