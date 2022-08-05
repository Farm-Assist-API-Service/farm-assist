import { Database } from "../services";
import main from "../main";
import { Mongo } from "../configs/drivers";
main();

Database.initiate(new Mongo())