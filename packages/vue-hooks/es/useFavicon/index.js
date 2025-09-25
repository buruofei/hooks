"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const ImgTypeMap = {
    SVG: 'image/svg+xml',
    ICO: 'image/x-icon',
    GIF: 'image/gif',
    PNG: 'image/png',
};
const useFavicon = (href) => {
    (0, vue_1.watch)(() => href, (newHref) => {
        if (!newHref || typeof document === 'undefined') {
            return;
        }
        const cutUrl = newHref.split('.');
        const imgSuffix = cutUrl[cutUrl.length - 1].toLocaleUpperCase();
        const link = document.querySelector("link[rel*='icon']") ||
            document.createElement('link');
        link.type = ImgTypeMap[imgSuffix] || 'image/x-icon';
        link.href = newHref;
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }, { immediate: true });
};
exports.default = useFavicon;