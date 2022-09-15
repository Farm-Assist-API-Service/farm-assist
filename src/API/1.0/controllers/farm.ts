import bcrypt from "bcrypt";
import {
  HttpRequest,
  EcontentType,
  EProtocolStatusCode,
  EProtocolMessages,
  EerrorMessages,
} from "../../../schemas";
import Repository from "../repository";

const { create, getAll, getOne, modifyOne } = new Repository("farm");

export const createFarm = async (request: HttpRequest) => {
  try {
    const body = request.body;
    const nameExist = await getOne({ name: body.name }, []);

    if (nameExist) {
      throw EerrorMessages.farmExist;
    }

    const data = await create(body);
    return {
      headers: {
        contentType: EcontentType.json,
      },
      statusCode: EProtocolStatusCode.created,
      body: {
        message: EProtocolMessages.created,
        data,
      },
    };
  } catch (e: any) {
    // TODO: Error logging
    return {
      headers: {
        contentType: EcontentType.json,
      },
      statusCode: EProtocolStatusCode.badRequest,
      body: {
        message: EProtocolMessages.failed,
        error: e?.message || e,
      },
    };
  }
};

export const getAFarm = async (request: HttpRequest) => {
  try {
    const query = request.params;
    console.log(query);
    const data = await getOne(query, ['products', 'address']);

    return {
      headers: {
        contentType: EcontentType.json,
      },
      statusCode: EProtocolStatusCode.ok,
      body: {
        message: EProtocolMessages.ok,
        data,
      },
    };
  } catch (e: any) {
    // TODO: Error logging
    console.log(e);

    return {
      headers: {
        contentType: EcontentType.json,
      },
      statusCode: EProtocolStatusCode.badRequest,
      body: {
        message: EProtocolMessages.failed,
        error: e?.message || e,
      },
    };
  }
};

export const delAFarm = async (request: HttpRequest) => {
  try {
    const query = request.params;

    return {
      headers: {
        contentType: EcontentType.json,
      },
      statusCode: EProtocolStatusCode.deleted,
      body: {
        message: EProtocolMessages.deleted,
        data: {},
      },
    };
  } catch (e: any) {
    // TODO: Error logging
    console.log(e);

    return {
      headers: {
        contentType: EcontentType.json,
      },
      statusCode: EProtocolStatusCode.badRequest,
      body: {
        message: EProtocolMessages.failed,
        error: e?.message || e,
      },
    };
  }
};
