export interface FileModel {
    id: number;
    name: string;
    owner_id: number;
    bucket: string;
    object_key: string;
    content_category: string;
    is_removed: boolean;
    created_at: string;
    updated_at: string;
}
