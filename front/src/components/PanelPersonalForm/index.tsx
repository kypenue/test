import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    PanelProfileSchema,
    profileSchema,
} from "@/shared/validation/profileSchema";
import { App, Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { useDebounceValue } from "usehooks-ts";
import { getFormStatus } from "@/shared/lib/getFormStatus";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { dateFormat } from "@/shared/constants/dateFormat";
import {
    useGetCityQuery,
    useGetCountryQuery,
    useLazyGetCurrentUserQuery,
    useUpdateUserMutation,
} from "@/services/User/user";
import dayjs from "dayjs";
import { FormInput } from "@/components/PanelPersonalForm/FormInput";

const { Option } = Select;

export const PanelPersonalForm = () => {
    const { notification } = App.useApp();

    const [debouncedCity, setCity] = useDebounceValue("", 500);
    const [debouncedCountry, setCountry] = useDebounceValue("", 500);

    const [getCurrentUser, user] = useLazyGetCurrentUserQuery();

    const [updateUser] = useUpdateUserMutation();

    const formMethods = useForm<PanelProfileSchema>({
        resolver: yupResolver(profileSchema),
        reValidateMode: "onChange",
        mode: "onBlur",
        defaultValues: async () => {
            const user = await getCurrentUser();
            return user.data!;
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { dirtyFields },
    } = formMethods;

    const countryField = useWatch({
        control,
        name: "country",
    });

    const { currentData: countrySuggest, isFetching: isFetchingCountry } =
        useGetCountryQuery(
            { country_prefix: debouncedCountry || "" },
            {
                skip: !debouncedCountry || debouncedCountry?.length < 1,
                refetchOnMountOrArgChange: true,
            },
        );

    const { currentData: citySuggest, isFetching: isFetchingCity } =
        useGetCityQuery(
            { city_prefix: debouncedCity || "", country: countryField || "" },
            {
                skip:
                    !debouncedCity ||
                    debouncedCity?.length < 3 ||
                    !countryField,
                refetchOnMountOrArgChange: true,
            },
        );

    const onSubmit = (data: PanelProfileSchema) => {
        if (!user?.data) return;
        const _data: PanelProfileSchema = {} as PanelProfileSchema;
        Object.keys(dirtyFields).map((key) => {
            // @ts-ignore
            _data[key] = data[key as keyof PanelProfileSchema];
        });

        updateUser({ ..._data, id: user.data.id }).then((res) => {
            if ("data" in res && res.data) {
                notification.success({
                    message: "Данные успешно обновлены",
                });
            }
        });
    };

    return (
        <div>
            <FormProvider {...formMethods}>
                <form
                    onSubmit={handleSubmit(onSubmit, console.log)}
                    id={"profile"}
                >
                    <Row gutter={8}>
                        <Col span={12}>
                            <FormInput
                                name={"username"}
                                prefix={<UserOutlined />}
                                autoComplete={"off"}
                                placeholder="cuply_player"
                                label={"Никнейм"}
                            />
                        </Col>
                        <Col span={12}>
                            <Controller
                                control={control}
                                name={"birth_date"}
                                render={({ field, fieldState }) => (
                                    <Form.Item
                                        layout="vertical"
                                        label={"Дата рождения"}
                                        style={{ width: "100%" }}
                                        validateStatus={getFormStatus(
                                            fieldState?.error?.message,
                                        )}
                                        help={fieldState?.error?.message}
                                    >
                                        <DatePicker
                                            format={dateFormat}
                                            disabled={true}
                                            prevIcon={<UserOutlined />}
                                            style={{ width: "100%" }}
                                            placeholder={"Выберите дату"}
                                            size={"large"}
                                            {...field}
                                            value={dayjs(
                                                field.value,
                                                dateFormat,
                                            )}
                                            onChange={(date) => {
                                                field.onChange(
                                                    date.format(dateFormat),
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                )}
                            />
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <FormInput
                                name={"email"}
                                prefix={<MailOutlined />}
                                autoComplete={"off"}
                                placeholder="ivan@yandex.ru"
                                label={"Email"}
                                disabled={true}
                            />
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <FormInput
                                name={"name"}
                                autoComplete={"off"}
                                placeholder="Имя"
                                label={"Имя"}
                            />
                        </Col>
                        <Col span={12}>
                            <FormInput
                                name={"surname"}
                                autoComplete={"off"}
                                placeholder="Фамилия"
                                label={"Фамилия"}
                            />
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Controller
                                control={control}
                                name={"country"}
                                render={({ field, fieldState }) => (
                                    <Form.Item
                                        layout="vertical"
                                        label={"Страна"}
                                        validateStatus={getFormStatus(
                                            fieldState?.error?.message,
                                        )}
                                        help={fieldState?.error?.message}
                                    >
                                        <Select
                                            {...field}
                                            value={field.value || undefined}
                                            allowClear
                                            showSearch
                                            showAction={["focus"]}
                                            placeholder="Страна"
                                            size={"large"}
                                            optionFilterProp="children"
                                            onSearch={setCountry}
                                            notFoundContent={
                                                "Начните вводить название"
                                            }
                                        >
                                            {debouncedCountry &&
                                                debouncedCountry?.length > 0 &&
                                                countrySuggest &&
                                                countrySuggest?.countries.map(
                                                    (el, index) => (
                                                        <Option
                                                            key={index}
                                                            value={el}
                                                            title={el}
                                                        >
                                                            {el}
                                                        </Option>
                                                    ),
                                                )}
                                        </Select>
                                    </Form.Item>
                                )}
                            />
                        </Col>
                        <Col span={12}>
                            <Controller
                                control={control}
                                name={"city"}
                                render={({ field, fieldState }) => (
                                    <Form.Item
                                        layout="vertical"
                                        label={"Город"}
                                        validateStatus={getFormStatus(
                                            fieldState?.error?.message,
                                        )}
                                        help={fieldState?.error?.message}
                                    >
                                        <Select
                                            {...field}
                                            disabled={!countryField}
                                            value={field.value || undefined}
                                            allowClear
                                            showSearch
                                            showAction={["focus"]}
                                            placeholder="Город"
                                            size={"large"}
                                            optionFilterProp="children"
                                            onSearch={setCity}
                                            notFoundContent={
                                                "Начните вводить название"
                                            }
                                        >
                                            {debouncedCity &&
                                                debouncedCity?.length > 0 &&
                                                citySuggest &&
                                                citySuggest?.cities.map(
                                                    (el, index) => (
                                                        <Option
                                                            key={index}
                                                            value={el}
                                                            title={el}
                                                        >
                                                            {el}
                                                        </Option>
                                                    ),
                                                )}
                                        </Select>
                                    </Form.Item>
                                )}
                            />
                        </Col>
                    </Row>
                </form>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col sm={12} xs={24}>
                        <Button
                            size={"large"}
                            type="primary"
                            block
                            htmlType={"submit"}
                            form={"profile"}
                        >
                            Сохранить изменения
                        </Button>
                    </Col>
                    <Col sm={12} xs={24}>
                        <Button size={"large"} onClick={() => reset()} block>
                            Отменить изменения
                        </Button>
                    </Col>
                </Row>
            </FormProvider>
        </div>
    );
};
