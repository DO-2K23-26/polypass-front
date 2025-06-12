import OrganizationContext, { OrganizationProviderProps } from "@/providers/organization-provider";
import { use } from "react";

const useOrganization = (): OrganizationProviderProps => {
    return use(OrganizationContext);
}

export default useOrganization;