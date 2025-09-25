"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const utils_1 = require("../utils");
var NetworkEventType;
(function (NetworkEventType) {
    NetworkEventType["ONLINE"] = "online";
    NetworkEventType["OFFLINE"] = "offline";
    NetworkEventType["CHANGE"] = "change";
})(NetworkEventType || (NetworkEventType = {}));
function getConnection() {
    if (typeof navigator === 'undefined')
        return null;
    const nav = navigator;
    if (!(0, utils_1.isObject)(nav)) {
        return null;
    }
    return nav.connection || nav.mozConnection || nav.webkitConnection;
}
function getConnectionProperty() {
    const c = getConnection();
    if (!c) {
        return {};
    }
    return {
        rtt: c.rtt,
        type: c.type,
        saveData: c.saveData,
        downlink: c.downlink,
        downlinkMax: c.downlinkMax,
        effectiveType: c.effectiveType,
    };
}
function useNetwork() {
    const state = (0, vue_1.ref)({
        since: undefined,
        online: typeof navigator !== 'undefined' ? navigator?.onLine : undefined,
        ...getConnectionProperty(),
    });
    let connection = null;
    const onOnline = () => {
        state.value = {
            ...state.value,
            online: true,
            since: new Date(),
        };
    };
    const onOffline = () => {
        state.value = {
            ...state.value,
            online: false,
            since: new Date(),
        };
    };
    const onConnectionChange = () => {
        state.value = {
            ...state.value,
            ...getConnectionProperty(),
        };
    };
    (0, vue_1.onMounted)(() => {
        if (typeof window === 'undefined')
            return;
        window.addEventListener(NetworkEventType.ONLINE, onOnline);
        window.addEventListener(NetworkEventType.OFFLINE, onOffline);
        connection = getConnection();
        connection?.addEventListener(NetworkEventType.CHANGE, onConnectionChange);
    });
    (0, vue_1.onUnmounted)(() => {
        if (typeof window === 'undefined')
            return;
        window.removeEventListener(NetworkEventType.ONLINE, onOnline);
        window.removeEventListener(NetworkEventType.OFFLINE, onOffline);
        connection?.removeEventListener(NetworkEventType.CHANGE, onConnectionChange);
    });
    return state;
}
exports.default = useNetwork;
