import ImgCrop from "antd-img-crop";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Modal, Upload, UploadFile, UploadProps } from "antd";
import { RcFile } from "antd/es/upload";
import { ReactNode, useEffect, useState } from "react";
import { useToggle } from "usehooks-ts";
import s from "./style.module.scss";
import { PhotoModel } from "@/shared/types/models/Photo";
import { getFilelist } from "@/shared/lib/getFilelist";
import { getBase64 } from "@/shared/lib/getBase64";

export interface AvatarProps {
    url?: string | null | Array<PhotoModel>;
    multiple?: boolean;
    uploadPhoto?: (
        photo: FormData,
    ) => Promise<
        { data: null } | { error: FetchBaseQueryError | SerializedError }
    >;
    deletePhoto?: (
        payload: string | void,
    ) => Promise<
        { data: null } | { error: FetchBaseQueryError | SerializedError }
    >;
    uploadText?: ReactNode;
    className?: string;
    style?: object;
    disabled?: boolean;
}

export const Avatar = ({
    uploadText = `Загрузить\nфото`,
    url,
    uploadPhoto,
    deletePhoto,
    multiple = false,
    className,
    style,
    disabled,
}: AvatarProps) => {
    const [isOpen, toggle] = useToggle();
    const [previewImage, setPreviewImage] = useState<string>();
    const [filelist, setFilelist] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (url) {
            const items = Array.isArray(url) ? url : [url];
            //@ts-ignore
            setFilelist(items.map(getFilelist));
        } else {
            setFilelist([]);
        }
    }, [url]);

    const onPreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string));
        toggle();
    };

    const handleCustomRequest: UploadProps["customRequest"] = (e) => {
        const { onSuccess, onError } = e;

        const formData = new FormData();
        formData.append("file", e.file);

        uploadPhoto &&
            uploadPhoto(formData)
                .then((res) => {
                    if ("data" in res) {
                        onSuccess && onSuccess("Ok");
                    } else {
                        if (res?.error) {
                            if ("data" in res.error) {
                                "message" in
                                    (res.error.data as { message: string }) &&
                                    onError &&
                                    onError(
                                        new Error(
                                            (
                                                res.error.data as {
                                                    message: string;
                                                }
                                            )?.message,
                                        ),
                                    );
                            }
                        } else {
                            onError &&
                                onError(new Error("Ошибка загрузки файла"));
                        }
                    }
                })
                .catch(() => {
                    onError && onError(new Error("Ошибка загрузки файла"));
                });
    };

    const handleOnChange: UploadProps["onChange"] = (e) => {
        if (e.file.status === "removed") {
            deletePhoto && deletePhoto(e.file.uid);
        } else {
            setFilelist(e.fileList);
        }
    };
    return (
        <div className={className} style={style}>
            <ImgCrop
                showGrid
                rotationSlider
                showReset
                resetText="Сброс"
                modalTitle="Предпросмотр"
                modalClassName={s.crop}
            >
                <Upload
                    fileList={filelist}
                    accept=".png, .jpg, .jpeg"
                    onChange={handleOnChange}
                    className={s.upload}
                    customRequest={handleCustomRequest}
                    name="file"
                    maxCount={multiple ? 100 : 1}
                    onPreview={onPreview}
                    disabled={disabled}
                    listType={multiple ? "picture-card" : "picture-circle"}
                >
                    {multiple ? uploadText : !filelist?.length && uploadText}
                </Upload>
            </ImgCrop>
            <Modal
                open={isOpen}
                title="Просмотр"
                footer={null}
                onCancel={toggle}
            >
                <img
                    alt="Аватар"
                    style={{ width: "100%" }}
                    src={previewImage}
                />
            </Modal>
        </div>
    );
};
