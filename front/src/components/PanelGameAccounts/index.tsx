// @ts-nocheck

import { App, Col, ConfigProvider, Form, Row, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";

import {
    useCreateGamerMutation,
    useDeleteGamerMutation,
    useGetGamersQuery,
    useGetGamesQuery,
    useGetPlatformsQuery,
    useUpdateGamerMutation,
} from "@/services/Games/games";
import { GamersTableColumns } from "@/shared/types/models/Games";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

import { MemoizedTable } from "@/components/MemoizedTable";

import { gamersColumns } from "./config";
import { LoginCell } from "./LoginCell";
import { EditableCell } from "./EditableCell";
import { ActionControls } from "./ActionControls";

import s from "./style.module.scss";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";

const { Title, Text } = Typography;

export const PanelGameAccounts = () => {
    const breakpoint = useBreakpoint();

    const { data: games, isLoading: isLoadingGames } = useGetGamesQuery();

    const { data: platforms, isLoading: isLoadingPlatforms } =
        useGetPlatformsQuery();

    const { data, isLoading } = useGetGamersQuery();
    const [create, createResponse] = useCreateGamerMutation();
    const [update, updateResponse] = useUpdateGamerMutation();
    const [deleteItem, deleteResponse] = useDeleteGamerMutation();

    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [editingKey, setEditingKey] = useState(null);
    const [newData, setNewData] = useState(null);
    const isEditing = (record: Item) => record.id === editingKey;

    const customizeRenderEmpty = () => (
        <div style={{ width: "100%" }}>
            <Title>Пока у вас нет игр</Title>
            <Text>
                Вы всегда можете взять и добавить то, во что вы играете!
            </Text>
        </div>
    );

    const onEdit = (record: gamersColumns) => {
        setNewData(null);
        setEditingKey(record.id);
        form.setFieldsValue({
            game: record.game.id,
            platform: record.platform.id,
            login: record.login,
        });
    };

    const onCancel = () => {
        setEditingKey(null);
        setNewData(null);
    };

    const onDelete = (record: gamersColumns) => {
        deleteItem(editingKey)
            .then((res) => {
                if ("data" in res) {
                    message.success("Данные успешно удалены");
                    setEditingKey(null);
                    setNewData(null);
                } else {
                    message.error("Ошибка при удалении данных");
                }
            })
            .catch(() => message.error("Ошибка при удалении данных"));
    };

    const onAdd = () => {
        setNewData({
            id: 0,
            game: 0,
            platform: 0,
            login: "",
        });
        setEditingKey(0);
    };

    const onSave = () => {
        const saveData = form.getFieldsValue();

        if (editingKey === 0 && newData) {
            create({
                game_id: saveData.game,
                platform_id: saveData.platform,
                login: saveData.login,
            });
        } else {
            update({
                id: editingKey,
                game_id: saveData.game,
                platform_id: saveData.platform,
                login: saveData.login,
            });
        }
    };

    useEffect(() => {
        if (createResponse.isSuccess || updateResponse.isSuccess) {
            message.success("Данные успешно сохранены");
            setEditingKey(null);
            setNewData(null);
        }
        if (createResponse.isError || updateResponse.isError) {
            getErrorMessage(
                createResponse?.isError || updateResponse.error,
                message,
            );
        }
    }, [createResponse, updateResponse]);

    const columns = useMemo(
        () =>
            gamersColumns
                .map((col) => {
                    return {
                        ...col,
                        onCell: (record: GamersTableColumns) => ({
                            record,
                            dataIndex: col.dataIndex,
                            title: col.title,
                            inputType: col.type,
                            gamesDictionary: games,
                            platformsDictionary: platforms,
                            editable: isEditing(record),
                        }),
                    };
                })
                .concat([
                    {
                        key: "login",
                        title: "EA ID",
                        dataIndex: "login",
                        width: "33%",
                        align: "center",
                        render: (_text, record) => (
                            <LoginCell
                                editable={isEditing(record)}
                                record={record}
                                dataIndex="login"
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ),
                    },
                ]),
        [onEdit, onDelete],
    );

    const mobileColumns = useMemo(
        () => [
            {
                key: "platform",
                title: "Игровые аккаунты",
                dataIndex: "platform",
                width: "100%",
                align: "center",
                render: (_, record) => (
                    <Row justify="end">
                        <Col span={24}>
                            <EditableCell
                                dataIndex="platform"
                                editable={isEditing(record)}
                                platformsDictionary={platforms}
                                gamesDictionary={games}
                                isMobile={!!breakpoint.xs}
                            >
                                {record.platform?.name}
                            </EditableCell>
                        </Col>
                        <Col span={24}>
                            <EditableCell
                                dataIndex="game"
                                editable={isEditing(record)}
                                platformsDictionary={platforms}
                                gamesDictionary={games}
                                isMobile={!!breakpoint.xs}
                            >
                                {record.game?.name}
                            </EditableCell>
                        </Col>
                        <Col span={24}>
                            <LoginCell
                                editable={isEditing(record)}
                                record={record}
                                dataIndex="login"
                                onEdit={onEdit}
                                onDelete={onDelete}
                                isMobile={!!breakpoint.xs}
                            />
                        </Col>
                    </Row>
                ),
            },
        ],
        [onEdit, onDelete],
    );

    const filteredData = useMemo(() => {
        if (newData) {
            if (data) {
                return data.concat([newData]);
            }
            return [newData];
        }

        return data;
    }, [data, newData]);

    return (
        <ConfigProvider>
            <Form form={form} component={false}>
                <MemoizedTable
                    className={s.table}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered={breakpoint.xs}
                    dataSource={filteredData}
                    columns={
                        breakpoint.xs
                            ? mobileColumns
                            : filteredData?.length
                              ? columns
                              : []
                    }
                    pagination={false}
                    rowKey="id"
                    locale={{ emptyText: customizeRenderEmpty() }}
                />
                <ActionControls
                    onAdd={onAdd}
                    onSave={onSave}
                    onCancel={onCancel}
                    isEditing={editingKey !== null}
                />
            </Form>
        </ConfigProvider>
    );
};
