import { useMemo, useState } from "react";
import { App, Table } from "antd";
import {
    useGetBlockedParticipantsQuery,
    useRemoveParticipantBlockMutation,
} from "@/services/Tournament/tournament";
import { generateColumns } from "@/components/BlockedUsers/utils";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";

export const BlockedUsers = () => {
    const { message } = App.useApp();
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isFetching } = useGetBlockedParticipantsQuery({
        per_page: pageSize,
        order_by: "-updated_at",
        page: currentPage,
    });
    const [unblockUser] = useRemoveParticipantBlockMutation();

    const handleChangeStatus = (participantId: number, userId: number) => {
        unblockUser({ userId }).then((res) => {
            if ("data" in res) {
                message.success("Пользователь разблокирован");
            }

            if ("error" in res && res.error) {
                getErrorMessage(res.error, message);
            }
        });
    };

    const columns = useMemo(() => {
        return generateColumns(handleChangeStatus);
    }, []);

    return (
        <Table
            dataSource={data?.payload}
            loading={isFetching}
            columns={columns}
            pagination={{
                defaultPageSize: pageSize,
                total: data?.total_count,
                current: data?.page,
                showSizeChanger: false,
            }}
            onChange={(pagination) => setCurrentPage(pagination.current ?? 0)}
        />
    );
};
