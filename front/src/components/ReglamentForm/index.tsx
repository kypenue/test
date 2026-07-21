import { App, Button, Form, Input, Spin } from "antd";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    type ReglamentSchema,
    reglamentSchema,
} from "@/shared/validation/reglamentSchema";
import {
    useGetTournamentByIdQuery,
    useSetTournamentReglamentMutation,
} from "@/services/Tournament/tournament";
import { useRouter } from "next/navigation";
import { UploadImage } from "./UploadImage";
import { Editor } from "@/components/Editor";
import { usePrepareData } from "@/components/ReglamentForm/usePrepareData";

const ReglamentForm = ({ tournamentId }: { tournamentId: number }) => {
    const router = useRouter();
    const { message } = App.useApp();
    const { currentData: tournamentData, isLoading } =
        useGetTournamentByIdQuery({
            id: tournamentId?.toString(),
        });
    const { isMarkdown, ...defaultValues } = usePrepareData(tournamentId);

    const form = useForm<ReglamentSchema>({
        resolver: yupResolver(reglamentSchema),
        defaultValues,
        mode: "onBlur",
        reValidateMode: "onChange",
    });

    const { control, handleSubmit } = form;

    const [update] = useSetTournamentReglamentMutation();

    const onSubmit = (data: ReglamentSchema) => {
        update({
            id: tournamentId,
            ...data,
        }).then((res) => {
            if ("data" in res && res.data) {
                router.replace("/account/current");
            }
            if ("error" in res && res.error) {
                //
            }
        });
    };

    if (isLoading) {
        return <Spin />;
    }

    return (
        <FormProvider {...form}>
            <form
                autoComplete={"off"}
                onSubmit={handleSubmit(onSubmit, console.log)}
            >
                <UploadImage name="cover_image_id" label="Обложка турнира" />
                <UploadImage name="header_image_id" label="Заголовок турнира" />

                <Controller
                    control={control}
                    name="rules_info"
                    render={({ field, fieldState }) => (
                        <Form.Item layout="vertical" label="Описание турнира:">
                            {isMarkdown ? (
                                <Input.TextArea
                                    rows={5}
                                    placeholder="Описание"
                                    {...field}
                                />
                            ) : (
                                <Editor
                                    fieldName={field.name}
                                    placeholder={"Описание"}
                                />
                            )}
                        </Form.Item>
                    )}
                />

                <Controller
                    control={control}
                    name="regulation"
                    render={({ field, fieldState }) => (
                        <Form.Item layout="vertical" label="Регламент турнира:">
                            {isMarkdown ? (
                                <Input.TextArea
                                    rows={5}
                                    placeholder="Ваш комментарий"
                                    {...field}
                                />
                            ) : (
                                <Editor
                                    fieldName={field.name}
                                    placeholder={"Ваш комментарий"}
                                />
                            )}
                        </Form.Item>
                    )}
                />
                <Form.Item layout="vertical">
                    <Button type="primary" htmlType="submit" block>
                        Сохранить
                    </Button>
                </Form.Item>
            </form>
        </FormProvider>
    );
};

export { ReglamentForm };
