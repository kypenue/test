export interface PaginatedResponse<T> {
    page: number;
    payload: T;
    per_page: number;
    total_count: number;
    total_pages: number;
}

export type PaginatedRequest<T> = T & {
    page?: number;
    per_page?: number;
    search?: string;
    order_by?: string;
};
