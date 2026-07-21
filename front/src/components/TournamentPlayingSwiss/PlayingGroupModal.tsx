import { useEffect, useState } from "react";
import { Col, Modal, Row, Typography } from "antd";
import { DotLottieReact, DotLottie } from "@lottiefiles/dotlottie-react";

import { PairModel, SwissPairModel, ParticipantsModel } from "@/shared/types/models/Tournament";

import { PlayingModalItem } from './PlayingModalItem';

import VSanimation from "../../../public/vs.json";

import s from "./style.module.scss";

export interface PlayingGroupModalProps {
    onCloseModal: () => void;
    isModalOpen: boolean;
    currentPlayers: Array<SwissPairModel> | Array<PairModel> | undefined;
}

export const PlayingGroupModal = ({
    onCloseModal,
    isModalOpen,
    currentPlayers,
}: PlayingGroupModalProps) => {
    const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (isModalOpen && currentPlayers?.length) {
            const interval = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % currentPlayers.length);
            }, 550);

            return () => clearInterval(interval);
        }
    }, [isModalOpen, currentPlayers]);

    const afterOpenChange = (open: boolean) => {
        if (dotLottie && open) {


            dotLottie.play();

            setTimeout(() => {
                onCloseModal();
            }, 9000);
        }
    };

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
            <Row gutter={[8, 8]} justify={"center"} align={"middle"}>
                {currentPlayers && (
                    <>
                        <Col span={9} style={{ position: 'relative' }}>
                            <div className={s.modalGroupTeam}>
                                <div className={s.leftBlock}>
                                    <div className={s.animateBlock}>
                                        <div className={s.verticalSlider}>
                                            <div
                                                className={s.slideItem}
                                                key={currentPlayers[activeIndex]?.gamer1 ? currentPlayers[activeIndex].gamer1.id : '0'}
                                            >
                                                <Row
                                                    gutter={[16, 18]}
                                                    align={"middle"}
                                                    justify={"end"}
                                                    style={{ textAlign: 'right' }}
                                                >
                                                    {currentPlayers[activeIndex]?.gamer1 &&
                                                        <PlayingModalItem player={currentPlayers[activeIndex].gamer1} />
                                                    }
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div style={{ width: 387, height: 387 }} className={s.lottieContainer}>
                                <DotLottieReact
                                    data={VSanimation}
                                    useFrameInterpolation={false}
                                    dotLottieRefCallback={setDotLottie}
                                    renderConfig={{
                                        devicePixelRatio: window.devicePixelRatio || 1,
                                    }}
                                    autoplay={false}
                                />
                            </div>
                        </Col>
                        <Col span={9}>
                            <div className={s.modalTeam}>
                                <div className={s.rightBlock}>
                                    <div className={s.animateBlock}>
                                        <div className={s.verticalSlider}>
                                            <div
                                                className={s.slideItem}
                                                key={currentPlayers[activeIndex]?.gamer1 ? currentPlayers[activeIndex].gamer1.id : '0'}
                                            >
                                                <Row gutter={[16, 18]} align={"middle"} style={{ textAlign: 'left' }}>
                                                    {(currentPlayers[activeIndex]?.gamer2 && currentPlayers[activeIndex]?.gamer2.team) &&
                                                        <PlayingModalItem player={currentPlayers[activeIndex].gamer2} isRight={true} />
                                                    }
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </>
                )}
            </Row>
        </Modal>
    );
};
