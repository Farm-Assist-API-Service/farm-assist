import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { APP_VAR } from "../configs";
import { User } from "../schemas";
const { jwt, hashing } = APP_VAR;


export const controllerInterface = () => {
    
}

export const hashUtil = {
    async generateHash(data: string){
        const salt = bcrypt.genSaltSync(10);
        const hashedData = bcrypt.hashSync(data, salt);
        return hashedData;
    },

    async verifyHash(data: string, hashedData: string) {
        try {
            return await bcrypt.compare(data, hashedData);
        } catch (error) {
            throw `Hashing Error: ${error}`; 
        }
    }
}

export const tokenUtil = {
    generateToken(data: object) {
        const token = jsonwebtoken.sign(data, jwt.secret, {
            expiresIn: jwt.exp	// expires in * 
        });
        return token;
    },

    verifyToken(token: any) {
        try {
            const decodedToken = jsonwebtoken.verify(token, jwt.secret);
            return decodedToken;
        } catch (error) {
            throw error; 
        }
    }
} 

export const exclude = <User, Key extends keyof User> (user: User, ...keys: Key[]): Omit<User, Key> => {
  for (let key of keys) {
    delete user[key]
  }
  return user
}