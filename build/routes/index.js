"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.farmRoute = exports.userRoute = void 0;
// Exports all routes
var user_1 = require("./user");
Object.defineProperty(exports, "userRoute", { enumerable: true, get: function () { return __importDefault(user_1).default; } });
var farm_1 = require("./farm");
Object.defineProperty(exports, "farmRoute", { enumerable: true, get: function () { return __importDefault(farm_1).default; } });
