"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYNC_STORAGE_EVENT_NAME = void 0;
exports.createUseStorageState = createUseStorageState;
const vue_1 = require("vue");
const useEventListener_1 = __importDefault(require("../useEventListener"));
const utils_1 = require("../utils");
exports.SYNC_STORAGE_EVENT_NAME = 'VUE_HOOKS_SYNC_STORAGE_EVENT_NAME';
function createUseStorageState(getStorage) {
    function useStorageState(key, options = {}) {
        let storage;
        const { listenStorageChange = false, onError = (e) => {
            console.error(e);
        }, } = options;
        // https://github.com/alibaba/hooks/issues/800
        try {
            storage = getStorage();
        }
        catch (err) {
            onError(err);
        }
        const serializer = (value) => {
            if (options.serializer) {
                return options.serializer(value);
            }
            return JSON.stringify(value);
        };
        const deserializer = (value) => {
            if (options.deserializer) {
                return options.deserializer(value);
            }
            return JSON.parse(value);
        };
        function getStoredValue() {
            try {
                const raw = storage?.getItem(key);
                if (raw) {
                    return deserializer(raw);
                }
            }
            catch (e) {
                onError(e);
            }
            if ((0, utils_1.isFunction)(options.defaultValue)) {
                return options.defaultValue();
            }
            return options.defaultValue;
        }
        const state = (0, vue_1.ref)(getStoredValue());
        // Watch for key changes
        (0, vue_1.watch)(() => key, () => {
            state.value = getStoredValue();
        });
        const updateState = (value) => {
            const currentState = (0, utils_1.isFunction)(value) ? value(state.value) : value;
            if (!listenStorageChange) {
                state.value = currentState;
            }
            try {
                let newValue;
                const oldValue = storage?.getItem(key);
                if ((0, utils_1.isUndef)(currentState)) {
                    newValue = null;
                    storage?.removeItem(key);
                }
                else {
                    newValue = serializer(currentState);
                    storage?.setItem(key, newValue);
                }
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(
                    // send custom event to communicate within same page
                    // importantly this should not be a StorageEvent since those cannot
                    // be constructed with a non-built-in storage area
                    new CustomEvent(exports.SYNC_STORAGE_EVENT_NAME, {
                        detail: {
                            key,
                            newValue,
                            oldValue,
                            storageArea: storage,
                        },
                    }));
                }
            }
            catch (e) {
                onError(e);
            }
        };
        const syncState = (event) => {
            if (event.key !== key || event.storageArea !== storage) {
                return;
            }
            state.value = getStoredValue();
        };
        const syncStateFromCustomEvent = (event) => {
            syncState(event.detail);
        };
        // from another document
        (0, useEventListener_1.default)('storage', syncState, {
            enable: listenStorageChange,
        });
        // from the same document but different hooks
        (0, useEventListener_1.default)(exports.SYNC_STORAGE_EVENT_NAME, syncStateFromCustomEvent, {
            enable: listenStorageChange,
        });
        return [state, updateState];
    }
    return useStorageState;
}
