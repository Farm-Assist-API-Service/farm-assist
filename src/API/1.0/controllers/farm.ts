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

export const createFarm = async ({ body, user }: HttpRequest) => {
  try {
    const nameExist = await getOne({ name: body.name });

    if (nameExist) {
      throw EerrorMessages.farmExist;
    }

    const { firstName, lastName, middleName, contact } = user;
    const ownerNames = `${lastName}, ${firstName} ${middleName}`;
  
    if (!body.contact && !contact) {
      throw {
        "body": {
          "reasons": {
            "contact": {
              "value": "",
              "msg": "Please enter your farm contact detail to proceed",
              "param": "contact",
              "location": "body"
            }
          }
        }
      }
    }

    const farmData = {
      ownerNames,
      name: body.name,
      ownerId: user.id,
      contact: body.contact || contact,
      description: body.description,
      category: body.category
    }

    const data = await create(farmData);
    delete data.id;

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

    // Get farm with; owner id
    const query = request.params.id;
    const farm = await getOne({ name: query }, ['products', 'address']);
    const data = !farm ? EerrorMessages.notFound : farm;

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

export const modifyFarm = async (request: HttpRequest) => {
    try {

        //* Got some jobs to do here
        const query = request.params.id;
        const farm = await getOne({ name: query }, ['products', 'address']);
        
        const modifiedData = {

        }

        const data = await modifyOne(query, modifiedData);
        delete data.password;
        delete data.id;

        return {
            headers: {
                contentType: EcontentType.json,
            },
            statusCode: EProtocolStatusCode.ok,
            body: { 
                message: EProtocolMessages.updated,
                data
            }
        }
    } catch (e: any) {
        // TODO: Error logging

        return {
            headers: {
                contentType: EcontentType.json
            },
            statusCode: EProtocolStatusCode.badRequest,
            body: {
                message: EProtocolMessages.failed,
                error: e?.message || e
            }
        }
    }
}

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
