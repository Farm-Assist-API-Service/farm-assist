
import Controllers from "./controllers/Controller";
import { UserModel } from "./models";
import { createNewUser } from "./usecases";

const userModel = new UserModel();
const newUser = createNewUser(userModel);

Controllers.registerUses({
    addEntity: newUser,
    removeEntity: () => {},
    modifiyEntity: () => {},
    getEntity: () => {}
});
export const userController = new Controllers();