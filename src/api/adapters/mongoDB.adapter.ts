import { UserCollection } from "../schemas";
import { FindByEmail } from "../../interfaces";

export const findByEmail = async (field: FindByEmail) => {
    try {
        const exist = UserCollection.findOne(field);
        if (!exist) {
            throw null;
        }
        return exist;
    } catch (error) {
        throw error;
    }
}
 