import { Db } from "../../bin";
import { User, IDB, IModel } from "../../interfaces";

export const createNewUser = (userModel: IModel) => {
  return async function addUser (user: User) {
    
    try {
      const newUser: User = userModel.create(user);
      // console.log(newUser);
      
      const exists = await Db.findByEmail({ email: newUser.userInfo.email });
      if (exists) {
        return exists;
      }

      
      // // return Db.insert(exists);
      return newUser;
    } catch (error) {
      throw error;
    }
  }
}