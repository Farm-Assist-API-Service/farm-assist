import { PA, User, Person, IModel, EdataType, Field } from '../../interfaces';

export default class UserModel implements IModel {

    get Rules() {
        const firstName: Field = {
            required: true,
            minLen: null,
            dataType: EdataType.string,
        }

        const middleName: Field = {
            required: true,
            minLen: null,
            dataType: EdataType.string,
        }

        const lastName: Field = {
            required: true,
            minLen: null,
            dataType: EdataType.string,
        }

        const email: Field = {
            required: true,
            minLen: null,
            dataType: EdataType.mixed,
        }

        const phone: Field = {
            required: true,
            minLen: 11,
            maxLen: 11,
            dataType: EdataType.number,
        }

        const password: Field = {
            required: true,
            minLen: 8,
            dataType: EdataType.mixed,
        }
        
        return Object.freeze({
              firstName,
              lastName,
              middleName,
              email,
              phone,
              password,
        });
    }

    public create(user: User): User {
        try {
            if (!user) throw "User informations is required";

            const { id, sourceInfo, userInfo } = user;

            if (!userInfo.firstName) {
                throw "First name is required";
            }

            if (!userInfo.middleName) {
                throw "Middle name is required";
            }

            if (!userInfo.lastName) {
                throw "Last name is required";
            }

            if (!userInfo.email) {
                throw "Email is required";
            }

            if (!userInfo.password) {
                throw "Password is required";
            }

            return Object.freeze({
                id,
                userInfo: {
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    middleName: userInfo.middleName,
                    email: userInfo.email,
                    phone: userInfo.phone,
                    password: userInfo.password,
                },
                sourceInfo: {
                    ip: sourceInfo.ip,
                    userAgent: sourceInfo.userAgent,
                    referrer: sourceInfo.referrer
                }
            });

        } catch (error) {
            throw error;
        }
    }

}