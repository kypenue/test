import { useGetProfileGames } from "@/shared/hooks/useGetProfileGames";
import { useEffect, useMemo } from "react";
import { Select, type SelectProps } from "antd";
import { DropDownItem } from "./DropDownItem";

import s from "./GameAccountsDropDown.module.scss";

interface GameAccountsDropDownProps {
    setAccount: (val: string | null) => void;
    accountId: string | null;
}

export const GameAccountsDropDown = ({
    setAccount,
    accountId,
}: GameAccountsDropDownProps) => {
    const { gamesData } = useGetProfileGames();

    const onChange: SelectProps["onChange"] = (value) => {
        setAccount(value);
    };

    const items: SelectProps["options"] = useMemo(
        () =>
            gamesData?.map((item) => ({
                key: item.id,
                value: item.id,
                label: (
                    <DropDownItem
                        login={item.login}
                        platform={item.platform.name}
                        name={item.game.name}
                    />
                ),
            })),
        [gamesData],
    );

    useEffect(() => {
        if (items) {
            const item = items.at(-1);
            if (item?.value) {
                setAccount(item.value as string);
            }
        }
    }, [items]);

    return (
        <Select
            options={items}
            onChange={onChange}
            placeholder={"Выберите аккаунт из списка"}
            className={s.dropdown}
            rootClassName={s.root}
            size={"large"}
            value={accountId}
        />
    );
};
