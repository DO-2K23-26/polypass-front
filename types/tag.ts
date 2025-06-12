export interface Tag {
    id: string
    name: string
    color: string
    folderId: string
    createdBy: string
}

export interface GetTagsResponse {
    id: string
    name: string
    color: string
    created_at: string
    updated_at: string
    folder_id: string
    created_by: string
}

export interface PostTagRequest {
    name: string
    color: string
    folder_id: string
    created_by: string
}