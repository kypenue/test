export const swissColumns = [
    {
        title: "W — L",
        key: "wins",
        width: 100,
        // @ts-ignore
        render: (text, record) => `${record.wins} — ${record.losses}`, // Render function to combine wins and losses
    },
    {
        title: "Количество игроков",
        dataIndex: "players",
        key: "players",
    },
    {
        title: "Попадают в следующий раунд",
        dataIndex: "cum_sum",
        key: "cum_sum",
    },
];
