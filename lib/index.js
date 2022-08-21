"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interface = exports.parser = exports.LL = exports.scanner = void 0;
const scanner_1 = require("./scanner");
Object.defineProperty(exports, "scanner", { enumerable: true, get: function () { return scanner_1.scanner; } });
const LL_1 = require("./LL");
Object.defineProperty(exports, "LL", { enumerable: true, get: function () { return LL_1.LL; } });
const parser_1 = require("./parser");
Object.defineProperty(exports, "parser", { enumerable: true, get: function () { return parser_1.parser; } });
const Interface = __importStar(require("./interface"));
exports.Interface = Interface;
