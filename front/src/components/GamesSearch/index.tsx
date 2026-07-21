import { Controller, useFormContext } from "react-hook-form";
import { Col, Empty, Flex, Form, Input, Row, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDebounceValue } from "usehooks-ts";
import { useGetGamesQuery } from "@/services/Games/games";
import CardSelector from "@/components/CardsSelector";
import { getFormStatus } from "@/shared/lib/getFormStatus";
import { Game } from "@/shared/types/models/Tournament";

export const GamesSearch = () => {
    const form = useFormContext();

    const [debouncedGameSearch, setGameSearch] = useDebounceValue("", 500);
    const { currentData, isLoading } = useGetGamesQuery();

    const filteredGames =
        currentData?.filter((game: Game) =>
            game.name.toLowerCase().includes(debouncedGameSearch.toLowerCase()),
        ) ?? [];

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Введите название игры"
                        size={"large"}
                        onChange={(e) => setGameSearch(e.target.value)}
                    />
                </Col>
                <Col xs={24}>
                    {isLoading && (
                        <Flex
                            vertical={true}
                            gap={16}
                            align={"center"}
                            justify={"center"}
                        >
                            <Spin />
                            <p>Загружаем список игр</p>
                        </Flex>
                    )}
                    {!isLoading && !filteredGames?.length && (
                        <Empty description={"Игры не найдены"} />
                    )}
                    {!isLoading && !!filteredGames?.length && (
                        <Controller
                            control={form.control}
                            name={`game_id`}
                            render={({ field, fieldState }) => (
                                <Form.Item
                                    validateStatus={getFormStatus(
                                        fieldState?.error?.message,
                                    )}
                                    help={fieldState?.error?.message}
                                >
                                    <CardSelector
                                        options={filteredGames ?? []}
                                        {...field}
                                    />
                                </Form.Item>
                            )}
                        />
                    )}
                </Col>
            </Row>
        </div>
    );
};
