import { join } from "path";
import * as fs from "fs"
const storageFile = join(__dirname, '');



export const readValueFromJSON = (property: string) => {	
	try {
		if (!fs.existsSync(storageFile)) {
            return;
        }
        const JSONFile = require(storageFile);
		return property ? JSONFile[property] : JSONFile;
	} catch(error) {
		console.log(error);
		return error;
	}
}

export const writeValueToJSON = async <T> (data: T) => {	
	try {
		if (!fs.existsSync(storageFile)) {
			return;
        }
        const json = JSON.stringify(data, null, 2);
		await fs.promises.writeFile(storageFile, json);
	  	return json;
    } catch (error) {
        console.log(error);
        return error;
    }
}