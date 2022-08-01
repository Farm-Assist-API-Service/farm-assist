"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("./Controller"));
const models_1 = require("../models");
const user = new models_1.UserModel();
// User controllers
class UserController extends Controller_1.default {
    callCreateModel(req, res, next) {
        try {
            const promise = user.create({});
        }
        catch (error) {
            console.log(error);
        }
    }
    callUpdateModel(req, res, next) {
        try {
            const promise = user.update({});
        }
        catch (error) {
            console.log(error);
        }
    }
    callGetModel(req, res, next) {
        try {
            const promise = user.get('');
        }
        catch (error) {
            console.log(error);
        }
    }
    callGetAllModel(req, res, next) {
        try {
            const promise = user.getAll;
        }
        catch (error) {
            console.log(error);
        }
    }
    callDeleteModel(req, res, next) {
        try {
            const promise = user.delete('');
        }
        catch (error) {
            console.log(error);
        }
    }
    callEmailVerification(req, res, next) {
        try {
            const promise = user.delete('');
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.default = UserController;
