export interface Folder {
    id: string
    name: string
    description?: string | null
    icon?: string | null
    parentId: string | null
    createdBy?: string
}

export interface GetFoldersResponse {
    folders: {
        Id: string
        Name: string
        Description: string | null
        Icon: string | null
        ParentID: string | null
        CreatedBy?: string
    }[]
    total: number
    page: number
    limit: number
}

export interface PostFolderRequest {
    name: string
    description: string | null
    icon: string | null
    parent_id: string | null
    created_by: string
}

export interface PostFolderResponse {
    Id: string,
    Name: string,
    Description: string | null,
    Icon: string | null,
    CreatedAt: string,
    UpdatedAt: string,
    ParentID: string | null,
    CreatedBy: string,
    user: { id: string }[]
}