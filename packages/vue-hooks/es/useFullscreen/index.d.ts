import { type Ref } from 'vue';
import type { BasicTarget } from '../utils/domTarget';
export interface PageFullscreenOptions {
    className?: string;
    zIndex?: number;
}
export interface Options {
    onExit?: () => void;
    onEnter?: () => void;
    pageFullscreen?: boolean | PageFullscreenOptions;
}
declare const useFullscreen: (target: BasicTarget, options?: Options) => [Ref<boolean>, {
    enterFullscreen: () => void;
    exitFullscreen: () => void;
    toggleFullscreen: () => void;
    isEnabled: boolean;
}];
export default useFullscreen;
