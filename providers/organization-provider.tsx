'use client'

import { getFolders } from "@/lib/api/folders";
import { Credential } from "@/types/credential";
import { Folder } from "@/types/folder";
import { Tag } from "@/types/tag";
import { createContext, useEffect, useState } from "react";

export interface OrganizationProviderProps {
    folders: Folder[];
    tags: Tag[];
    credentials: Credential[];
    selectedFolderId?: string;
    loadings: OrganizationLoadings;
    updateSelectedFolderId: (folderId: string) => void;
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
    updateSelectedFolderId: () => {},
    reloadData: () => {},
});

export const OrganizationProvider = ({ children }: any) => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
    const [loadings, setLoadings] = useState<OrganizationLoadings>({
        foldersLoading: false,
        tagsLoading: false,
        credentialsLoading: false,
    });
    
    const loadData = async () => {
        setLoadings({
            foldersLoading: true,
            tagsLoading: true,
            credentialsLoading: true,
        });

        try {
            const folders = await getFolders("Baptiste", 1, 100);
            setFolders(folders);
        } catch (error) {
            console.error("Error loading folders:", error);
        } finally {
            setLoadings((prev) => ({ ...prev, foldersLoading: false }));
        }
    }
    const updateSelectedFolderId = (folderId: string) => {
        setSelectedFolderId(folderId);
        console.log(`Selected folder ID updated to: ${folderId}`);
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <OrganizationContext.Provider
            value={{
                folders,
                tags,
                credentials,
                selectedFolderId,
                loadings,
                updateSelectedFolderId,
                reloadData: loadData,
            }}
        >
            {children}
        </OrganizationContext.Provider>
    );
}

export default OrganizationContext;