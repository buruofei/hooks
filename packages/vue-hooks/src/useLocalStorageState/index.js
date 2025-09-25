"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createUseStorageState_1 = require("../createUseStorageState");
const isBrowser_1 = require("../utils/isBrowser");
const useLocalStorageState = (0, createUseStorageState_1.createUseStorageState)(() => (isBrowser_1.default ? localStorage : undefined));
exports.default = useLocalStorageState;
