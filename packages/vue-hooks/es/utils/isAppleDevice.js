"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAppleDevice = typeof navigator !== 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform);
exports.default = isAppleDevice;