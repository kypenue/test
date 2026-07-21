"use client";
import {
    useGetCommunityByIdQuery,
    useUpdateCommunityMutation,
} from "@/services/Communities/community";
import { UploadImage } from "@/components/ReglamentForm/UploadImage";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { spaceSchema } from "@/shared/validation/spaceSchema";
import { App, Button, Form } from "antd";
import { useMemo } from "react";
import { UpdateCommunityArgs } from "@/services/Communities/community.model";

const Page = ({ params: { slug } }: { params: { slug: string } }) => {
    const [update] = useUpdateCommunityMutation();
    const { currentData: community } = useGetCommunityByIdQuery({
        communityId: slug,
    });
    const { message } = App.useApp();

    const defaultValues: UpdateCommunityArgs = useMemo(() => {
        if (!community) {
            return {
                slug,
                communityId: slug,
            };
        }
        return {
            slug,
            communityId: community.id,
            title: community.title,
            description: community.description,
            header_id: community.header?.id,
            avatar_id: community.avatar?.id,
            game_ids: community.games.map((game) => game.id),
            social_links: community.social_links,
        };
    }, [community, slug]);

    const form = useForm<UpdateCommunityArgs>({
        resolver: yupResolver(spaceSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: defaultValues,
    });

    const { handleSubmit, watch } = form;

    const onSubmit = (data: UpdateCommunityArgs) => {
        update(data)
            .then((res) => {
                console.log(res);
                if ("data" in res && res.data) {
                    message.success("Изменения сохранены");
                }
                if ("error" in res && res.error) {
                    message.error("Произошла ошибка");
                }
            })
            .catch((err) => {
                console.log(err);
                message.error("Произошла ошибка");
            });
    };

    const onClick = () => {
        onSubmit({
            ...watch(),
        });
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <UploadImage name="header_id" label="Обложка пространства" />
                <UploadImage name="avatar_id" label="Аватар пространства" />

                <Form.Item layout="vertical">
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        onClick={onClick}
                    >
                        Сохранить
                    </Button>
                </Form.Item>
            </form>
        </FormProvider>
    );
};

export default Page;
