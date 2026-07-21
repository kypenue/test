import type { UploadProps } from "antd";
import { App, Form, Upload } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { DiffOutlined } from "@ant-design/icons";
import { useUploadTournamentFileMutation } from "@/services/Files/files";

const { Dragger } = Upload;

interface UploadImageProps {
    name: string;
    label: string;
}

const UploadImage = ({ name, label }: UploadImageProps) => {
    const { message } = App.useApp();
    const { setValue, control } = useFormContext();

    const [upload] = useUploadTournamentFileMutation();

    const handleCustomRequest: UploadProps["customRequest"] = (e) => {
        const { onSuccess, onError } = e;

        const formData = new FormData();
        formData.append("file", e.file);

        upload(formData)
            .then((res) => {
                if ("data" in res) {
                    setValue(name, res.data?.id, { shouldValidate: true });
                    onSuccess && onSuccess("Ok");
                } else {
                    onError && onError(new Error("Ошибка загрузки файла"));
                }
            })
            .catch(() => {
                onError && onError(new Error("Ошибка загрузки файла"));
            });
    };

    const props: UploadProps = {
        name: "file",
        maxCount: 1,
        customRequest: handleCustomRequest,
        onChange(info) {
            const { status } = info.file;
            if (status !== "uploading") {
                console.log(info.file, info.fileList);
            }
            if (status === "done") {
                message.success(
                    `${info.file.name} file uploaded successfully.`,
                );
            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log("Dropped files", e.dataTransfer.files);
        },
    };
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <Form.Item layout="vertical" label={label} {...field}>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <DiffOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Добавьте или перетащите файлы сюда
                        </p>
                    </Dragger>
                </Form.Item>
            )}
        />
    );
};

export { UploadImage };
