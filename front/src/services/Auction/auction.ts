import { Api as api } from "../api";
import { AuctionWebSocketResponse } from "@/shared/types/models/Auction";
import { STORAGE } from "../Storage";

export interface StartAuctionArg {
    tournamentId: string;
}

export interface StartAuctionResponse {
    message: string;
}

export const addTagTypes = ["AUCTION"] as const;

const auctionApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            startAuction: build.mutation<StartAuctionResponse, StartAuctionArg>({
                query: ({ tournamentId }) => ({
                    url: `/teams/tournaments/${tournamentId}/auction/start-auction`,
                    method: "POST",
                }),
                invalidatesTags: ["AUCTION"],
            }),
        }),
    });

export const { useStartAuctionMutation } = auctionApi;

export interface AuctionWebSocketHandlers {
    onMessage: (data: AuctionWebSocketResponse) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
}

export const createAuctionWebSocket = (
    tournamentId: string,
    handlers: AuctionWebSocketHandlers
) => {
    let ws: WebSocket | null = null;

    const connect = () => {
        const baseUrl =  process.env.NEXT_PUBLIC_APP_URL || "https://cuply.pro";
        const wsProtocol = 'wss' //baseUrl.startsWith("https") ? "wss" : "ws";
        const wsUrl = baseUrl.replace(/^https?:\/\//, `${wsProtocol}://`);
        const token = STORAGE.getToken();
        
        const url = `${wsUrl}/api/v1/teams/tournaments/${tournamentId}/ws?auth=${token}`;
        
        ws = new WebSocket(url);
                console.log(ws.readyState)


        ws.addEventListener("open", (event) => {
            ws?.send(JSON.stringify({ action: "init" }));
            handlers.onOpen?.();
        });

        
        ws.addEventListener("message", (event) => {
            try {
                const data = JSON.parse(event.data) as AuctionWebSocketResponse;
                handlers.onMessage(data);
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error);
            }
        });


        ws.onclose = () => {
            handlers.onClose?.();
        };

        ws.onerror = (error) => {
            console.log('error', error)
            handlers.onError?.(error);
        };
    };

    const send = (
  message:
    | { action: "auth"; token: string }
    | { action: "make_bet"; data: { team_id: string; bet: number } }
    | { action: "init" }
) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
};

    const makeBet = (teamId: string, bet: number) => {
        send({
            action: "make_bet",
            data: {
                team_id: teamId,
                bet,
            },
        });
    };

    const disconnect = () => {
        if (ws) {
            ws.close();
            ws = null;
        }
    };

    const getReadyState = () => {
        return ws?.readyState || WebSocket.CLOSED;
    };

    return {
        connect,
        send,
        makeBet,
        disconnect,
        getReadyState,
    };
}; 