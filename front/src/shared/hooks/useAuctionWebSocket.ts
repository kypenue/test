import { useEffect, useRef, useState } from "react";
import { createAuctionWebSocket } from "@/services/Auction/auction";
import { notification } from "antd";
import type { AuctionData, AuctionWebSocketResponse } from "@/shared/types/models/Auction";

export interface UseAuctionWebSocketResult {
    auctionData: AuctionData | null;
    isConnected: boolean;
    isStarted: boolean | null;
    makeBet: (teamId: string, bet: number) => void;
    error: string | null;
    sendInit: () => void;
}

function isErrorResponse(data: unknown): data is { result: string; error_message: string } {
    return (
        typeof data === "object" &&
        data !== null &&
        "result" in data &&
        (data as any).result === "error" &&
        typeof (data as any).error_message === "string"
    );
}

export const useAuctionWebSocket = (tournamentId: string): UseAuctionWebSocketResult => {
    const [auctionData, setAuctionData] = useState<AuctionData | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isStarted, setIsStarted] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<ReturnType<typeof createAuctionWebSocket> | null>(null);

    useEffect(() => {
        if (!tournamentId) return;

        const handleMessage = (data: AuctionWebSocketResponse | unknown) => {
            if (isErrorResponse(data)) {
                notification.error({
                    message: "Ошибка",
                    description: data.error_message,
                    placement: "topRight",
                });
                return;
            }
            if (typeof data === "object" && data !== null && "data" in data) {
                const d = (data as any).data;
                setAuctionData(d);
                setIsStarted(typeof d.is_started === "boolean" ? d.is_started : true);
            }
        };

        const handleOpen = () => {
            setIsConnected(true);
            setError(null);
        };

        const handleClose = () => {
            setIsConnected(false);
        };

        const handleError = (error: Event) => {
            setError("Попробуйте перезагрузить страницу или открыть ее в другом браузере");
            setIsConnected(false);
        };

        wsRef.current = createAuctionWebSocket(tournamentId, {
            onMessage: handleMessage,
            onOpen: handleOpen,
            onClose: handleClose,
            onError: handleError,
        });

        wsRef.current.connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.disconnect();
            }
        };
    }, [tournamentId]);

    const makeBet = (teamId: string, bet: number) => {
        if (wsRef.current && isConnected) {
            wsRef.current.makeBet(teamId, bet);
        }
    };

    const sendInit = () => {
        if (wsRef.current && isConnected) {
            wsRef.current.send({ action: "init" });
        }
    };

    return {
        auctionData,
        isConnected,
        isStarted,
        makeBet,
        error,
        sendInit,
    };
}; 