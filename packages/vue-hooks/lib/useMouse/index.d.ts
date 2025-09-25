import type { BasicTarget } from '../utils/domTarget';
export interface CursorState {
    screenX: number;
    screenY: number;
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
    elementX: number;
    elementY: number;
    elementH: number;
    elementW: number;
    elementPosX: number;
    elementPosY: number;
}
export default function useMouse(target?: BasicTarget): import("vue").Ref<CursorState, CursorState>;
