"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EHttpMessages = exports.EHttpStatus = void 0;
var EHttpStatus;
(function (EHttpStatus) {
    EHttpStatus[EHttpStatus["ok"] = 200] = "ok";
    EHttpStatus[EHttpStatus["created"] = 201] = "created";
    EHttpStatus[EHttpStatus["deleted"] = 301] = "deleted";
})(EHttpStatus = exports.EHttpStatus || (exports.EHttpStatus = {}));
var EHttpMessages;
(function (EHttpMessages) {
    EHttpMessages["ok"] = "Success!";
    EHttpMessages["created"] = "Created!";
    EHttpMessages["deleted"] = "Deleted!";
    EHttpMessages["updated"] = "Updated!";
    EHttpMessages["failed"] = "Failed!";
})(EHttpMessages = exports.EHttpMessages || (exports.EHttpMessages = {}));
