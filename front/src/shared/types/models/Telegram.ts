interface VerifyTelegramResponse {
    token: string;
    tg_login: string;
    expires_at: string;
    full_link: string;
}

interface VerifyTelegramRequest {
    tg_login: string;
}
