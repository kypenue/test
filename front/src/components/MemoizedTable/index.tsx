import { memo } from "react";
import { Table } from "antd";

export const genericMemo: <T>(component: T) => T = memo;

export const MemoizedTable = genericMemo(Table);
