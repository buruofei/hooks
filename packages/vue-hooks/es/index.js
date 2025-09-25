"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDrag = exports.useLongPress = exports.useKeyPress = exports.useRequest = exports.useNetwork = exports.useLockFn = exports.useSafeState = exports.useUnmountedRef = exports.useCreation = exports.useTitle = exports.useMemoizedFn = exports.useLatest = exports.useCookieState = exports.useSessionStorageState = exports.useLocalStorageState = exports.useVirtualList = exports.useMutationObserver = exports.useSize = exports.useMouse = exports.useHover = exports.useEventEmitter = exports.useClickAway = exports.useEventListener = exports.useAsyncEffect = exports.useIsomorphicLayoutEffect = exports.useUpdateLayoutEffect = exports.useTrackedEffect = exports.useDeepCompareLayoutEffect = exports.useDeepCompareEffect = exports.useThrottleEffect = exports.useDebounceEffect = exports.usePrevious = exports.useInterval = exports.useTimeout = exports.useUpdateEffect = exports.useUpdate = exports.useUnmount = exports.useMount = exports.useThrottleFn = exports.useThrottle = exports.useDebounceFn = exports.useDebounce = exports.useReactive = exports.useRafState = exports.useSetState = exports.useSet = exports.useMap = exports.useCounter = exports.useToggle = exports.useBoolean = void 0;
exports.createUseStorageState = exports.useFusionTable = exports.useAntdTable = exports.useWhyDidYouUpdate = exports.useResetState = exports.useGetState = exports.useWebSocket = exports.useEventTarget = exports.useControllableValue = exports.usePagination = exports.useDynamicList = exports.useHistoryTravel = exports.useSelections = exports.useRafTimeout = exports.useRafInterval = exports.useCountDown = exports.useTextSelection = exports.useInfiniteScroll = exports.useInViewport = exports.useScroll = exports.useTheme = exports.useResponsive = exports.useExternal = exports.useFavicon = exports.useFullscreen = exports.useDocumentVisibility = exports.useFocusWithin = exports.useDrop = void 0;
// State Management
var useBoolean_1 = require("./useBoolean");
Object.defineProperty(exports, "useBoolean", { enumerable: true, get: function () { return __importDefault(useBoolean_1).default; } });
var useToggle_1 = require("./useToggle");
Object.defineProperty(exports, "useToggle", { enumerable: true, get: function () { return __importDefault(useToggle_1).default; } });
var useCounter_1 = require("./useCounter");
Object.defineProperty(exports, "useCounter", { enumerable: true, get: function () { return __importDefault(useCounter_1).default; } });
var useMap_1 = require("./useMap");
Object.defineProperty(exports, "useMap", { enumerable: true, get: function () { return __importDefault(useMap_1).default; } });
var useSet_1 = require("./useSet");
Object.defineProperty(exports, "useSet", { enumerable: true, get: function () { return __importDefault(useSet_1).default; } });
var useSetState_1 = require("./useSetState");
Object.defineProperty(exports, "useSetState", { enumerable: true, get: function () { return __importDefault(useSetState_1).default; } });
var useRafState_1 = require("./useRafState");
Object.defineProperty(exports, "useRafState", { enumerable: true, get: function () { return __importDefault(useRafState_1).default; } });
var useReactive_1 = require("./useReactive");
Object.defineProperty(exports, "useReactive", { enumerable: true, get: function () { return __importDefault(useReactive_1).default; } });
// Effect Hooks
var useDebounce_1 = require("./useDebounce");
Object.defineProperty(exports, "useDebounce", { enumerable: true, get: function () { return __importDefault(useDebounce_1).default; } });
var useDebounceFn_1 = require("./useDebounceFn");
Object.defineProperty(exports, "useDebounceFn", { enumerable: true, get: function () { return __importDefault(useDebounceFn_1).default; } });
var useThrottle_1 = require("./useThrottle");
Object.defineProperty(exports, "useThrottle", { enumerable: true, get: function () { return __importDefault(useThrottle_1).default; } });
var useThrottleFn_1 = require("./useThrottleFn");
Object.defineProperty(exports, "useThrottleFn", { enumerable: true, get: function () { return __importDefault(useThrottleFn_1).default; } });
var useMount_1 = require("./useMount");
Object.defineProperty(exports, "useMount", { enumerable: true, get: function () { return __importDefault(useMount_1).default; } });
var useUnmount_1 = require("./useUnmount");
Object.defineProperty(exports, "useUnmount", { enumerable: true, get: function () { return __importDefault(useUnmount_1).default; } });
var useUpdate_1 = require("./useUpdate");
Object.defineProperty(exports, "useUpdate", { enumerable: true, get: function () { return __importDefault(useUpdate_1).default; } });
var useUpdateEffect_1 = require("./useUpdateEffect");
Object.defineProperty(exports, "useUpdateEffect", { enumerable: true, get: function () { return __importDefault(useUpdateEffect_1).default; } });
var useTimeout_1 = require("./useTimeout");
Object.defineProperty(exports, "useTimeout", { enumerable: true, get: function () { return __importDefault(useTimeout_1).default; } });
var useInterval_1 = require("./useInterval");
Object.defineProperty(exports, "useInterval", { enumerable: true, get: function () { return __importDefault(useInterval_1).default; } });
var usePrevious_1 = require("./usePrevious");
Object.defineProperty(exports, "usePrevious", { enumerable: true, get: function () { return __importDefault(usePrevious_1).default; } });
var useDebounceEffect_1 = require("./useDebounceEffect");
Object.defineProperty(exports, "useDebounceEffect", { enumerable: true, get: function () { return __importDefault(useDebounceEffect_1).default; } });
var useThrottleEffect_1 = require("./useThrottleEffect");
Object.defineProperty(exports, "useThrottleEffect", { enumerable: true, get: function () { return __importDefault(useThrottleEffect_1).default; } });
var useDeepCompareEffect_1 = require("./useDeepCompareEffect");
Object.defineProperty(exports, "useDeepCompareEffect", { enumerable: true, get: function () { return __importDefault(useDeepCompareEffect_1).default; } });
var useDeepCompareLayoutEffect_1 = require("./useDeepCompareLayoutEffect");
Object.defineProperty(exports, "useDeepCompareLayoutEffect", { enumerable: true, get: function () { return __importDefault(useDeepCompareLayoutEffect_1).default; } });
var useTrackedEffect_1 = require("./useTrackedEffect");
Object.defineProperty(exports, "useTrackedEffect", { enumerable: true, get: function () { return __importDefault(useTrackedEffect_1).default; } });
var useUpdateLayoutEffect_1 = require("./useUpdateLayoutEffect");
Object.defineProperty(exports, "useUpdateLayoutEffect", { enumerable: true, get: function () { return __importDefault(useUpdateLayoutEffect_1).default; } });
var useIsomorphicLayoutEffect_1 = require("./useIsomorphicLayoutEffect");
Object.defineProperty(exports, "useIsomorphicLayoutEffect", { enumerable: true, get: function () { return __importDefault(useIsomorphicLayoutEffect_1).default; } });
var useAsyncEffect_1 = require("./useAsyncEffect");
Object.defineProperty(exports, "useAsyncEffect", { enumerable: true, get: function () { return __importDefault(useAsyncEffect_1).default; } });
// Event Hooks
var useEventListener_1 = require("./useEventListener");
Object.defineProperty(exports, "useEventListener", { enumerable: true, get: function () { return __importDefault(useEventListener_1).default; } });
var useClickAway_1 = require("./useClickAway");
Object.defineProperty(exports, "useClickAway", { enumerable: true, get: function () { return __importDefault(useClickAway_1).default; } });
var useEventEmitter_1 = require("./useEventEmitter");
Object.defineProperty(exports, "useEventEmitter", { enumerable: true, get: function () { return __importDefault(useEventEmitter_1).default; } });
// DOM Hooks
var useHover_1 = require("./useHover");
Object.defineProperty(exports, "useHover", { enumerable: true, get: function () { return __importDefault(useHover_1).default; } });
var useMouse_1 = require("./useMouse");
Object.defineProperty(exports, "useMouse", { enumerable: true, get: function () { return __importDefault(useMouse_1).default; } });
var useSize_1 = require("./useSize");
Object.defineProperty(exports, "useSize", { enumerable: true, get: function () { return __importDefault(useSize_1).default; } });
var useMutationObserver_1 = require("./useMutationObserver");
Object.defineProperty(exports, "useMutationObserver", { enumerable: true, get: function () { return __importDefault(useMutationObserver_1).default; } });
var useVirtualList_1 = require("./useVirtualList");
Object.defineProperty(exports, "useVirtualList", { enumerable: true, get: function () { return __importDefault(useVirtualList_1).default; } });
// Storage Hooks
var useLocalStorageState_1 = require("./useLocalStorageState");
Object.defineProperty(exports, "useLocalStorageState", { enumerable: true, get: function () { return __importDefault(useLocalStorageState_1).default; } });
var useSessionStorageState_1 = require("./useSessionStorageState");
Object.defineProperty(exports, "useSessionStorageState", { enumerable: true, get: function () { return __importDefault(useSessionStorageState_1).default; } });
var useCookieState_1 = require("./useCookieState");
Object.defineProperty(exports, "useCookieState", { enumerable: true, get: function () { return __importDefault(useCookieState_1).default; } });
// Utility Hooks
var useLatest_1 = require("./useLatest");
Object.defineProperty(exports, "useLatest", { enumerable: true, get: function () { return __importDefault(useLatest_1).default; } });
var useMemoizedFn_1 = require("./useMemoizedFn");
Object.defineProperty(exports, "useMemoizedFn", { enumerable: true, get: function () { return __importDefault(useMemoizedFn_1).default; } });
var useTitle_1 = require("./useTitle");
Object.defineProperty(exports, "useTitle", { enumerable: true, get: function () { return __importDefault(useTitle_1).default; } });
var useCreation_1 = require("./useCreation");
Object.defineProperty(exports, "useCreation", { enumerable: true, get: function () { return __importDefault(useCreation_1).default; } });
var useUnmountedRef_1 = require("./useUnmountedRef");
Object.defineProperty(exports, "useUnmountedRef", { enumerable: true, get: function () { return __importDefault(useUnmountedRef_1).default; } });
var useSafeState_1 = require("./useSafeState");
Object.defineProperty(exports, "useSafeState", { enumerable: true, get: function () { return __importDefault(useSafeState_1).default; } });
var useLockFn_1 = require("./useLockFn");
Object.defineProperty(exports, "useLockFn", { enumerable: true, get: function () { return __importDefault(useLockFn_1).default; } });
// Network & Request Hooks
var useNetwork_1 = require("./useNetwork");
Object.defineProperty(exports, "useNetwork", { enumerable: true, get: function () { return __importDefault(useNetwork_1).default; } });
var useRequest_1 = require("./useRequest");
Object.defineProperty(exports, "useRequest", { enumerable: true, get: function () { return __importDefault(useRequest_1).default; } });
// Interaction Hooks
var useKeyPress_1 = require("./useKeyPress");
Object.defineProperty(exports, "useKeyPress", { enumerable: true, get: function () { return __importDefault(useKeyPress_1).default; } });
var useLongPress_1 = require("./useLongPress");
Object.defineProperty(exports, "useLongPress", { enumerable: true, get: function () { return __importDefault(useLongPress_1).default; } });
var useDrag_1 = require("./useDrag");
Object.defineProperty(exports, "useDrag", { enumerable: true, get: function () { return __importDefault(useDrag_1).default; } });
var useDrop_1 = require("./useDrop");
Object.defineProperty(exports, "useDrop", { enumerable: true, get: function () { return __importDefault(useDrop_1).default; } });
var useFocusWithin_1 = require("./useFocusWithin");
Object.defineProperty(exports, "useFocusWithin", { enumerable: true, get: function () { return __importDefault(useFocusWithin_1).default; } });
// Browser Hooks
var useDocumentVisibility_1 = require("./useDocumentVisibility");
Object.defineProperty(exports, "useDocumentVisibility", { enumerable: true, get: function () { return __importDefault(useDocumentVisibility_1).default; } });
var useFullscreen_1 = require("./useFullscreen");
Object.defineProperty(exports, "useFullscreen", { enumerable: true, get: function () { return __importDefault(useFullscreen_1).default; } });
var useFavicon_1 = require("./useFavicon");
Object.defineProperty(exports, "useFavicon", { enumerable: true, get: function () { return __importDefault(useFavicon_1).default; } });
var useExternal_1 = require("./useExternal");
Object.defineProperty(exports, "useExternal", { enumerable: true, get: function () { return __importDefault(useExternal_1).default; } });
var useResponsive_1 = require("./useResponsive");
Object.defineProperty(exports, "useResponsive", { enumerable: true, get: function () { return __importDefault(useResponsive_1).default; } });
var useTheme_1 = require("./useTheme");
Object.defineProperty(exports, "useTheme", { enumerable: true, get: function () { return __importDefault(useTheme_1).default; } });
// Scroll & Viewport Hooks
var useScroll_1 = require("./useScroll");
Object.defineProperty(exports, "useScroll", { enumerable: true, get: function () { return __importDefault(useScroll_1).default; } });
var useInViewport_1 = require("./useInViewport");
Object.defineProperty(exports, "useInViewport", { enumerable: true, get: function () { return __importDefault(useInViewport_1).default; } });
var useInfiniteScroll_1 = require("./useInfiniteScroll");
Object.defineProperty(exports, "useInfiniteScroll", { enumerable: true, get: function () { return __importDefault(useInfiniteScroll_1).default; } });
var useTextSelection_1 = require("./useTextSelection");
Object.defineProperty(exports, "useTextSelection", { enumerable: true, get: function () { return __importDefault(useTextSelection_1).default; } });
// Timer Hooks
var useCountDown_1 = require("./useCountDown");
Object.defineProperty(exports, "useCountDown", { enumerable: true, get: function () { return __importDefault(useCountDown_1).default; } });
var useRafInterval_1 = require("./useRafInterval");
Object.defineProperty(exports, "useRafInterval", { enumerable: true, get: function () { return __importDefault(useRafInterval_1).default; } });
var useRafTimeout_1 = require("./useRafTimeout");
Object.defineProperty(exports, "useRafTimeout", { enumerable: true, get: function () { return __importDefault(useRafTimeout_1).default; } });
// Data Management Hooks
var useSelections_1 = require("./useSelections");
Object.defineProperty(exports, "useSelections", { enumerable: true, get: function () { return __importDefault(useSelections_1).default; } });
var useHistoryTravel_1 = require("./useHistoryTravel");
Object.defineProperty(exports, "useHistoryTravel", { enumerable: true, get: function () { return __importDefault(useHistoryTravel_1).default; } });
var useDynamicList_1 = require("./useDynamicList");
Object.defineProperty(exports, "useDynamicList", { enumerable: true, get: function () { return __importDefault(useDynamicList_1).default; } });
var usePagination_1 = require("./usePagination");
Object.defineProperty(exports, "usePagination", { enumerable: true, get: function () { return __importDefault(usePagination_1).default; } });
// Form & Input Hooks
var useControllableValue_1 = require("./useControllableValue");
Object.defineProperty(exports, "useControllableValue", { enumerable: true, get: function () { return __importDefault(useControllableValue_1).default; } });
var useEventTarget_1 = require("./useEventTarget");
Object.defineProperty(exports, "useEventTarget", { enumerable: true, get: function () { return __importDefault(useEventTarget_1).default; } });
// Communication Hooks
var useWebSocket_1 = require("./useWebSocket");
Object.defineProperty(exports, "useWebSocket", { enumerable: true, get: function () { return __importDefault(useWebSocket_1).default; } });
// State Enhancement Hooks
var useGetState_1 = require("./useGetState");
Object.defineProperty(exports, "useGetState", { enumerable: true, get: function () { return __importDefault(useGetState_1).default; } });
var useResetState_1 = require("./useResetState");
Object.defineProperty(exports, "useResetState", { enumerable: true, get: function () { return __importDefault(useResetState_1).default; } });
// Debug Hooks
var useWhyDidYouUpdate_1 = require("./useWhyDidYouUpdate");
Object.defineProperty(exports, "useWhyDidYouUpdate", { enumerable: true, get: function () { return __importDefault(useWhyDidYouUpdate_1).default; } });
// Table Hooks
var useAntdTable_1 = require("./useAntdTable");
Object.defineProperty(exports, "useAntdTable", { enumerable: true, get: function () { return __importDefault(useAntdTable_1).default; } });
var useFusionTable_1 = require("./useFusionTable");
Object.defineProperty(exports, "useFusionTable", { enumerable: true, get: function () { return __importDefault(useFusionTable_1).default; } });
// Storage Creator
var createUseStorageState_1 = require("./createUseStorageState");
Object.defineProperty(exports, "createUseStorageState", { enumerable: true, get: function () { return createUseStorageState_1.createUseStorageState; } });