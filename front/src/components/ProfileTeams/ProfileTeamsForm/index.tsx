import {
    useCreateProfileTeamMutation,
    useUpdateProfileTeamByIdMutation,
} from "@/services/Teams";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { AccessType } from "@/services/Teams/teams.model";
import { Form, Input, Modal, Select } from "antd";

import { UploadImage } from "@/components/ReglamentForm/UploadImage";

import { useGetFormData } from "@/components/ProfileTeams/ProfileTeamsForm/useGetFormData";
import { schema } from "@/components/ProfileTeams/ProfileTeamsForm/schema";

import s from "@/components/GameAccountsDropDown/GameAccountsDropDown.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";

interface ProfileTeamsFormProps {
    teamId?: string;
    onClose: VoidFunction;
}

export const ProfileTeamsForm = ({
    teamId,
    onClose,
}: ProfileTeamsFormProps) => {
    const { items, data, isLoading, defaultValues } = useGetFormData(teamId);

    const [create] = useCreateProfileTeamMutation();
    const [update] = useUpdateProfileTeamByIdMutation();

    const form = useForm<FormProps>({
        defaultValues,
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const onSubmit = useCallback((value: FormProps) => {
        if (teamId) {
            update({ ...value, id: teamId });
        } else {
            create(value);
        }
        onClose();
    }, []);

    useEffect(() => {
        if (!isLoading && data) {
            form.reset(defaultValues);
        }
    }, [isLoading, defaultValues]);

    if (isLoading) {
        return null;
    }

    return (
        <Modal
            title={teamId ? "Изменить команду" : "Создать команду"}
            open
            onCancel={onClose}
            onClose={onClose}
            okButtonProps={{
                form: "command_form",
                htmlType: "submit",
                disabled: !form.formState.isValid,
            }}
        >
            <FormProvider {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    id={"command_form"}
                >
                    <Controller
                        name={"name"}
                        render={({ field }) => (
                            <Form.Item
                                label={"Название команды"}
                                vertical
                                htmlFor={field.name}
                            >
                                <Input {...field} id={field.name} />
                            </Form.Item>
                        )}
                    />
                    <Controller
                        name={"game_id"}
                        render={({ field }) => (
                            <Form.Item
                                label={"Игра"}
                                vertical
                                htmlFor={field.name}
                            >
                                <Select
                                    options={items}
                                    placeholder={"Выберите игру из списка"}
                                    className={s.dropdown}
                                    rootClassName={s.root}
                                    size={"large"}
                                    disabled={!!teamId}
                                    {...field}
                                />
                            </Form.Item>
                        )}
                    />
                    <UploadImage name="image_id" label="Обложка команды" />
                </form>
            </FormProvider>
        </Modal>
    );
};

interface FormProps {
    name: string;
    access_type: AccessType;
    image_id: number;
    game_id: number;
}
