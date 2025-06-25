"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserFactory = void 0;
// src/services/document/ParserFactory.ts
var path_1 = require("path");
var PDFParser_1 = require("./PDFParser");
// import { WordParser } from "./WordParser";
// import { TextParser } from "./TextParser";
var ParserFactory = /** @class */ (function () {
    function ParserFactory() {
    }
    ParserFactory.getParser = function (filePath) {
        var ext = path_1.default.extname(filePath).toLowerCase();
        switch (ext) {
            case ".pdf":
                return new PDFParser_1.PDFParser();
            // case ".docx":
            //   return new WordParser();
            // case ".txt":
            //   return new TextParser();
            default:
                throw new Error("Unsupported file type: ".concat(ext));
        }
    };
    return ParserFactory;
}());
exports.ParserFactory = ParserFactory;
