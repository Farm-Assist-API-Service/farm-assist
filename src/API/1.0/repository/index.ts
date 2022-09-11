import { prismaAdapter } from "../../../adapters/prisma.adapter";
import bcrypt from "bcrypt";

export default class Repository {
  protected entity: string;

  constructor(entity: string) {
    this.entity = entity;
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
  }

  async create(data: any) {
    try {
      const { password, ...othersFields } = data;
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const modifiedData = { ...othersFields };
      modifiedData["password"] = hashedPassword;

      const newEntity = prismaAdapter.create(this.entity);
      const createdEntity = await newEntity(modifiedData);
      return createdEntity;
    } catch (error) {
      throw error;
    }
  }

  async getOne(data: object, options: string[]) {
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
      return {
        count: responseData.length,
        [this.entity]: responseData,
      };
    } catch (error) {
      throw error;
    }
  }

  async delOne(data: object) {
    try {
      const deleteEntity = prismaAdapter.delone(this.entity);
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
}
