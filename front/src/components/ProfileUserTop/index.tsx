import { Button, Col, Flex, Row, Skeleton, Typography } from "antd";
import { Avatar } from "@/components/Avatar";
import { ContentCard } from "@/components/ContentCard";
import { useParams } from "next/navigation";
import {
    useDeletePhotoMutation,
    useGetProfilePhotoByIdQuery,
    useGetUserByIdQuery,
} from "@/services/User/user";
import { useUploadFileMutation } from "@/services/Files/files";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import { useIsCurrentUser } from "@/shared/hooks/useIsCurrentUser";
import { userMock } from "@/shared/constants/userMock";
import React, { useMemo } from "react";
import s from "./style.module.scss";
import { BiLogoTelegram } from "react-icons/bi";
export const ProfileUserTop = () => {
    const { userId } = useParams<{ userId: string }>();
    const { xs } = useBreakpoint();
    const isCurrentUser = useIsCurrentUser(userId);

    const { currentData, isLoading } = useGetUserByIdQuery(userId);
    const { currentData: photo, isLoading: isLoadingPhoto } =
        useGetProfilePhotoByIdQuery({ id: userId });
    const [upload] = useUploadFileMutation();
    const [deletePhoto] = useDeletePhotoMutation();

    const photoUrl = useMemo(() => {
        if (photo) {
            return photo;
        }
        if (isCurrentUser) {
            return "";
        }
        return userMock.avatar;
    }, [photo, isCurrentUser]);

    // @ts-ignore
    return (
        <>
            {!currentData && isLoading && isLoadingPhoto && (
                <Row align={"middle"} gutter={[24, 24]}>
                    <Col>
                        <Skeleton.Avatar active size={100} />
                    </Col>
                    <Col>
                        <Skeleton.Input block active size={"large"} />
                    </Col>
                </Row>
            )}
            {currentData && (
                <Row
                    align={"middle"}
                    justify={xs ? "center" : "start"}
                    gutter={[24, 24]}
                >
                    <Col>
                        <Avatar
                            /*
							 // @ts-ignore */
                            uploadPhoto={upload}
                            /*
							 // @ts-ignore */
                            deletePhoto={deletePhoto}
                            /*
							 // @ts-ignore */
                            url={photoUrl}
                            disabled={!isCurrentUser}
                        />
                    </Col>
                    <Col>
                        <Flex gap={8} align={"center"}>
                            <Typography.Title
                                className={s.username}
                                level={xs ? 3 : 2}
                            >
                                {currentData.username}
                            </Typography.Title>
                            <Button
                                size={"small"}
                                href={`https://t.me/${currentData.tg_login}`}
                                type={"link"}
                            >
                                <BiLogoTelegram />
                            </Button>
                        </Flex>
                        <Typography.Paragraph type={"secondary"}>
                            {currentData.name} {currentData?.surname}
                        </Typography.Paragraph>
                    </Col>
                </Row>
            )}
        </>
    );
};
