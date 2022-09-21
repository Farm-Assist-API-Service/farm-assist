import { EUserRole } from "../schemas";
import { InvalidPropertyError } from "../helpers";

export const getUserRole = (role: string) => {
    if (!role.includes(' ')) 
        throw new InvalidPropertyError(`${role}: is an invalid user role format.`);
    const [ code, name ] = role.split(' ');
    return { name, code }
} 

export const getListRoles = (ignore?: string) => Object
    .keys(EUserRole)
    .filter(role => role !== ignore);
