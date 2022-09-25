import { prismaAdapter } from "../../../adapters/prisma.adapter";
import { EerrorMessages } from "../../../schemas";

export default class Repository {
    protected entity: string;

    constructor(entity: string) {
        this.entity = entity;
        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getOne = this.getOne.bind(this);
        this.modifyOne = this.modifyOne.bind(this);
        this.delOne = this.delOne.bind(this);
        this.delAll = this.delAll.bind(this);
    }

    async create(data: any) {
        try {
            const newEntity = prismaAdapter.create(this.entity);
            const createdEntity = await newEntity(data);
            return createdEntity;
        } catch (error) {
            throw error;
        }
    }

    async getOne(data: object, options: string[] = []) {
        try {
            const getEntity = prismaAdapter.getOne(this.entity);
            const responseData = await getEntity(data, options);
            return responseData;
        } catch (error) {
            throw error;
        }
    }

    async getAll(options: string[]) {
        try {
            const getAllEntity = prismaAdapter.getAll(this.entity);
            const responseData = await getAllEntity(options);
            const count = responseData.length;
            return {
                count,
                [this.entity]: !count ? [] : responseData,
            };
        } catch (error) {
            throw error;
        }
    }

    async delOne(data: object) {
        try {
            const deleteEntity = prismaAdapter.delOne(this.entity);
            const responseData = await deleteEntity(data);
            return responseData;
        } catch (error) {
            throw error;
        }
    }

    async delAll() {
        try {
            const deleteAllEntity = prismaAdapter.delAll(this.entity);
            const responseData = await deleteAllEntity();
            return responseData;
        } catch (error) {
            throw error;
        }
    }

    async modifyOne(query: object, data: any, options: string[] = []) {
        try {
            const modifyEntity = prismaAdapter.updateMany(this.entity);
            const responseData = await modifyEntity(query, data, options);
            const modifiedData = await this.getOne({ email: data.email });
            return modifiedData;
        } catch (error) {
            throw error;
        }
    }   
}
