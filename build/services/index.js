"use strict";
// Exports all services
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3 = exports.DataBase = void 0;
var Mongoose_1 = require("./Mongoose");
Object.defineProperty(exports, "DataBase", { enumerable: true, get: function () { return __importDefault(Mongoose_1).default; } });
var Web3_1 = require("./Web3");
Object.defineProperty(exports, "Web3", { enumerable: true, get: function () { return __importDefault(Web3_1).default; } });
