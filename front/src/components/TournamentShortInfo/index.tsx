import { Carousel, Skeleton, Tag, Typography } from "antd";
import s from "./style.module.scss";
import GameIcon from "../../../public/icons/game-controller.svg";
import PlatformIcon from "../../../public/icons/platform.svg";
import IdCardIcon from "../../../public/icons/identification-card.svg";
import { ApartmentOutlined, TeamOutlined } from "@ant-design/icons";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";
import { BRACKETS_TYPES_TEXT } from "@/shared/constants/bracketsTypes";

export interface TournamentShortInfoProps {
    tournamentId: string;
}

export const TournamentShortInfo = ({
    tournamentId,
}: TournamentShortInfoProps) => {
    const { currentData, isLoading } = useGetTournamentByIdQuery({
        id: tournamentId,
    });

    return (
        <>
            {isLoading && (
                <Skeleton.Input
                    style={{ height: 75, marginLeft: 16 }}
                    block
                    active
                    size={"large"}
                />
            )}
            {currentData && (
                <Carousel
                    className={s.carousel}
                    {...{
                        dots: false,
                        infinite: false,
                        centerMode: false,
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        variableWidth: true,
                        swipe: true,
                        arrows: true,
                        responsive: [
                            {
                                breakpoint: 1430,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 1,
                                    centerMode: false,
                                },
                            },
                            {
                                breakpoint: 1430,
                                settings: {
                                    slidesToShow: 5,
                                    slidesToScroll: 0,
                                    centerMode: false,
                                },
                            },
                            {
                                breakpoint: 1165,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1,
                                },
                            },
                            {
                                breakpoint: 865,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1,
                                },
                            },
                            {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                },
                            },
                            {
                                breakpoint: 295,
                                settings: {
                                    slidesToShow: 0,
                                    slidesToScroll: 1,
                                },
                            },
                        ],
                    }}
                >
                    <Tag
                        color="transparent"
                        icon={<GameIcon height={24} fill={"white"} />}
                        bordered
                        className={s.tag}
                    >
                        {currentData.game?.name}
                        <br />
                        <Typography.Text type={"secondary"}>
                            игра
                        </Typography.Text>
                    </Tag>
                    <Tag
                        color="transparent"
                        icon={<IdCardIcon height={24} fill={"white"} />}
                        bordered
                        className={s.tag}
                    >
                        От {currentData.min_age} лет
                        <br />
                        <Typography.Text type={"secondary"}>
                            возрастное ограничение
                        </Typography.Text>
                    </Tag>
                    <Tag
                        color="transparent"
                        icon={<PlatformIcon height={24} fill={"white"} />}
                        bordered
                        className={s.tag}
                    >
                        {currentData.platforms
                            .map((platform) => platform.name)
                            .join(" / ")}
                        <br />
                        <Typography.Text type={"secondary"}>
                            платформы
                        </Typography.Text>
                    </Tag>
                    {/*<Tag*/}
                    {/*    icon={<CalendarOutlined height={24} color={"white"} />}*/}
                    {/*    color="transparent"*/}
                    {/*    bordered*/}
                    {/*    className={s.tag}*/}
                    {/*>*/}
                    {/*    {dayjs(currentData.tournament_start).format("DD MMMM")}{" "}*/}
                    {/*    - &nbsp;*/}
                    {/*    {dayjs(currentData.tournament_end).format("DD MMMM")}*/}
                    {/*</Tag>*/}
                    <Tag
                        color="transparent"
                        icon={<TeamOutlined height={24} color={"white"} />}
                        bordered
                        className={s.tag}
                    >
                        {currentData.should_limit_participants
                            ? `${currentData.participants_number} уч.`
                            : "Не ограничено"}
                        <br />
                        <Typography.Text type={"secondary"}>
                            количество участников
                        </Typography.Text>
                    </Tag>
                    <Tag
                        color="transparent"
                        icon={<ApartmentOutlined height={24} color={"white"} />}
                        bordered
                        className={s.tag}
                    >
                        {/*{currentData?.stages?.length === 1*/}
                        {/*    ? BRACKETS_TYPES_TEXT[*/}
                        {/*          currentData?.stages[0]?.stage_type*/}
                        {/*      ]*/}
                        {/*    : "Комплексный турнир"}*/}
                        {currentData?.stages
                            ?.map(
                                (stage) =>
                                    BRACKETS_TYPES_TEXT[stage.stage_type],
                            )
                            .join(" > ")}
                        <br />
                        <Typography.Text type={"secondary"}>
                            формат
                        </Typography.Text>
                    </Tag>
                </Carousel>
            )}
        </>
    );
};
