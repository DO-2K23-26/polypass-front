'use client'

import { createCredential, getCredentials } from "@/lib/api/credentials";
import { createFolder, getFolders } from "@/lib/api/folders";
import { createTag, getTags } from "@/lib/api/tags";
import { CardCredential, PasswordCredential, SSHKeyCredential } from "@/types/credential";
import { Folder } from "@/types/folder";
import { Tag } from "@/types/tag";
import { createContext, useEffect, useState } from "react";

export interface OrganizationProviderProps {
    folders: Folder[];
    tags: Tag[];
    credentials: (CardCredential | PasswordCredential | SSHKeyCredential)[];
    selectedFolderId?: string;
    loadings: OrganizationLoadings;
    onCreateFolder: (folderName: string, parentId: string | null) => void;
    // onUpdateFolder: (id: string, data: Partial<Folder>) => void;
    // onDeleteFolder: (id: string) => void;
    onCreateTag: (tagName: string, color: string, folderId: string) => void;
    // onUpdateTag: (id: string, data: Partial<Tag>) => void;
    // onDeleteTag: (id: string) => void;
    onCreateCredential: (folderId: string, type: string, credentialData: any) => void;
    updateSelectedFolderId: (folderId: string | null) => void;
    reloadData: () => void;
}

export interface OrganizationLoadings {
    foldersLoading: boolean;
    tagsLoading: boolean;
    credentialsLoading: boolean;
}

const OrganizationContext = createContext<OrganizationProviderProps>({
    folders: [],
    tags: [],
    credentials: [],
    selectedFolderId: undefined,
    loadings: {
        foldersLoading: false,
        tagsLoading: false,
        credentialsLoading: false,
    },
    onCreateFolder: (folderName: string, parentId: string | null) => {},
    // onUpdateFolder: (id: string, data: Partial<Folder>) => {},
    // onDeleteFolder: (id: string) => {},
    onCreateTag: (tagName: string, color: string, folderId: string) => {},
    onCreateCredential: (folderId: string, type: string, credentialData: any) => {},
    updateSelectedFolderId: (folderId: string | null) => {},
    reloadData: () => {},
});

export const OrganizationProvider = ({ children }: any) => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [credentials, setCredentials] = useState<(CardCredential | PasswordCredential | SSHKeyCredential)[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
    const [loadings, setLoadings] = useState<OrganizationLoadings>({
        foldersLoading: false,
        tagsLoading: false,
        credentialsLoading: false,
    });

    const loadFolders = async () => {
        setLoadings((prev) => ({ ...prev, foldersLoading: true }));
        try {
            const folders = await getFolders("Baptiste", 1, 100);
            setFolders(folders);
        } catch (error) {
            console.error("Error loading folders:", error);
        } finally {
            setLoadings((prev) => ({ ...prev, foldersLoading: false }));
        }
    }

    const loadTags = async () => {
        setLoadings((prev) => ({ ...prev, tagsLoading: true }));
        try {
            const tags = await getTags();
            setTags(tags);
        } catch (error) {
            console.error("Error loading tags:", error);
        } finally {
            setLoadings((prev) => ({ ...prev, tagsLoading: false }));
        }
    }

    const loadCredentials = async (folderId?: string) => {
        setLoadings((prev) => ({ ...prev, credentialsLoading: true }));
        try {
            const credentials = await getCredentials(folderId ?? "8115a3f7-20cc-44d6-9e62-182eab3b8cd5", 'password');
            setCredentials(credentials);
            console.log("Credentials loaded:", credentials);
        } catch (error) {
            console.error("Error loading credentials:", error);
        } finally {
            setLoadings((prev) => ({ ...prev, credentialsLoading: false }));
        }
    }
    
    const loadData = async (folderId?: string) => {
        loadFolders();

        loadTags();

        loadCredentials(folderId);
    }

    const updateSelectedFolderId = (folderId: string | null) => {
        setSelectedFolderId(folderId ?? undefined);
        console.log(`Selected folder ID updated to: ${folderId}`);
    }

    useEffect(() => {
        loadData(selectedFolderId)
    }, [])

    useEffect(() => {
        loadCredentials(selectedFolderId);
    }, [selectedFolderId]);

    const onCreateFolder = async (folderName: string, parentId: string | null) => {
        try {
            const newFolder = await createFolder({ name: folderName, parent_id: parentId, description: null, icon: null, created_by: "Baptiste" });
            setFolders((prev) => [...prev, newFolder]);
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    };
    // const onUpdateFolder = async (id: string, data: Partial<Folder>) => {
    //     try {
    //         // const updatedFolder = await updateFolder(id, data);
    //         // setFolders((prev) =>
    //         //     prev.map((folder) => (folder.id === id ? updatedFolder : folder))
    //         // );
    //     } catch (error) {
    //         console.error("Error updating folder:", error);
    //     }
    // };
    // const onDeleteFolder = async (id: string) => {
    //     try {
    //         // await deleteFolder(id);
    //         // setFolders((prev) => prev.filter((folder) => folder.id !== id));
    //     } catch (error) {
    //         console.error("Error deleting folder:", error);
    //     }
    // };

    const onCreateTag = async (tagName: string, color: string, folderId: string) => {
        try {
            const newTag = await createTag({ name: tagName, color, folder_id: folderId, created_by: "Baptiste" });
            loadTags();
        } catch (error) {
            console.error("Error creating tag:", error);
        }
    };

    const onCreateCredential = async (folderId: string, type: string, credentialData: any) => {
        try {
            const newCredential = await createCredential(folderId, type, credentialData);
            setCredentials((prev) => [...prev, newCredential]);
        } catch (error) {
            console.error("Error creating credential:", error);
        }
    }

    return (
        <OrganizationContext.Provider
            value={{
                folders,
                tags,
                credentials,
                selectedFolderId,
                loadings,
                onCreateFolder,
                // onUpdateFolder,
                // onDeleteFolder,
                onCreateTag,
                onCreateCredential,
                updateSelectedFolderId,
                reloadData: loadData,
            }}
        >
            {children}
        </OrganizationContext.Provider>
    );
}

export default OrganizationContext;