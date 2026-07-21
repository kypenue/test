import { useState } from "react";
import { Col, Modal, Row, Typography } from "antd";
import { DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";

import {
    PairModel,
    SwissPairModel,
    ParticipantsModel,
} from "@/shared/types/models/Tournament";

import { PlayingModalItem } from "./PlayingModalItem";

import VSanimation from "../../../public/vs.json";
import ArrowAnimation from "../../../public/arrow.json";
import GiftAnimation from "../../../public/gift.json";

import s from "./style.module.scss";

export interface PlayingModalProps {
    onCloseModal: () => void;
    isModalOpen: boolean;
    currentPlayers: SwissPairModel | PairModel | undefined;
    isSwiss?: boolean;
}

export const PlayingModal = ({
    onCloseModal,
    isModalOpen,
    currentPlayers,
    isSwiss,
}: PlayingModalProps) => {
    const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

    const afterOpenChange = (open: boolean) => {
        if (dotLottie && open) {
            dotLottie.play();
        }

        if (open) {
            setTimeout(() => {
                onCloseModal();
            }, 3000);
        }
    };

    if (!currentPlayers) return null;

    const isGamerSecondEmpty =
        !currentPlayers.gamer2 ||
        (isSwiss && !(currentPlayers.gamer2 as ParticipantsModel).account);

    return (
        <Modal
            open={isModalOpen}
            className={s.customModal}
            mask={true}
            maskClosable={true}
            centered={true}
            closable={false}
            footer={""}
            onCancel={onCloseModal}
            width="100%"
            destroyOnClose={true}
            afterOpenChange={afterOpenChange}
        >
            <Row
                gutter={[8, 8]}
                justify={"center"}
                align={"middle"}
                aria-description="PlayingModal"
            >
                {currentPlayers && (
                    <>
                        <Col span={9} style={{ position: "relative" }}>
                            <div className={s.modalTeam}>
                                <div className={s.leftBlock}>
                                    <Row
                                        gutter={[16, 0]}
                                        align={"middle"}
                                        justify={"end"}
                                    >
                                        <PlayingModalItem
                                            player={currentPlayers.gamer1}
                                        />
                                    </Row>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            {!isGamerSecondEmpty ? (
                                <div
                                    style={{ width: 387, height: 387 }}
                                    className={s.lottieContainer}
                                >
                                    <DotLottieReact
                                        data={VSanimation}
                                        useFrameInterpolation={false}
                                        dotLottieRefCallback={setDotLottie}
                                        renderConfig={{
                                            devicePixelRatio:
                                                window.devicePixelRatio || 1,
                                        }}
                                        autoplay={false}
                                    />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        width: 287,
                                        height: 287,
                                        paddingLeft: 100,
                                    }}
                                    className={s.lottieContainer}
                                >
                                    <DotLottieReact
                                        data={
                                            isSwiss
                                                ? GiftAnimation
                                                : ArrowAnimation
                                        }
                                        useFrameInterpolation={false}
                                        renderConfig={{
                                            devicePixelRatio:
                                                window.devicePixelRatio || 1,
                                        }}
                                        autoplay
                                        loop
                                    />
                                </div>
                            )}
                        </Col>
                        <Col span={9}>
                            <div className={s.modalTeam}>
                                <div className={s.rightBlock}>
                                    <Row gutter={[16, 0]} align={"middle"}>
                                        {!isGamerSecondEmpty &&
                                        currentPlayers.gamer2 ? (
                                            <PlayingModalItem
                                                player={currentPlayers.gamer2}
                                                isRight={true}
                                            />
                                        ) : (
                                            <Typography.Title
                                                level={1}
                                                style={{
                                                    marginBottom: 0,
                                                    fontSize: "100px",
                                                }}
                                            >
                                                {/* Раунд &#8545; */}
                                            </Typography.Title>
                                        )}
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </>
                )}
            </Row>
        </Modal>
    );
};
