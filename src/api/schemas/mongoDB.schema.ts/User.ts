import { Schema, model } from "mongoose";
import { User } from "../../../interfaces";

const userSchema = new Schema<User>({
    id: {
        required: true,
        type: String
    },
    userInfo: {
        firstName: {
            required: true,
            type: String
        },
        lastName: {
            required: true,
            type: String
        },
        middleName: {
            required: true,
            type: String
        },
        password: {
            required: true,
            type: String
        },
        phone: Number

    },
    sourceInfo: {
        userAgent: {
            required: true,
            default: "",
        },
        ip: {
            type: String,
            required: true,
            default: "",
        },
        referrer: {
            type: String,
            required: true,
            default: "",
        }
    }
},
{
 timestamps: true
});


export const UserCollection = model('User', userSchema);
