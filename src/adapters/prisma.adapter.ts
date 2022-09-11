import { PrismaClient } from '@prisma/client';
import { User, EerrorMessages } from '../schemas';
const prisma = new PrismaClient()

export const prismaAdapter = {
    create(entity: string) {
        return async (data: User) => {
            try {
                let newEntity;
                // if (entity == 'user') {
                //     newEntity = await prisma.user;
                // } else if (entity == 'farm') {
                //     newEntity = await prisma.farm;
                // } else if (entity == 'sourceInfo') {
                //     newEntity = await prisma.sourceInfo;
                // } else if (entity == 'product') {
                //     newEntity = await prisma.product;
                // } else {
                //     throw EerrorMessages.unRecogEntity;
                // }
                
                // const created = newEntity.create({
                //     data
                // });

                const response = await prisma.user.create({ data });
        
                console.log({response, entity});
                return response;
                
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },

    getOne(entity: string) {
        return async (query: object, options: string[]) => {
            try {
                let include = {};
                for (const key in options) {
                    if (Object.prototype.hasOwnProperty.call(options, key)) {
                        const element = options[key];
                        include = { ...include, [element]: true };
                    }
                }

                const response = await prisma.user.findUnique({ 
                    include,
                    where: query
                });
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

    delone(entity: string) {
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