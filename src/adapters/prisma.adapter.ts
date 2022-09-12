import { PrismaClient } from '@prisma/client';
import { User, EerrorMessages } from '../schemas';
const prisma = new PrismaClient()

export const prismaAdapter = {
    create(entity: string) {
        return async (data: User) => {
            try {
                let newEntity;
                const response = await prisma.user.create({ data });
                return response;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },

    getOne(entity: string) {
        return async (query: object, options: string[] = []) => {
            try {
                let include = {};
                for (const key in options) {
                    if (Object.prototype.hasOwnProperty.call(options, key)) {
                        const element = options[key];
                        include = { ...include, [element]: true };
                    }
                }

                const queryOpt: any = !options.length 
                    ? { 
                        where: query
                    }
                    : { 
                        include,
                        where: query
                    }

                const response = await prisma.user.findUnique(queryOpt);
                return response;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },

    getAll(entity: string) {
        return async (options: string[]) => {
            try {
                let include = {};
                for (const key in options) {
                    if (Object.prototype.hasOwnProperty.call(options, key)) {
                        const element = options[key];
                        include = { ...include, [element]: true };
                    }
                }
                
                const response = await prisma.user.findMany({ include });
                return response;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },

    delOne(entity: string) {
        return async (query: any) => {
            try {
                const response = await prisma.user.delete({
                    where: query
                });
                return response;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },

    delAll(entity: string) {
        return async () => {
            try {
                const response = await prisma.user.deleteMany({});
                return response;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },

    updateOne(entity: string) {
        return async (query: object, data: object) => {
            try {
                const response = await prisma.user.update({
                    data,
                    where: query
                });
                return response;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },

    updateMany(entity: string) {
        return async (query: object, data: object, options: string[]) => {
            try {
                const response = await prisma.user.updateMany({
                    data,
                    where: query
                }); 

                const getEntity = await this.getOne(entity)(query, options);

                if (!response.count)
                    throw EerrorMessages.somethingW;
                return getEntity;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    }
}

// data: {
//     fullName: data.fullName,
//     firstName: data.firstName,
//     middleName: data.middleName,
//     lastName: data.lastName,
//     email: data.email,
//     password: data.password,
//     sourceInfo: data.sourceInfo,
//     role: data.role,
//     isVerified: data.isVerified,
//     banned: data.banne
// },