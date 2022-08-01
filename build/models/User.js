"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __importDefault(require("./Model"));
class User extends Model_1.default {
    create(entity) {
        return Promise.resolve({});
    }
    update(field) {
        return Promise.resolve({});
    }
    delete(id) {
        return Promise.resolve({});
    }
    get(id) {
        return Promise.resolve({});
    }
    get getAll() {
        return Promise.resolve([]);
    }
}
exports.default = User;
