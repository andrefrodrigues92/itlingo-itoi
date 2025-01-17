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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = exports.getFileNameWithoutExtension = exports.getFileName = void 0;
const path_1 = __importDefault(require("path"));
const vscode = __importStar(require("vscode"));
/**
 * Retrieves the file name from a path.
 *
 * @param filePath The file path.
 * @returns The file name.
 */
function getFileName(filePath) {
    return path_1.default.basename(filePath);
}
exports.getFileName = getFileName;
/**
 * Retrieves the file name without the extension from a path.
 *
 * @param filePath The file path.
 * @returns The file name.
 */
function getFileNameWithoutExtension(filePath) {
    return path_1.default.basename(filePath, path_1.default.extname(filePath)).replace(/[.-]/g, '');
}
exports.getFileNameWithoutExtension = getFileNameWithoutExtension;
/**
 * Writes the provided content to the specified URI.
 *
 * @param uri     The URI of the file to write.
 * @param content The content to write.
 */
function writeFile(uri, content) {
    return __awaiter(this, void 0, void 0, function* () {
        let writeData;
        if (typeof content === 'string') {
            writeData = Buffer.from(content, 'utf8');
        }
        else {
            writeData = content;
        }
        yield vscode.workspace.fs.writeFile(uri, writeData);
    });
}
exports.writeFile = writeFile;
//# sourceMappingURL=generator-utils.js.map