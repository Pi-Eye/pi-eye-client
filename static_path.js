"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.index = exports.static_path = void 0;
var path_1 = __importDefault(require("path"));
exports.static_path = path_1["default"].join(__dirname, "build");
exports.index = path_1["default"].join(__dirname, "build", "index.html");
