import { useGetGamesQuery } from "@/services/Games/games";
import { Select, type SelectProps } from "antd";
import { useEffect, useMemo } from "react";

interface Props {
    gameId: number | null;
    setGameId: (id: number) => void;
}

export const RatingGameSelector = ({ setGameId, gameId }: Props) => {
    const { data: games, isLoading } = useGetGamesQuery();

    const onChange: SelectProps["onChange"] = (value) => {
        setGameId(value);
    };

    const items = useMemo(
        () =>
            games?.map((game) => ({
                id: game.id,
                value: game.id,
                label: game.name,
            })),
        [games],
    );

    useEffect(() => {
        if (items) {
            const item = items.at(-1);
            if (item?.value) {
                setGameId(item.value);
            }
        }
    }, [items]);

    return (
        <Select
            popupMatchSelectWidth={false}
            loading={isLoading}
            options={items}
            value={gameId}
            onChange={onChange}
        />
    );
};
