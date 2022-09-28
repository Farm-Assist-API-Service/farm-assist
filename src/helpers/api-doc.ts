import { join } from "path";
import { version, description, name } from "../../package.json";
import { APP_VAR } from "../configs";

export const swaggerOptions = {
	definition: {
		openapi: "3.0.3",
		info: {
			title: "Farm Assist API",
			version,
			description,
		},
		servers: [
			{
				url: APP_VAR.host,
			},
		],
	},
	apis: [join("..", "/API/1.0/routes/auth.ts")],
}
